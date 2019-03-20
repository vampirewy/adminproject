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
let startTime = new Date();
let arr = [`1`, `2`, `3`, `4`, `5`];

function showspeed() {
  let filesize = 35.4;
  let endTime = new Date();
  let speed = Math.round(filesize * 1000) / (endTime - startTime);
  let scope = (speed > 0 && speed <= 50) ? 0 : (speed > 50 && speed <= 100) ? 1 : (speed >= 100 && speed < 200) ? 2 : (speed >= 200 && speed < 300) ? 3 : 4;
  localStorage.setItem(`speed`, arr[scope]);
};
window.onload = function () {
  showspeed();
}