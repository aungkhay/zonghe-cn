<template>
  <!-- <div class="tab-box">
    <span
      v-for="(item, index) in modelProps.tabList"
      :key="index"
      :class="{ active: index == modelProps.tabIndex }"
      @click="changeTab(index)"
      >{{ $t(item.name) }}
    </span>
  </div> -->
  <div class="about-text">
    {{
      $t("106018", [modelProps.hostUrl, modelProps.hostUrl, modelProps.hostUrl])
    }}
  </div>
</template>
<script setup lang="ts" name="Tools">
import { ref, onMounted } from "vue";

// 定义变量
let modelProps = ref({
  tabIndex: 0,
  tabKey: "about",
  tabList: [{ key: "about", name: "101005" }],

  hostUrl: ""
});

const changeTab = (tabIndex: number) => {
  modelProps.value.tabIndex = tabIndex;
  let tabKey = modelProps.value.tabList[tabIndex].key;
  modelProps.value.tabKey = tabKey;
};

onMounted(() => {
  modelProps.value.hostUrl = window.location.hostname;
});
</script>

<style lang="scss" scoped>
@import "./about.scss";
</style>
