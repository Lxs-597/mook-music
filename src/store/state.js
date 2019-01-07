import { playMode } from 'base/js/config'
import { getLocalSearch, loadPlay, loadFavarite } from 'base/js/catch'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  currentIndex: -1,
  mode: playMode.sequence,
  diss: {},
  topList: {},
  searchHistory: getLocalSearch(),
  playHistory: loadPlay(),
  favariteList: loadFavarite()
}

export default state
