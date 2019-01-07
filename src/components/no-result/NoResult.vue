<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{ title }}</p>
  </div>
</template>

<script>
export default {
  name: 'NoResult',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
@import '../../base/scss/mixin.scss';

  .no-result {
    text-align: center;
    .no-result-icon {
      width: 86px;
      height: 90px;
      margin: 0 auto;
      @include bg-image('./images/no-result');
      background-size: 86px 90px;
    }
    .no-result-text {
      margin-top: 20px;
      font-size: $size-md;
      color: $color-text-d;
    }
  }

</style>


