<template>
  <div class="top-box bg-white">
    <div class="select-box">
      <SelectBox @change="changeDateTime" listType="date"></SelectBox>
    </div>
    <div class="select-box ml-[10px]">
      <SelectBox @change="changeRecordType" listType="statementType" :listArr="modelProps.typeList"></SelectBox>
    </div>
  </div>
  <!-- <div class="top-info bg-white">
    <div class="left">
      <span>{{ $t("106020") }}</span>
      <i>{{ $t("107043") }}&nbsp;{{ Common.toFixed2(Number(playerInfo.rechargeAmount)) }}</i>
    </div>
    <div class="right">
      <span>{{ $t("106021") }}</span>
      <i>{{ $t("107043") }}&nbsp;{{ Common.toFixed2(Number(playerInfo.withdrawAmount)) }}</i>
    </div>
  </div> -->
  <!-- <div class="table-content">
    <div class="table-title-row">
      <div class="table-title-cell">{{ $t("102013") }}</div>
      <div class="table-title-cell">{{ $t("102014") }}</div>
      <div class="table-title-cell">{{ $t("106022") }}</div>
    </div>
    
    <div v-if="modelProps.logsList.length <= 0">
      <NoData />
    </div>

    <div class="table-row" v-for="(item, index) in modelProps.logsList" :key="index">
      <div class="table-cell">{{ item.createTime }}</div>
      <div class="table-cell">{{ Common.toFixed2(Number(item.amount)) }}</div>
      <div class="table-cell">{{ item.typeName }}</div>
    </div>
  </div> -->

  <div class="flex justify-between items-center mx-3 text-[12px]">
    <div class="mt-3">{{ $t('total_history') }} {{ modelProps.logsList.length }}</div>
    <div class="flex items-center space-x-5">
      <div>
        <span>{{ $t("106020") }}</span>
        <span class="pl-1">{{ Common.toFixed2(Number(playerInfo.rechargeAmount)) }}</span>
      </div>
      <div>
        <span>{{ $t("106021") }}</span>
        <span class="pl-1">{{ Common.toFixed2(Number(playerInfo.withdrawAmount)) }}</span>
      </div>
    </div>
  </div>
  <div 
    v-for="(item, index) in modelProps.logsList" :key="index"
    class="bg-white mx-3 p-3 rounded-lg my-3"
  >
    <div class="flex justify-between items-center text-[12px]">
      <div class="text-[#338aef]">D</div>
      <div>D</div>
    </div>
    <div class="h-[1px] bg-gray-200 my-2"></div>
    <div class="flex justify-between items-center">
      <div>
        <div class="text-[14px]">D<span class="ml-1">{{ Common.toFixed2(Number(item.amount)) }}</span></div>
        <div class="text-[12px] text-gray-400 mt-2">{{ item.createTime }}</div>
      </div>
      <div class="text-right">
        <div v-if="Number(item.amount) > 0" class="font-bold text-red-500">+{{ Common.toFixed2(item.amount) }}</div>
        <div v-else-if="Number(item.amount)" class="font-bold text-green-600">-{{ Common.toFixed2(item.amount) }}</div>
        <div v-else class="font-bold">{{ Common.toFixed2(item.amount) }}</div>
        <div class="text-[12px] text-gray-400 mt-2">余额 <span class="ml-1">0</span></div>
      </div>
    </div>
  </div>

  <!-- 底部分页 -->
  <div class="footer" v-if="modelProps.logsList.length > 0">
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

<script setup lang="ts" name="statement">
import { ref, onMounted,computed } from "vue";
import { useI18n } from "vue-i18n";
import { statementApi } from "@/api/records/index";
import { userInfoApi } from "@/api/user/index";
import SelectBox from "@/components/SelectBox/index.vue";
import Common from "@/utils/common/common";
import { useUserStoreHook } from "@/store/modules/user";
import { SearchTimeEnum } from "@/api/agent";


// 用户信息
const playerInfo = computed(() => {
  return useUserStoreHook().playerInfo;
});



// 多语言
const { t } = useI18n();

