<template>
  <div class="list-wrap">
    <v-card>
      <v-list two-line dark>
        <template v-for="(item, index) in list">
          <v-list-tile avatar :key="index" v-ripple @click="selectItem(item)">
            <v-list-tile-avatar :tile="tile" size="60">
              <img v-lazy="item.imgurl">
            </v-list-tile-avatar>
            <v-list-tile-content class="pl-3">
              <v-list-tile-title class="grey--text text--lighten-2 mb-2 body-1" v-html="item.creator.name"></v-list-tile-title>
              <v-list-tile-sub-title class="grey--text text--darken-1 caption" v-html="item.dissname"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'List',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    tile: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem(diss) {
      this.$emit('selectDiss', diss)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';

  .list-wrap {
    .list {
      background-color: $color-bg;
      padding-bottom: 15px;
    }
  }
</style>
