const routerpath = {
    state: {
        routerName: [],
        routerPath: []
    },

    mutations: {
        SET_ROUTERNAME(state, value) {
            console.log(value.index)
            console.log(value.routername)
            //routername, index
            state.routerName[value.index] = value.routername
            //console.log(state.routerName)
        },

        REMOVE_ROUTERNAME: (state, index) => {
            state.routerName.splice(index, 1)
        }

    },

    actions: {
        insertRouterName({ commit }, value) {
            commit('SET_ROUTERNAME', value)
        },

        removeRouterName({ commit }, index) {
            commit('REMOVE_ROUTERNAME', index)
        }

    }
}

export default routerpath