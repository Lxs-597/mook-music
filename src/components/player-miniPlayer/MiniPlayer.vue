<template>
  <div class="mini-player">
    <div class="icon">
      <v-progress-circular class="circle" :size="44" :width="2" :rotate="-90" :value="percent" color="yellow darken-1"></v-progress-circular>
      <img :class="cdClass" :src="currentSong.image" width="40" height="40">
    </div>
    <div class="text">
      <h2 class="name body-1" v-html="currentSong.name"></h2>
      <p class="desc caption" v-html="currentSong.singer"></p>
    </div>
    <div class="control mini-icon">
      <v-btn icon @click.stop="togglePlaying">
        <i :class="miniIcon"></i>
      </v-btn>
    </div>
    <div class="control list-icon">
      <v-btn icon @click.stop="showPlayList">
        <i class="icon-playlist"></i>
      </v-btn>
    </div>
  </div>
</template>

<script>
import CProgress from 'components/c-progress/CProgress'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'MiniPlayer',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  components: {
    CProgress
  },
  methods: {
    togglePlaying() {
      this.$emit('togglePlaying')
    },
    showPlayList() {
      this.$emit('showPlayList')
    }
  },
  computed: {
    ...mapGetters(['currentSong', 'playing']),
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdClass() {
      return this.playing ? 'play' : 'play pause'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
@import '../../base/scss/mixin.scss';

  .mini-player {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: $color-bg-hl;
    .icon {
      flex: 0 0 40px;
      padding: 0 16px;
      position: relative;
      .circle {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 1;
        transform: translate(-50%, -50%);
        circle.progress-circular__underlay {
          stroke: #000 !important;
        }
      }
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 20s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 20px;
      overflow: hidden;
      .name, .desc {
        @include ellipsis();
      }
      .name {
        color: $color-text;
      }
      .desc {
        color: $color-text-d;
      }
    }
    .control {
      flex: 0 0 36px;
      width: 36px;
      &.mini-icon {
        margin-left: 10px;
        position: relative;
      }
      &.list-icon {
        margin-right: 10px;
      }
      .btn--icon {
        margin: 0;
      }
      .icon-play-mini, .icon-pause-mini, .icon-playlist{
        font-size: 22px;
        color: $color-theme;
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg)
    }
  }
</style>

