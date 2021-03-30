import Vue from 'vue'
import Vuex from 'vuex'
import routerpath from './modules/routerpath'

Vue.use(Vuex)

export default new Vuex.Store({

  modules: {
    routerpath
  }
})
