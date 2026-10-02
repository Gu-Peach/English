import { uploadUrl } from "@/apis"; //头像地址的前缀
import defaultAvatar from "@/assets/images/avatar/default-avatar.png"; //默认头像
import { useUserStore } from "@/stores/user"; //用户信息
import { computed } from "vue";
export const useAvatar = () => {
  const userStore = useUserStore(); //初始化pinia
  const resolveAvatar = (value?: string | null) => {
    if (!value) {
      return defaultAvatar;
    }
    if (/^(?:https?:|data:|blob:)/i.test(value)) {
      return value;
    }
    return `${uploadUrl}/${value.replace(/^\/+/, "")}`;
  };
  const avatar = computed(() => {
    return resolveAvatar(userStore.getUser?.avatar);
  });
  const customAvatar = (avatar?: string | null) => resolveAvatar(avatar);
  return {
    avatar,
    customAvatar,
  };
};
