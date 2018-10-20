<template>
  <div class="home container-fluid">
    <div class="topbar-div">
      <Topbar/>
    </div>

    <div class="content m-5">
      <h1>Login</h1>
      <div class="row d-flex justify-content-center">
        <div class="col-12 col-md-4">
          <form @submit.prevent="login">
            <div class="form-group">
              <label for="usernameField1">Username</label>
              <input type="text" class="form-control" id="usernameField1" v-model="usernameField" placeholder="Enter username">
            </div>
            <div class="form-group">
              <label for="passwordField1">Password</label>
              <input type="password" class="form-control" id="passwordField1" v-model="passwordField" placeholder="Enter password">
            </div>
            <!-- <div v-if="error" class="text-danger">{{error}}</div> -->
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
    <div class="bottombar-div">
      <Bottombar/>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import Topbar from "@/components/Topbar";
import Bottombar from "@/components/Bottombar";

export default {
  name: "Login",
  components: {
    Topbar,
    Bottombar
  },
  data() {
    return {
      usernameField: "",
      passwordField: ""
    };
  },
  methods: {
    login() {
      axios.post("/api/login", {
        username: this.usernameField,
        password: this.passwordField
      }).then((res) => {
        console.log(res);
        this.$store.commit('login', res.data.token)
        this.$router.push('/')
      }).catch((err) => {
        this.$notify({
          group: "error",
          text: err.response.data.message
        })
      })
    }
  },
  mounted() {}
};
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}
.home {
  height: 100%;
  padding: 0;
  margin: 0;
}
.topbar-div {
  height: 10%;
  min-height: 75px;
}
/* .content {
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 30px;
  margin-bottom: 30px;
} */
.bottombar-div {
  height: 25%;
  min-height: 187.5px;
}
@media only screen and (max-width: 670px) {
  .search span {
    width: 0px;
    border: 0px;
  }
  .search input {
    width: calc(100% - 60px);
    border-radius: 4px 0px 0px 4px;
  }
}
</style>
