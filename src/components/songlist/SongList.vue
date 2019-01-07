<template>
  <div class="list-wrap">
    <v-card v-if="songs.length" :flat="true">
      <v-list :two-line="twoLine" dark>
        <template v-for="(song, index) in songs">
          <v-list-tile :avatar="avatar" :key="index" v-ripple @click="selectSong(song, index)">
            <v-list-tile-avatar v-if="avatar" :tile="tile" size="60">
              <span :class="getRankClass(index)" v-text="getRankText(index)"></span>
            </v-list-tile-avatar>
            <v-list-tile-content :class="{ 'pl-3' : avatar, 'pl-1' : !avatar}">
              <v-list-tile-title class="grey--text text--lighten-2 mb-2 body-1" v-html="song.name"></v-list-tile-title>
              <v-list-tile-sub-title v-if="twoLine" class="grey--text text--darken-1 caption"> {{ song | describe }} </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'SongList',
  props: {
    twoLine: {
      type: Boolean,
      default: true
    },
    avatar: {
      type: Boolean,
      default: true
    },
    tile: {
      type: Boolean,
      default: true
    },
    songs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectSong(song, index) {
      this.$emit('selectSong', song, index)
    },
    getRankClass(index) {
      if (index < 3) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1
      }
    }
  },
  filters: {
    describe(song) {
      return `${song.singer} - ${song.album}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
@import '../../base/scss/mixin.scss';

  .list-wrap {
    .list {
      background-color: $color-bg;
      padding-bottom: 15px;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          @include bg-image('./images/first')
        }
        &.icon1 {
          @include bg-image('./images/second')
        }
        &.icon2 {
          @include bg-image('./images/third')
        }
      }
      .text {
        color: $color-theme;
        font-size: $size-lg-s;
      }
    }
  }
</style>

