import Vue from 'vue'
import Vuex from 'vuex'
import routerpath from './modules/routerpath'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({

  modules: {
    routerpath,
    user
  }
})
