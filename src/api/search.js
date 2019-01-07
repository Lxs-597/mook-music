import jsonp from 'base/js/jsonp'
import { params, options } from './config'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, params, {
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  })

  return jsonp(url, data, options)
}

export function search(query, page, perpage, zhida) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({}, params, {
    w: query,
    p: page,
    perpage,
    catZhida: zhida ? 1 : 0,
    n: perpage,
    zhidaqu: 1,
    platform: 'h5',
    needNewCode: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    format: 'jsonp',
    _: +new Date()
  })

  return jsonp(url, data, options)
}
