<template>
  <div v-if="!skeletonShow" v-scaleTap class="game-item" :class="{ 'game-item-2': props.type == 2 }">
    <div class="game-item-content"  >
      <van-image :src="gameItem.gameImg" fit="cover" class="game-item-img">
        <template v-slot:loading>
          <div class="game-loading"></div>
        </template>
      </van-image>

      <svg-icon @click="reGameStar()" class="text-[20px] cursor-pointer gameStar"
        :class="props.type == 2 ? 'hidden' : 'block'" :name="gameItem.isStar ? 'star-sel' : 'star'" />

      <div class="game-name-item" v-if="gameItem.showName == 1">
        <span>{{ common.getParamsLang() == 'zh' ? gameItem.zh : gameItem.en}}</span>
      </div>

      <van-button class="theme-button-default game-item-enter" @click="jumpGame(gameItem)" :disabled="enterLock">
        <!-- <svg-icon class="theme-svg-color text-[96px]" name="play" /> -->
      </van-button>
    </div>
    <!-- <div class="game-item-bottom">
      <span>{{ gameItem.en }}</span>
    </div> -->
  </div>
</template>

<script setup lang="ts" name="gamebox">
// import Common from "@/utils/common/common";
import { ref, onMounted, onActivated } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStoreHook } from "@/store/modules/user";
import { showTipModel } from "@/components/TipModel/index";
import { checkJoinGame } from "@/api/game/index";
import router from "@/router/index";
import common from "@/utils/common/common";

const { t } = useI18n();

const props = defineProps({
  item: {
    type: Object,
    default: ""
  },
  type: {
    type: Number,
    default: 1
  },
  loading: {
    type: Boolean,
    default: false
  }
});
const skeletonShow = ref(true)

const gameItem = ref(props.item);
// 游戏收藏
const reGameStar = () => {
  gameItem.value.isStar = !gameItem.value.isStar;
  common.setGameStar(gameItem.value);
};

// 跳转游戏请求锁
const enterLock = ref(false);
// 跳转游戏
const jumpGame = async gameItem => {
  if (!useUserStoreHook().isLogin) {
    useUserStoreHook().openLogin();
    return false;
  }

  let playerInfo = useUserStoreHook().playerInfo;

  // if (Number(playerInfo.amount) < 1) {
  //   showTipModel({
  //     type: 1,
  //     title: t("100037"),
  //     icon: "fail"
  //   });
  //   return false;
  // }

  // 打开请求锁
  enterLock.value = true;

  setTimeout(() => {
    // 关闭请求锁
    enterLock.value = false;
  }, 3000);

  const toGame = () => {
    // 保存当前路由地址到本地存储
    const currentRoute = router.currentRoute.value;
    const sourceRoute = {
      path: currentRoute.path,
      query: currentRoute.query,
      fullPath: currentRoute.fullPath
    };
    localStorage.setItem('gameSourceRoute', JSON.stringify(sourceRoute));
    
    // 跳转到游戏页面
    router.push(
      `/gameDetail?roomId=${gameItem.id || gameItem.gameId}&screen=${gameItem.screen || 1}`
    );
  };
  toGame();
  // let { code, data }: any = await checkJoinGame(gameItem.id);
  // if (code == 200) {
  // } else if (code == 100010) {
  //   showTipModel({
  //     type: 2,
  //     title: t("102050"),
  //     subTitle: t("100010"),
  //     cancelBtnText: t("106015"),
  //     success: function () {
  //       router.push(`/gameDetail?roomId=${playerInfo.gameId}`
  //       );
  //     },
  //   });
  // } else {
  //   showTipModel({
  //     type: 1,
  //     title: t(code),
  //     icon: "fail"
  //   });
  // }
};


onMounted(() => {
  if(gameItem.value.showName == 1){
    //  console.log(gameItem.value.showName,gameItem.value.pt,gameItem.value.en);
  }
  setTimeout(() => {
    skeletonShow.value = false
  }, 300);
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
