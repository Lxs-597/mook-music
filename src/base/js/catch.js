const storage = require('store')

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 100

const FAVARITE_KEY = '__favarite__'
const FAVARITE_MAX_LENGTH = 100


export function saveHistory(query) {
  let searches = storage.get(SEARCH_KEY) || []
  insertArray(searches, query, item => {
    return item === query
  }, SEARCH_MAX_LENGTH)

  storage.set(SEARCH_KEY, searches)

  return searches
}

export function deleteHistory(query) {
  let searches = storage.get(SEARCH_KEY) || []
  deleteFromArray(searches, item => {
    return item === query
  })

  storage.set(SEARCH_KEY, searches)

  return searches
}

export function clearHistory() {
  storage.remove(SEARCH_KEY)

  return []
}

export function getLocalSearch() {
  return storage.get(SEARCH_KEY) || []
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY) || []

  insertArray(songs, song, item => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)

  storage.set(PLAY_KEY, songs)

  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY) || []
}

export function saveFavarite(song) {
  let songs = storage.get(FAVARITE_KEY) || []

  insertArray(songs, song, item => {
    return item.id === song.id
  }, FAVARITE_MAX_LENGTH)

  storage.set(FAVARITE_KEY, songs)

  return songs
}

export function deleteFavarite(song) {
  let songs = storage.get(FAVARITE_KEY) || []

  deleteFromArray(songs, item => {
    return item.id === song.id
  })

  storage.set(FAVARITE_KEY, songs)

  return songs
}

export function loadFavarite() {
  return storage.get(FAVARITE_KEY) || []
}


function insertArray(arr, val, compare, maxlen) {
  const index = arr.findIndex(compare)

  if(index === 0) {
    return
  }

  if(index > 0) {
    arr.splice(index, 1)
  }

  arr.unshift(val)

  if(maxlen && arr.length > maxlen) {
    arr.pop()
  }
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)

  if(index > -1) {
    arr.splice(index, 1)
  }
}