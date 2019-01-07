<template>
  <scroll
    class="suggest"
    ref="suggestScroll"
    :data="result"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScrollStart="beforeListScroll">
    <ul class="suggest-list">
      <li v-for="(item, index) in result" :key="index" class="suggest-item" @click="selectSuggest(item)">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
    <div v-show="result.length === 0">
      <p class="no-result">暂无搜索结果....</p>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'components/scroll/Scroll'
import Bus from '@/eventbus'

const TYPE_SINGER = 'singer'

export default {
  name: 'Suggest',
  components: {
    Scroll
  },
  props: {
    result: {
      type: Array,
      default() {
        return []
      },
    },
    pullup: {
      type: Boolean,
      default: true
    },
    beforeScroll: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    selectSuggest(item) {
      this.$emit('selectSuggest', item)
    },
    searchMore() {
      this.$emit('searchMore')
    },
    beforeListScroll() {
      Bus.$emit('beforeListScroll')
    },
    getIconClass(item) {
      if(item.type === TYPE_SINGER) {
        return 'icon-mine'
      }else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if(item.type === TYPE_SINGER) {
        return item.singername
      }else {
        return `${item.name}-${item.singer}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
@import '../../base/scss/mixin.scss';

  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 20px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: $size-md;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $size-md;
          color: $color-text-d;
          .text {
            @include ellipsis();
          }
        }
      }
    }
    .no-result {
      font-size: $size-md;
      color: $color-text-d;
      text-align: center;
    }
  }
</style>


