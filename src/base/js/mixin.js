import { mapGetters, mapMutations } from 'vuex'
import { playMode } from 'base/js/config'
import { shuffle } from 'base/js/utils'

export const playListMixin = {
  methods: {
    handlePlayList(playlist) {
      throw new Error('component must implement handlePlayList function')
    }
  },
  computed: {
    ...mapGetters(['playList'])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated () {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(list) {
      this.handlePlayList(list)
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters(['mode', 'currentSong', 'playList', 'sequenceList']),
    modeIcon() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null
      if(mode === playMode.random) {
        list = shuffle(this.playList)
      }else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    }
  }
}


