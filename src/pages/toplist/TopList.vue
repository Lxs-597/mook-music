<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :avatar="true"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/musiclist/MusicList'
import { getList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong } from 'base/js/song'
import { mapGetters } from 'vuex'

export default {
  name: 'TopList',
  components: {
    MusicList
  },
  data() {
    return {
      songs: []
    }
  },
  methods: {
    _getList() {
      getList(this.topList.id).then(res => {
        if(res.code === ERR_OK) {
          this.songs = this._normalSongs(res.songlist)
        }
      })
    },
    _normalSongs(list) {
      let ret = []
      list.forEach(song => {
        ret.push(createSong(song.data))
      })

      return ret
    }
  },
  computed: {
    ...mapGetters(['topList']),    
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if(this.songs.length) {
        return this.songs[0].image
      }
    }
  },
  created() {
    if(!this.topList.id) {
      this.$router.push('/rank')
      return
    }
    this._getList()
  }
}
</script>

<style lang="scss" scoped>
.slide-enter-active, .slide-leave-active {
  transition: all .3s ease-in-out;
}
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>

