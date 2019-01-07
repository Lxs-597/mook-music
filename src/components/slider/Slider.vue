<template>
  <div class="m-slider" ref="slider">
    <div class="slider-group" ref="silderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" :class="{active: currentIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from 'base/js/dom'

export default {
  name: 'Slider',
  data() {
    return {
      dots: [],
      currentIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.silderGroup.children

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth

      for(let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      if(this.loop && !isResize) {
        width += 2 * sliderWidth
      }

      this.$refs.silderGroup.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        bounce: false
      })

      this.slider.on('scrollEnd', () => {
        this.currentIndex = this.slider.getCurrentPage().pageX

        if(this.autoPlay) {
          this._play()
        }
      })
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      clearTimeout(this.timer)
      
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if(this.autoPlay) {
        this._play()
      }
    })

    window.addEventListener('resize', () => {
      if(!this.slider) {
        return
      }

      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  activated() {
    if(this.autoPlay) {
      this._play()
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';

  .m-slider {
    position: relative;
  }
  .slider-group {
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float: left;
      font-size: 0;
      width: 100%;
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 12px;
    font-size: 0;
    text-align: center;
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $color-text-l;
      &.active {
        width: 20px;
        border-radius: 5px;
        background-color: $color-text-b;
      }
    }
  }
</style>
