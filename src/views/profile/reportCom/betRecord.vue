<template>
    <div 
        class="bg-[#f4faff]"
        style="
            height: calc(100vh - 50px);
            -webkit-overflow-scrolling: touch;
            transform: translateZ(0);
            overscroll-behavior: contain;
            overflow-y: scroll;
        "
    >
        <div class="bg-white flex px-3 pb-3 pt-1">
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

        <div class="mx-3 text-[12px] mt-3">{{ $t('total_history') }} {{ modelProps.logsList.length }}</div>
        <div class="pb-12">
          <div 
              v-for="(item, index) in modelProps.logsList" :key="index"
              class="bg-white mx-3 p-3 rounded-lg my-3"
          >
              <div class="flex justify-between items-center text-[12px]">
              <div class="text-[#338aef]">
                {{  item[Common.getParamsLang()] }}
              </div>
              <div>{{ item.platFormName }}</div>
              </div>
              <div class="h-[1px] bg-gray-200 my-2"></div>
              <div class="flex justify-between items-center">
              <div>
                  <div class="text-[14px]">投注了<span class="ml-1">{{ Common.toFixed2(item.bet ?? 0) }}</span></div>
                  <div class="text-[12px] text-gray-400 mt-2">{{ item.createTime }}</div>
              </div>
              <div class="text-right">
                  <div v-if="Number(item.win) > 0" class="font-bold text-red-500">+{{ Common.toFixed2(item.win ?? 0) }}</div>
                  <div v-else-if="Number(item.win)" class="font-bold text-green-600">-{{ Common.toFixed2(item.win ?? 0) }}</div>
                  <div v-else class="font-bold">{{ Common.toFixed2(item.win ?? 0) }}</div>
                  <div class="text-[12px] text-gray-400 mt-2">余额 <span class="ml-1">{{ Common.toFixed2(item.balance ?? 0) }}</span></div>
              </div>
              </div>
          </div>
        </div>
    </div>

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

<script lang="ts" setup>
import { playLogApi } from "@/api/records/index";
import { playedGame } from "@/api/game/index";
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

interface LogItem {
  platFormName?: string;
  gameName?: string;
  createTime?: string;
  bet?: string;
  win?: string;
  balance?: string;
  zh?: string;
  en?: string;
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

const page = ref<PageConfig>({ total: 0, pageSize: 30, pageNum: 1 });

// 分页参数类型
type ParamsType = {
  day: SearchTimeEnum;
  type: number | null;
  gameId: number | null;
};

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
    // {
    //   key: "14",
    //   name: "SSR"
    // },
    // {
    //   key: "15",
    //   name: "SPRIBE"
    // },
    {
      key: "100",
      name: "LTS"
    },
    {
      key: "101",
      name: "捕鱼"
    },
    {
      key: "102",
      name: "NG"
    },
    {
      key: "103",
      name: "腾龙视讯"
    }

  ],
  gameList: [
    {
      key: "null",
      name: t('record.all_games')
    }
  ]
});

const changeDateTime = (type: SearchTimeEnum) => {
  modelProps.value.day = type;
  getLogs();
};

const changePlatform = (type: string) => {
  if (!isNaN(Number(type))) {
    modelProps.value.type = Number(type);
    getLogs();
  }else{
    modelProps.value.type = null;
    getLogs();
  }
};

const changeGame = (roomId: string) => {
  modelProps.value.gameId = Number(roomId);
  getLogs();
};

const changePage = pageNum => {
  page.value.pageNum = pageNum;
  getLogs();
};

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
          15: "SPRIBE",
          100: "LTS",
          101: '捕鱼',
          102: 'NG',
          103: "腾龙视讯"
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