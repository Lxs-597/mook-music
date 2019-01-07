<template>
  <ul class="switches">
    <li v-for="(item, index) in switches"
        :key="index" class="switch-item"
        :class="{'active' : index === currentIndex}"
        @click="switchClick(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Switches',
  props: {
    switches: {
      type: Array,
      default() {
        return []
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchClick(index) {
      this.$emit('switch', index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';

  .switches {
    display: flex;
    align-items: center;
    width: 240px;
    margin: 0 auto;
    border: 1px solid $color-bg-hl;
    border-radius: 5px;
    .switch-item {
      flex: 1;
      padding: 8px;
      text-align: center;
      font-size: $size-md;
      color: $color-text-d;
      &.active {
        background: $color-bg-hl;
        color: $color-text;
      }
    }
  }
</style>
