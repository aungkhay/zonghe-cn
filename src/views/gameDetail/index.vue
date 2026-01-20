<template>
  <div class="game-detail-box" ref="gameDetailBoxRef">
    <!-- 博主特供信息 -->
    <!-- <van-floating-bubble
      v-if="showBlogInfo"
      v-model:offset="nameOffset"
      axis="xy"
      :gap="0"
      :teleport="gameDetailBoxRef"
      >{{ roomName }}</van-floating-bubble
    >
    <van-floating-bubble
      v-if="showBlogInfo && timeOffset"
      v-model:offset="timeOffset"
      axis="xy"
      :gap="0"
      :teleport="gameDetailBoxRef"
      >{{ nowTime }}</van-floating-bubble
    > -->

    <!-- 返回首页 -->
    <!-- <van-button
      v-scaleTap
      class="theme-button-default back-home"
      :class="{ 'back-b': mBLandscape }"
      @click="backHome"
      :disabled="leaveLock"
    >
      <img
        :class="{ b: mBLandscape }"
        :src="`${$imgBasePath}/public/icon_backhome.png`"
      />
    </van-button> -->

    <button
      ref="draggableBtn"
      v-scaleTap
      class="theme-button-default back-home"
      :class="{ 'back-b': mBLandscape }"
      @click="backHome"
      :disabled="leaveLock"
      @mousedown="startDrag"
      @touchstart="startDrag"
      :style="{ position: 'fixed', left: `${pos.x}px`, top: `${pos.y}px`, cursor: 'grab' }"
    >
      <img :class="{ b: mBLandscape }" :src="`${$imgBasePath}/public/icon_backhome.png`" />
    </button>

    <!-- 押注返利 -->
    <Brgames :mBLandscape="mBLandscape" v-if="isRebate == 'true'"/>
    <!-- 金猪返利 -->
    <bountyTop v-else :mBLandscape="mBLandscape"/>
    <!-- game iframe -->
    <div class="iframe-wrapper">
      <iframe 
        ref="iframeRef"
        style="width: 100%; height: 100%; border: none; display: block;" 
        :src="gameUrl" 
        @load="onIframeLoad"
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="GameDetail">
import Brgames from "./brgames.vue";
import bountyTop from './bountyTop.vue';
import { onMounted, onUnmounted, ref, computed, onBeforeUnmount, getCurrentInstance, reactive } from "vue";
import { useRoute } from "vue-router";
import Common from "@/utils/common/common";
import { useUserStoreHook } from "@/store/modules/user";
import router from "@/router";
import { userLeaveRoomApi } from "@/api/game";
import roomConfig from "@/config/roomConfig.json";
import { hideLoadingModel, showLoadingModel } from "@/components/TipModel";

const { proxy } = getCurrentInstance();
const $imgBasePath = proxy.$imgBasePath;

const route = useRoute();

const draggableBtn = ref(null)
const pos = reactive({ x: 10, y: 10 }) // initial position
const drag = reactive({
  active: false,
  offsetX: 0,
  offsetY: 0,
  moved: false, // 👈 detect movement
  startX: 0,
  startY: 0,
})

// 获取地址栏参数
const { roomId, roomName, platform, screen }: any = route.query;

// 游戏盒子ref
const gameDetailBoxRef = ref();

// 检测是否横屏游戏
const testBLandscape = () => {
  let isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  if (isMobile) {
    return screen == 2;
  }
};
// 是否横屏游戏
const mBLandscape = ref(testBLandscape() || false);

// 是否显示博主特供
const showBlogInfo = ref(false);
// 博主特供初始位置绑定
const nameOffset = ref({ x: 10, y: 3 });
const timeOffset = ref();
// 博主特供时间
const nowTime = ref(Common.formatTime(Date.now(), "HH:mm:ss"));
const nowTimer = ref(null);

// 是否返利还是金猪
const isRebate = computed(() => {
  let rebate = Common.getStorage('rebateStatus')
    return rebate || 'true'
});


// 返回首页请求锁
const leaveLock = ref(false);
// 返回首页
// 返回首页
const backHome = async () => {
  if (drag.moved) return;
  
  // 打开请求锁
  leaveLock.value = true;

  try {
    // 调用离开房间API
    const { code, data }: any = await userLeaveRoomApi();
    
    // 获取保存的路由地址
    const sourceRouteStr = localStorage.getItem('gameSourceRoute');
    
    if (sourceRouteStr) {
      const sourceRoute = JSON.parse(sourceRouteStr);
      
      // 清除iframe内容
      const iframeElement = document.querySelector('iframe');
      if (iframeElement) {
        iframeElement.src = 'about:blank';
      }
      
      // 使用保存的路由地址返回
      router.replace(sourceRoute.path + sourceRoute.fullPath.substring(sourceRoute.path.length));
    } else {
      // 如果没有保存的路由地址，返回首页
      router.replace('/');
    }
  } catch (error) {
    console.error('Error leaving room:', error);
    // 出错时返回首页
    router.replace('/');
  } finally {
    // 3秒后解锁，无论成功与否
    setTimeout(() => {
      leaveLock.value = false;
    }, 3000);
  }
};

