<template>
  <div class="input-wrap">
    <v-icon color="grey darken-4">fas fa-search</v-icon>
    <input
      ref="input"
      type="text"
      class="input"
      v-model.trim="query"
      :placeholder="placeholder">
    <v-icon color="grey darken-4" v-show="query.length" @click="clear">fas fa-times-circle</v-icon>
  </div>
</template>

<script>
import { debounce } from 'base/js/utils'
import Bus from '@/eventbus'

export default {
  name: 'SearchInput',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: '',
    }
  },
  methods: {
    clear() {
      this.query = ''
      this.$refs.input.focus()
    },
    setQuery(query) {
      this.query = query
    }
  },
  computed: {
    hasIcon() {
      return this.query.length > 0 ? 'fas fa-times-circle' : ''
    }
  },
  mounted() {
    Bus.$on('beforeListScroll', () => {
      this.$refs.input.blur()
    })
  },
  created() {
    this.$watch('query', debounce(newQuery => {
      this.$emit('queryChange', newQuery)
    }, 200))
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';

.input-wrap {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-bg-hl;
  border-radius: 6px;
  .input {
    flex: 1;
    height: 24px;
    margin: 0 5px;
    line-height: 24px;
    background: $color-bg-hl;
    color: $color-text;
    font-size: $size-md;
    text-indent: 5px;
    &::placeholder {
      color: $color-text-d;
      padding-left: 5px;
    }
    &:focus {
      border-color: 1px solid $color-theme !important;
    }
  }
}
</style>

