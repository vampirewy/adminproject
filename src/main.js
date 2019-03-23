import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import './plugins/element.js';
import 'normalize.css';
import './less/global.css';

Vue.config.productionTip = false;

function getCookie(name) {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
};
let sessionId = getCookie(`sessionId`);
let cityCode = getCookie(`cityCode`);

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    localStorage.setItem(`sessionId`, sessionId);
    localStorage.setItem(`cityCode`, cityCode);
  }
}).$mount("#app");
router.afterEach(() => {
  window.scrollTo(0, 0);
});