// game路径
const gameUrl = ref('');
if (process.env.NODE_ENV === 'production') {
  gameUrl.value = `/h5/gameDetailTT?roomId=${roomId}`;
} else {
  gameUrl.value = `/h5/gameDetailTT?roomId=${roomId}`;
}

const iframeRef = ref(null);
function setViewportHeight() {
  const vh = window.innerHeight * 0.01
  console.log('setViewportHeight', vh);
  document.documentElement.style.setProperty('--vh', `${vh}px`)
  console.log('setViewportHeight end!', vh);
}

function startDrag(e: MouseEvent | TouchEvent) {
  drag.active = true
  drag.moved = false

  const clientX = e.type === 'touchstart' ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
  const clientY = e.type === 'touchstart' ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY

  drag.startX = clientX
  drag.startY = clientY
  drag.offsetX = clientX - pos.x
  drag.offsetY = clientY - pos.y

  e.preventDefault()

  window.addEventListener('mousemove', onDrag, { passive: false })
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag, { passive: false })
  window.addEventListener('touchend', stopDrag)
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!drag.active) return
  e.preventDefault()

  const clientX = e.type.includes('touch')
    ? (e as TouchEvent).touches[0].clientX
    : (e as MouseEvent).clientX
  const clientY = e.type.includes('touch')
    ? (e as TouchEvent).touches[0].clientY
    : (e as MouseEvent).clientY

  const dx = clientX - drag.startX
  const dy = clientY - drag.startY

  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) drag.moved = true

  const button = document.querySelector('.back-home') as HTMLElement
  if (!button) return

  const buttonWidth = button.offsetWidth
  const buttonHeight = button.offsetHeight

  pos.x = Math.max(0, Math.min(window.innerWidth - buttonWidth, clientX - drag.offsetX))
  pos.y = Math.max(0, Math.min(window.innerHeight - buttonHeight, clientY - drag.offsetY))
}

function stopDrag(e: MouseEvent | TouchEvent) {
  // 🧩 Only trigger click if the user didn’t really move
  if (!drag.moved) {
    const target = e.target as HTMLElement
    target.click() // manually trigger click
  }

  drag.active = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
}

onMounted(() => {

  showLoadingModel({
    message: '加载中...',
    loadType: 2
  })

  // Set viewport height immediately
  setViewportHeight();
  window.addEventListener('resize', setViewportHeight)

  // Prevent any scrolling
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  // 博主特供初始位置绑定
  timeOffset.value = { x: gameDetailBoxRef.value.clientWidth - 58, y: 3 };

  // 防止定时器重复
  nowTimer.value && clearInterval(nowTimer.value);

  // 判断是否是PG游戏且是博主账号
  if (platform == 1 && useUserStoreHook().isBozhu) {
    // 启动计时器
    nowTimer.value = setInterval(() => {
      nowTime.value = Common.formatTime(Date.now(), "HH:mm:ss");
    }, 1000);

    // 页面显示博主特供
    showBlogInfo.value = true;
  }
  setTimeout(() => {
    setViewportHeight()
    window.addEventListener('resize', setViewportHeight)
  }, 1000)
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', setViewportHeight)
  // Restore scrolling
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})

onUnmounted(() => {
  // 清除定时器
  nowTimer.value && clearInterval(nowTimer.value);
  // stopDrag();
});

const loadCont = ref(0);
const onIframeLoad = () => {
  console.log('onIframeLoad');

  // setTimeout(() => {
  //   window.scrollTo(0, 0);
  // }, 100);

   loadCont.value++;
   if(loadCont.value == 2) {
      setTimeout(() => {
        hideLoadingModel();
      }, 2000);
   }
  
}

</script>

<style lang="scss" scoped>
.iframe-wrapper {
  width: 100%;
  // height: calc(var(--vh, 1vh) * 100); /* 真实视口高度 */
  height: 100%;
  // overflow: auto;
  // -webkit-overflow-scrolling: touch;
  overflow: hidden;
  position: relative;
}
@import "./index.scss";
</style>
