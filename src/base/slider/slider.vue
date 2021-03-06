<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span v-for="(item,index) in dots" class="dot" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Bscroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    name: "slider",
    props: {
      // 循环轮播
      loop: {
        type: Boolean,
        default: true
      },
      // 自动轮播
      autoplay: {
        type: Boolean,
        default: true,
      },
      // 时间间隔
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    methods: {
      refresh() {
        if (this.slider) {
          this._setSliderWidth(true)
          this.slider.refresh()
        }
      },
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += sliderWidth * 2
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider() {
        this.slider = new Bscroll(this.$refs.slider, {
          scrollX: true, // 横向滚动
          scrollY: false, // 纵向滚动
          momentum: false, // 根据滑动的距离 生成滚动动画
          snap: {
            loop: this.loop, // 是否滚动
            threshold: 0.3,
            speed: 400
          } //循环轮播
        })
        this.slider.on('scrollEnd', () => {
          // 当前dots高亮
          let pageIndex = this.slider.getCurrentPage().pageX
          this.currentPageIndex = pageIndex
          if (this.autoplay) {
            this._paly()
          }
        })
        this.slider.on('touchend', () => {
          if (this.autoplay) {
            this._paly()
          }
        })
        this.slider.on('beforeScrollStart', () => {
          if (this.autoplay) {
            clearTimeout(this.timer)
          }
        })
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      //自动轮播
      _paly() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slider.next()
        }, this.interval)
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if (this.autoplay) {
          this._paly()
        }
      }, 20)
      window.addEventListener('resize', () => {
        if (!this.slider || !this.slider.enabled) {
          return
        }
        this.refresh()
      })
    },
    created() {
    },
    deactivated() {
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
