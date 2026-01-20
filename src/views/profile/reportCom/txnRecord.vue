<template>
    <div 
        class="bg-[#f4faff]"
        style="
            height: calc(100vh - 100px);
            -webkit-overflow-scrolling: touch;
            transform: translateZ(0);
            overscroll-behavior: contain;
            overflow-y: scroll;
        "
    >
        <div class="bg-white flex px-3 pb-3">
            <div class="select-box">
            <SelectBox @change="changeDateTime" listType="date"></SelectBox>
            </div>
            <div class="select-box ml-[10px]">
            <SelectBox @change="changeRecordType" listType="statementType" :listArr="modelProps.typeList"></SelectBox>
            </div>
        </div>

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
        <div class="mb-[150px]">
            <div 
                v-for="(item, index) in modelProps.logsList" :key="index"
                class="bg-white mx-3 p-3 rounded-lg mt-3"
            >
                <div class="flex justify-between items-center">
                    <div class="text-[12px]">
                      <div class="text-[#338aef]">{{ modelProps.typeList.find(t => t.key2 === item.type)?.name || item.type }}</div>
                      <div class="text-gray-400 mt-2">{{ item.createTime }}</div>
                    </div>
                    <div class="text-right">
                        <div v-if="Number(item.amount) > 0" class="font-bold text-red-500">+{{ Common.toFixed2(item.amount) }}</div>
                        <div v-else-if="Number(item.amount)" class="font-bold text-green-600">{{ Common.toFixed2(item.amount) }}</div>
                        <div v-else class="font-bold">{{ Common.toFixed2(item.amount) }}</div>
                        <div class="text-[12px] text-gray-400 mt-2">{{ $t('106000') }}: <span class="ml-1">{{ Number(item.afterAmount) }}</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="pagination-box">
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
        <van-icon @click="changePage(Math.ceil(page.total / page.pageSize))" name="arrow-double-right"
            class="pagination-last" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { statementApi } from "@/api/records/index";
import { userInfoApi } from "@/api/user";
import { useUserStoreHook } from "@/store/modules/user";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { SearchTimeEnum } from "@/api/agent";
import SelectBox from "@/components/SelectBox/index.vue";
import Common from "@/utils/common/common";

const { t } = useI18n();
const playerInfo = computed(() => {
  return useUserStoreHook().playerInfo;
});
const page = ref({
  total: 0,
  pageSize: 30,
  pageNum: 1
});

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
    {
      key: 'TRANSFER_OUT',
      key2:30,
      name: t("transfer_out")
    },
    {
      key: 'TRANSFER_IN',
      key2:31,
      name: t("transfer_in")
    },
    {
      key: 'AGENT_UP_SCORE',
      key2:32,
      name: t("agent_up_score")
    },
    {
      key: 'AGENT_DOWN_SCORE',
      key2:33,
      name: t("agent_down_score")
    },
    {
      key: 'GIVE_USER_UP_SCORE',
      key2:34,
      name: t("give_user_up_score")
    },
    {
      key: 'GIVE_USER_DOWN_SCORE',
      key2:35,
      name: t("give_user_down_score")
    },
    {
      key: 'SYSTEM_AUTO_SETTLE_COMMISSION',
      key2:36,
      name: t("system_auto_settle_commission")
    },
    {
      key: 'VIP_UPGRADE_REWARD',
      key2:37,
      name: t("vip_upgrade_reward")
    },
  ]
});

const changeDateTime = (type: SearchTimeEnum) => {
  modelProps.value.day = type;
  getLogs();
};

const changeRecordType = (type: string) => {
  modelProps.value.type = type;
  getLogs();
};


const changePage = pageNum => {
  page.value.pageNum = pageNum;
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
  await getUseinfo();
  await getLogs();
});
</script>

<style scoped lang="scss">
// @import "./report.scss";

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0; 
    margin: 0 auto;
    max-width: 499px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    background: white;
    z-index: 1000;

    .pagination-box {
      position: relative;

      $cancel-bg:transparent;
      $submit-bg:transparent;
      --pa-width: 25px;
      --pa-height: 25px;
      --pa-font-size: 12px;
      --pa-space: 10px;

      .pagination-first,
      .pagination-last {
        position: absolute;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--pa-width);
        height: var(--pa-height);
        font-size: var(--pa-font-size);
        color: var(--primary-color);
        border-radius: 50%;
        background: $cancel-bg;
        background-size: 100% 100%;
        cursor: pointer;
      }

      .pagination-first {
        left: calc(-1 * (var(--pa-width) + var(--pa-space)));
      }

      .pagination-last {
        right: calc(-1 * (var(--pa-width) + var(--pa-space)));
      }

      --van-pagination-item-width: var(--pa-width);
      --van-pagination-height: var(--pa-height);
      --van-pagination-font-size: var(--pa-font-size);
      --van-pagination-disabled-opacity: 1;

      :deep(.van-pagination__item) {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--primary-color);
        background: $cancel-bg;
        background-size: 100% 100%;
        border-radius: 50%;
        font-size: 14px;
        font-weight: 600;
        &:not(:last-child) {
          margin-right: var(--pa-space);
        }
      }

      :deep(.van-pagination__item--active) {
        color: var(--primary-color);
        background: $submit-bg;
        background-size: 100% 100%;
      }

      :deep(.van-pagination__item--prev),
      :deep(.van-pagination__item--next) {
        color: var(--primary-color);
      }

      :deep(.van-hairline--surround):after {
        border-width: 0;
      }
    }
}
</style>