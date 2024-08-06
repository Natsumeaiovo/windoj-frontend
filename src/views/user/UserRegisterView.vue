<template>
  <div class="userLoginView">
    <h1>用户注册</h1>
    <a-form
      label-align="right"
      :model="form"
      @submit="handleSubmit"
      auto-label-width
      style="max-width: 480px; margin: 0 auto"
    >
      <a-form-item field="userAccount" tooltip="账号不少于4位" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号..." />
      </a-form-item>
      <a-form-item field="userName" tooltip="用户名不能为空" label="用户名">
        <a-input v-model="form.userName" placeholder="请输入用户名..." />
      </a-form-item>
      <a-form-item field="userPassword" tooltip="密码不少于8位" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码..."
        />
      </a-form-item>
      <a-form-item
        field="checkPassword"
        tooltip="再次输入密码"
        label="确认密码"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请再次输入密码..."
        />
      </a-form-item>
      <a-button type="primary" html-type="submit" class="submit-button">
        注册
      </a-button>
      <a-button type="outline" class="reg-button" @click="goToLogin">
        已有账号？前往登录
      </a-button>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userName: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

const router = useRouter();

/**
 * 提交表单
 * @param data
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userRegisterUsingPost(form);
  if (res.code === 0) {
    Message.success("注册成功！");
    // 注册成功，跳转到登录页
    await router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    Message.error("注册失败，" + res.message);
  }
};

/**
 * 跳转到登录页面
 */
const goToLogin = () => {
  router.push({
    path: "/user/login",
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
  width: 150px;
  margin: 20px auto;
}

.reg-button {
  width: 150px;
  margin: 0 auto;
}

.submit-button:hover {
  transform: scale(1.05);
}

.reg-button:hover {
  transform: scale(1.05);
}
</style>
