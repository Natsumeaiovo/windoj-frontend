<template>
  <div class="userLoginView">
    <h1>用户登录</h1>
    <a-form
      label-align="right"
      :model="form"
      @submit="handleSubmit"
      auto-label-width
      style="max-width: 480px; margin: 0 auto"
    >
      <a-form-item field="userAccount" tooltip="请输入账号" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号..." />
      </a-form-item>
      <a-form-item field="userPassword" tooltip="密码不少于8位" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码..."
        />
      </a-form-item>
      <a-button type="primary" html-type="submit" class="submit-button">
        登录
      </a-button>
      <a-button type="outline" class="reg-button" @click="goToRegister">
        前往注册
      </a-button>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

const router = useRouter();
const store = useStore();

/**
 * 提交表单
 * @param data
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    Message.success("登录成功！");
    await store.dispatch("user/getLoginUser");
    // 登录成功，跳转到主页
    router.push({
      path: "/",
      replace: true,
    });
    console.log("当前登录用户信息", store.state.user.loginUser);
  } else {
    Message.error("登录失败，" + res.message);
  }
};

/**
 * 跳转到注册页面
 */
const goToRegister = () => {
  router.push({
    path: "/user/register",
    replace: true,
  });
};
</script>

<style scoped>
h1 {
  font-size: 25px;
  margin-top: 30px;
  margin-bottom: 50px;
}

.submit-button {
  width: 120px;
  margin: 20px auto;
}

.reg-button {
  width: 120px;
  margin: 0 auto;
}

.submit-button:hover {
  transform: scale(1.05);
}

.reg-button:hover {
  transform: scale(1.05);
}
</style>
