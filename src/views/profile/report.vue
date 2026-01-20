<template>
  <div class="bg-[#f4faff] text-[#555555] overflow-y-auto" style="height: calc(100vh - 50px); -webkit-overflow-scrolling: touch;">
    <div class="tab-box mt-3">
      <span class="cursor-pointer"
        v-for="(item, index) in modelProps.tabList"
        :key="index"
        :class="{ active: index == modelProps.tabIndex }"
        @click="changeTab(index)"
        >{{ $t(item.name) }}
      </span>
    </div>
    <!-- Statement -->
    <div class="main-box" v-if="modelProps.tabKey == 'Statement'">
      <Statement></Statement>
    </div>
    <!-- BetRecords -->
    <div class="main-box" v-if="modelProps.tabKey == 'BetRecords'">
      <BetRecords></BetRecords>
    </div>
    <!-- Report -->
    <div class="main-box" v-if="modelProps.tabKey == 'Report'">
      <Report></Report>
    </div>
  </div>
</template>
<script setup lang="ts" name="Tools">
import { ref, onMounted, watch } from "vue";
import Statement from "./reportCom/statement.vue";
import BetRecords from "./reportCom/betRecords.vue";
import Report from "./reportCom/report.vue";
import { useRoute } from "vue-router";

const route = useRoute();

watch(() => route.query.tab, (val) => {
  if (val) {
    changeTab(Number(val));
  }
});

// 定义变量
let modelProps = ref({
  tabIndex: 0,
  tabKey: "Statement",
  tabList: [
    { key: "Statement", name: "106004" },
    { key: "BetRecords", name: "106005" },
    { key: "Report", name: "106006" }
  ]
});

const changeTab = (tabIndex: number) => {
  modelProps.value.tabIndex = tabIndex;
  let tabKey = modelProps.value.tabList[tabIndex].key;
  modelProps.value.tabKey = tabKey;
};

onMounted(() => {
  if (route.query.tab) {
    changeTab(Number(route.query.tab));
  }
});
</script>

<style lang="scss" scoped>
@import "./report.scss";
</style>
