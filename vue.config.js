const path = require('path')
const axios = require('axios')

const resolve = dir => path.join(__dirname, dir)

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('api', resolve('src/api'))
      .set('base', resolve('src/base'))
      .set('components', resolve('src/components'))
      .set('pages', resolve('src/pages'))
  },

  devServer: {
    before(app) {
      app.get('/api/getDissList', (req, res) => {
        let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        }).catch(err => {
          console.log(err)
        })
      }),
      app.get('/api/getLyric', (req, res) => {
        let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          let ret = response.data
          if(typeof ret === 'string') {
            let reg = /^\w+\(({[^()]+})\)$/
            let matches = ret.match(reg)
            if(matches) {
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch(err => {
          console.log(err)
        })
      }),
      app.get('/api/getDissSongs', (req, res) => {
        let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        }).catch(err => {
          console.log(err)
        })
      })
    }
  }
}