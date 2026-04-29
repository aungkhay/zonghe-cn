<template>
    <div class="nav-top">
        <div class="flex items-center">
            <svg-icon @click="changeLeftMenu" name="sidebar" class="text-[var(--primary-color)] text-[20px] sidebar-icon" :class="{'rotate-180': isRotated}" />
            <!-- <svg-icon name="logo" class="theme-svg-color text-[100px] ml-[5px]" /> -->
             <img :src="$imgBasePath + '/home/new_logo.png'" class="h-[25px] ml-2" />
        </div>

        <!-- 已登录 -->
        <div v-if="isLogin" class="flex items-center h-[100%]">
            <!-- 用户信息 -->
            <div class="user-info-box mr-[7px]">
                <svg-icon name="cny" class="text-[18px] text-[#e60012]" />
                <span class="gold-font mr-[4px] ml-[4px]">{{ Number(playerInfo.amount).toFixed(2) }}</span>
                <svg-icon class="text-[var(--primary-color)] text-[16px]" name="refresh" :class="{ rotate: refreshing }"
                    @click="refreshBlance()"/>
            </div>
            <!-- 跳转充值 -->
            <!-- <div>
                <div v-scaleTap class="charge-btn">
                    <div  @click="emit('enterDeposit')" class="ml-[10px]" >
                        <span >{{ $t("110002") }}</span>
                    </div>
                    <div class="line-color h-[12px] w-[1px] ml-[10px]"></div>
                    <div class="flex items-center justify-center px-[8px]" @click="showMenu = !showMenu">
                        <svg-icon name="arrow-down" class="theme-svg-color-light text-[10px]" :class="{ 'rotate-180': showMenu }" />
                    </div>
                </div>
                <div  class="dropdown-menu" v-if="showMenu" ref="dropdownRef">
                    <button v-scaleTap class="dropdown-item" @click="onSelect">{{ $t("110003") }}</button>
                </div>
            </div> -->
        </div>

        <!-- 未登录 -->
        <div  v-else class="login-box">
            <div v-scaleTap class="enter-btn-login" @click="enterLoginBtn('login')">
                {{ $t("110000") }}
            </div>
            <div v-if="useUserStoreHook().isDLApp == false" v-scaleTap class="enter-btn-register" @click="enterLoginBtn('register')">
                {{ $t("110001") }}
            </div>
        </div>
    </div>
</template>
<script setup lang="ts" name="topNavBar">
import router from "@/router/index";
import {
    onActivated,
    onMounted,
    ref,
    getCurrentInstance,
    computed,
    defineEmits,
    defineExpose,
    onUnmounted
} from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { userInfoApi } from "@/api/user/index";
import Common from "@/utils/common/common";
const showMenu = ref(false);
const dropdownRef = ref(null);


const handleClickOutside = (event: MouseEvent) => {
  if (event.type !== 'mousedown') return;
  if(!showMenu.value) return;
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    setTimeout(() => {
      showMenu.value = false;
    }, 300);
  }
};


const actions = [
  { name: '提现' }
];
function onSelect() {
  showMenu.value = false;
  // 这里可以跳转到提现页面或执行提现逻辑
  // 例如：router.push('/withdraw');
  router.push('/withdraw2');
}

const emit = defineEmits(["enterLoginBtn", "emitChangeLeft","enterDeposit"]);
const props = defineProps({
  isRotated: {
    type: Boolean,
    default: false
  }
});

// 用户信息
const playerInfo = computed(() => {
    return useUserStoreHook().playerInfo;
});

const isLogin = computed(() => {
    return useUserStoreHook().isLogin;
});

const enterLoginBtn = (type: string) => {
    emit("enterLoginBtn", type)
}

const goService = () => {
    Common.nologinService()
}

const changeLeftMenu = () => {
    emit("emitChangeLeft")
}

// 刷新资金状态
const refreshing = ref(false);
// 刷新资金
const refreshBlance = async () => {
    if (useUserStoreHook().isLogin !== true) {
        return false;
    }
    if (refreshing.value == true) {
        return false;
    }

    refreshing.value = true;
    let { code, data }: any = await userInfoApi();
    if (code == 200) {
        if (data.data) useUserStoreHook().changePlayerInfo(data.data || {})
    }

    setTimeout(function () {
        refreshing.value = false;
    }, 3000);
};
onActivated(async () => {
    // await refreshBlance();
})

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
})
onUnmounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
})


defineExpose({ refreshBlance });
</script>
<style lang="scss" scoped>
@import "./index.scss";




</style>
