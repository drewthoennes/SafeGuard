<template>
  <div class="w-100">
    <div v-if="loaded">
      <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="user in group.users" :key="user._id">
          {{user.fullname}}
          <button type="button" class="btn btn-danger" @click="removeUser(user._id)"><i class="fa fa-times"></i></button>
        </li>
      </ul>

      <h3 class="mt-4">Add another user</h3>
      <input type="text" class="form-control" v-model="search" placeholder="Search...">
      <div class="list-group mt-3">
        <button type="button" class="list-group-item list-group-item-action" v-for="user in searchResults" :key="user._id" @click="addUser(user._id)">
          {{user.fullname}}
        </button>
      </div>
    </div>
    <div v-if="!loaded">
      <h1>Loading...</h1>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import Topbar from "@/components/Topbar";
import Bottombar from "@/components/Bottombar";

export default {
  name: "EditGroupComponent",
  props: ["groupId"],
  components: {
    Topbar,
    Bottombar
  },
  data() {
    return {
      group: {},
      allUsers: [],
      loaded: false,

      search: ""
    };
  },
  methods: {
    getGroupUsers() {
      axios
        .post("/api/group/getById", {
          token: this.$store.state.token,
          id: this.groupId
        })
        .then(res => {
          console.log(res);
          this.group = res.data;
          this.loaded = true;
        })
        .catch(err => {
          this.$notify({
            group: "error",
            text: err.response.data.message
          });
        });
    },
    getAllUsers() {
      axios
        .post("/api/user/getAll", {
          token: this.$store.state.token
        })
        .then(res => {
          console.log(res);
          this.allUsers = res.data;
        })
        .catch(err => {
          this.$notify({
            group: "error",
            text: err.response.data.message
          });
        });
    },
    addUser(userId) {
      this.search = "";
      axios
        .post("/api/group/addUser", {
          token: this.$store.state.token,
          groupId: this.groupId,
          userId: userId
        })
        .then(res => {
          console.log(res);
          this.getGroupUsers();
        })
        .catch(err => {
          this.$notify({
            group: "error",
            text: err.response.data.message
          });
        });
    },
    removeUser(userId) {
      axios
        .post("/api/group/removeUser", {
          token: this.$store.state.token,
          groupId: this.groupId,
          userId: userId
        })
        .then(res => {
          console.log(res);
          this.getGroupUsers();
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
    this.getGroupUsers();
    this.getAllUsers();
  },
  computed: {
    searchResults() {
      let search = this.search.trim();
      // if (search === "") return [];

      let results = this.allUsers.filter((user) => {
        for (var userInGroup of this.group.users) {
          if (user._id === userInGroup._id) return false;
        }

        if (user.fullname.toLowerCase().includes(search)) return true;

        return false;
      });

      return results;
    }
  }
};
</script>

<style scoped>
</style>
