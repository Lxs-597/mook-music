<template>
  <div class="shot-cut">
    <h1 class="m-title">{{ title }}</h1>
    <ul>
      <li v-for="(item, index) in hotKey" :key="index" class="item" @click="itemClick(item, index)">
        <span>{{ item.k }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ShotCut',
  props: {
    title: {
      type: String,
      default: '热门搜索'
    },
    hotKey: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    itemClick(item, index) {
      this.$emit('itemClick', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';

  .shot-cut {
    margin: 0 20px 20px 20px;
    .m-title {
      margin-bottom: 20px;
      font-size: $size-md;
      color: $color-text-d;
    }
    .item {
      display: inline-block;
      padding: 5px 10px;
      margin: 0 20px 10px 0;
      border-radius: 6px;
      background: $color-bg-hl;
      font-size: $size-sm;
      color: $color-text-d;
    }
  }
</style>

