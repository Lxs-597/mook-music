<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="top-list" ref="topList">
    <ul>
      <li v-for="item in topList" :key="item.topTitle" class="item" @click="selectItem(item)">
        <div class="image">
          <img v-lazy="item.picUrl"  width="100" height="100">
        </div>
        <ol class="song-list">
           <li v-for="(song, index) in item.songList" :key="index" class="song">
              <span>{{ index + 1}}</span>
              <span>{{ song.songname }}-{{ song.singername }}</span>
           </li>
        </ol>
      </li>
    </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import Scroll from 'components/scroll/Scroll'
import { playListMixin } from 'base/js/mixin'
import { mapMutations } from 'vuex';

export default {
  name: 'Rank',
  mixins: [playListMixin],
  components: {
    Scroll
  },
  data() {
    return {
      topList: []
    }
  },
  methods: {
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    }),
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.rank.style.bottom = bottom
      this.$refs.topList.refresh()
    },
    selectItem(item) {
      this.$router.push({
        name: 'TopList',
        params: {
          id: item.id
        }
      })

      this.setTopList(item)
    },
    _getTopList() {
      getTopList().then(res => {
        if(res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    }
  },
  created() {
    this._getTopList()
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
@import '../../base/scss/mixin.scss';

  .rank {
    position: fixed;
    width: 100%;
    top: 92px;
    bottom: 0;
    z-index: 10;
    background-color: $color-bg;
    .top-list {
      height: 100%;
      overflow: hidden;
    }
    .item {
      display: flex;
      font-size: 0;
      align-items: center;
      margin: 0 20px;
      padding-top: 20px;
      &:last-child {
        padding-bottom: 20px;
      }
      .image {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100px;
        padding: 0 20px;
        font-size: $size-sm;
        background-color: $color-bg-d;
        color: $color-text-d;
        overflow: hidden;
        .song {
          flex: 1;
          line-height: 33px;
          @include ellipsis();
        }
      }
    }
  }
</style>