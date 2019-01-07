<template>
  <div class="loading">
    <div class="loading-content">
      <div class="icon d-block">
        <img width="24" height="24" src="./images/loading.gif">
      </div>
      <slot>载入中...</slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'Loading',
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';

  .loading {
    height: 100%;
    width: 100%;
    text-align: center;
    background-color: $color-bg;
    .icon {
      font-size: 0;
      margin-bottom: 4px;
    }
    .text {
      font-size: $size-sm;
      color: $color-text-l;
    }
  }
</style>
