<template>
  <transition name="fade">
    <div
      class="slider"
      @touchstart="touchstart($event)"
      @touchmove="touchmove($event)"
      @touchend="touchend($event)"
      :style="startFlag ? transto : ''"
    >
      <div class="slider-wrap">
        123456
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      touched: {
        startY: 0,
        endY: 0
      },
      startFlag: false
    };
  },
  computed: {
    transto() {
      return {
        top: this.px2rem
      };
    },
    px2rem() {
      return this.touched.endY / 37.5 + "rem";
    }
  },
  methods: {
    touchstart(e) {
      this.touched.startY = e.touches[0].clientY - e.currentTarget.offsetTop;
    },
    touchmove(e) {
      this.touched.endY = e.touches[0].clientY - this.touched.startY; // 移动的距离
      if (this.touched.endY / 37.5 > 12) {
        // 如果拖动过低，回归最低点
        this.touched.endY = 450;
      } else if (
        document.body.offsetHeight - e.currentTarget.offsetTop >
        e.currentTarget.offsetHeight
      ) {
        this.touched.endY =
          document.body.offsetHeight - e.currentTarget.offsetHeight;
      }
      // 开始移动的标识
      if (!this.startFlag) {
        this.startFlag = true;
      }
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.slider {
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;
  box-sizing: border-box;
  padding: 0.266667rem;
  box-shadow: 0 0 0.8rem #ccc;
  position: absolute;
  top: 12rem;
  transform: translateX(-50%); /*先left:50%再transform:50%*/
  left: 50%;
  background: #fff;
  width: 95%;
  height: 13.333333rem;
  z-index: 2;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter,
.fade-leave-to {
  top: 14.666667rem;
}
</style>
