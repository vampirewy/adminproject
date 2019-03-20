<template>
  <div id="app">
    <router-view/>
    <img class="test" src="./img/demo1.png" alt="">
  </div>
</template>

<script>
export default {
  name: "app"
  // components: {
  //   HelloWorld
  // }
};
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .test{
    display:none;
  }
}
</style>
