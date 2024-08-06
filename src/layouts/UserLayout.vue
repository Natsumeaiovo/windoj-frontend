<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <!-- Header -->
      <a-layout-header class="header">
        <a-space>
          <img src="@/assets/oj-logo.svg" alt="oj-logo" class="logo" />
          <div class="title">风帆OJ</div>
        </a-space>
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
#userLayout {
  text-align: center;
  background: url("https://kusanagi.oss-cn-beijing.aliyuncs.com/oj/FfdJeJRQWjEeGTpqgBKj.png")
    0% 0% / 100% 100%;
}

#userLayout .logo {
  width: 50px;
}

#userLayout .title {
  font-size: 32px;
  font-weight: bold;
  margin-left: 8px;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  color: transparent;
}

#userLayout .header {
  margin-top: 16px;
}

#userLayout .content {
  margin-bottom: 16px;
  padding: 20px;
}

#userLayout .footer {
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
  background-color: #f8f9fa;
  color: #343a40;
}
</style>

<script setup lang="ts"></script>
