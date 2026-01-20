<template>
  <div class="top-box">
    
    <SelectBox @change="changeDateTime" listType="date"></SelectBox>
 
    <div class="right">
      <span>{{ $t("102030") }}:</span>
      <i> {{ $t('107043', [Common.toFixed2(playerInfo.withdrawAmount)]) }}</i>
    </div>
  </div>

  <div class="pb-[60px]" v-if="modelProps.logsList.length > 0">
    <!-- <div class="table-content">
      <div class="table-title-row">
        <div class="table-title-cell">{{ $t("102013") }}</div>
        <div class="table-title-cell">{{ $t("102014") }}</div>
        <div class="table-title-cell">{{ $t("102017") }}</div>
      </div>
      
      <div class="table-row" v-for="(item, index) in modelProps.logsList" :key="index">
        <div class="table-cell">{{ item.createTime }}</div>
        <div class="table-cell">{{ Common.toFixed2(item.amount) }}</div>
        <div class="table-cell">{{ item.statusName }}</div>
      </div>
    </div> -->
    <div v-for="(item, index) in modelProps.logsList" :key="index" class="bg-white shadow-sm mb-2 mx-3 p-3 rounded-md">
      <div class="flex justify-between items-center">
        <div class="flex flex-col justify-between">
          <div class="text-[#338aef] text-[12px]">{{ $t("102014") }}: {{ item.amount }}</div>
          <div class="text-[12px] text-gray-400">{{ $t("102013") }}: {{ item.createTime }}</div>
        </div>
        <div 
            class="text-sm"
            :class="{
              'text-yellow-500': item.status == 0,
              'text-green-500': item.status == 1,
              'text-red-500': item.status == 5,
            }"
        >{{ item.statusName }}</div>
      </div>
    </div>
  </div>
  <div v-else>
    <NoData />
  </div>

  <!-- 底部分页 -->
  <div class="footer">
    <div class="pagination-box">
      <!-- 跳到首页 -->
      <van-icon @click="changePage(1)" name="arrow-double-left" class="pagination-first" />
      <van-pagination v-model="page.pageNum" :total-items="page.total" :items-per-page="page.pageSize"
        :show-page-size="4" @change="changePage">
        <template #prev-text>
          <van-icon name="arrow-left" />
        </template>
        <template #next-text>
          <van-icon name="arrow" />
        </template>
      </van-pagination>
      <!-- 跳到尾页 -->
      <van-icon @click="changePage(Math.ceil(page.total / page.pageSize))" name="arrow-double-right"
        class="pagination-last" />
    </div>
  </div>
</template>

<script setup lang="ts" name="vip-history">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { withdrawLogApi } from "@/api/withdraw/index";
import SelectBox from "@/components/SelectBox/index.vue";
import Common from "@/utils/common/common";
import { useUserStoreHook } from "@/store/modules/user";
import { SearchTimeEnum } from "@/api/agent";
// 多语言
const { t } = useI18n();
// 用户信息
const playerInfo = computed(() => {
  return useUserStoreHook().playerInfo;
});
// 定义变量
let modelProps = ref({
  day: SearchTimeEnum.TODAY,
  logsList: [],
});

// 分页
const page = ref({
  total: 0,
  pageSize: 20,
  pageNum: 1
});

// 更改分页
const changePage = currentPage => {
  page.value.pageNum = currentPage;
  getLogs();
};

const changeDateTime = (type: SearchTimeEnum) => {
  modelProps.value.day = type;
  getLogs();
};

const getLogs = async () => {
  const { pageSize, pageNum }: any = page.value;
  const { day }: any = modelProps.value
  let params: any = {
    day,
  }
  let { code, data }: any = await withdrawLogApi({ pageSize, pageNum }, params);
  if (code == 200 && data.rows.length > 0) {

    // if (code == 200) {
      //添加模拟数据
 
    
    data.rows.map((item) => {
      const StatusOpt: any = {
        0: t('102020'),
        1: t('102018'),
        2: t('102019'),
        3: t('102065'),
        4: t('102066'),
        5: t('102067'),
        6: t('102018'),
        7: t('102018'),
      }
      item.statusName = StatusOpt[item.status]
    })
    
    modelProps.value.logsList = data.rows;
  }
    
};

onMounted(() => {
  getLogs();
});
</script>
<style lang="scss" scoped>
@import "./records.scss";

.table-content {
  margin-top: 15px;
  width: 355px;
  margin-left: auto;
  margin-right: auto;

  background: $theme-nav-top-bg;
  border-radius: 6px;
  padding: 8px;
}

.table-title-row {
  height: 40px;
  background: $theme-table-title-bg;
  border-radius: 6px;
  border: 1px solid $theme-nav-top-border-color;
  display: flex;
  flex-direction: row;
  align-items: center;
  
  .table-title-cell {
    flex: 1;
    text-align: center;
    font-weight: bold;
    font-size: 12px;
    color: white;
  }
}

.table-row {
  height: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  
  &:nth-child(odd) {
    background: $theme-table-odd-bg;
    border-radius: 6px;
  }
  
  &:nth-child(even) {
    background: $theme-table-even-bg;
  }
  
  .table-cell {
    flex: 1;
    text-align: center;
    font-weight: 500;
    font-size: 12px;
    color: $theme-text-color-dark;
  }
}
</style>
