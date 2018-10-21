<template>
  <div class="home container-fluid">
    <div class="topbar-div">
      <Topbar/>
    </div>

    <div class="content">
      <h1>DashBoard</h1>
      <div class="row text-left">
        <div class="col-12 col-md-6">

        </div>
        <div class="col-12 col-md-6">
          <small>Current event: </small>
          <select class="custom-select" v-model="currentEvent">
            <option selected :value="null">None</option>
            <option v-for="event in events" :key="event._id" :value="event._id">{{event.name}}</option>
          </select>

          <button v-if="currentEvent" type="button" class="btn btn-success mt-3" @click="notifySoberDrivers">Notify Sober Drivers</button>

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
  name: "Home",
  components: {
    Topbar,
    Bottombar
  },
  data() {
    return {
      events: [],
      me: {},
      currentEvent: ""
    };
  },
  methods: {
    getEvents() {
      axios
        .post("/api/event/getAll", {
          token: this.$store.state.token
        })
        .then(res => {
          this.events = res.data;
          // this.loaded = true;
        })
        .catch(err => {
          this.$notify({
            group: "error",
            text: err.response.data.message
          });
        });
    },
    myData() {
      axios
        .post("/api/user/me", {
          token: this.$store.state.token
        })
        .then(res => {
          this.me = res.data;
          this.currentEvent = this.me.currentEvent;
        })
        .catch(err => {
          this.$notify({
            group: "error",
            text: err.response.data.message
          });
        });
    },
    notifySoberDrivers() {
      axios
        .post("/api/notifications/notifySober", {
          token: this.$store.state.token
        })
        .then(res => {
          
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
    this.getEvents();
    this.myData();
  },
  watch: {
    currentEvent() {
      axios
        .post("/api/user/setEvent", {
          token: this.$store.state.token,
          id: this.currentEvent !== null ? this.currentEvent : ""
        })
        .then(res => {
          this.myData();
        })
        .catch(err => {
          this.$notify({
            group: "error",
            text: err.response.data.message
          });
        });
    }
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
.content {
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 30px;
  margin-bottom: 30px;
}
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
