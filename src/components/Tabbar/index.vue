<template>
  <transition name="tabbar-fade">
    <div class="u-tabbar" v-if="!route.meta.hideTabBar">
      <div class="container">
        <div class="slider-bg" :style="{
          transform: `translateX(${tabbarProps.acitveIndex * itemWidth + (itemWidth - 70) / 2}px)`
        }"></div> 
        <div 
          v-scaleTap 
          class="u-tabbar-item" 
          :class="{'u-tabbar-item-center': index === -1}" 
          v-for="(item, index) in tabbarProps.tabbarData" 
          :key="index" 
          @click="changeTab(index)"
        >
          <!-- <img 
            :class="index === 2 ? 'u-tabbar-item-icon-center' : 'u-tabbar-item-icon'"
            :src="$imgBasePath + (index === tabbarProps.acitveIndex ? item.selectedIconPath : item.iconPath)"
          /> -->
          <!-- <svg-icon 
            :name="item.iconPath" 
            class="text-[26px] u-tabbar-item-icon"
            :class="{'active': index === tabbarProps.acitveIndex}" 
          /> -->
          <div class="flex justify-center">
            <img :src="$imgBasePath + (index === tabbarProps.acitveIndex ? item.selectedIconPath : item.iconPath)" class="h-9">
          </div>
          <div 
            class="u-tabbar-item-text" 
            :class="{'u-tabbar-item-text-active': index === tabbarProps.acitveIndex}"
          >
            {{ $t(item.text) }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance, nextTick } from "vue";
import router from "@/router/index";
import { useUserStoreHook } from "@/store/modules/user";
import { useRoute } from "vue-router";
import { useActPopupStoreHook } from "@/store/modules/actPopup";

const route = useRoute();
const { proxy } = getCurrentInstance();
const $imgBasePath = proxy.$imgBasePath;

// 定义变量
let tabbarProps = ref({
  isfree: false,
  acitveIndex: computed(() => {
    switch (route.name) {
      case "Home":
        return 0;
      case "Promo":
        return 1;
      // case "Promo":
      //   return 1;
      case "Service":
        return 2;
      case "Deposit":
        return 3;
      // case "vipPlus":
      //   return 3;
      case "Profile":
        return 3;
      default:
        return 0; // 默认返回首页
    }
  }),
  tabbarData: [
    { 
      iconPath: "/home/tabbar/home.png",
      selectedIconPath: "/home/tabbar/home-active.png",
      // iconPath: "Home",
      text: "110004",
      RedDot: 0
    },
    {
      iconPath: "/home/tabbar/promo.png",
      selectedIconPath: "/home/tabbar/promo-active.png",
      // iconPath: "Events",
      text: "110005",
      RedDot: computed(() => {
        return useActPopupStoreHook().globalRedDot.tabbarPromo;
      })
    },
    {
      iconPath: "/home/tabbar/service.png",
      selectedIconPath: "/home/tabbar/service-active.png",
      // iconPath: "extend",
      text: "customer_service",
      RedDot: 0
    },
    {
      iconPath: "/home/tabbar/me.png",
      selectedIconPath: "/home/tabbar/me-active.png",
      // iconPath: "Eu",
      text: "110008",
      RedDot: 0
    }
  ]
});

// 切换页面
const changeTab = (tabIndex: number) => {
  if (useUserStoreHook().isLogin == false && tabIndex > 2) {
    useUserStoreHook().openLogin();
    return false;
  }
  switch (tabIndex) {
    case 0:
      router.push("/");
      break;
    case 1:
      router.push("/promo");
      break;
    case 2:
      router.push("/service");
      break;
    // case 3:
    //   router.push("/vipPlus");
    //   break;
    case 3:
      router.push("/profile");
      break;
  }
};

function isMobile() {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Common mobile device keywords
  return /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(ua);
}
const itemWidth = ref(0);
onMounted(() => {
  if(isMobile()) {
    itemWidth.value = window.innerWidth / tabbarProps.value.tabbarData.length
  } else {
    itemWidth.value = 499 / tabbarProps.value.tabbarData.length
  }
})
</script>
<style lang="scss" scoped>
.tabbar-fade-enter-active, .tabbar-fade-leave-active {
  transition: opacity 0.3s;
}
.tabbar-fade-enter-from, .tabbar-fade-leave-to {
  opacity: 0;
}
.tabbar-fade-enter-to, .tabbar-fade-leave-from {
  opacity: 1;
}

.u-tabbar {
  background: var(--app-background);
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
  max-width: $max-width; 
  width: 100%;
  height: 62px;
  position: fixed;
  z-index: 99;
  bottom: 0;
  display: flex;
  align-items: flex-end;


  .container{
    position: relative;
    height: 62px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
  }
  

  .u-tabbar-item {
    height: 100%;
    flex: 1;
    text-align: center;
    position: relative;

    &.u-tabbar-item-center {
      flex: 1.5;
    }

    .u-tabbar-item-icon {
      // height: 26px;
      // width: 26px;
      margin: 10px auto 0;
      color: #5a5a5a;
      
      &.active {
        color: var(--primary-color);
      }
    }

    .u-tabbar-item-icon-center {
      height: 56px;
      width: 56px;
      margin-top: -15px;
      position: relative;
      margin-left: auto;
      margin-right: auto;
    }
    

    .u-tabbar-item-text,
    .u-tabbar-item-text-active  {
      font-weight: 500;
      font-size: 12px;
      bottom: 0;
      padding-bottom: 5px;
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
      color: #5a5a5a;
    }
    .u-tabbar-item-text-active {
      font-weight: bold;
      color: var(--primary-color);
    }
  }
  .slider-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 70px;
    height: 58px;
    background: url('#{$img-base-path}/home/tabbar-bg.png') center/cover;
    transition: transform 0.4s ease;
    z-index: 0;
  }
}
</style>
