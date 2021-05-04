const user = {
    state: {
        userid: null,
        username: null,
    },

    mutations: {
        SET_USERID(state, userid) {
            state.userid = userid
        },

        SET_USERNAME(state, username) {
            state.username = username
            console.log('===')
            console.log(state.username)
        },

        REMOVE_USERNAME(state) {
            state.username = null
        }
    }
}

export default user