<template>
  <div class="singer" ref="singer">
    <anchor v-show="anthorList.length" :list="anthorList"></anchor>
    <singer-list
      ref="singerList"
      v-if="sortSingerList.length"
      :singers="sortSingerList"
      @selectSinger="selectSinger"
    ></singer-list>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'base/js/singer'
import Anchor from 'components/anchor/Anchor'
import SingerList from 'components/singerlist/SingerList'
import { mapMutations } from 'vuex'
import { playListMixin } from 'base/js/mixin'

const HOT_NAME = '热门'
const HOT_LEN = 10

export default {
  name: 'Singer',
  mixins: [playListMixin],
  components: {
    Anchor,
    SingerList
  },
  data() {
    return {
      singerList: []
    }
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    handlePlayList(list) {
      const bottom = list.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.singerList.refresh()
    },
    _getSingerList() {
      getSingerList().then(res => {
        if(res.code === ERR_OK) {
          this.singerList = res.data.list
        }
      })
    },
    selectSinger(singer) {
      this.$router.push({ name: 'SingerDetail', params: { id: singer.id } })
      this.setSinger(singer)
    }
  },
  computed: {
    mapSingerList() {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      this.singerList.forEach((item, index) => {
        if(index < HOT_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }

        const key = item.Findex

        if(!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
        }))
      })

      return map
    },
    sortSingerList() {
      let hot = [],
          res = []
      for(let val of Object.values(this.mapSingerList)) {
        if(val.title.match(/[a-zA-Z]/)) {
          res.push(val)
        }else if(val.title === HOT_NAME) {
          hot.push(val)
        }
      }

      return [...hot, ...res.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))]
    },
    anthorList() {
      return this.sortSingerList.map(item => {
        return item.title.substring(0, 1)
      })
    }
  },
  created() {
    this._getSingerList()
  }
}
</script>

<style lang="scss" scoped>
  .singer {
    position: fixed;
    top: 92px;
    bottom: 0;
    width: 100%;
    z-index: 10;
    overflow: hidden;
  }
</style>
