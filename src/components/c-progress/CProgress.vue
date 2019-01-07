<template>
  <div class="c-progress">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-back" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-before" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'CProgress',
  props: {
    radius: {
      type: Number,
      default: 40
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset() {
      return this.dashArray * (1 - this.percent)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';

  .c-progress {
    position: relative;
    font-size: 0;
    circle {
      stroke-width: 8px;
      transform-origin: center;
      &.progress-back {
        transform: scale(0.9);
        stroke: red;
      }
      &.progress-before {
        transform: scale(0.9) rotate(-90deg);
        stroke: $color-theme;
      }
    }
  }
</style>

