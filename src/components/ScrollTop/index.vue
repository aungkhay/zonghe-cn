<template>
  <!-- 返回顶部按钮 -->
  <van-back-top
    :right="right"
    :bottom="bottom"
    :offset="offset"
    :immediate="immediate"
    :z-index="zIndex"
    class="scroll-top"
  >
    <svg-icon name="scroll-top" class="theme-svg-color mb-[3px] text-[7px]" />
    <span>{{ text }}</span>
  </van-back-top>
  <template />
</template>

<script setup lang="ts">
const props = defineProps({
  // 距离页面右侧的距离，默认居中
  right: {
    String,
    default: "calc(50% - 22px)"
  },
  // 距离页面底部的距离(px)
  bottom: {
    type: Number,
    default: 100
  },
  // 滚动高度达到此参数值时才显示组件(px)
  offset: {
    type: Number,
    default: 100
  },
  // 是否瞬间滚动到顶部
  immediate: {
    type: Boolean,
    default: false
  },
  // 设置组件的 z-index 层级
  zIndex: {
    type: Number,
    default: 100
  },
  // 显示文案
  text: {
    type: String,
    default: "Top"
  }
});
</script>

<style lang="scss">
.scroll-top {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  font-size: 11px;
  color: $theme-main-color;
  background: white;
  border-radius: 5px;
}
</style>
