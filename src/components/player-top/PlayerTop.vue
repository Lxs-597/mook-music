<template>
  <div class="player-top">
    <v-btn icon @click="back">
      <i class="icon-back"></i>
    </v-btn>
    <h1 class="t-title" v-html="currentSong.name"></h1>
    <h2 class="t-subtitle" v-html="currentSong.singer"></h2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PlayerTop',
  methods: {
    back() {
      this.$emit('back')
    }
  },
  computed: {
    ...mapGetters(['currentSong'])
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
@import '../../base/scss/mixin.scss';

  .player-top {
    position: relative;
    color: $color-text;
    .btn {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 10;
      margin-top: 2px;
    }
    .icon-back {
      transform: rotate(-90deg);
      font-size: $size-lg-l;
      color: $color-theme;
    }
    .t-title {
      width: 70%;
      margin: 0 auto;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: $size-lg-s;
      @include ellipsis();
    }
    .t-subtitle {
      line-height: 20px;
      text-align: center;
      font-size: $size-md;
    }
  }
</style>

