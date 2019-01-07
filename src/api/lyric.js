import { params } from './config'
import axios from 'axios'

export function getLyric(mid) {
  const url = '/api/getLyric'

  const data = Object.assign({}, params, {
    pcachetime: +new Date(),
    songmid: mid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then(res => Promise.resolve(res.data))
}