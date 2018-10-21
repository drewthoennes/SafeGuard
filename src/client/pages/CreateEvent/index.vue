<template>
  <div class="home container-fluid">
    <div class="topbar-div">
      <Topbar/>
    </div>
    <div class="content m-5">
      <h1>Create a new event</h1>
      <div class="row d-flex justify-content-center">
        <div class="col-12 col-md-8">
          <div id="map" style="width: 100%; height: 100%; min-height: 400px" />
        </div>
        <div class="col-12 col-md-4">
          <form @submit.prevent="createEvent">
            <div class="form-group">
              <label for="nameField1">Event name</label>
              <input type="text" class="form-control" id="nameField1" v-model="nameField" placeholder="Event name">
            </div>
            <div class="form-group">
              <label for="descField1">Event description</label>
              <textarea type="text" col="5" class="form-control" id="descField1" v-model="descriptionField" placeholder="Event description"></textarea>
            </div>
            <div class="form-group">
              <label for="dateFromField1">From date</label>
              <date-picker v-model="dateFrom" id="dateFromField1"></date-picker>
            </div>
            <div class="form-group">
              <label for="dateToField1">To date</label>
              <date-picker v-model="dateTo" id="dateToField1"></date-picker>
            </div>
            <div class="form-group">
              <label for="radiusField1">Radius in meters</label>
              <input type="number" min="0" class="form-control" v-model="radius" id="radiusField1">
            </div>
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

// Import required dependencies
import "bootstrap/dist/css/bootstrap.css";

// Import this component
import datePicker from "vue-bootstrap-datetimepicker";

// Import date picker css
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

export default {
  name: "CreateEvent",
  components: {
    datePicker,
    Topbar,
    Bottombar
  },
  data() {
    let defaultLocation = [40.4245066, -86.91261109999999];
    let defaultRadius = 20;
    return {
      nameField: "",
      descriptionField: "",
      dateFrom: null,
      dateTo: null,
      radius: defaultRadius,
      location: defaultLocation,

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
      )
    };
  },
  methods: {
    createEvent() {
      axios
        .post("/api/event/create", {
          token: this.$store.state.token,
          name: this.nameField,
          description: this.descriptionField,
          location: this.location,
          fromDate: this.dateFrom,
          toDate: this.dateTo,
          radius: this.radius
        })
        .then(res => {
          console.log(res);
          this.$router.push({name: "ViewEvent", params: {id: res.data.id}});
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
    var map = new H.Map(
      document.getElementById("map"),
      defaultLayers.normal.map,
      {
        center: { lat: this.location[0], lng: this.location[1] },
        zoom: 17,
        pixelRatio: pixelRatio
      }
    );

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    var marker = new H.map.Marker({
      lat: this.location[0],
      lng: this.location[1]
    });
    // Ensure that the marker can receive drag events
    marker.draggable = true;
    map.addObject(marker);

    // disable the default draggability of the underlying map
    // when starting to drag a marker object:
    map.addEventListener(
      "dragstart",
      function(ev) {
        var target = ev.target;
        if (target instanceof H.map.Marker) {
          behavior.disable();
        }
      },
      false
    );

    // re-enable the default draggability of the underlying map
    // when dragging has completed
    map.addEventListener(
      "dragend",
      ev => {
        var target = ev.target;
        if (target instanceof mapsjs.map.Marker) {
          behavior.enable();
        }
        this.$set(this.location, 0, target.b.lat);
        this.$set(this.location, 1, target.b.lng);
      },
      false
    );

    // Listen to the drag event and move the position of the marker
    // as necessary
    map.addEventListener(
      "drag",
      function(ev) {
        var target = ev.target,
          pointer = ev.currentPointer;
        if (target instanceof mapsjs.map.Marker) {
          target.setPosition(
            map.screenToGeo(pointer.viewportX, pointer.viewportY)
          );
        }
      },
      false
    );

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
