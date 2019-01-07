<template>
  <div class="anchor" @touchstart.stop="onStart($event)" @touchmove.stop.prevent="onMove($event)">
    <ul>
      <li v-for="(item, index) in list" :key="item" 
        :data-index="index" 
        :class="{ current: currentIndex === index}"
        class="anchor-item">
        {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
import Bus from '@/eventbus'

const ANCHOR_HEIGHT = 18

export default {
  name: 'Anchor',
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    onStart(e) {
      let anchorIndex = Number(e.target.dataset.index)

      if(!anchorIndex && anchorIndex !== 0) {
        return
      }

      this.touch.touchIndex = anchorIndex
      this.touch.y1 = e.touches[0].pageY

      Bus.$emit('gotoAnchor', anchorIndex)
    },
    onMove(e) {
      this.touch.y2 = e.touches[0].pageY

      let skip = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let touchIndex = this.touch.touchIndex + skip

      if(touchIndex < 0) {
        touchIndex = 0
      }else if(touchIndex > this.list.length){
        touchIndex = this.list.length -1
      }

      Bus.$emit('gotoAnchor', touchIndex)
    }
  },
  mounted() {
    Bus.$on('gotoAnthor', index => {
      this.currentIndex = index
    })
  },
  created() {
    this.touch = {}
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
  .anchor {
    position: fixed;
    top: 50%;
    right: 0;
    z-index: 9;
    width: 20px;
    transform: translateY(-50%);
    padding: 10px 0;
    border-radius: 10px;
    background-color: $color-bg-d;
    text-align: center;
    .anchor-item {
      font-size: $size-sm;
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      &.current {
        color: $color-theme
      }
    }
  }
</style>
