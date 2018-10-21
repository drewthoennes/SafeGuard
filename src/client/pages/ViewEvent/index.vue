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
          <h3>{{this.eventData.name}}</h3>

          <span>Description: </span>
          <h3>{{this.eventData.description}}</h3>

          <div class="row">
            <div class="col">
              <span>Start time:</span>
              <h3>{{(new Date(this.eventData.fromDate).toLocaleString())}}</h3>
            </div>
            <div class="col">
              <span>End time:</span>
              <h3>{{(new Date(this.eventData.toDate).toLocaleString())}}</h3>
            </div>
          </div>

          <span>Oraganized by: </span>
          <router-link :to="{name: 'ViewUser', params: {id: user._id}}" v-for="user in eventData.adminGroup.users" :key="user._id" style="display: block;">{{user.fullname}}</router-link>

          <div v-if="eventData.admin" class="mt-3">
            <router-link :to="{name: 'EditGroup', params: {id: eventData.adminGroup._id}}" class="btn btn-primary">Edit organizators</router-link>
            <router-link :to="{name: 'EditGroup', params: {id: eventData.userGroup._id}}" class="btn btn-primary">Edit users</router-link>
            <router-link :to="{name: 'EditGroup', params: {id: eventData.soberGroup._id}}" class="btn btn-primary">Edit sober drivers</router-link>
          </div>
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
  name: "ViewEvent",
  components: {
    datePicker,
    Topbar,
    Bottombar
  },
  props: ["id"],
  data() {
    let defaultLocation = [40.4245066, -86.91261109999999];
    let defaultRadius = 5;
    return {
      eventData: {},
      radius: defaultRadius,
      location: defaultLocation,
      loaded: false,

      mapCircleObj: new H.map.Circle(
        // The central point of the circle
        { lat: defaultLocation[0], lng: defaultLocation[1] },
        // The radius of the circle in meters
        defaultRadius,
        {
          style: {
            strokeColor: "rgba(52, 152, 219, 0.8)", // Color of the perimeter
            lineWidth: 2,
            fillColor: "rgba(52, 152, 219, 0.6)" // Color of the circle
          }
        }
      ),
      map: null,
      marker: null
    };
  },
  methods: {
    loadEvent() {
      axios
        .post("/api/event/getById", {
          token: this.$store.state.token,
          id: this.id
        })
        .then(res => {
          console.log(res);
          this.eventData = res.data;
          this.$set(this, "location", this.eventData.location.coordinates);
          this.radius = this.eventData.radius;
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
    this.loadEvent()

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

    map.addObject(this.mapCircleObj);
  },
  watch: {
    radius() {
      this.mapCircleObj.setRadius(this.radius);
    },
    location() {
      this.mapCircleObj.setCenter({
        lat: this.location[0],
        lng: this.location[1]
      });
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
