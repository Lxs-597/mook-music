export function addClass(el, className) {
  if(hasClass(el, className)) {
    return
  }

  el.classList.add(className)
}

export function hasClass(el, className) {
  return el.classList.contains(className)
}

const elementStyle = document.createElement('div').style

const vender = (() => {
  const transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    ms: 'msTransform',
    O: 'OTransform',
    standard: 'transform'
  }

  for(let key in transformNames){
    if(elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})() 

export function prefixStyle(style) {
  if(vender === false) {
    return false
  }

  if(vender === 'standard') {
    return style
  }

  return vender + style.charAt(0).toUpperCase() + style.substring(1)
}