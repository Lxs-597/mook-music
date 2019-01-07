import * as types from './types'
import { playMode } from 'base/js/config'
import { shuffle } from 'base/js/utils'
import { saveHistory, deleteHistory, clearHistory, savePlay, saveFavarite, deleteFavarite } from 'base/js/catch'

export const selectAndPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  if(state.mode === playMode.random) {
    let randomList = shuffle(list)
    index = findIndex(randomList, list[index])
    commit(types.SET_PLAY_LIST, randomList)
  }else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
}

export const randomAndPlay = ({commit}, {list}) => {
  let randomList = shuffle(list)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_CURRENT_INDEX, 0)
}

export const insertSong = ({commit, state}, song) => {
  let playList = state.playList.slice(),
      sequenceList = state.sequenceList.slice(),
      currentIndex = state.currentIndex
  let currentSong = playList[currentIndex],
      fIndex = findIndex(playList, song)

  currentIndex++
  playList.splice(currentIndex, 0, song)
  if(fIndex > -1) {
    if(currentIndex > fIndex) {
      playList.splice(fIndex, 1)
      currentIndex --
    }else {
      playList.splice(fIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let sIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if(sIndex > -1) {
    if(currentSIndex > sIndex) {
      sequenceList.splice(sIndex, 1)
    }else {
      sequenceList.splice(sIndex + 1, 1)
    }
  }

  if(state.playing) {
    currentSIndex -= 1
  }

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_CURRENT_INDEX, currentSIndex)
  if(!state.playing) {
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_FULL_SCREEN, true)
  }
}

export const deleteSong = ({commit, state}, song) => {
  let playList = state.playList.slice(),
      sequenceList = state.sequenceList.slice(),
      currentIndex = state.currentIndex

  let pIndex = findIndex(playList ,song)
  let sIndex = findIndex(sequenceList, song)
  playList.splice(pIndex, 1)
  sequenceList.splice(sIndex, 1)

  if(currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if(!playList.length) {
    commit(types.SET_PLAYING_STATE, false)
  }else if(playList.length && currentIndex === pIndex) {
    commit(types.SET_PLAYING_STATE, true)
  }

}

export const saveSearchHistory = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, saveHistory(query))
}

export const deleteSearchHistory = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, deleteHistory(query))
}

export const clearSearchHistory = ({commit}) => {
  commit(types.SET_SEARCH_HISTORY, clearHistory())
}

export const clearPlayList = ({commit}) => {
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_CURRENT_INDEX, -1)
}

export const savePlayHistory = ({commit}, song) => {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavariteList = ({commit, state}, song) => {
  commit(types.SET_FAVARITE_LIST, saveFavarite(song))
}

export const deleteFavariteList = ({commit, state}, song) => {
  commit(types.SET_FAVARITE_LIST, deleteFavarite(song))
}
  

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}
