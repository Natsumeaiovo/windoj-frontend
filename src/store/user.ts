import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/ACCESS_ENUM";
import { User, UserControllerService } from "../../generated";
import axios from "axios";

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
     * 获取用户登录信息并更新到state中
     * @param commit
     * @param state
     */
    async getLoginUser({ commit, state }) {
      // 从远程请求获取登录信息,如果后端登录了，那么就自动更新state
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        // 用户已登录
        commit("updateUser", res.data);
        console.log("更新了用户信息，后端传来响应数据：", res.data);
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
    /**
     * 检查cookie是否有效，如果无效则重置用户state
     * @param dispatch
     */
    async checkCookieAndResetState({ dispatch }) {
      try {
        // 使用需要认证的接口来检查cookie是否有效
        const response = await UserControllerService.getLoginUserUsingGet();
        // 如果返回了40100错误，那么就说明cookie无效
        if (response.code === 40100) {
          console.log("cookie已失效！已重置state");
          dispatch("resetState");
        } else {
          console.log("cookie没过期");
        }
      } catch (error) {
        console.error("cookie检查异常，检查后端是否打开", error);
        dispatch("resetState");
      }
    },
    /**
     * 重置 state
     * @param commit
     */
    resetState({ commit }) {
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
