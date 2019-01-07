import Vue from 'vue'
import Router from 'vue-router'
import { resolve } from 'url'

Vue.use(Router)

const SingerDetail = resolve => {
  import('pages/singerdetail/SingerDetail').then(module => {
    resolve(module)
  })
}

const Diss = resolve => {
  import('pages/diss/Diss').then(module => {
    resolve(module)
  })
}

const TopList = resolve => {
  import('pages/toplist/TopList').then(module => {
    resolve(module)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: resolve => require(['pages/recommend/Recommend'], resolve),
      children: [
        {
          path: ':id',
          name: 'Diss',
          component: Diss
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: resolve => require(['pages/singer/Singer'], resolve),
      children: [
        {
          path: ':id',
          name: 'SingerDetail',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: resolve => require(['pages/rank/Rank'], resolve),
      children: [
        {
          path: ':id',
          name: 'TopList',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: resolve => require(['pages/search/Search'], resolve),
      children: [
        {
          path: ':id',
          name: 'searchSinger',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/addsong',
      name: 'AddSong',
      component: resolve => require(['pages/add-song/AddSong'], resolve)
    },
    {
      path: '/user',
      name: 'UserCenter',
      component: resolve => require(['pages/user-center/UserCenter'], resolve)
    }
  ]
})
