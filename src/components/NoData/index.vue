<template>
  <div class="no-data-box">
    <img :src="`${$imgBasePath}/public/icon_Empty.png`" class="w-[196px]">
    <span>{{ $t("102048") }}</span>
  </div>
</template>

<style lang="scss" scoped>
.no-data-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  span {
    font-size: 14px;
    font-weight: bold;
    color: var(--primary-color);
  }
}
</style>
