<template>
  <div class="operators">
    <div class="icon-box icon-left">
      <v-btn icon @click="changeMode">
        <i class="icon" :class="modeIcon"></i>
      </v-btn>
    </div>
    <div class="icon-box icon-center">
      <v-btn icon @click="prev">
        <i class="icon icon-prev" :class="disableClass"></i>
      </v-btn>
    </div>
    <div class="icon-box icon-center">
      <v-btn icon @click="togglePlaying">
        <i class="icon" :class="[playIcon, disableClass]"></i>
      </v-btn>
    </div>
    <div class="icon-box icon-center">
      <v-btn icon @click="next">
        <i class="icon icon-next" :class="disableClass"></i>
      </v-btn>
    </div>
    <div class="icon-box icon-right">
      <v-btn icon @click="toggleFavarite">
        <i class="icon" :class="favariteIcon"></i>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'base/js/config'
import { shuffle } from 'base/js/utils'

export default {
  name: 'Operators',
  props: {
    songReady: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions(['saveFavariteList', 'deleteFavariteList']),
    isFavarite() {
      return this.favariteList.find(item => {
        return item.id === this.currentSong.id
      })
    },
    toggleFavarite() {
      this.isFavarite() ? this.deleteFavariteList(this.currentSong) :  this.saveFavariteList(this.currentSong)
    },
    togglePlaying() {
      this.$emit('togglePlaying')
    },
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null
      if(mode === playMode.random) {
        list = shuffle(this.playList)
      }else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    prev() {
      if(!this.songReady) {
        return
      }

      if(this.playList.length === 1) {
        this.$emit('oneSong')
      }else {
        let index = (this.currentIndex - 1 >= 0) ? this.currentIndex - 1 : this.playList.length -1
        this.setCurrentIndex(index)
        if(!this.playing) {
          this.togglePlaying()
        }
      }
      this.$emit('unReady')
    },
    next() {
      if(!this.songReady) {
        return
      }

      if(this.playList.length === 1) {
        this.$emit('oneSong')
      }else {
        let index = (this.currentIndex + 1 < this.playList.length) ? this.currentIndex + 1 : 0
        this.setCurrentIndex(index)
        if(!this.playing) {
          this.togglePlaying()
        }
      }
      this.$emit('unReady')
    }
  },
  computed: {
    ...mapGetters(['playing', 'currentIndex', 'currentSong', 'playList', 'mode', 'sequenceList', 'playList', 'favariteList']),
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    modeIcon() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    disableClass() {
      return this.songReady ? '' : 'disable'
    },
    favariteIcon() {
      return this.isFavarite() ? 'icon-favorite' : 'icon-not-favorite'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';

  .operators {
    display: flex;
    align-items: center;
    .icon-box {
      flex: 1;
      font-size: 30px;
      &.icon-left {
        text-align: right;
      }
      &.icon-right {
        text-align: left;
      }
      &.icon-center {
        text-align: center;
      }
      .icon {
        color: $color-theme;
        font-size: 30px;
        &.icon-pause,
        &.icon-play {
          font-size: 40px;
        }
        &.icon-favorite {
          color: $color-sub-theme;
        }
        &.disable {
          color: $color-theme-d;
        }
      }
    }
    .btn--icon {
      margin: 0;
    }
  }
</style>
