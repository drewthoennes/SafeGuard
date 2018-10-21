<template>
  <div class="home container-fluid">
    <div class="topbar-div">
      <Topbar/>
    </div>
    <div class="content m-5">
      <div class="row d-flex justify-content-center">
        <div class="col-12 col-md-8">
          <div id="map" style="width: 100%; height: 100%; min-height: 500px" />
        </div>
        <div v-if="loaded" class="col-12 col-md-4" style="text-align: left;">
          <span>Name: </span>
          <h3>{{this.userData.fullname}}</h3>

          <span>Username: </span>
          <h3>{{this.userData.username}}</h3>

          <span>Phone number: </span>
          <h3>{{this.userData.phoneNumber}}</h3>

          <span>Last location update:</span>
          <h3>{{(new Date(this.userData.lastCoordinatesUpdate).toLocaleString())}}</h3>

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

// Import required dependencies
import "bootstrap/dist/css/bootstrap.css";

// Import this component
import datePicker from "vue-bootstrap-datetimepicker";

// Import date picker css
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

export default {
  name: "ViewUser",
  components: {
    Topbar,
    Bottombar
  },
  props: ["id"],
  data() {
    let defaultLocation = [40.4245066, -86.91261109999999];
    return {
      userData: {},
      location: defaultLocation,
      loaded: false,

      map: null,
      marker: null
    };
  },
  methods: {
    loadUser() {
      axios
        .post("/api/user/getById", {
          token: this.$store.state.token,
          id: this.id
        })
        .then(res => {
          console.log(res);
          this.userData = res.data;
          this.$set(this, "location", this.userData.location.coordinates);
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
    this.loadUser();

    //Step 1: initialize communication with the platform
    var platform = new H.service.Platform({
      app_id: "ABadVEiBwHASBHpdrLVl",
      app_code: "IE1TlNsBcjQ3-tBpwQLb-A",
      useHTTPS: true
    });
    var pixelRatio = window.devicePixelRatio || 1;
    var defaultLayers = platform.createDefaultLayers({
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi: pixelRatio === 1 ? undefined : 320
    });

    //Step 2: initialize a map - this map is centered over New Delhi
    this.map = new H.Map(
      document.getElementById("map"),
      defaultLayers.normal.map,
      {
        center: { lat: this.location[0], lng: this.location[1] },
        zoom: 17,
        pixelRatio: pixelRatio
      }
    );
    let map = this.map;

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    this.marker = new H.map.Marker({
      lat: this.location[0],
      lng: this.location[1]
    });
    let marker = this.marker;
    map.addObject(marker);
  },
  watch: {
    location() {
      this.map.setCenter({
        lat: this.location[0],
        lng: this.location[1]
      });
      this.marker.setPosition({
        lat: this.location[0],
        lng: this.location[1]
      });
    }
  }
};
</script>

<style scoped>
.topbar-div {
  height: 10%;
  min-height: 75px;
}
.bottombar-div {
  height: 25%;
  min-height: 187.5px;
}
.home {
  height: 100%;
  padding: 0;
  margin: 0;
}
form {
  text-align: left;
}
</style>
