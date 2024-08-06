import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/ACCESS_ENUM";
import { User, UserControllerService } from "../../generated";

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      userName: "未登录",
      // 初始 loginUser 没有 userRole
    } as User,
  }),
  getters: {},
  actions: {
    /**
     * 获取用户登录信息
     * @param commit
     * @param state
     */
    async getLoginUser({ commit, state }) {
      // 从远程请求获取登录信息
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        // 用户已登录
        commit("updateUser", res.data);
        console.log("更新了用户信息，后端传来响应数据：", res.data);
      } else {
        // 用户未登录，那就给初始 loginUser 添加一个 userRole 为 未登录
        commit("updateUser", {
          ...state.loginUser, // 展开loginUser
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
      }
    },
    /**
     * 用户注销
     * @param commit
     */
    async logout({ commit }) {
      // 调用后端注销接口
      await UserControllerService.userLogoutUsingPost();
      // 清除用户状态
      commit("updateUser", {
        userName: "未登录",
        userRole: ACCESS_ENUM.NOT_LOGIN,
      });
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
