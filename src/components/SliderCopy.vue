<template>
  <div class="slider-container" ref="realItem" :style="ends">
    <!-- 一定要加，为了不让用户点击slide以外的东西 -->
    <div class="slider">
      <div class="slider-wrap">
        123456
      </div>
    </div>
  </div>
</template>

<script>
import anime from "animejs";
import DragScroll from "../utils/dragScroll.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      bodyHeight: document.body.clientHeight,
      initHeight: 0,
      showGo2TopBtn: false,
      ends: {},
      dragScroll: null // 缓动对象
    };
  },
  computed: {},
  methods: {
    topOver(position) {
      // console.log("topOver", position);
      this.showGo2TopBtn = position < 0; // 当顶部距离浏览器顶部距离小于0的时候展示出到达顶部的快捷按钮
    },
    // 去最顶部
    goTop() {
      anime({
        targets: this.$refs.realItem,
        translateY: 0,
        easing: "easeInSine",
        duration: 200
      }).finished.then(() => {
        this.showGo2TopBtn = true;
      });
    },
    // 去最底部
    goDown() {
      anime({
        targets: this.$refs.realItem,
        translateY: this.bodyHeight - this.initHeight,
        easing: "easeInSine",
        duration: 200
      }).finished.then(() => {
        this.showGo2TopBtn = false;
      });
    },
    close() {
      anime({
        targets: this.$refs.realItem,
        translateY: [
          {
            value: document.body.clientHeight,
            duration: 0
          }
        ],
        easing: "easeInBack"
      }).finished.then(() => {});
    },
    showUp() {
      const initHeight = 200;
      this.initHeight = initHeight;
      this.$refs.realItem.initHeight = initHeight; // 控制最低点，赋值到initHeight，dragScroll所需
      return anime({
        targets: this.$refs.realItem,
        translateY: [
          { value: 650, duration: 0 }, // 将元素一开始就置于高处，形成动画过程
          { value: document.body.clientHeight - this.initHeight, duration: 250 } //duration 为持续时间
        ],
        easing: "easeOutBack"
      }).finished.then(() => {});
    }
  },
  created() {},
  mounted() {
    this.dragScroll = new DragScroll(this.$refs.realItem, {
      topOver: this.topOver,
      goTop: this.goTop,
      goDown: this.goDown
    });
    this.$nextTick(() => {
      this.showUp();
    });
  }
};
</script>
<style lang="less" scoped>
.slider-container {
  position: relative;
}
.slider {
  border-top-left-radius: 15px; /* no*/
  border-top-right-radius: 15px; /* no*/
  box-sizing: border-box;
  padding: 10px; /* no*/
  box-shadow: 0 0 0.8rem #ccc;
  background: #fff;
  height: 800px; // 实际根据元素撑开的
  width: 95%;
  margin: 0 auto;
  z-index: 2;
}
</style>
