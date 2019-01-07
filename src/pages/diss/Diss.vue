<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/musiclist/MusicList'
import { getDissSongs } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { createSong } from 'base/js/song'
import { mapGetters } from 'vuex'

export default {
  name: 'Diss',
  components: {
    MusicList
  },
  data() {
    return {
      songs: []
    }
  },
  methods: {
    _getDissSongs(disstid) {
      getDissSongs(this.diss.dissid).then(res => {
        if(res.code === ERR_OK) {
          this.songs = this._normalSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalSongs(list) {
      let ret = []

      list.forEach(item => {
        if(item.songid && item.albumid) {
          ret.push(createSong(item))
        }
      })

      return ret
    }
  },
  computed: {
    ...mapGetters(['diss']),
    title() {
      return this.diss.dissname
    },
    bgImage() {
      return this.diss.imgurl
    }
  },
  created() {
    if(!this.diss.dissid) {
      this.$router.push('/recommend')
    }

    this._getDissSongs()
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