// 定义变量
let modelProps = ref({
  day: SearchTimeEnum.TODAY,
  type: null,
  logsList: [],
  totalDeposit: 0,
  totalWithdraw: 0,
  typeList: [
    {
      key: null,
      key2:null,
      name: t("102006")
    },
    {
      key: 'RECHARGE',
      key2:1,
      name: t("110002")
    },
    {
      key: 'WITHDRAW',
      key2:2,
      name: t("110003")
    },
    {
      key: 'BET',
      key2:3,
      name: t("106023")
    },
    {
      key: 'WIN',
      key2:4,
      name: t("106024")
    },
    {
      key: 'ACTIVITY_TUNRN_TABLE',
      key2:5,
      name: t("f_activity_turn_table")
    },
    // {
    //   key: 'ADMIN_ADD',
    //   key2:12,
    //   name: t("f_admin_add")
    // },
    // {
    //   key: 'ADMIN_SUB',
    //   key2:13,
    //   name: t("f_admin_sub")
    // },
    {
      key: 'WITHDRAW_BACK',
      key2:14,
      name: t("f_withdraw_refund")
    },
    {
      key: 'FIRST_RECHARGE_REBATE',
      key2:15,
      name: t("f_first_deposit_bonus")
    },
    {
      key: 'SECOND_RECHARGE_REBATE',
      key2:16,
      name: t("f_second_recharge_bonus")
    },
    {
      key: 'AGENT_RECHARGE_REBATE',
      key2:17,
      name: t("f_agent_recharge_bonus")
    },
    {
      key: 'AGENT_BERT_WEEK_REBATE',
      key2:18,
      name: t("f_agent_week_water_bonus")
    },
    {
      key: 'VIP_WEEK_REWARD',
      key2:19,
      name: t("f_vip_week_reward")
    },
    {
      key: 'VIP_MONTH_REWARD',
      key2:20,
      name: t("f_vip_month_reward")
    },
    {
      key: 'TOTAL_RECHARGE_REBATE',
      key2:21,
      name: t("f_total_recharge_bonus")
    },
    {
      key: 'DAY_BET_REBATE',
      key2:22,
      name: t("f_day_bet_bonus")
    },
    {
      key: 'WEEK_BET_REBATE',
      key2:23,
      name: t("f_week_bet_bonus")
    },
    {
      key: 'WEEK_LOSS_REBATE',  
      key2:24,
      name: t("f_week_loss_bonus")
    },
    {
      key: 'INVITE_BOX_REWARD',
      key2:25,
      name: t("f_invite_box_reward")
    },
    {
      key: 'WEEK_DEPOSIT_REBATE',
      key2:26,
      name: t("f_week_deposit_bonus")
    },
    {
      key: 'REGISTER_REWARD',
      key2:27,
      name: t("f_register_reward")
    },
    {
      key: 'APP_DOWNLOAD_REWARD',
      key2:28,
      name: t("f_app_download_reward")
    },
    {
      key: 'DAY_DEPOSIT_REBATE',
      key2:29,
      name: t("f_day_deposit_bonus")
    },
    
   
   
  ]
});

// 分页
const page = ref({
  total: 0,
  pageSize: 30,
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

const changeRecordType = (type: string) => {
  modelProps.value.type = type;
  getLogs();
};


const getLogs = async () => {
  const { pageSize, pageNum }: any = page.value;
  const {day, type}: any = modelProps.value
  let params: any = {
    day,
    type
  }
  let { code, data }: any = await statementApi({ pageSize, pageNum }, params);
  if (code == 200 && data.rows.length > 0) {
    const {total, rows} = data
    rows.forEach((item: any) => {
      // 大于11的为未知类型，归类其他
      // item.typeName = item.type >= 11 ?  modelProps.value.typeList[11].name:  modelProps.value.typeList[item.type].name
      //查看item.type是否在list中的key2中
      const typeItem = modelProps.value.typeList.find((item1: any) => item1.key2 == item.type)
      item.typeName = typeItem ? typeItem.name : t("f_unknown")
    })
    modelProps.value.logsList = rows
    page.value.total = total;
  } else {
    modelProps.value.logsList = []
  }
};


const getUseinfo = async () => {
  let { code, data }: any = await userInfoApi();
  const { rechargeAmount, withdrawAmount} = data.data
  if (code == 200) {
    useUserStoreHook().updatePlayerInfo("rechargeAmount", rechargeAmount);
    useUserStoreHook().updatePlayerInfo("withdrawAmount", withdrawAmount);
  }
};

onMounted(async () => {
  await getLogs();
  await getUseinfo()
});
</script>
<style lang="scss" scoped>
@import "./statement.scss";

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
  height: 32px;
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
    font-size: 12px;
    color: var(--primary-color);
  }
}
</style>
