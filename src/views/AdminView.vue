<template>
  <div class="home">
    管理员可见
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue";
import { useRouter } from "vue-router";
import store from "@/store"; // @ is an alias to /src

console.log(store.state.user.loginUser);

export default defineComponent({
  name: "HomeView",
  components: {
    HelloWorld,
  },
});
</script>
