import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "@/style/reset.css";
import store from "./store";
import "amfe-flexible";
import {
  /* eslint-disable no-unused-vars */
  Button
} from "cube-ui";
Vue.use(Button);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
