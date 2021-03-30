import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
import qs from 'qs'
import moment from 'moment'

import  'echarts/theme/roma.js'


Vue.prototype.$qs = qs
Vue.prototype.$moment = moment
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app')
