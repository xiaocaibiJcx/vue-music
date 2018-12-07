import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend' // 推荐
import Singer from 'components/singer/singer' // 歌手
import Rank from 'components/rank/rank' // 排行
import Search from 'components/search/search' //搜索
import singerDetail from 'components/singer-detail/singer-detail'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: 'recommend'
  }, {
    path: '/recommend',
    component: Recommend
  }, {
    path: '/singer',
    component: Singer,
    children: [{
      path: ':id',
      component: singerDetail
    }]
  }, {
    path: '/rank',
    component: Rank
  }, {
    path: '/search',
    component: Search
  }]
})
