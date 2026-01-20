<template>
    <div class="money-grow-bg">
      <span class="money-grow-text">{{ formattedMoney }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
  
  const money = ref<number>(13582665);
  const displayMoney = ref<number>(money.value);
  let timer: number | null = null;
  let animationFrame: number | null = null;
  
  const formatMoney = (num: number): string => {
    // 千分位格式化，结尾加 ,00
    return num.toLocaleString('de-DE') + ',00';
  };
  
  const formattedMoney = computed(() => formatMoney(displayMoney.value));
  
  function animateNumber(from: number, to: number, duration = 1000) {
    const start = performance.now();
    function update(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      displayMoney.value = Math.floor(from + (to - from) * progress);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      } else {
        displayMoney.value = to;
      }
    }
    animationFrame = requestAnimationFrame(update);
  }
  
  onMounted(() => {
    timer = window.setInterval(() => {
      const oldValue = money.value;
      money.value += Math.floor(Math.random() * 10000 + 1000); // 随机增长
      animateNumber(displayMoney.value, money.value, 1000); // 1秒动画
    }, 3000);
  });
  
  onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
  </script>
  
  <style lang="scss" scoped>
  .money-grow-bg {
    @extend .theme-money-grow-bg;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .money-grow-text {
    @extend .theme-money-grow-text;
    left: 0px;   // 向左偏移16px，可根据实际效果调整
    top: 10px;      // 向下偏移8px，可根据实际效果调整
    width: 100%;
    position: relative;
    text-align: center;
  }
  </style>