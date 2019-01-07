<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrap">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentSwitch"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="randomPlay">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrap">
        <scroll class="list-scroll" ref="favariteScroll" :data="favariteList" v-show="currentSwitch === 0">
          <div class="inner">
            <song-list 
              :avatar="false" 
              :songs="favariteList"
              @selectSong="selectSong">
            </song-list>
          </div>
        </scroll>
        <scroll class="list-scroll" ref="playListScroll" :data="playHistory" v-show="currentSwitch === 1">
          <div class="inner">
            <song-list 
              :avatar="false" 
              :songs="playHistory"
              @selectSong="selectSong">
            </song-list> 
          </div>
        </scroll>
      </div>
      <div class="no-result-wrap">
        <no-result :title="title" v-show="noResult"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'components/switches/Switches'
import SongList from 'components/songlist/SongList'
import Scroll from 'components/scroll/Scroll'
import NoResult from 'components/no-result/NoResult'
import Song from 'base/js/song'
import { playListMixin } from 'base/js/mixin'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserCenter',
  mixins: [playListMixin],
  components: {
    Switches,
    SongList,
    Scroll,
    NoResult
  },
  data() {
    return {
      currentSwitch: 0,
      switches: [
        {
          name: '我喜欢的'
        },
        {
          name: '最近听的'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['insertSong', 'randomAndPlay']),
    handlePlayList(playList) {
      const bottom = playList.length ? '60px' : 0
      
      this.$refs.listWrap.style.bottom = bottom
      this._refreshScroll(this.currentSwitch)
    },
    randomPlay() {
      let list = this.currentSwitch === 0 ? this.favariteList : this.playHistory
      
      if(!list.length) {
        return
      }

      list = list.map(song => {
        return new Song(song)
      })

      this.randomAndPlay({ list })
    },
    selectSong(song) {
      this.insertSong(new Song(song))
    },
    back() {
      this.$router.back()
    },
    switchItem(index) {
      this.currentSwitch = index
    },
    _refreshScroll(currentSwitch) {
      if(currentSwitch === 0) {
        this.$nextTick(() => {
          this.$refs.favariteScroll && this.$refs.favariteScroll.refresh()
        })
      }else {
        this.$nextTick(() => {
          this.$refs.playListScroll && this.$refs.playListScroll.refresh()
        })
      }
    }
  },
  computed: {
    ...mapGetters(['favariteList', 'playHistory']),
    title() {
      return this.currentSwitch === 0 ? '暂无收藏歌曲...' : '暂无最近播放歌曲...'
    },
    noResult() {
      return this.currentSwitch === 0 ? !this.favariteList.length : !this.playHistory.length
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._refreshScroll(this.currentSwitch)
    })
  },
  watch: {
    currentSwitch(newSwitch) {
      this._refreshScroll(newSwitch)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';

  .user-center {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background-color: $color-bg;
    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .back {
      position: absolute;
      top: 10px;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $size-lg-s;
        color: $color-theme;
      }
    }
    .switches-wrap {
      margin: 10px 0 30px 0;
    }
    .play-btn {
      box-sizing: border-box;
      width: 135px;
      padding: 4px 0 7px;
      margin: 0 auto;
      text-align: center;
      border: 1px solid  $color-text-l;
      color: $color-text-l;
      border-radius: 100px;
      font-size: 0;
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $size-bg;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $size-sm;
        height: 19px;
        line-height: 22px;
      }
    }
    .list-wrapper {
      position: absolute;
      top: 120px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
      }
    }
    .no-result-wrap {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }

</style>


