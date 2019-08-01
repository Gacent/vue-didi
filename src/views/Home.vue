<template>
  <div class="home">
    <div class="main">
      <!-- 这里放地图等东西 -->
      <cube-button @click="open">open</cube-button>
      <cube-button @click="close">close</cube-button>
    </div>
    <!-- 这里是底部上下滑动菜单栏 -->
    <SliderCopy ref="slide" />
  </div>
</template>

<script>
// @ is an alias to /src
import SliderCopy from "@/components/SliderCopy";
export default {
  name: "home",
  components: {
    SliderCopy
  },
  methods: {
    open() {
      this.$refs.slide.showUp();
    },
    close() {
      this.$refs.slide.close();
    }
  }
};
</script>
<style lang="less" scoped>
.main {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  z-index: 0;
  max-width: 640px;
  min-width: 320px;
  margin: 0 auto;
}
.home {
  position: fixed;
  top: 0;
  width: 100%;
  left: 0;
  overflow: hidden;
  height: 100%;
}
</style>
