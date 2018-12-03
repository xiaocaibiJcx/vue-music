<template>
  <div class="singer" ref="singer">
    <listview :data="singerList"></listview>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ERR_OK} from 'api/config'
  import {getSingerList} from 'api/singer'
  import Singer from 'common/js/singer'
  import listview from 'base/listview/listview'

  const HOT_NAME = '热门'
  const HOT_ENL = 10
  export default {
    name: "singer",
    data() {
      return {
        singerList: []
      }
    },
    methods: {
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singerList = this._normalizeSinger(res.data.list)
          }

        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_ENL) {
            map.hot.items.push(
              new Singer({
                id: item.Fsinger_mid,
                name: item.Fother_name
              }))
          }
          let key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fother_name
          }))
        })
        let hot = []
        let ret = []
        for (let k in map) {
          let value = map[k]
          if (value.title.match(/[a-zA-Z]/)) {
            ret.push(value)
          } else if (value.title === HOT_NAME) {
            hot.push(value)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      }
    },
    components: {
      listview
    },
    created() {
      this._getSingerList()
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
