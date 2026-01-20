<template>
  <!-- 首页右下角图标按钮合集 -->
  <div class="bottom-btn-box">
    <template v-for="(item, index) in iconList" :key="index">
      <div class="enter-btn" :class="{ 'enter-btn-animation': true }" @click="onClickFloatItem(item)">
        <img :src="item.imgSmall" class="enter-btn-icon" />
      </div>
    </template>
    <template v-for="(item, boxKey) in popBoxShow" :key="boxKey">
      <div
        class="enter-btn"
        :class="{ 'enter-btn-animation': true }"
        @click="popupBoxShow(item.key)"
      >
        <img
          class="enter-btn-icon"
          v-show="item.icon"
          :src="`${$imgBasePath}/home_rb_icon/${item.icon}.png`"
        />
      </div>
    </template>
    <van-swipe class="swipe-box" :autoplay="2500" indicator-color="#fbcf0e" :show-indicators="false">
      <van-swipe-item v-for="(item, index) in swipeList" :key="index">
        <div
        class="enter-btn"
        :class="{ 'enter-btn-animation': true }"
        @click="popupBoxShow(item.key)"
      >
        <img
          class="enter-btn-icon"
          v-if="item.icon"
          :src="`${$imgBasePath}/home_rb_icon/${item.icon}.png`"
        />
      </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script setup lang="ts">
import { computed,ref,onMounted } from "vue";
import { useActPopupStoreHook } from "@/store/modules/actPopup";
import { getFloatingIconList } from "@/api/activityPopup";
import { SFloatingIconConfigVo } from "@/model/home";

import Common from "@/utils/common/common";
const popBoxShow = computed(() => {
  return useActPopupStoreHook().globalActivity;
});
const swipeList = computed(() => {
  return useActPopupStoreHook().swipeIcon;
});
const popupBoxShow = (boxKey: string) => {
  useActPopupStoreHook().popupBoxShow(boxKey);
};

const iconList = ref([] as SFloatingIconConfigVo[])
onMounted(async() => {
  var result = await getFloatingIconList();
  if(result.code == 200){
    iconList.value = result.data.data.filter(item => item.isOpen == 1);
  }
})

const onClickFloatItem = (item:SFloatingIconConfigVo)=>{
  if(item.jumpUrl && item.jumpUrl.length > 0){
    if(item.linkType == 0){
      Common.jumpUrl(item.jumpUrl)
    }else {
      window.openWin(item.jumpUrl)
    }
  }else{
     
  }
}


</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
