<template>
  <div v-if="rebate" class="brgames-box" :class="{ b: mBLandscape }">
    <div class="brgames-top">
      <span class="gold">{{ $t("107043", [(Gold).toFixed(3)]) }}</span>

      <van-button @click="getReward()" class="theme-button-default submit theme-btn-submit">
        {{ $t("104002") }}
      </van-button>
    </div>

    <div class="brgames-bottom">
      {{ $t("106019", [rebate.rebatePercent * 100]) }}
    </div>
  </div>

  <!-- 奖励弹窗 -->
  <RewardBox ref="rewardBox" @confirm="confirmReward" :mBLandscape="mBLandscape"></RewardBox>
</template>

<script setup lang="ts">
import ws from "@/utils/http/ws";
import { playRebateDrawApi, playRebateInfoApi, playRebateConfigApi } from "@/api/game";
import { onMounted, onUnmounted, ref } from "vue";
import { showTipModel } from "@/components/TipModel";
import { useI18n } from "vue-i18n";
import Common from "@/utils/common/common";
// 多语言
const { t } = useI18n();

const props = defineProps({
  mBLandscape: {
    type: Boolean,
    default: false
  }
});

// 奖励弹窗ref实例
const rewardBox = ref();
// 关闭奖励弹窗回调
const confirmReward = async () => {
  // 获取页面数据
  getPlayRebate();
};

// 页面数据
const time = ref(null);
const Gold = ref(0);
// 获取页面数据
const getPlayRebate = async () => {
  // const { code, data }: any = await playRebateInfoApi();
  // if (code == 200) {
  //   Gold.value = Number(data.data);
  // }
};
const rebate = ref()
const getRebateConfig = async () => {
  const { code, data }: any = await playRebateConfigApi();
  if (code == 200) {
    rebate.value = data.data;
  }
};


// 领取奖励
const getReward = Common.debounce(async () => {

  const { code, data }: any = await playRebateDrawApi();

  if (code == 200) {
    if (data.data > 0) {
      rewardBox.value.show({
        gold: data.data
      });
    } else {
      showTipModel({
        type: 1,
        icon: "fail",
        title: t("105035", [Number(rebate.value.rebateAmount)])
      });
    }
  } else {
    showTipModel({
      type: 1,
      icon: "fail",
      title: t("105035", [rebate.value.rebateAmount]),
      mBLandscape: props.mBLandscape
    });
  }
}, 500);

onMounted(() => {
  time.value = setInterval(getPlayRebate, 5000)
  // 获取页面配置
  getRebateConfig()
});

onUnmounted(() => {
  clearInterval(time.value)
});
</script>

<style lang="scss" scoped>
@import "./brgames.scss";
</style>
