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
  </div>
  <div class="top-info bg-white">
    <div class="left">
      <span>{{ $t("106036") }}</span>
      <i
        >{{ $t("107043") }}&nbsp;{{
          Common.toFixed2(Number(playerInfo.totalBet))
        }}</i
      >
    </div>
    <div class="right">
      <span>{{ $t("106037") }}</span>
      <i
        >{{ $t("107043") }}&nbsp;{{
          Common.toFixed2(Number(playerInfo.totalWin)-Number(playerInfo.totalBet))
        }}</i
      >
    </div>
  </div>
  <div class="table-content">
    <div class="table-title-row">
      <div class="table-title-cell">{{ $t("102013") }}</div>
      <div class="table-title-cell">{{ $t("106035") }}</div>
      <div class="table-title-cell">{{ $t("106023") }}</div>
      <div class="table-title-cell">{{ $t("106038") }}</div>
    </div>
    
    <!-- 无数据状态 -->
    <div v-if="modelProps.logsList.length <= 0">
      <NoData />
    </div>

    <div class="table-row" v-for="(item, index) in modelProps.logsList" :key="index">
      <div class="table-cell">{{ item.createDay }}</div>
      <div class="table-cell">{{ item.platform }}</div>
      <div class="table-cell">{{ Common.toFixed2(item.bet) }}</div>
      <div class="table-cell">{{ Common.toFixed2(item.pay-item.bet) }}</div>
    </div>
  </div>

  <!-- 底部分页 -->
  <div class="footer">
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
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { reportApi } from "@/api/records/index";
import { userInfoApi } from "@/api/user/index";
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
  type: 0,
  logs: [],
  logsList: [],
  allValidBet: 0,
  allWinGold: 0,
  platformList: [
    {
      key: null,
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
  ]
});

// 切换时间
const changeDateTime = (type: SearchTimeEnum) => {
  modelProps.value.day = type;
  getLogs();
};

// 切换平台
const changePlatform = (type: string) => {
  modelProps.value.type = Number(type);
  getLogs();
};

const getPlatformCaption = type => {
  let platformList = modelProps.value.platformList;
  for (let i in platformList) {
    if (String(type) == platformList[i].key) {
      return platformList[i].name;
    }
  }

  return "-";
};

// 分页
const page = ref({
  total: 0,
  pageSize: 30,
  pageNum: 1
});
// 更改分页
const changePage = pageNum => {
  page.value.pageNum = pageNum;
  getLogs();
};

const getLogs = async () => {
  const { pageSize, pageNum }: any = page.value;
  const { day, type }: any = modelProps.value;
  let params: any = {
    day,
    type,
    pageSize,
    pageNum
  };
  let { code, data }: any = await reportApi(params);

  if (code == 200 && data.rows.length > 0) {
    const { total, rows } = data;
    rows.map(item => {
      item.platform = modelProps.value.platformList.find(sitem => sitem.key == String(item.firmType)).name;
      item.createDay = item.createDay.split(" ")[0];
    });
    page.value.total = total;
    modelProps.value.logsList = rows;
  } else {
    modelProps.value.logsList = [];
  }
};
const getUseinfo = async () => {
  let { code, data }: any = await userInfoApi();
  const { totalWin, totalBet } = data.data;
  if (code == 200) {
    useUserStoreHook().updatePlayerInfo("totalBet", totalBet);
    useUserStoreHook().updatePlayerInfo("totalWin", totalWin);
  }
};

onMounted(async () => {
  await getUseinfo();
  await getLogs();
});
</script>
<style lang="scss" scoped>
@import "./report.scss";

.table-content {
  margin-top: 15px;
  width: 355px;
  margin-left: auto;
  margin-right: auto;

  background: white;
  border-radius: 6px;
  padding: 8px;
}

.table-title-row {
  height: 40px;
  background: var(--secondary-color);
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
  height: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  
  &:nth-child(odd) {
    background: var(--secondary-color);
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
    color: var(--primary-color);
  }
}
</style>
