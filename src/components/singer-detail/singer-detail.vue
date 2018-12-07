<template>
  <transition name="singerflag">
    <music-list :songs="songs" :title="titlt" :bg-image="bgImage"></music-list>
    <!--{{bgImage}}-->
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {singer} from "../../store/getters";
  import {getDetail} from 'api/singer'
  import {createSong, isValidMusic, processSongsUrl} from 'common/js/song'
  import {ERR_OK} from 'api/config'
  import MusicList from '../music-list/music-list'

  export default {
    name: "singer-detail",
    data() {
      return {
        songs: []
      }
    },
    methods: {
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSong(res.data.list)).then((songs) => {
              this.songs = songs
            })
          }
        })
      },
      _normalizeSong(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    created() {
      this._getDetail()
      console.log(this.singer)
    },
    computed: {
      titlt() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singerflag-enter-active, .singerflag-leave-active
    transition: all .3s

  .singerflag-enter, .singerflag-leave-to
    transform: translate3d(100%, 0, 0)
</style>
