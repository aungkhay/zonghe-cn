<template>
  <van-nav-bar
    fixed
    :border="false"
    z-index="999"
    title="title"
    v-if="!route.meta.hideNavBar || title"
    class="nav-bar-box"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template #left>
      <van-icon name="arrow-left" size="16" class="nav-bar-icon" />
    </template>
    <template #title>
      <div class="nav-bar-title">
        {{
          title ||
          (typeof route.meta.titleTextId == "string" &&
            $t(route.meta.titleTextId)) ||
          "-"
        }}
      </div>
    </template>
    <template #right>
      <van-icon
        v-if="!route.meta.subUrl"
        name="home-o"
        size="16"
        class="nav-bar-icon"
      />
      <div v-else class="nav-bar-sub">
        {{ $t("100009") }}
      </div>
    </template>
  </van-nav-bar>
  <div class="nav-bar-zw" v-if="!route.meta.hideNavBar || title"></div>
</template>

<script setup lang="ts">
import router from "@/router/index";
import { useRoute } from "vue-router";

const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  directHome: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();

const onClickLeft = () => {
  console.log("route.name",route.name)
  // 判断当前路由是否为 gameList
  if(props.directHome){
    router.push('/')
    return
  }
  if (route.name === 'GameList') {
    router.push('/')  // 或者使用具体的首页路径，如 '/home'
  } else if(route.name === 'withdraw2SetPassword') {
    router.go(-2);
  } else {
    history.back()
    // 或者使用 history.back() 如果你更倾向于这个方法
  }
}
const onClickRight = () => {
  if (!route.meta.subUrl) {
    router.push("/");
  } else {
    router.push(route.meta.subUrl);
  }
};
</script>

<style lang="scss" scoped>
.nav-bar-box {
  left: 50%;
  transform: translateX(-50%);
  max-width: $max-width;
  background-color: var(--nav-bar-background);
  background-size: 100% auto;
}

.nav-bar-icon {
  color: var(--primary-color);
}
.nav-bar-title {
  color: #000;
  font-size: 18px;
}
.nav-bar-zw {
  width: 100%;
  height: var(--van-nav-bar-height);
}

.nav-bar-sub {
  padding-top: 12px;
  color: $theme-text-color-dark;
  font-size: 14px;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 6px;
}
</style>
