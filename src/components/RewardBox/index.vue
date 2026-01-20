<template>
  <!-- 奖励领取框 -->
  <van-popup
    v-model:show="modelProps.isShow"
    @click-overlay="confirm()"
    style="background-color: transparent"
  >
    <div class="reward-main-box" :class="{ b: mBLandscape }">
      <div class="theme-popup-title-bg popup-title">
        <span>{{ modelProps.title }}</span>
        <svg-icon
          name="close-pop"
          class="text-[16px] cursor-pointer"
          @click="confirm()"
        />
      </div>
      <div class="desc" v-html="modelProps.desc"></div>
      <div class="reward-box">
        <img :src="`${$imgBasePath}/public/reward-moeny.png`" />
        <span>{{ $t('107043') }} +{{ common.formatNum(modelProps.gold) }}</span>
      </div>
      <van-button
        class="theme-btn-submit btn-ext"
        type="default"
        @click="confirm()"
        :disabled="confirmLock"
        >{{ $t("103015") }}</van-button
      >
    </div>
  </van-popup>
</template>
<script setup lang="ts" name="svgDemo">
import { ref, onMounted, defineEmits } from "vue";
import { useI18n } from "vue-i18n";
import common from "@/utils/common/common";

const { t } = useI18n();

const props = defineProps({
  mBLandscape: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["confirm"]);

// 定义变量
let modelProps = ref({
  isShow: false,
  title: "",
  desc: "",
  gold: 0,
  rewardKey: 0
});

const show = (option: any) => {
  if (typeof option.title != "undefined" && option.title != "") {
    modelProps.value.title = option.title;
  } else {
    modelProps.value.title = t("102050");
  }

  if (option.desc != "") {
    modelProps.value.desc = option.desc;
  }

  if (option.gold != "") {
    modelProps.value.gold = option.gold;
  }

  modelProps.value.rewardKey = option.rewardKey;

  modelProps.value.isShow = true;
};

const confirmLock = ref(false);
const confirm = () => {
  confirmLock.value = true;

  setTimeout(() => {
    confirmLock.value = false;
  }, 3000);

  modelProps.value.isShow = false;
  emit("confirm");
};

onMounted(() => {});

defineExpose({
  show
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
