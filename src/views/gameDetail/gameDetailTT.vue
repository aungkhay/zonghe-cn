<template>
  <div class="w-[100vw] h-[100vh] bg-black" id="innerBox"></div>

</template>

<script setup lang="ts" name="GameDetailTT">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import Common from "@/utils/common/common";
import { useI18n } from "vue-i18n";
import { joinGame } from "@/api/game/index";
import { showLoadingModel, showTipModel } from "@/components/TipModel/index";
const route = useRoute();

// 获取地址栏参数
const { roomId } = route.query;
const { t } = useI18n();
const appendHtmlToInnerBox = (innerBox, htmlStr) => {
  const div = document.createElement("div");
  div.innerHTML = htmlStr;
  innerBox.append(div);
  const scriptTags = div.getElementsByTagName("script");
  for (let i = 0; i < scriptTags.length; i++) {
    const script = document.createElement("script");
    script.innerHTML = scriptTags[i].innerHTML;
    innerBox.appendChild(script);
  }
};

const loadHtmlPage = htmlStr => {
  const innerBox = document.getElementById("innerBox");

  // 如果 innerBox 已经存在，直接加载 HTML
  if (innerBox) {
    appendHtmlToInnerBox(innerBox, htmlStr);
  } else {
    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations, observer) => {
      const innerBox = document.getElementById("innerBox");
      if (innerBox) {
        appendHtmlToInnerBox(innerBox, htmlStr);
        observer.disconnect(); // 停止观察
      }
    });

    // 开始观察 document.body
    observer.observe(document.body, { childList: true, subtree: true });
  }
};

const isHttpConnection = (roomData: string) => {
  try {
    var parsedUrl = new URL(roomData);
    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
       location.href = roomData;
    } else {
      loadHtmlPage(roomData);
    }
  } catch (e) {
    loadHtmlPage(roomData);
  }
};

onMounted(async () => {
  let { code, data }: any = await joinGame(roomId);
  if( code == 200) {
    
    if (typeof data.data === 'string' && data.data.trim().startsWith('<!DOCTYPE html')) {
      console.log('HTML content detected.');
      loadHtmlPage(data.data);
      return;
    }

    const url = new URL(data.data);
    if (!url.search.includes("client_type=mobile")) {
      if (url.search) {
        url.search += "&client_type=mobile";
      } else {
        url.search = "?client_type=mobile";
      }
    }
    isHttpConnection(url.toString());
  } else {
    showTipModel({
      type: 1,
      title: t(code),
      icon: "fail"
    });
  }
});
</script>

<style lang="scss" scoped></style>
