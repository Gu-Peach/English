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

// `import { RouterView }` ：只是把 vue-router 包里的这个组件引入进来，让`<script setup>` 能在模板中使用它。严格说这行导入是 可选的 ——因为后面`app.use(router)` 时 vue-router 会把`RouterView` /`RouterLink` 注册成 全局组件 ，不导入也能写`<RouterView />` 。显式导入只是让来源更清晰。
// `<RouterView />` ：顶层路由出口。它做的事情是：从注入的 router 实例里读取"当前匹配的路由"，然后渲染匹配到的组件。它就是整个组件树的"第 1 层坑"。
app.use(router);

app.mount("#app");
