<template>
  <div class="home container-fluid">
    <div class="topbar-div">
      <Topbar/>
    </div>

    <div class="content m-5">
      <h1>All Events</h1>
      <div class="row d-flex justify-content-center">
        <div v-if="loaded" class="col-12 col-md-4 text-left">
          <ul class="list-group">
            <router-link class="list-group-item list-group-item-action flex-column align-items-start" 
              v-for="event in events" :key="event._id" :to="{name: 'ViewEvent', params: {id: event._id}}">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{event.name}}</h5>
                <small>{{event.totalUsers}} going</small>
              </div>
              <p class="mb-1">{{event.description}}</p>
            </router-link>
          </ul>
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

export default {
  name: "Events",
  components: {
    Topbar,
    Bottombar
  },
  data() {
    return {
      events: [],
      loaded: false
    };
  },
  methods: {
    getEvents() {
      axios
        .post("/api/event/getAll", {
          token: this.$store.state.token
        })
        .then((res) => {
          this.events = res.data;
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
    this.getEvents();
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
