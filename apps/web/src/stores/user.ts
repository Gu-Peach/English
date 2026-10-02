import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { WebResultUser, Token } from "@en/common/user";
export const useUserStore = defineStore(
  "user",
  () => {
    //用户信息
    const user = ref<WebResultUser | null>(null);
    //设置用户信息
    const setUser = (params: WebResultUser) => {
      user.value = params;
    };
    //导出accessToken
    const getAccessToken = computed(() => user.value?.token.accessToken);
    //导出refreshToken
    const getRefreshToken = computed(() => user.value?.token.refreshToken);
    //更新token
    const updateToken = (newToken: Token) => {
      user.value!.token = newToken;
    };
    //获取用户信息
    const getUser = computed(() => user.value);
    //退出登录
    const logout = () => {
      user.value = null;
    };
    return {
      user,
      setUser,
      getUser,
      logout,
      getAccessToken,
      getRefreshToken,
      updateToken,
    };
  },
  { persist: true },
); //持久化存储localStorage
