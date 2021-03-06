<template>
  <scroll class="listview"
          @scroll="scroll"
          :probeType="probeType"
          :listenScroll="listenScroll"
          ref="listview">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items"
              @click="selectionItem(item)"
              class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="touchstartShortcutList"
         @touchmove.stop.prevent="tochmoveShortcutList">
      <ul>
        <li class="item"
            :class="{'current':currentIndex=== index}"
            v-for="(item, index) in shortcutList"
            :data-index="index">{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <h1 class="fixed-title">{{ fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from '../../common/js/dom'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30
  export default {
    name: "listview",
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        scrollY: -1,
        probeType: 3,
        currentIndex: 0,
        diffly: -1
      }
    },
    methods: {
      selectionItem(item) {
        this.$emit('selection', item)
      },
      touchstartShortcutList(e) {
        let appointIndex = getData(e.target, 'index')
        this.touch.y1 = e.touches[0].pageY
        this.touch.appointIndex = appointIndex
        this.$refs.listview.scrollToElement(this.$refs.listGroup[appointIndex], 0)
        this._scrollTo(appointIndex)
      },
      tochmoveShortcutList(e) {
        this.touch.y2 = e.touches[0].pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = Number(this.touch.appointIndex) + delta
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight() {
        let height = 0
        this.listHeight.push(height)
        let list = this.$refs.listGroup
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        let listHeight = this.listHeight
        // newY 大于0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // newY 在中间
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diffly = height2 + newY
            return
          }
          // -new 大于整个列表的高度时
          this.currentIndex = this.listHeight.length - 2
        }
      },
      diffly(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal-TITLE_HEIGHT : 0
        if (fixedTop === this.fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style['transform'] = `translate3d(0, ${fixedTop}px,0)`
        this.$refs.fixed.style['webkitTransform'] = `translate3d(0, ${fixedTop}px,0)`
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    created() {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
