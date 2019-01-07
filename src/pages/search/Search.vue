<template>
  <div class="search" ref="search">
    <div class="search-input-wrap">
      <search-input ref="searchInput" @queryChange="queryChange"></search-input>
    </div>
    <scroll class="history-wrap" ref="historyWrap">
      <div>
        <shot-cut :hotKey="hotKey" @itemClick="itemClick"></shot-cut>
        <div class="search-history" v-show="!query">
          <h1 class="m-title">
            <span class="text">搜索历史</span>
            <span class="clear" v-show="searchHistory.length" @click="showConfirm">
              <v-icon small color="grey darken-3">fas fa-trash-alt</v-icon>
            </span>
          </h1>
          <search-list
            v-show="searchHistory.length && !query"
            :searches="searchHistory"
            @selectSearch="selectSearch"
            @deleteSearch="deleteSearchHistory">
          </search-list>
          <div class="no-result" v-show="!searchHistory.length">
            <p>暂无搜索历史...</p>
          </div>
        </div>
      </div>
    </scroll>
    <div class="suggest-wrap" ref="suggestWrap" v-show="query">
      <suggest ref="suggest" :result="result" @selectSuggest="selectSuggest" @searchMore="searchMore"></suggest>
    </div>
    <confirm ref="confirm" info="确定删除所有历史记录吗？" @confirm="clearSearchHistory"></confirm>
     <top-tip ref="topTip">
      <div class="tip-content">
        <i class="icon-ok"></i>
        <span class="text">1首歌曲已经添加到播放队列</span>
      </div>
    </top-tip>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import SearchInput from 'components/search-input/SearchInput'
import ShotCut from 'components/search-shotcut/ShotCut'
import Suggest from 'components/search-suggest/Suggest'
import SearchList from 'components/search-list/SearchList'
import Confirm from 'components/confirm/Confirm'
import Scroll from 'components/scroll/Scroll'
import TopTip from 'components/top-tip/TopTip'
import { getHotKey, search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong } from 'base/js/song'
import Singer from 'base/js/singer'
import { playListMixin } from 'base/js/mixin'
import { mapMutations, mapActions, mapGetters } from 'vuex'

const TYPE_SINGER = 'singer'
const PERPAGE = 20

export default {
  name: 'Search',
  mixins: [playListMixin],
  components: {
    SearchInput,
    ShotCut,
    Suggest,
    SearchList,
    Confirm,
    Scroll,
    TopTip
  },
  data() {
    return {
      hotKey: [],
      query: '',
      page: 1,
      showSinger: true,
      result: [],
      hasMore: true
    }
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER',
      setSearchHistory: 'SET_SEARCH_HISTORY'
    }),
    ...mapActions([
      'insertSong',
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ]),
    handlePlayList(list) {
      const bottom = list.length > 0 ? '60px' : 0

      this.$refs.suggestWrap.style.bottom = bottom
      this.$refs.suggest.$refs.suggestScroll.refresh()
      this.$refs.historyWrap.$el.style.bottom = bottom
      this.$refs.historyWrap.refresh()
    },
    showTip() {
      this.$refs.topTip.show()
    },
    queryChange(query) {
      this.query = query
    },
    selectSearch(search) {
      this.$refs.searchInput.setQuery(search)
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    itemClick(item) {
      this.$refs.searchInput.setQuery(item.k)
    },
    selectSuggest(item) {
      if(item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.setSinger(singer)
        this.$router.push({
          name: 'searchSinger',
          params: {
            id: singer.id
          }
        })
      }else {
        this.showTip()
        this.insertSong(item)
      }
      this.saveSearchHistory(this.query)
    },
    searchMore() {
      if(!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, PERPAGE, this.showSinger).then(res => {
        if(res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data))
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
          this.result = this._genResult(res.data)
          this._checkHasMore(res.data)
        }
      })
    },
    _getHotKey() {
      getHotKey().then(res => {
        if(res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    _checkHasMore(data) {
      const song = data.song

      if(!song.list.length || (song.curnum + song.curpage * PERPAGE >= song.totalnum)) {
        this.hasMore = false
      }
    },
    _genResult(data) {
      let ret = []
      if(data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if(data.song) {
        ret = ret.concat(this._normalSongs(data.song.list))
      }

      return ret
    },
    _normalSongs(list) {
      let ret = []
      list.forEach(musicData => {
        if(musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })

      return ret
    }
  },
  computed: {
    ...mapGetters(['searchHistory']),
    historyList() {
      return this.hotKey.concat(this.searchHistory)
    },
  },
  created() {
    this._getHotKey()
  },
  watch: {
    query(newQuery) {
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
@import '../../base/scss/mixin.scss';

  .search {
    position: fixed;
    left: 0;
    top: 92px;
    bottom: 0;
    right: 0;
    z-index: 99;
    background-color: $color-bg;
    .search-input-wrap {
      margin: 20px;
    }
    .history-wrap, .suggest-wrap {
      position: fixed;
      top: 172px;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: hidden;
      background-color: inherit;
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .m-title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $size-md;
        color: $color-text-d;
        .text {
          flex: 1;
        }
        .clear {
          font-size: 0;
          @include extend-click()
        }
      }
      .no-result {
        text-align: center;
        color: $color-text-d;
        font-size: $size-md;
        margin-top: 30px;
      }
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