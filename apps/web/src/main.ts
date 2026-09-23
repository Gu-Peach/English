import "@/assets/base.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import zhCn from "element-plus/es/locale/lang/zh-cn";

const app = createApp(App);
const pinia = createPinia();

// Pinia 插件挂在 pinia 上
pinia.use(piniaPluginPersistedstate);

// Vue 插件挂在 app 上
app.use(pinia);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(router);
app.use(router);

app.mount("#app");
