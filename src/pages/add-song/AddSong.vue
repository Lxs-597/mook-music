<template>
  <transition name="slide">
    <div class="add-song">
      <div class="header">
        <h1 class="m-title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-input-wrap">
        <search-input
          ref="searchInput"
          placeholder="搜索歌曲"
          @queryChange="queryChange">
        </search-input>
      </div>
      <div class="short-cut" v-show="!query">
        <switches
          :currentIndex="currentSwitch"
          :switches="switches"
          @switch="switchClick">
        </switches>
          <div class="list-wrapper">
            <scroll
              ref="songListScroll"
              class="list-scroll"
              :data="playHistory"
              v-show="currentSwitch === 0">
              <div class="list-inner">
                <song-list
                  :avatar="false"
                  :songs="playHistory"
                  @selectSong="selectSong">
                </song-list>
              </div>
            </scroll>
            <scroll
              ref="searchListScroll"
              class="list-scroll"
              :data="searchHistory"
              v-show="currentSwitch === 1">
              <div class="list-inner search-wrapper">
                <search-list
                  :searches="searchHistory"
                  @selectSearch="selectSearch"
                  @deleteSearch="deleteSearchHistory">
                </search-list>
              </div>
            </scroll>
          </div>
      </div>
      <div class="suggest-wrap" v-show="query">
        <suggest ref="suggest" :result="result" @selectSuggest="selectSuggest" @searchMore="searchMore"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-content">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchInput from 'components/search-input/SearchInput'
import Suggest from 'components/search-suggest/Suggest'
import Switches from 'components/switches/Switches'
import SongList from 'components/songlist/SongList'
import SearchList from 'components/search-list/SearchList'
import Scroll from 'components/scroll/Scroll'
import TopTip from 'components/top-tip/TopTip'
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong } from 'base/js/song'
import Song from 'base/js/song'
import { mapActions, mapGetters } from 'vuex'

const PERPAGE = 20

export default {
  name: 'AddSong',
  components: {
    SearchInput,
    Suggest,
    Switches,
    SongList,
    SearchList,
    Scroll,
    TopTip
  },
  data() {
    return {
      query: '',
      page: 1,
      showSinger: false,
      result: [],
      hasMore: true,
      currentSwitch: 0,
      switches: [
        { name: '最近播放' },
        { name: '搜索历史' }
      ]
    }
  },
  methods: {
    ...mapActions([
      'insertSong',
      'saveSearchHistory',
      'savePlayHistory',
      'deleteSearchHistory'
    ]),
    showTip() {
      this.$refs.topTip.show()
    },
    selectSong(song, index) {
      if(index !== 0) {
        this.showTip()
        this.insertSong(new Song(song))
      }
    },
    selectSearch(search) {
      this.$refs.searchInput.setQuery(search)
    },
    switchClick(index) {
      this.currentSwitch = index
    },
    hide() {
      this.$router.back()
    },
    queryChange(query) {
      this.query = query
    },
    selectSuggest(suggest) {
      this.showTip()
      this.insertSong(suggest)
      this.saveSearchHistory(this.query)
    },
    searchMore() {
      if(!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, PERPAGE, this.showSinger).then(res => {
        if(res.code === ERR_OK) {
          this.result = this.result.concat(this._normalSongs(res.data.song.list))
          this._checkHasMore(res.data)
        }
      })
    },
    search() {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.$refs.suggestScroll.scrollTo(0, 0)

      search(this.query, this.page, PERPAGE, this.showSinger).then(res => {
        if(res.code === ERR_OK) {
          this.result = this._normalSongs(res.data.song.list)
          this._checkHasMore(res.data)
        }
      })
    },
    _normalSongs(list) {
      let ret = []
      list.forEach(musicData => {
        if(musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })

      return ret
    },
    _checkHasMore(data) {
      const song = data.song

      if(!song.list.length || (song.curnum + song.curpage * PERPAGE >= song.totalnum)) {
        this.hasMore = false
      }
    },
    _refreshScroll(currentSwitch) {
      if(currentSwitch === 0) {
        this.$nextTick(() => {
          this.$refs.songListScroll && this.$refs.songListScroll.refresh()
        })
      }else {
        this.$nextTick(() => {
          this.$refs.searchListScroll && this.$refs.searchListScroll.refresh()
        })
      }
    }
  },
  computed: {
    ...mapGetters(['playHistory', 'searchHistory'])
  },
  created () {
    this._refreshScroll(this.currentSwitch)
  },
  watch: {
    query(newQuery) {
      this.search()
    },
    currentSwitch(newSwitch) {
      this._refreshScroll(newSwitch)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
@import '../../base/scss/mixin.scss';

  .add-song {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 199;
    background-color: $color-bg;
    &.slide-enter-active, &.slide-leave-active {
      transition: all .3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .header {
      position: relative;
      height: 44px;
      text-align: center;
      .m-title {
        line-height: 44px;
        font-size: $size-md;
        color: $color-text;
      }
      .close {
        position: absolute;
        top: 0;
        right: 8px;
        .icon-close {
          display: block;
          padding: 13px;
          font-size: $size-bg;
          color: $color-theme;
        }
      }
    }
    .short-cut {
      .list-wrapper {
        position: absolute;
        top: 164px;
        bottom: 0;
        width: 100%;
        .list-scroll {
          height: 100%;
          overflow: hidden;
          .list-inner {
            &.search-wrapper {
              padding: 10px 25px;
            }
          }
        }
      }
    }
    .search-input-wrap {
      margin: 20px;
    }
    .suggest-wrap {
      position: fixed;
      top: 124px;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: hidden;
      background-color: inherit;
    }
    .tip-content {
      text-align: center;
      padding: 18px 0;
      font-size: 0;
      .icon-ok {
        font-size: $size-md;
        color: $color-theme;
        margin-right: 4px;
      }
      .text {
        font-size: $size-md;
        color: $color-text;
      }
    }
  }
</style>

