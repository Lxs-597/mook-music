<template>
  <transition name="list-fade">
    <div class="play-list" @click="hide" v-show="showFlag">
      <div class="list-wrap" @click.stop>
        <div class="list-header">
          <h1 class="m-title">
            <i class="icon" :class="modeIcon" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click="showConfirm">
              <v-icon small color="grey darken-2">fas fa-trash-alt</v-icon>
            </span>
          </h1>
        </div>
        <scroll ref="listScroll" :data="sequenceList" class="list-content">
          <transition-group tag="ul" name="list">
            <li
              ref="listItem"
              class="item"
              v-for="(item, index) in sequenceList"
              :key="item.id"
              @click.stop="selectSong(item, index)">
              <span class="text" :class="getCurrentClass(item)" v-html="item.name"></span>
              <span class="like" @click.stop="toggleFavarite(item)">
                <i :class="favariteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteItem(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operator">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text" @click="addSong">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirm" :info="confirmInfo" :confirmBtnText="confirmBtnText"></confirm>
    </div>
  </transition>
</template>

<script>
import Scroll from 'components/scroll/Scroll'
import Confirm from 'components/confirm/Confirm'
import { mapMutations ,mapActions, mapGetters } from 'vuex'
import { playMode } from 'base/js/config'
import { playerMixin } from 'base/js/mixin'

export default {
  name: 'PlayList',
  mixins: [playerMixin],
  components: {
    Scroll,
    Confirm
  },
  data() {
    return {
      showFlag: false,
      confirmInfo: '确定清空播放列表吗？',
      confirmBtnText: '清空'
    }
  },
  methods: {
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions(['deleteSong', 'clearPlayList', 'saveFavariteList', 'deleteFavariteList']),
    isFavarite(song) {
      return this.favariteList.find(item => {
        return item.id === song.id
      })
    },
    toggleFavarite(current) {
      console.log(current)
      this.isFavarite(current) ? this.deleteFavariteList(current) :  this.saveFavariteList(current)
    },
    favariteIcon(song) {
      return this.isFavarite(song) ? 'icon-favorite' : 'icon-not-favorite'
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    addSong() {
      this.$router.push('/addsong')
    },
    confirm() {
      this.clearPlayList()
      this.hide()
    },
    deleteItem(song) {
      this.deleteSong(song)
      if(!this.playList.length) {
        this.hide()
      }
    },
    show() {
      this.showFlag = true
      this.$nextTick(() => {
        this.$refs.listScroll.refresh()
        this.scrollToCurrent(this.currentSong)
      })
    },
    hide() {
      this.showFlag = false
    },
    toggle() {
      this.showFlag = !this.showFlag
    },
    getCurrentClass(song) {
      if(this.currentSong.id === song.id) {
        return 'current'
      }

      return ''
    },
    selectSong(song, index) {
      if(this.mode === playMode.random) {
        index = this.playList.findIndex(item => {
          return item.id === song.id
        })
      }

      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return song.id === current.id
      })

      this.$refs.listScroll.scrollToElement(this.$refs.listItem[index], 300)
    }
  },
  computed: {
    ...mapGetters(['currentSong', 'favariteList']),
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      if(!this.showFlag || oldSong.id === newSong.id) {
        return
      }

      this.scrollToCurrent(newSong)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
@import '../../base/scss/mixin.scss';

  .play-list {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 99;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s;
      .list-wrap {
        transition: all .3s;
      }
    }
    &.list-fade-enter, &.list-fade-leave-to {
      opacity: 0;
      .list-wrap {
        transform: translate3d(0, 100%, 0)
      }
    }
    .list-wrap {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: $color-bg-hl;
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          &.list-enter-active, &.list-leave-active {
            transition: all 0.2s;
          }
          &.list-enter, &.list-leave-to {
            height: 0;
          }
          .text {
            flex: 1;
            font-size: $size-md;
            color: $color-text-d;
            padding: 0 10px;
            @include ellipsis();
            &.current {
              color: $color-text;
            }
          }
          .like {
            margin-right: 15px;
            font-size: $size-sm;
            color: $color-theme;
            @include extend-click();
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            font-size: $size-sm;
            color: $color-theme;
            @include extend-click();
          }
        }
      }
      .list-header {
        position: relative;
        padding: 10px 30px 10px 20px;
        .m-title {
          display: flex;
          align-items: center;
          font-size: 0;
          padding-left: 10px;
          .icon {
            font-size: $size-lg-l;
            color: $color-theme;
            vertical-align: middle;
          }
          .text{
            flex: 1;
            font-size: $size-md;
            color: $color-text-l;
            padding-left: 10px;
            vertical-align: middle;
          }
          .clear{
            @include extend-click();
          }
        }
      }
      .list-operator {
        width: 140px;
        margin: 20px auto 30px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $size-sm;
          }
          .text {
            font-size: $size-sm;
          }
        }
      }
      .list-close {
        text-align: center;
        line-height: 50px;
        background: $color-bg;
        font-size: $size-bg;
        color: $color-text-l;
      }
    }
  }
</style>

