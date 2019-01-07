<template>
  <v-card class="player" v-show="playList.length > 0">
    <transition name="normal"
      @enter="enter"
      @leave="leave">
      <div class="normal-player" v-show="fullScreen">
        <div class="backgroud">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="top-wrap">
          <player-top @back="back"></player-top>
        </div>
        <div class="middle"
          @touchstart="middleTouchStart"
          @touchmove="middleTouchMove"
          @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrap" ref="cdWrap">
              <div class="cd" :class="cdClass">
                <img :src="currentSong.image">
              </div>
              <div class="playing-lyric">
                <p ref="playingLyric" class="text">{{ playingLyric }}</p>
              </div>
            </div>
          </div>
          <div class="middle-r" ref="middleR">
            <lyric-list :currentLine="currentLine" :lyric="currentLyric && currentLyric.lines"></lyric-list>
          </div>
        </div>
        <div class="operators-wrap">
          <div class="dot-wrap">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <l-progress
            :time="_format(currentTime)"
            :duration="_format(currentSong.duration)"
            :percent="percent"
            :isMove="isMove"
            @ballMove="ballMove"
            @ballMoveEnd="ballMoveEnd"
            @gotoPercent="gotoPercent"
            @changePercent="changePercent"
            @triggerMove="triggerMove">
          </l-progress>
          <operators
            ref="operators"
            :songReady="songReady"
            @oneSong="loop"
            @togglePlaying="togglePlaying"
            @unReady="unReady">
          </operators>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player-wrap" v-show="!fullScreen" @click="showFullScreen">
        <mini-player
          :percent="percent"
          @togglePlaying="togglePlaying"
          @showPlayList="showPlayList">
        </mini-player>
      </div>
    </transition>
    <play-list ref="playList"></play-list>
    <audio ref="audio"
      :src="currentSong.url"
      @timeupdate="updateTime"
      @canplay="ready"
      @ended="ended"
      @error="error">
    </audio>
  </v-card>
</template>

