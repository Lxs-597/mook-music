<template>
  <div class="search-list">
    <transition-group tag="ul" name="list">
      <li v-for="search in searches" :key="search" class="search-item" @click="selectSearch(search)">
        <span class="text">{{ search }}</span>
        <span class="m-icon" @click.stop="deleteSearch(search)">
          <v-icon small color="grey darken-3">fas fa-times</v-icon>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'SearchList',
  props: {
    searches: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectSearch(search) {
      this.$emit('selectSearch', search)
    },
    deleteSearch(search) {
      this.$emit('deleteSearch', search)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
@import '../../base/scss/mixin.scss';

    .search-item {
      display: flex;
      align-items: center;
      height: 40px;
      overflow: hidden;
      &.list-enter-avtive, &.list-leave-active {
        transition: all .2s;
      }
      &.list-enter, &.list-leave-to {
        height: 0;
      }
      .text {
        flex: 1;
        color: $color-text-d;
        font-size: $size-md;
        @include ellipsis();
      }
      .m-icon {
        font-size: 0;
        @include extend-click()
      }
    }
</style>
