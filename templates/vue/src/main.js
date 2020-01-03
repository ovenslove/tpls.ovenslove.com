const _h = window.location.hash;
const _s = Symbol();
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import _v from 'vconsole'
window[_s] = /vc=1/g.test(_h) ? new _v() : null
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')