<template>
  <div class="top-box bg-white">
    <div class="select-box">
      <SelectBox @change="changeDateTime" listType="date"></SelectBox>
    </div>
    <div class="select-box ml-[10px]">
      <SelectBox
        @change="changePlatform"
        listType="platform"
        :listArr="modelProps.platformList"
      ></SelectBox>
    </div>
    <div class="select-box ml-[10px]">
      <SelectBox
        @change="changeGame"
        listType="game"
        :listArr="modelProps.gameList"
      ></SelectBox>
    </div>
  </div>
  <!-- <div class="table-content">
    <div class="table-title-row">
      <div class="table-title-cell">{{ $t("102013") }}</div>
      <div class="table-title-cell">{{ $t("106035") }}</div>
      <div class="table-title-cell">{{ $t("106034") }}</div>
      <div class="table-title-cell">{{ $t("106023") }}</div>
      <div class="table-title-cell">{{ $t("106024") }}</div>
      <div class="table-title-cell">{{ $t("106000") }}</div>
    </div>
    
    <div v-if="modelProps.logsList.length <= 0">
      <NoData />
    </div>

    <div class="table-row" v-for="(item, index) in modelProps.logsList" :key="index">
      <div class="table-cell">{{ item.createTime }}</div>
      <div class="table-cell">{{ item.platFormName }}</div>
      <div class="table-cell">{{ item.gameName }}</div>
      <div class="table-cell">{{ Common.toFixed2(item.bet) }}</div>
      <div class="table-cell">{{ Common.toFixed2(item.win) }}</div>
      <div class="table-cell">{{ Common.toFixed2(item.balance) }}</div>
    </div>
  </div> -->

  <div class="mx-3 text-[12px] mt-3">{{ $t('total_history') }} {{ modelProps.logsList.length }}</div>
  <div 
    v-for="(item, index) in modelProps.logsList" :key="index"
    class="bg-white mx-3 p-3 rounded-lg my-3"
  >
    <div class="flex justify-between items-center text-[12px]">
      <div class="text-[#338aef]">{{ item.gameName }}</div>
      <div>{{ item.platFormName }}</div>
    </div>
    <div class="h-[1px] bg-gray-200 my-2"></div>
    <div class="flex justify-between items-center">
      <div>
        <div class="text-[14px]">投注了<span class="ml-1">{{ Common.toFixed2(item.bet) }}</span></div>
        <div class="text-[12px] text-gray-400 mt-2">{{ item.createTime }}</div>
      </div>
      <div class="text-right">
        <div v-if="Number(item.win) > 0" class="font-bold text-red-500">+{{ Common.toFixed2(item.win) }}</div>
        <div v-else-if="Number(item.win)" class="font-bold text-green-600">-{{ Common.toFixed2(item.win) }}</div>
        <div v-else class="font-bold">{{ Common.toFixed2(item.win) }}</div>
        <div class="text-[12px] text-gray-400 mt-2">余额 <span class="ml-1">{{ Common.toFixed2(item.balance) }}</span></div>
      </div>
    </div>
  </div>

  <!-- 底部分页 -->
  <div v-if="modelProps.logsList.length > 0" class="footer">
    <div class="pagination-box">
      <!-- 跳到首页 -->
      <van-icon
        @click="changePage(1)"
        name="arrow-double-left"
        class="pagination-first"
      />
      <van-pagination
        v-model="page.pageNum"
        :total-items="page.total"
        :items-per-page="page.pageSize"
        :show-page-size="4"
        @change="changePage"
      >
        <template #prev-text>
          <van-icon name="arrow-left" />
        </template>
        <template #next-text>
          <van-icon name="arrow" />
        </template>
      </van-pagination>
      <!-- 跳到尾页 -->
      <van-icon
        @click="changePage(Math.ceil(page.total / page.pageSize))"
        name="arrow-double-right"
        class="pagination-last"
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="report">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { playLogApi } from "@/api/records/index";
import { playedGame } from "@/api/game/index";
import SelectBox from "@/components/SelectBox/index.vue";
import Common from "@/utils/common/common";
import roomConfig from "@/config/roomConfig.json";
import { SearchTimeEnum } from "@/api/agent";

// 多语言
const { t } = useI18n();



interface LogItem {
  platFormName?: string;
  gameName?: string;
  createTime?: string;
  bet?: string;
  win?: string;
  balance?: string;
}

