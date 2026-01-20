<script setup lang="ts">
import tabbar from "@/components/Tabbar/index.vue";
import NavBar from "@/components/NavBar/index.vue";
import { useCachedViewStoreHook } from "@/store/modules/cachedView";
import { computed, onMounted } from "vue";
import { userInfoApi } from "@/api/user/index";
import { useUserStoreHook } from "@/store/modules/user";
import Common from "@/utils/common/common";

import router from "@/router";
import { useRoute } from "vue-router";

const route = useRoute();

const cachedViews = computed(() => {
  return useCachedViewStoreHook().cachedViewList;
});

const isNeed = computed(() => { 
  return router.currentRoute.value.path === "/home" || router.currentRoute.value.path === "/";
});

const isBlackAll = computed(() => {
  return router.currentRoute.value.path === "/gameDetail" || router.currentRoute.value.path === "/gameDetailTT";
});

onMounted(async () => {
  if (route.query.tg) {
    Common.setStorage('__user__token__', route.query.tg as string);
    // console.log("query: ******************************");
    useUserStoreHook().setToken();
    let { code, data }: any = await userInfoApi();
    console.log(data);
    if (code == 200) {
      const userInfo = data.data;
      if (userInfo) useUserStoreHook().changePlayerInfo(userInfo || {})

      Common.setStorage("telegram", null);
      Common.setStorage("lnUsername", userInfo.userName);
      useUserStoreHook().login(route.query.tg as string, userInfo);
      router.push("/");
    }
  }
});

</script>

<template>
  <div class="app-wrapper" :class="{ 'football-field': isNeed,'black-all': isBlackAll }">
    <van-config-provider>
      <nav-bar />
      <top-menu-bar />
      <router-view v-slot="{ Component }">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <tabbar />
    </van-config-provider>
  </div>
</template>

<style lang="scss" scoped>
    .football-field {
       width: 100%;
       height: 100%;
      //  background:#161a34;
       &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%; // 图片高度，可以根据实际图片调整
        // background-image: url('#{$img-base-path}/home/app_bg.png');
        background-repeat: repeat;
        background-size: 90px 90px;
        pointer-events: none;
        z-index: 0;
      }
    }

    .app-wrapper {
      transition: background-color 0.1s ease-in-out;
    }

    .black-all {
      background-color: #000;
      width: 100%;
      height: 100%;
      position: relative;
    }
</style>
