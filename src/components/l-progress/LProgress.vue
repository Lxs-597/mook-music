<template>
  <div class="l-progress">
    <div class="time-l">{{ time }}</div>
    <div class="progress-wrap" ref="progressWrap" @click="progressClick($event)">
      <v-progress-linear
        class="time-line"
        v-model="percent"
        color="yellow yellow-darken-1"
        height="4">
      </v-progress-linear>
    </div>
    <div class="time-r">{{ duration }}</div>
    <div class="ball-wrap" ref="ball"
      @touchstart.prevent="touchBallStart($event)"
      @touchmove.prevent="touchBallMove($event)"
      @touchend.prevent="touchBallEnd">
      <div class="ball"></div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'base/js/dom'

const transform = prefixStyle('transform')
const BUTTON_WIDTH = 30
export default {
  name: 'LProgress',
  props: {
    duration: {
      type: String,
      default: 0
    },
    time: {
      type: String,
      default: 0
    },
    percent: {
      type: Number,
      default: 0
    },
    isMove: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    touchBallStart(e) {
      this.touch.initial = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progressWrap.clientWidth * this.percent / 100
    },
    touchBallMove(e) {
      if(!this.touch.initial) {
        return
      }
      if(!this.isMove) {
        this.$emit('ballMove')
      }
      this.touch.deltaX = e.touches[0].pageX - this.touch.startX
      const offset = Math.min(this.$refs.progressWrap.clientWidth, Math.max(0, this.touch.left + this.touch.deltaX))
      const deltaPercent = offset / (this.$refs.progressWrap.clientWidth)

      this.$emit('triggerMove', deltaPercent)
      this.$refs.ball.style[transform] = `translate3d(${offset}px, 0, 0)`
    },
    touchBallEnd() {
      let percent = this.$refs.progressWrap.clientWidth
      percent = this.touch.deltaX / percent * 100

      this.$emit('ballMoveEnd')
      this.$emit('changePercent')
      this.touch.initial = false
    },
    progressClick(e) {
      let percent = this.$refs.progressWrap.clientWidth
      percent = e.offsetX / percent * 100

      this.$emit('gotoPercent', percent)
    }
  },
  created() {
    this.touch = {}
  },
  watch: {
    percent(newPercent) {
      if(newPercent > 0 && !this.touch.initial) {
        const width = this.$refs.progressWrap.clientWidth
        const offset = Math.round(width * newPercent / 100)
        this.$refs.ball.style[transform] = `translate3d(${offset}px, 0, 0)`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';

  .l-progress {
    position: relative;
    display: flex;
    align-items: center;
    height: 30px;
    line-height: 30px;
    width: 80%;
    margin: 0 auto 8px;
    .progress-wrap {
      width: 100%;
      height: 100%;
      .progress-linear {
        margin: 13px 0;
      }
    }
    .time-line {
      flex: 1;
    }
    .time-l, .time-r {
      flex: 0 0 35px;
      width: 30px;
      text-align: center;
      font-size: $size-sm;
    }
    .time-l {
      text-align: left;
      padding-right: 10px;
    }
    .time-r {
      text-align: right;
      padding-left: 10px;
    }
    .ball-wrap {
      position: absolute;
      top: 0;
      left: 20px;
      width: 30px;
      height: 30px;
      box-sizing: border-box;
      z-index: 1;
      padding: 8px;
      .ball {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: $color-theme;
        border: 3px solid $color-text;
      }
    }
  }
</style>

