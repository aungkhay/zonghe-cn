<template>
  <van-popup
    v-model:show="modelProps.isShow"
    style="background-color: transparent"
  >
    <div class="popup-bg mian-box">
      <div class="title">
        <van-icon name="cross" size="18" class="text-[var(--primary-color)] close-btn" @click="close()" />
        <span>{{ $t("106007") }}</span>
      </div>
       <!-- 只在调试模式下显示,或者url上有zhongwen=1 v-if="isDevelopment || hasZhongwenParam"-->
      <!-- <template > -->
      <div class="lang-row" @click="changeLang('zh')">
        <span class="name">{{ $t("990001") }}</span>
        <div 
          class="checkbox-circle"
          :class="{ active: Common.getCurLang() === 'zh' }"
        ></div>
      </div>
    <!-- </template> -->
      <div class="lang-row" @click="changeLang('en')">
        <span class="name">{{ $t("106013") }}</span>
        <div 
          class="checkbox-circle"
          :class="{ active: Common.getCurLang() === 'en' }"
        ></div>
      </div>
      <div class="lang-row" @click="changeLang('pt')">
        <span class="name">{{ $t("106014") }}</span>
        <div 
          class="checkbox-circle"
          :class="{ active: Common.getCurLang() === 'portugal' }"
        ></div>
      </div>

    </div>

   
  </van-popup>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import Common from "@/utils/common/common";
import { useI18n } from "vue-i18n";
import { updateLanguageApi, changleLang } from "@/api/user/index";

const { locale } = useI18n();

// 判断是否为开发环境
const isDevelopment = computed(() => {
  return import.meta.env.MODE === 'development' || import.meta.env.VITE_IS_SHOW_ZH === 'true';
});

// 判断URL中是否有zhongwen=1参数
const hasZhongwenParam = computed(() => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get('zhongwen') === '1';
  }
  return false;
});

// 定义变量
let modelProps = ref({
  isShow: false,
  lang: ''
});
const show = () => {
  console.log(useUserStoreHook().playerInfo.language)
  modelProps.value.lang = useUserStoreHook().playerInfo.language;
  modelProps.value.isShow = true;
};
const close = () => {
  modelProps.value.isShow = false;
};

const changeLang = async(lang: string) => {
  modelProps.value.lang = lang;
  locale.value = Common.getParamsLangName(lang);
  useUserStoreHook().updatePlayerInfo("language", lang);
  useUserStoreHook().changeLang(lang);
  close();
  // 异步通知服务器修改
  changleLang(lang);
};

defineExpose({
  show
});
</script>

<style lang="scss" scoped>
.mian-box {
  width: 300px;
  max-width: 350px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 8px;

  .title {
    width: 100%;
    height: 50px;
    text-align: center;
    color: var(--primary-color);
    font-size: 16px;
    padding: 10px 20px;
    position: relative;

    .close-btn {
      position: absolute;
      right: 15px;
      top: 15px;
    }
  }

  .lang-row {
    width: 90%;
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 18px;
    color: var(--primary-color);
    margin-left: 5%;
    justify-content: space-between;
    border-top: 1px dashed white;

    .checkbox-circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid #CCCCCC;
      background-color: #FFFFFF;
      transition: all 0.3s ease;

      &.active {
        background-color: var(--primary-color);
        border-color: #CCCCCC;
      }
    }
  }
}
</style>
