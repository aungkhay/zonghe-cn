<template>
  <van-popup
    v-model:show="modelProps.isShow"
    style="background-color: transparent"
  >
 
      <div class="mian-box">
        <div class="explain-title">{{ modelProps.title }}</div>
        <div class="explain-content">
          <span>{{ modelProps.content }}</span>
        </div>

        <van-button
          v-scaleTap
          class="theme-btn btn-submit"
          type="default"
          @click="close()"
          >{{ $t("103015") }}</van-button
        >
        <svg-icon v-scaleTap class="text-[30px] theme-svg-color-light box-close" name="close" @click="close()" />
      </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 定义变量
let modelProps = ref({
  isShow: false,
  title: "",
  content: ""
});
const show = (title: string, content: string) => {
  modelProps.value.title = title;
  modelProps.value.content = content;
  modelProps.value.isShow = true;
};
const close = () => {
  modelProps.value.isShow = false;
};

defineExpose({ 
  show
});
</script>

<style lang="scss" scoped>
.mian-box {
  @extend .popup-bg;
  width: 288px;
  min-height: 200px;
  border-radius: 10px;
  padding-bottom: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 65px;
  padding: 18px 12px;
  
  .box-close {
    position: absolute;
    bottom: -50px;
    left: 50%;
    margin-left: -15px;
  }

  .explain-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 10px;
    color: $theme-text-color-dark;
    // border-bottom : 1px solid white;
  }

  .explain-content {
    width: 100%;
    height: 365px;
    overflow-y: scroll;
    border-radius: 8px;
    font-size: 12px;
    color: $theme-text-color-dark;
    margin-bottom: 15px;
    margin-top: 12px;
    text {
      line-height: 14px;
    }
  }

  .btn-submit{
    margin-left : auto;
    margin-right: auto;
    width: 100%;
    height: 28px;
  }
}

</style>
