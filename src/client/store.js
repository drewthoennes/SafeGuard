import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // logged: false,
    // token: ""
    logged: true,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVsbmFyZHUiLCJpZCI6IjViY2MyYTkyNWI4YzIyYjE2YmIzYzc5NyIsImlhdCI6MTU0MDEwNjg5OCwiZXhwIjoxNTQwMTkzMjk4fQ.-Wcp0VHcVFDTAHEBjkg_xPlmRd3TO4teYNsvKEa0h9E"
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
