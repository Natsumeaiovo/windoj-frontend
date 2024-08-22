<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <!-- Header -->
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <!-- Content -->
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <!-- Footer -->
      <a-layout-footer class="footer">
        <a
          href="https://natsumeaiovo.github.io"
          target="_blank"
          class="footer-link"
        >
          风帆OJ by serein
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout {
}

#basicLayout .header {
  margin-bottom: 16px;
  box-shadow: #eee 1px 1px 5px;
}

#basicLayout .content {
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 16px;
  padding: 20px;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

.footer-link {
  font-size: 14px;
  color: #6c757d;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.footer-link:hover {
  color: #343a40;
}
</style>

<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>
