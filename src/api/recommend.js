import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommend() {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  let data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })
  return jsonp(url, data, options)
}

export function getDiscList() {
  let url = '/api/getDiscList'
  let data = Object.assign({}, commonParams, {
    picmid: 1,
    platform: 'yqq',
    needNewCode: 0,
    uin: 0,
    rnd: Math.random(),
    hostUin: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSinger() {
  let str = {
    comm: {ct: 24, cv: 10000},
    singerList: {
      module: "Music.SingerListServer",
      method: "get_singer_list",
      param: {area: -100, sex: -100, genre: -100, index: -100, sin: 0, cur_page: 1}
    }
  }
  let url = '/api/getSinger'
  let data = Object.assign({}, commonParams, {
      platform: 'yqq',
      needNewCode: 0,
      hostUin: 0,
      format: 'jsonp',
      data: JSON.stringify(str)
    }
  )
  let options1 = {
    param: 'jsonpCallback'
  }
  return jsonp(url, data, options1)
}
