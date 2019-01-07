<template>
  <transition name="slide">
    <music-list :title="name" :bg-image="avatar" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'base/js/song'
import MusicList from 'components/musiclist/MusicList'

export default {
  name: 'SingerDetail',
  components: {
    MusicList
  },
  data() {
    return {
      songs: []
    }
  },
  methods: {
    _getSinger() {
      if(!this.singer.id) {
        this.$router.back()
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if(res.code === ERR_OK) {
          this.songs = this._normalSongs(res.data.list)
        }
      })
    },
    _normalSongs(list) {
      let ret = []
      list.forEach(item => {
        let { musicData } = item
        if(musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })

      return ret
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    name() {
      return this.singer.name
    },
    avatar() {
      return this.singer.avatar
    }
  },
  created() {
    this._getSinger()
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
