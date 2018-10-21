<template>
  <div class="home container-fluid">
    <div class="topbar-div">
      <Topbar/>
    </div>

    <div class="content m-5">
      <h1>Notification Settings</h1>
      <p class="text-info">Users listed here will be notified if you leave the event</p>
      <div class="row d-flex justify-content-center">
        <div v-if="loaded" class="col-12 col-md-4 text-left">
          <EditGroupComponent :groupId="me.notificationGroups[0]"/>
        </div>
        <div v-if="!loaded" class="col-12 col-md-4">
          <h1>Loading...</h1>
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
import EditGroupComponent from "@/components/EditGroupComponent";

export default {
  name: "NotificationSettings",
  components: {
    Topbar,
    Bottombar,
    EditGroupComponent
  },
  data() {
    return {
      me: {},
      loaded: false
    };
  },
  methods: {
    myData() {
      axios
        .post("/api/user/me", {
          token: this.$store.state.token
        })
        .then(res => {
          this.me = res.data;
          this.loaded = true;
        })
        .catch(err => {
          this.$notify({
            group: "error",
            text: err.response.data.message
          });
        });
    }
  },
  mounted() {
    this.myData();
  }
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
form {
  text-align: left;
}
</style>
