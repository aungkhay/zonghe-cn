<template>
  <van-popup :show="isShow" style="background-color: transparent">
    <div class="popup-container rounded-b-[5px]">
      <div class="tutorial-title-box rounded-t-[5px]">
        <span class="tutorial-title">
          <!-- {{ $t("110007") }} -->
        </span>
        <!-- 关闭 -->
        <svg-icon
          name="close"
          class="text-[25px] text-[#ffc700] cursor-pointer"
          @click="isShow = false"
        />
      </div>
      <img :src="`${$imgBasePath}/event/webimg.png`" class="w-[100%]" />
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isShow = ref(false);

const show = () => {
  isShow.value = true;
};

defineExpose({
  show
});
</script>
<style lang="scss" scoped>
.popup-container {
  padding-top: 40px;
  position: relative;
  width: 340px;
  height: 80vh;
  overflow-y: auto;

  .tutorial-title-box {
    padding: 5px 10px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8f8f8;
    border-bottom: 1px solid #9e9e9e;

    .tutorial-title {
      flex: 1;
      font-size: 12px;
      color: #000;
    }
  }
}
</style>
