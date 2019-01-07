<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'TopTip',
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      clearTimeout(this.timer)

      this.showFlag = true

      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay);
    },
    hide() {
      this.showFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';

  .top-tip {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
    background: $color-bg-dl;
    &.drop-enter-active, &.drop-leave-active {
      transition: all 0.3s;
    }
    &.drop-enter, &.drop-leave-to {
      transform: translate3d(0, -100%, 0);
    }
  }
</style>


