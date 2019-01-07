<template>
  <scroll :data="singers" :probeType="probeType" @scroll="scroll" :listenScroll="listenScroll" class="singer-list" ref="singerScroll">
    <v-card>
      <v-list dark>
        <li v-for="(group, index) in singers" :key="index" ref="listGroup">
          <v-subheader :key="index">{{ group.title }}</v-subheader>
          <v-list-tile avatar v-ripple
            v-for="(singer, id) in group.items"
            :key="group.title + id"
            @click="selectSinger(singer)"
          >
            <v-list-tile-avatar :tile="tile" size="40">
              <img v-lazy="singer.avatar">
            </v-list-tile-avatar>
            <v-list-tile-content class="pl-1">
              <v-list-tile-title class="grey--text text--darken-1 mb-2 body-1" v-html="singer.name"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </li>
      </v-list>
    </v-card>
    <div class="fix-title" v-show="fixTitle && scrollY < 0" ref="fixTitle">
      <v-subheader>{{ fixTitle }}</v-subheader>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'components/scroll/Scroll'
import Bus from '@/eventbus'

const FIX_TITLE_HEIGHT = 28

export default {
  name: 'SingerList',
  components: {
    Scroll
  },
  props: {
    singers: {
      type: Array,
      default: []
    },
    tile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      probeType: 3,
      listenScroll: true,
      scrollY: -1,
      fixTitle: '',
      diff: -1
    }
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
      let oldTitle = this.fixTitle
      Bus.$emit('gotoAnthor', this.current)
      if(oldTitle && oldTitle === this.singers[this.current].title) {
        return
      }
      this.fixTitle = this.singers[this.current].title
    },
    selectSinger(item) {
      this.$emit('selectSinger', item)
    },
    refresh() {
      this.$refs.singerScroll.refresh()
    }
  },
  computed: {
    listHeight() {
      let height = 0
      return [0, ...this.$refs.listGroup.map(item => height += item.clientHeight)]
    },
    current() {
      let y = -this.scrollY,
          list = this.listHeight,
          current = 0

      if(y < 0) {
        return current
      }

      for(let i = 0; i < list.length - 1; i++) {
        let h1 = list[i]
        let h2 = list[i + 1]
        if(y >= h1 && y < h2){
          this.diff = h2 - y
          return i
        }
      }
      return list.length - 2
    }
  },
  mounted() {
    Bus.$on('gotoAnchor', index => {
      this.$refs.singerScroll.scrollToElement(this.$refs.listGroup[index], 300)
    })
  },
  watch: {
    diff(val) {
      let fixTop = (val > 0 && val < FIX_TITLE_HEIGHT) ? val - FIX_TITLE_HEIGHT : 0
      this.$refs.fixTitle.style.transform = `translate3d(0, ${fixTop}px, 0)`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
  .singer-list {
    width: 100%;
    height: 100%;
    min-height: 100%;
    overflow: hidden;
    .list {
      padding: 0;
      background-color: $color-bg;
      padding-bottom: 15px;
    }
    .subheader {
      height: 28px;
      line-height: 28px;
      background-color: #424242;
      margin: 10px 0;
      &:first-child {
        margin-top: 0;
      }
    }
    .fix-title {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
  }
</style>

