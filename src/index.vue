<template>
  <div class="s-scrollbar">
    <div class="s-scrollbar_v_box" :style="{width:verticalStyle.width}" ref="vbox">
      <div
        class="s-scrollbar__thumb_vertical"
        :style="{height:sbh , top:scrollbarTop , opacity ,...verticalStyle}"
        ref="vertical"
      ></div>
    </div>
    <div class="s-scrollbar_h_box" :style="{height:verticalStyle.height}" ref="hbox">
      <div
        class="s-scrollbar__thumb_horizontal"
        :style="{width:sbw,left:scrollbarLeft , opacity ,...horizontalStyle}"
        ref="horizontal"
      ></div>
    </div>
    <div class="s-scrollbar__view" :style="{width:viewWidth,height:viewHeight}" ref="scrollbox">
      <div class="s-scrollbar__content" ref="contentbox">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { transformToPercent, transformToMorePx, ScrollEvent, bindMouse } from '../helper'
const events = new Map()
export default {
  name: 'SScrollbar',
  props: {
    verticalStyle: {
      type: Object,
      default: () => ({})
    },
    horizontalStyle: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["scroll"],
  data () {
    return {
      viewWidth: "100%",
      viewHeight: "100%",
      scrollbarHeight: '100%',
      scrollbarTop: "0%",
      scrollbarWidth: "100%",
      scrollbarLeft: "0%",
      opacity: 0,
    }
  },
  computed: {
    sbh () {
      const value = this.scrollbarHeight.slice(0, -1) - 0
      if (value >= 100) {
        return '0px'
      }
      return this.scrollbarHeight
    },
    sbw () {
      const value = this.scrollbarWidth.slice(0, -1) - 0
      if (value >= 100) {
        return '0px'
      }
      return this.scrollbarWidth
    }
  },
  methods: {
    // 初始化几何属性
    initGeometric () {
      const { offsetHeight, offsetWidth } = this.$el || {}
      this.viewWidth = transformToMorePx(offsetWidth)
      this.viewHeight = transformToMorePx(offsetHeight)
      const { scrollbox, contentbox } = this.$refs || {};
      this.scrollbarHeight = transformToPercent(scrollbox.offsetHeight, contentbox.offsetHeight)
      this.scrollbarWidth = transformToPercent(scrollbox.offsetWidth, contentbox.offsetWidth)
    },
    // 滚动的回调
    scrollFun () {
      const { scrollbox, contentbox } = this.$refs || {}
      this.$emit("scroll", 'vertical', 1, 'step')
      this.scrollbarTop = transformToPercent(scrollbox.scrollTop, contentbox.offsetHeight)
    },

    // 注册事件
    registerEvent () {
      const { scrollbox, horizontal, vertical, vbox, hbox } = this.$refs || {};
      const documentEvent = new ScrollEvent(document)
      const horizontalEvent = new ScrollEvent(horizontal)
      const scrollboxEvent = new ScrollEvent(scrollbox)
      const verticalEvent = new ScrollEvent(vertical)
      const vboxEvent = new ScrollEvent(vbox)
      const hboxEvent = new ScrollEvent(hbox)


      events.set('scrollbox', scrollboxEvent)
      events.set("horizontal", horizontalEvent)
      events.set("document", documentEvent)
      events.set("vertical", verticalEvent)
      events.set('vbox', vboxEvent)
      events.set('hbox', hboxEvent)


      return {
        documentEvent,
        horizontalEvent,
        scrollboxEvent,
        verticalEvent,
        vboxEvent,
        hboxEvent
      }
    },
    // 初始化事件
    initEvent () {
      const { scrollbox, contentbox, vbox, hbox } = this.$refs || {};
      // 注册事件
      const { documentEvent, scrollboxEvent, horizontalEvent, verticalEvent, vboxEvent, hboxEvent } = this.registerEvent()
      const _this = this;

      const opacity2light = () => this.opacity = 1;
      const opacity2dark = () => this.opacity = 0;
      // 绑定事件实现
      scrollboxEvent.listen('scroll', this.scrollFun)
      horizontalEvent.listen('mouseenter', () => {
        opacity2light();
        documentEvent.listen("mousewheel", (e) => {
          const delta = e.wheelDelta
          if (delta < 0) {  //向下滚动
            scrollbox.scrollLeft += 10;
            this.$emit("scroll", 'horizontal', 10, 'step')
          } else {//向上滚动
            scrollbox.scrollLeft -= 10;
            this.$emit("scroll", 'horizontal', -10, 'step')
          }
          _this.scrollbarLeft = transformToPercent(scrollbox.scrollLeft, contentbox.offsetWidth)
        })
      })

      horizontalEvent.listen('mouseleave', () => {
        documentEvent.remove("mousewheel")
        opacity2dark()
      })

      documentEvent.listen('mouseup', () => {
        documentEvent.remove("mousemove")
      })
      // 高亮
      bindMouse(verticalEvent, opacity2light, opacity2dark)
      bindMouse(scrollboxEvent, opacity2light, opacity2dark)
      bindMouse(hboxEvent, opacity2light, opacity2dark)
      bindMouse(vboxEvent, opacity2light, opacity2dark)

      // 触发这个定位的功能；

      hboxEvent.listen("click", (e) => {
        const value = e.layerX, height = hbox.offsetWidth;
        const rate = (value / height) - ((_this.sbw.slice(0, -1) - 0) / 100)
        if (rate < 0) {
          scrollbox.scrollLeft = 0;
          _this.scrollbarLeft = "0%"
          return
        }
        scrollbox.scrollLeft = (rate * contentbox.offsetWidth)
        _this.scrollbarLeft = (rate * 100) + '%'
      })

      vboxEvent.listen("click", (e) => {
        const value = e.layerY, height = vbox.offsetHeight;
        const rate = (value / height) - ((_this.sbh.slice(0, -1) - 0) / 100)
        if (rate < 0) {
          scrollbox.scrollTop = 0;
          _this.scrollbarTop = "0%"
          return
        }
        scrollbox.scrollTop = (rate * contentbox.offsetHeight)
        _this.scrollbarTop = (rate * 100) + '%'
      })
    },
    // 对外暴露的可供调用的api
    scrollTo (direction, px = 10, type = 'step') {
      this.$emit("scroll", direction, px, type)
      const { scrollbox } = this.$refs || {}
      if (direction === 'vertical') {
        if (type === 'step') {
          scrollbox.scrollTop += px;
        } else {
          scrollbox.scrollTop = px;
        }
      } else {
        if (type === 'step') {
          scrollbox.scrollLeft += px;
        } else {
          scrollbox.scrollLeft = px;
        }
      }
    },

  },
  mounted () {
    this.initGeometric()
    this.initEvent()
  },


  beforeDestroy () {
    events.forEach(event => {
      event.removeAll()
    })
  }
}
</script>


<style scoped>
.s-scrollbar {
  overflow: hidden;
  -ms-overflow-style: none;
  box-sizing: border-box;
  position: relative;
}
.s-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.s-scrollbar__thumb_vertical {
  position: absolute;
  display: block;
  width: 6px;
  height: 50px;
  cursor: pointer;
  border-radius: inherit;
  background-color: rgba(144, 147, 153, 0.3);
  transition: opacity 0.5s linear;
  border-radius: 3px;
  top: 0;
  right: 0;
}

.s-scrollbar__thumb_horizontal {
  position: absolute;
  height: 10px;
  width: 40px;
  background: rgba(144, 147, 153, 0.3);
  cursor: pointer;
  border-radius: inherit;
  transition: opacity 0.5s linear;
  border-radius: 3px;
  bottom: 0;
  left: 10px;
}

.s-scrollbar__view {
  overflow: auto;
  height: 100%;
}

.s-scrollbar__content {
  display: inline-block;
}

.s-scrollbar_v_box {
  height: 100%;
  position: absolute;
  right: 0;
  width: 6px;
  box-sizing: border-box;
  cursor: pointer;
}

.s-scrollbar_h_box {
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 10px;
  box-sizing: border-box;
  cursor: pointer;
}
</style>