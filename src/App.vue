<template>
  <router-view />
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from "vue";

// pwa应用ref实例
const appPromptEvent = ref<Event | null>(null);

// 有pwa环境时处理
const handleBeforeInstallPrompt = (event: Event) => {
  // 阻止默认行为
  event.preventDefault();
  appPromptEvent.value = event;
};

// 处理pwa安装点击
const handleInstallClick = () => {
  return new Promise<boolean>((resolve, reject) => {
    if (appPromptEvent.value !== null) {
      const promptEvent = appPromptEvent.value as any;
      // 显示安装提示
      promptEvent.prompt();
      // 处理用户的选择
      promptEvent.userChoice
        .then((result: any) => {
          if (result.outcome === "accepted") {
            resolve(true);
          } else {
            resolve(false);
          }
          // 重置事件变量
          appPromptEvent.value = null;
        })
        .catch((error: any) => {
          // 处理错误
          reject(error);
        });
    } else {
      // 如果事件不存在，直接解析 false
      resolve(false);
    }
  });
};

// 使用 provide 提供变量和函数，子组件可以注入使用
provide("appPromptEvent", appPromptEvent);
provide("handleInstallClick", handleInstallClick);

// 在组件挂载时监听是否有pwa环境
onMounted(() => {
  const lang = localStorage.getItem("__user__lang__");
  const validLangs = ["zh", "en", "portugal"];
  // Set default to 'zh' if no language or invalid language
  if (!lang || lang === 'null' || lang === 'undefined' || !validLangs.includes(lang)) {
    localStorage.setItem("__user__lang__", "zh");
  }
  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
});
</script>

<style></style>
