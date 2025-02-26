<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style>
#app {
}
</style>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import store from "@/store";

const route = useRoute();

/**
 * 全局初始化函数，有全局单次调用的代码，都可以写到这里
 */
const doInit = async () => {
  console.log(
    "Welcome to windOJ⛵, have fun! :)\n" +
      "                   |    |    |\n" +
      "                  )_)  )_)  )_)\n" +
      "                 )___))___))___)\n" +
      "                 )____)____)_____)\n" +
      "           _____|____|____|____|____\\\\__\n" +
      "   --------\\                           /---------\n" +
      "     ^^^^^ ^^^^^^^^^^^^^^^^^^^^^ ^^^^^ ^^^  ^^\n" +
      "       ^^^^      ^^^^     ^^^    ^^    ^^^\n" +
      "            ^^^^      ^^^      ^^^^"
  );
  // 检查cookie是否还有效
  await store.dispatch("user/checkCookieAndResetState");
};
onMounted(() => {
  doInit();
});
</script>
