<template>
  <div class="music-list">
    <v-btn icon class="back" @click="back">
      <i class="icon-back"></i>
    </v-btn>
    <h1 class="m-title text-xs-center" v-html="title"></h1>
    <div class="list-top elevation-10" :style="bgStyle" ref="listTop">
      <div class="play-wrap">
        <div class="play" ref="play" v-show="songs.length" @click="randomList">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="mask" ref="mask"></div>
    </div>
    <scroll @scroll="scroll" :data="songs" :probeType="probeType" :listenScroll="listenScroll" class="scroll" ref="scroll">
      <song-list @selectSong="selectSong" :songs="songs" :avatar="avatar"></song-list>
    </scroll>
    <div class="diy">
      <span v-show="this.songs.length" class="grey--text text--darken-1 caption">你已经拉到低了哦...</span>
      <span v-show="!this.songs.length" class="grey--text text--darken-1 caption">暂时还没有数据哦...</span>
    </div>
  </div>
</template>

<script>
import SongList from 'components/songlist/SongList'
import Scroll from 'components/scroll/Scroll'
import { prefixStyle } from 'base/js/dom'
import { mapActions } from 'vuex'
import { playListMixin } from 'base/js/mixin'

const RESERVED_HEIGHT = 36

const transform = prefixStyle('transform')
const filter = prefixStyle('filter')

export default {
  name: 'MusicList',
  mixins: [playListMixin],
  components: {
    SongList,
    Scroll
  },
  props: {
    avatar: {
      type: Boolean,
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      probeType: 3,
      listenScroll: true,
      scrollY: 0
    }
  },
  methods: {
    ...mapActions([
      'selectAndPlay',
      'randomAndPlay'
    ]),
    handlePlayList(list) {
      const bottom = list.length > 0 ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    back() {
      this.$router.back()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    selectSong(song, index) {
      this.selectAndPlay({
        index,
        list: this.songs
      })
    },
    randomList() {
      this.randomAndPlay({ list: this.songs })
    }
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  mounted() {
    this.topHeight = this.$refs.listTop.clientHeight
    this.maxScrollY = -this.topHeight + RESERVED_HEIGHT
    this.$refs.scroll.$el.style['top'] = this.topHeight + 'px'
  },
  watch: {
    scrollY(y) {
      let translate = Math.max(this.maxScrollY, y)
      let zIndex = 0
      let scale = 1
      let blur = 0
      const percent = Math.abs(y / this.topHeight)
      if(y > 0) {
        scale = 1 + percent
      }else {
        blur = Math.min(20 * percent, 20)
      }
      if(y < translate) {
        zIndex = 10
        this.$refs.listTop.style['padding-top'] = 0
        this.$refs.listTop.style['height'] = RESERVED_HEIGHT + 'px'
        this.$refs.play.style['display'] = 'none'
      }else {
        this.$refs.listTop.style['padding-top'] = '70%'
        this.$refs.listTop.style['height'] = 0
        this.$refs.play.style['display'] = ''
      }
      this.$refs.listTop.style['z-index'] = zIndex
      this.$refs.listTop.style[transform] = `scale(${scale})`
      this.$refs.mask.style[filter] = `blur(${blur}px)`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
@import '../../base/scss/mixin.scss';

  .music-list {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    background-color: $color-bg;
    .list-top {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
      .play-wrap {
        position: absolute;
        bottom: 20px;
        width: 100%;
        z-index: 1;
        .play {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
          .icon-play{
            display: inline-block;
            vertical-align: top;
            margin-right: 6px;
            font-size: $size-bg;
          }
          .text{
            display: inline-block;
            vertical-align: middle;
            height: $size-bg;
            line-height: $size-bg;
            font-size: $size-sm;
            font-weight: 400;
          }
        }
      }
      .mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(7, 17, 27, .4)
      }
    }
    .m-title {
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 11;
      width: 80%;
      height: 36px;
      line-height: 36px;
      @include ellipsis();
    }
    .back {
      position: absolute;
      left: 6px;
      top: 0;
      z-index: 11;
      margin: 0;
      .icon-back{
        font-size: $size-lg-l;
        color: $color-theme;
      }
    }
    .scroll {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      z-index: 9;
    }
    .diy {
      position: fixed;
      bottom: 25px;
      left: 0;
      width: 100%;
      text-align: center;
    }
  }
</style>
