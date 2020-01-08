<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/images/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld
  },
  created() {
    this.testAsync();

    this.$api.testApiPost({
      username:'ovenslove',
      password:'aaaa'
    }).then(data=>{
      console.log(data);
    })
  },
  methods: {
    async testAsync() {
      let result = await this.$api.testApi();
      console.log(result);
    }
  }
};
</script>