<script>
import Operators from 'components/player-operators/Operators'
import MiniPlayer from 'components/player-miniPlayer/MiniPlayer'
import PlayerTop from 'components/player-top/PlayerTop'
import LProgress from 'components/l-progress/LProgress'
import LyricList from 'components/lyric/Lyric'
import PlayList from 'components/play-list/PlayList'
import { mapGetters, mapMutations, mapActions } from "vuex"
import { prefixStyle } from 'base/js/dom'
import { playMode } from 'base/js/config'
import Lyric from 'lyric-parser'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  name: "Player",
  components: {
    Operators,
    MiniPlayer,
    PlayerTop,
    LProgress,
    LyricList,
    PlayList
  },
  data() {
    return {
      songReady: false,
      currentTime: 0,
      isMove: false,
      currentLyric: null,
      currentLine: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  methods: {
    ...mapMutations({
      setFullSreen: "SET_FULL_SCREEN",
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions(['savePlayHistory']),
    showPlayList() {
      this.$refs.playList.toggle()
    },
    getLyric() {
      this.currentSong.getLyric().then(lyric => {
        if(this.currentSong.lyric !== lyric) {
          return
        }

        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if(this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.currentLine = 0
        this.playingLyric = ''
      })
    },
    handleLyric({lineNum, txt}) {
      this.currentLine = lineNum
      this.playingLyric = txt
    },
    lyricSeek(time) {
      if(this.currentLyric) {
        this.currentLyric.seek(time)
      }
    },
    gotoPercent(percent) {
      this.$refs.audio.currentTime = Math.round(this.currentSong.duration * percent / 100)
      this.lyricSeek(this.$refs.audio.currentTime * 1000)
    },
    changePercent() {
      this.$refs.audio.currentTime = this.currentTime

      this.lyricSeek(this.currentTime * 1000)
    },
    triggerMove(percent) {
      this.currentTime = this.currentSong.duration * percent
    },
    ballMove() {
      this.isMove = true
    },
    ballMoveEnd() {
      this.isMove = false
    },
    togglePlaying() {
      if(!this.songReady) {
        return
      }

      this.setPlayingState(!this.playing)
      if(this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    back() {
      this.setFullSreen(false)
    },
    showFullScreen() {
      this.setFullSreen(true)
      this.$refs.playList.hide()
    },
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()

      this.$velocity(
        this.$refs.cdWrap,
        { scale: [1.05, scale], left: ['10%', x], top: [0, y] },
      )
      this.$velocity(this.$refs.cdWrap, { scale: 1 }, { duration: 200, complete: done })
    },
    leave(el, done) {
      const {x, y, scale} = this._getPosAndScale()

      this.$velocity(
        this.$refs.cdWrap,
        { scale: [scale, 1], left: [x, '10%'], top: [y, 0] },
        { complete: done }
      )
    },
    middleTouchStart(e) {
      this.touch.initial = true
      const touches = e.touches[0]
      this.touch.startX = touches.pageX
      this.touch.startY = touches.pageY
      this.touch.isMove = false
    },
    middleTouchMove(e) {
      if(!this.touch.initial) {
        return
      }
      const touches = e.touches[0]
      const deltaX = touches.pageX - this.touch.startX
      const deltaY = touches.pageY - this.touch.startY

      if(Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      if(!this.touch.isMove) {
        this.touch.isMove = true
      }

      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))

      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.middleR.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.middleR.style[transitionDuration] = '0'
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = '0'
    },
    middleTouchEnd() {
      if(!this.touch.isMove) {
        return
      }

      let offsetWidth,
          opacity,
          lyricOpacity

      if(this.currentShow === 'cd') {
        if(this.touch.percent > 0.1) {
          lyricOpacity = 0
          opacity = 0.3
          offsetWidth = -window.innerWidth
          this.currentShow = 'lyric'
        }else {
          lyricOpacity = 1
          opacity = 1
          offsetWidth = 0
        }
      }else {
        if(this.touch.percent < 0.9) {
          lyricOpacity = 1
          opacity = 1
          offsetWidth = 0
          this.currentShow = 'cd'
        }else {
          lyricOpacity = 0.3
          opacity = 0.3
          offsetWidth = -window.innerWidth
        }
      }
      const time = 300
      this.$refs.middleR.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.middleR.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.$refs.playingLyric.style.opacity = lyricOpacity
      this.$refs.playingLyric.style[transitionDuration] = `${time}ms`
      this.touch.initial = false
    },
    _getPosAndScale() {
      const width = window.innerWidth * 0.8
      const targetWidth = 40
      const paddingLeft = 36
      const paddingBottom = 30
      const paddingTop = 80
      const scale = targetWidth / width
      const x = -(width / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - paddingBottom - width / 2

      return {
        x, y, scale
      }
    },
    updateTime(e) {
      if(!this.isMove) {
        this.currentTime = e.target.currentTime
      }
    },
    ready() {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    unReady() {
      this.songReady = false
    },
    ended() {
      if(this.mode === playMode.loop){
        this.loop()
      }else {
        this.$refs.operators.next()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)

      if(this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    error() {
      this.songReady = true
    },
    _format(num) {
      num = num | 0
      const minute = num / 60 | 0
      const second = this._pad(num % 60)

      return `${minute}:${second}`
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while(len < n) {
        num = '0' + num
        len++
      }
      return num
    }
  },
  computed: {
    ...mapGetters(["fullScreen", "playList", "currentSong", 'playing', 'mode']),
    cdClass() {
      return this.playing ? 'play' : 'play pause'
    },
    percent() {
      return this.currentTime / this.currentSong.duration * 100
    }
  },
  created() {
    this.touch = {}
  },
  watch: {
    currentSong(newSong, oldSong) {
      if(!newSong.id || oldSong.id === newSong.id) {
        return
      }
      if(this.currentLyric) {
        this.currentLyric.stop()
      }
      this.$nextTick(() => {
        this.getLyric()
        this.$refs.audio.play()
      })
    },
    playing(state) {
      const audio = this.$refs.audio

      this.$nextTick(() => {
        state ? audio.play() : audio.pause()
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../base/scss/variable.scss";
@import "../../base/scss/mixin.scss";

.player {
  .normal-player {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: $color-bg;
    &.normal-enter-active, &.normal-leave-active {
      transition: all .4s;
      .top-wrap, .operators-wrap {
        transition: all .4s cubic-bezier(.86, .18, .82, 1.32);
      }
    }
    &.normal-enter, &.normal-leave-to {
        visibility: hidden;
        opacity: 0;
        .top-wrap {
          transform: translate3d(0, -100px, 0);
        }
        .operators-wrap {
          transform: translate3d(0, 100px, 0);
        }
    }
    .backgroud {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      opacity: 0.6;
      filter: blur(15px);
    }
    .middle {
      position: fixed;
      top: 80px;
      bottom: 170px;
      width: 100%;
      font-size: 0;
      white-space: nowrap;
      .middle-l,
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
      }
      .middle-l {
        position: relative;
        height: 0;
        padding-top: 80%;
        .cd-wrap {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          transform-origin: center;
          transform: translateX(200px);
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
          }
        }
        .playing-lyric {
          width: 100%;
          margin-top: 30px;
          text-align: center;
          height: 20px;
          line-height: 20px;
          font-size: $size-md;
          color: $color-text-l;
          .text {
            width: 100%;
            @include ellipsis();
          }
        }
      }
      .middle-r {
        height: 100%;
        overflow: hidden;
      }
    }
    .progress-wrap {
      position: fixed;
      left: 0;
      width: 80%;
    }
    .operators-wrap {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrap {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: $color-text-l;
          &.active{
            width: 20px;
            border-radius: 5px;
            background: $color-text-b;
          }
        }
      }
    }
  }
  .mini-player-wrap {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60px;
    z-index: 100;
    &.mini-enter-active {
      transition: all .4s;
    }
    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
