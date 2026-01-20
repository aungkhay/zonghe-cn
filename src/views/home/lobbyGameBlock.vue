<template>
  <!-- 列表 quente -->
  <div class="game-box">
    <!-- 游戏标题/全部游戏按钮 -->
    <div class="game-header">
      <!-- <div class="flex items-center"> 
    
        <svg-icon v-if="config[curGameTabKey] != undefined" :name="config[curGameTabKey].svg" class="theme-svg-color text-[30px]" />
        <img v-if="config[curGameTabKey] != undefined" :src="setImagePath(config[curGameTabKey])" class="w-[35px] h-[35px]" />
        <span v-if="config[curGameTabKey] != undefined"  class="text-[15px]">{{ t(config[curGameTabKey].key) }}</span>
      </div> -->
      <!-- <span v-if="curGameTabKey != 'Popular' && curGameTabKey != 'History' && curGameTabKey != 'Collect' " class="btn-all"
      @click="toGamePage('all', 'all', curGameTabKey, curGameTabName)"> {{ t('990002') }} ></span> -->

    </div>

    <!-- 游戏列表 -->
    <div v-if="curGameTabKey != 'Popular' && curGameTabKey != 'Slots'">
      <GameBox 
        v-for="(item, index) in paginatedGameList" :key="index" :item="item" :curGameTabKey="curGameTabKey"
        class="h-[120px] shadow-md rounded-lg mb-3"
      />
    </div>
    <div v-else class="game-list">
      <GameBox v-for="(item, index) in paginatedGameList" :key="index" :item="item" :curGameTabKey="curGameTabKey" />
    </div>

    <div class="game-list2">
      <SlotsGameBox v-for="(item, index) in slotsList" :key="index" :item="item" @toGamePage="toGamePage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameBox from "@/components/GameBox/index.vue";
import SlotsGameBox from "@/components/SlotsGameBox/index.vue";
import Common from "@/utils/common/common";

import { defineProps, defineEmits, computed, getCurrentInstance } from "vue";
import { useI18n } from 'vue-i18n';

const { proxy } = getCurrentInstance();

// 默认图片路径
const $imgBasePath = proxy.$imgBasePath;

const config = {
  'Popular': {
     "svg":'Popular',
     "key":'110012'
  },
  'Slots': {
     "svg":'Slot',
     "key":'110013'
  },
  'Live': {
     "svg":'Live',
     "key":'Live'
  },
  'Fish': {
     "svg":'Fish',
     "key":'Fish'
  },
  'Card': {
     "svg":'Card',
     "key":'Card'
  },
  'History': {
     "svg":'History',
     "key":'110017'
  },
  'Collect': {
     "svg":'Collect',
     "key":'110016'
  }
}

const props = defineProps({
  curGameTabKey: {
    type: String,
    default: ""
  },
  curGameTabName: {
    type: String,
    default: ""
  },
  gameList: {
    type: Array,
    default: () => []
  },
  slotsList: {
    type: Array,
    default: () => []
  },
  showPopularMore: {
    type: Boolean,
    default: false
  }
});
const { t } = useI18n();
const emit = defineEmits(["toGamePage"]);

// 页面游戏列表
const paginatedGameList = computed(() => {
  return props.showPopularMore ? props.gameList : props.gameList.slice(0, 12);
})



// 跳转游戏页面
const toGamePage = (
  gameType: string = "all",
  usTab: string = "all",
  gamePlayType: string = "all",
  title: string = "game"
) => {
  emit("toGamePage", gameType, usTab, gamePlayType, title);
};

const setImagePath = (imageName) => {
  return $imgBasePath + '/home/home-category/' + imageName.svg + '.png';
}

</script>

<style lang="scss" scoped>
@import "./lobbyGameBlock.scss";
</style>
