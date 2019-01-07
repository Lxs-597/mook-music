export function shuffle(arr) {
  let array = arr.slice()
  for(let i = 0; i < array.length; i++) {
    let random = getRandomInt(0, i)
    let temp = array[i]
    array[i] = array[random]
    array[random] = temp
  }

  return array
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function debounce(fn, delay) {
  let timer

  return function(...args) {
    if(timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}