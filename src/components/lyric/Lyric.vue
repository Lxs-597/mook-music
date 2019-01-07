<template>
    <scroll :data="lyric" class="lyric" ref="lyricScroll">
      <div class="lyric-wrap">
        <div v-if="lyric && lyric.length > 0">
          <p v-for="(line, index) in lyric" :key="index"
            class="text"
            :class="{ 'current' : currentLine === index }"
            ref="line">
            {{ line.txt }}
          </p>
        </div>
      </div>
    </scroll>
</template>

<script>
import Scroll from 'components/scroll/Scroll'
import { mapGetters } from 'vuex'

export default {
  name: 'Lyric',
  components: {
    Scroll
  },
  props: {
    lyric: {
      type: Array,
      default() {
        return []
      }
    },
    currentLine: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters(['playing'])
  },
  watch: {
    currentLine(line) {
      if(!this.playing) {
        return
      }

      if(this.currentLine > 5) {
        this.lyricScroll.scrollToElement(this.$refs.line[line - 5], 1000)
      }else {
        this.lyricScroll.scrollTo(0, 0, 1000)
      }
    }
  },
  created() {
    this.$nextTick(() => {
      if(!this.lyricScroll) {
        this.lyricScroll = this.$refs.lyricScroll
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
@import '../../base/scss/mixin.scss';

  .lyric {
    width: 100%;
    height: 100%;
    font-size: $size-bg;
    overflow: hidden;
    .lyric-wrap {
      width: 80%;
      margin: 0 auto;
      text-align: center;
      .text {
        color: $color-text-l;
        line-height: 32px;
        @include ellipsis();
        &.current {
          color: $color-text;
        }
      }
    }
  }
</style>

