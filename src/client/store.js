import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // logged: false,
    // token: ""
    logged: true,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVsbmFyZHUyIiwiaWQiOiI1YmNiOGE0Nzk1ZTliYjIwZjUwNDUwZjMiLCJpYXQiOjE1NDAwNjU4NjMsImV4cCI6MTU0MDE1MjI2M30.CHkrNrlqPL7cQdj2CJrdBX0eqKMUeoR1QwsmgJwzu4U"
  },
  mutations: {
    login(state, token) {
      state.logged = true
      state.token = token
    }
  },
  getters: {
    isAuthenticated: state => {
      return state.logged
    }
  }
})

export default store;
