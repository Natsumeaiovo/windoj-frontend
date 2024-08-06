<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '30px', marginLeft: '0' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/oj-logo.svg" alt="logo" />
            <div class="title">风帆OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div class="user-info">
        <!-- 用户信息 -->
        <span class="user-name">{{ loginUser?.userName ?? "未登录" }}</span>
        <a-dropdown>
          <a-avatar
            class="avatar"
            trigger-type="mask"
            :size="52"
            :image-url="avatarUrl"
          >
            <template #trigger-icon>
              <IconEdit />
            </template>
          </a-avatar>
          <template #content>
            <!-- todo 完成编辑个人资料、设置的开发-->
            <a-doption>
              <icon-edit />
              编辑个人资料
            </a-doption>
            <a-doption>
              <icon-settings />
              设置
            </a-doption>
            <a-doption @click="handleAuthAction">
              <!-- 退出登录 或 用户登录 -->
              <component :is="authIcon" />
              {{ authText }}
            </a-doption>
          </template>
        </a-dropdown>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import { IconEdit, IconExport, IconUser } from "@arco-design/web-vue/es/icon";
import ACCESS_ENUM from "@/access/ACCESS_ENUM";

const router = useRouter();
const store = useStore(); // 拿到vuex的store
const loginUser = computed(() => store.state.user.loginUser); // 拿到登录用户信息，必须使用computed计算属性，不然不是响应式

// 展示在菜单的路由数组，同样要使用computed计算属性，用户信息变更时，触发菜单栏的重新渲染
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    // 1. 如果路由meta里定义了hideInMenu就隐藏
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 2. 根据权限过滤菜单
    if (!checkAccess(loginUser.value, item.meta?.access as string)) {
      return false; // 如果没有权限则不展示
    }
    return true; // 有权限，展示
  });
});

// 默认主页
const selectedKeys = ref(["/"]);
// 头像
const avatarUrl = loginUser.value.userAvatar
  ? loginUser.value.userAvatar
  : "https://pic.imgdb.cn/item/61f0e5ff2ab3f51d915f9023.png";

const isLoggedIn = loginUser.value.userRole !== ACCESS_ENUM.NOT_LOGIN;
const authIcon = computed(() => (isLoggedIn ? IconExport : IconUser));
const authText = computed(() => (isLoggedIn ? "退出登录" : "用户登录"));

// -------------------- 方法 --------------------------
// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

// 当菜单项被点击时，跳转到对应的路由
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

// 登录 或 退出登录
const handleAuthAction = () => {
  if (loginUser.value.userRole === ACCESS_ENUM.NOT_LOGIN) {
    login();
  } else {
    logout();
  }
};

// 退出登录
const logout = async () => {
  await store.dispatch("user/logout");
  router.push("/user/login");
};

// 前往登录页
const login = () => {
  router.push("/user/login");
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-left: 16px;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  color: transparent;
}

.logo {
  height: 48px;
}

.user-info {
  display: flex;
  align-items: center;
  white-space: nowrap; /* 确保用户名不换行 */
}

.user-name {
  font-size: 16px; /* 调整字体大小 */
  color: #333; /* 调整字体颜色 */
  margin-left: 20px;
  margin-right: 15px; /* 调整用户名和头像之间的间距 */
}

.avatar {
  margin-right: 50px;
}
</style>
