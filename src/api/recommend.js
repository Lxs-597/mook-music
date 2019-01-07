import jsonp from 'base/js/jsonp'
import { params, options } from './config'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, params, {
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function getDissList() {
  const url = '/api/getDissList'

  const data = Object.assign({}, params, {
    picmid: 1,
    rnd: Math.random(),
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  })

  return axios.get(url, {
    params: data
  }).then(res => Promise.resolve(res.data))
}

export function getDissSongs(id) {
  // const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const url = '/api/getDissSongs'

  const data = Object.assign({}, params, {
    disstid: id,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    format: 'json'
  })

  let opts = Object.assign({}, options, {
      param: 'jsonpCallback',
      name: 'playlistinfoCallback'
  })

  return axios.get(url, {
    params: data
  }).then(res => Promise.resolve(res.data))
}