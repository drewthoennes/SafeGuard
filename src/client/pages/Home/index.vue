<template>
  <div class="home container-fluid">
    <div class="topbar-div">
      <Topbar/>
    </div>

    <div class="content">
      <h1>Backseat</h1>
    </div>
    <div class="bottombar-div">
      <Bottombar/>
    </div>
  </div>
</template>

<script>
  import Topbar from '@/components/Topbar'
  import Bottombar from '@/components/Bottombar'

  export default {
    name: 'Home',
    components: {
      Topbar,
      Bottombar
    },
    data () {
      return {
      }
    },
    methods: {
    },
    mounted() {
    }
  }
</script>

<style scoped>
  h1, h2 {
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
