import { createApp } from "vue";
import { store } from "./store";
import i18n from "@/lang/index/index";

// Google Login
import vue3GoogleLogin from 'vue3-google-login'

// import 'amfe-flexible'
// normalize.css
import "normalize.css/normalize.css";
// vant 桌面端点击适配
import "@vant/touch-emulator";
// 全局样式
import "./styles/index.scss";
// tailwindcss
import "./styles/tailwind.css";
// svg icon
import "virtual:svg-icons-register";
// 引入h5自适应插件
// import "@/utils/viewport.js";

// 引入初始化方法
import "@/utils/init/index.js";

import  Common  from "@/utils/common/common";
import App from "./App.vue";
import router from "./router";
import scaleTap from "@/utils/common/scaleTap";

// import "@/components/globalClickEffect/globalClickEffect";

const app = createApp(App);
app.use(i18n);
app.use(store);
app.use(router);

// 配置谷歌登录 Configure Google Sign-In
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '你的谷歌客户端ID'
})

// 全局指令 点击缩放 Global Commands Click to zoom
app.directive('scaleTap', scaleTap);

// 全局变量 Global variables
if(process.env.NODE_ENV === 'production') {
  app.config.globalProperties.$imgBasePath = Common.handleImagePath(`${import.meta.env.VITE_STATIC_PATH}/static/${import.meta.env.VITE_THEME}`);
} else {
  app.config.globalProperties.$imgBasePath = Common.handleImagePath(`/static/${import.meta.env.VITE_THEME}`);
}

// 声明全局变量
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $imgBasePath: string;
  }
}
// 阻止下拉刷新（允许正常滚动）
let startY: number;

window.openWin=function (url) {
  const win = window.open(url, '_blank');
  if (!win) {
    // 如果被拦截，则直接跳转 If intercepted, jump directly
    window.location.href = url;
  }
}

// document.body.addEventListener('touchstart', function (e) {
//   startY = e.touches[0].pageY;
// }, { passive: true });

// document.body.addEventListener('touchmove', function (e) {
//   const y = e.touches[0].pageY;
//   if (document.documentElement.scrollTop === 0 && y > startY) {
//     e.preventDefault();
//   }
// }, { passive: false });
app.mount("#app");