interface PageConfig {
  total: number;
  pageSize: number;
  pageNum: number;
}

interface ModelProps {
  day: SearchTimeEnum;
  type: number | null;
  gameId: number | null;
  logsList: LogItem[];
  platformList: { key: string; name: string }[];
  gameList: { key: string; name: string }[];
}
// 定义变量
let modelProps = ref<ModelProps>({
  day: SearchTimeEnum.TODAY,
  type: null,
  gameId: null,
  logsList: [],
  platformList: [
    {
      key: "all",
      name: t("record.platform")
    },
    {
      key: "1",
      name: t("106032")
    },
    {
      key: "2",
      name: t("106033")
    },
    {
      key: "3",
      name: t("106071")
    },
    {
      key: "4",
      name: t("106072")
    },
    {
      key:"5",
      name:"EVO"
    },
    {
      key: "14",
      name: "SSR"
    },
    {
      key: "15",
      name: "SPRIBE"
    }

  ],
  gameList: [
    {
      key: "null",
      name: t('record.all_games')
    }
  ]
});

const page = ref<PageConfig>({ total: 0, pageSize: 30, pageNum: 1 });

// 分页参数类型
type ParamsType = {
  day: SearchTimeEnum;
  type: number | null;
  gameId: number | null;
};

// 切换时间
const changeDateTime = (type: SearchTimeEnum) => {
  modelProps.value.day = type;
  getLogs();
};

// 切换平台
const changePlatform = (type: string) => {
  if (!isNaN(Number(type))) {
    modelProps.value.type = Number(type);
    getLogs();
  }else{
    //表示选择全部
    modelProps.value.type = null;
    getLogs();
  }
};

// 切换游戏
const changeGame = (roomId: string) => {
  modelProps.value.gameId = Number(roomId);
  getLogs();
};
// 初始化游戏筛选列表
const initGameList = async () => {
  try {
    const { code, data }: any = await playedGame();
    if (code === 200 && Array.isArray(data.data) && data.data.length > 0) {
      data.data.forEach(item => {
        modelProps.value.gameList.push({
          key: item.gameId,
          name: item.en
        });
      });
    }
  } catch (error) {
    console.error("Error initializing game list:", error);
  }
};

// 更改分页
const changePage = (currentPage: number) => {
  page.value.pageNum = currentPage;
  getLogs();
};

const getLogs = async () => {
  try {
    const { pageSize, pageNum } = page.value;
    const { day, type, gameId } = modelProps.value;
    const params: ParamsType = { day, type, gameId };

    const { code, data }: any = await playLogApi({ pageSize, pageNum }, params);
    if (code === 200) {
      const { total, rows } = data;
      if (rows.length > 0) {
        let platFormOpt = {
          1: "PG",
          2: "PP",
          3: "JDB",
          4: "JILI",
          5: "EVO",
          14: "SSR",
          15: "SPRIBE"
        };
        rows.forEach(item => {
          item.platFormName = platFormOpt[item.type] || "Unknown";
          item.gameName = item.en || "-";
        });
        page.value.total = total;
        modelProps.value.logsList = rows;
      } else {
        modelProps.value.logsList = [];
      }
    }
  } catch (error) {
    console.error("Error fetching logs:", error);
  }
};

onMounted(() => {
  initGameList();
  getLogs();
});
</script>
<style lang="scss" scoped>
@import "./betRecords.scss";

.table-content {
  margin-top: 15px;
  width: 355px;
  margin-left: auto;
  margin-right: auto;

  background: var(--secondary-color);
  border-radius: 6px;
  padding: 8px;
}

.table-title-row {
  height: 40px;
  background: var(--secondary-dark-color);
  border-radius: 6px;
  // border: 1px solid $theme-nav-top-border-color;
  display: flex;
  flex-direction: row;
  align-items: center;
  
  .table-title-cell {
    flex: 1;
    text-align: center;
    font-weight: bold;
    font-size: 12px;
    color: var(--text-black);
  }
}

.table-row {
  height: 45px;
  display: flex;
  flex-direction: row;
  align-items: center;
  
  &:nth-child(odd) {
    background: var(--secondary-dark-color);
    border-radius: 6px;
  }
  
  &:nth-child(even) {
    background: $theme-table-even-bg;
  }
  
  .table-cell {
    flex: 1;
    text-align: center;
    font-weight: 500;
    font-size: 10px;
    color: var(--primary-color);
  }
}
</style>
