import ACCESS_ENUM from "@/access/ACCESS_ENUM";
import router from "@/router";
import store from "@/store";
import checkAccess from "@/access/checkAccess";

// useStore 和 useRouter 需要在 Vue 组件的 setup 函数或生命周期钩子中调用，以确保它们能够正确访问 Vue 的依赖注入系统
// 在普通的ts文件中使用store和router需要直接导入并使用它们的实例来实现。import router from "@/router";
router.beforeEach(async (to, from, next) => {
  // 权限检查
  const loginUser = store.state.user.loginUser;
  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  // 要跳转的页面必需登录
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 如果没登录，跳转到登录页面
    if (!loginUser.userRole || loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
      // 要跳转页面需要登录，当前用户没登录
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // 如果已经登录了，但是权限不足，那么跳转到无权限页面
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
    }
  }
  next();
});
