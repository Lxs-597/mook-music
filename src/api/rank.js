import jsonp from 'base/js/jsonp'
import { params, options } from './config.js'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, params, {
    platform: 'h5',
    _: +new Date(),
    format: 'jsonp'
  })

  return jsonp(url, data, options)
}

export function getList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, params, {
    topid,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    _: +new Date()
  })

  return jsonp(url, data, options)
}