const _h = window.location.hash;
const _s = Symbol();
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import _v from 'vconsole'
import cookies from 'vue-cookies'
import API from './service/api'
import UTILS from './utils/utils.base'

// 配置远程调试
window[_s] = /vc=1/g.test(_h) ? new _v() : null
Vue.config.productionTip = false
// 接口注入
Vue.prototype.$api = API;
Vue.prototype.$utils = UTILS;
Vue.use(cookies);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')