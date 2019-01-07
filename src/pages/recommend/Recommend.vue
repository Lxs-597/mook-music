<template>
  <div class="recommend" ref="recommend">
    <scroll :data="dissList" class="recommend-content" ref="scroll">
      <div>
        <slider height="150px" v-if="recommends.length">
          <div v-for="(item, index) in recommends" :key="index">
            <img :src="item.picUrl" @load="loadImage">
          </div>
        </slider>
        <div class="sub-title">
          <h2 class="yellow--text text--darken-1 text-xs-center">热门歌曲推荐</h2>
        </div>
        <list :list="dissList" :tile="true" @selectDiss="selectDiss"></list>
      </div>
      <loading v-show="!dissList.length">
        <span class="grey--text text--lighten-1">正在加载...</span>
      </loading>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getDissList } from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'
import Slider from 'components/slider/Slider'
import Scroll from 'components/scroll/Scroll'
import List from 'components/list/List'
import Loading from 'components/loading/Loading'
import { playListMixin } from 'base/js/mixin'
import { mapMutations } from 'vuex'

export default {
  name: 'Recommend',
  mixins: [playListMixin],
  components: {
    Slider,
    Scroll,
    List,
    Loading
  },
  data() {
    return {
      recommends: [],
      dissList: []
    }
  },
  methods: {
    ...mapMutations({
      setDiss: 'SET_DISS'
    }),
    handlePlayList(list) {
      const bottom = list.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectDiss(diss) {
      this.$router.push({
        name: 'Diss',
        params: {
          id: diss.dissid
        }
      })
      this.setDiss(diss)
    },
    _getRecommend() {
      getRecommend().then(res => {
        if(res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDissList() {
      getDissList().then(res => {
        if(res.code === ERR_OK) {
          this.dissList = res.data.list
        }
      })
    },
    loadImage() {
      if(!this.imageloaded) {
        this.$refs.scroll.refresh()
        this.imageloaded = true
      }
    }
  },
  created() {
    this._getRecommend()
    setTimeout(() => {
      this._getDissList()
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';

  .recommend {
    position: fixed;
    top: 92px;
    bottom: 0;
    width: 100%;
    z-index: 10;
    .recommend-content {
      height: 100%;
      min-height: 100%;
      overflow: hidden;
    }
    .sub-title {
      height: 50px;
      line-height: 50px;
      font-size: $size-md;
      font-weight: 600;
      background-color: $color-bg;
    }
  }
</style>
