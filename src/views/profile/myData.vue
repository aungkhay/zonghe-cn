<template>
    <div class="bg-[#f4faff] p-3 text-[#535353] overflow-y-auto" style="height: calc(100vh - 50px); -webkit-overflow-scrolling: touch;">
        <div ref="tabsContainer" class="bg-[#ddedfa] flex items-center overflow-x-auto space-x-2 rounded-2xl">
            <div 
                v-for="(item, index) in searchList" 
                :key="index" 
                :ref="el => tabRefs[index] = el"
                @click="changeTab(item, index)" 
                class="flex-shrink-0 cursor-pointer"
            >
                <div 
                    class="text-[11px] px-5 whitespace-nowrap" 
                    :class="active == index ? 'bg-[#3e83ea] text-white py-1 rounded-2xl' : ''"
                >{{ item.name }}</div>
            </div>
        </div>

        <div class="bg-white p-2 rounded-lg mt-3">
            <div class="flex items-end justify-between">
                <div>{{ $t('myData.direct_data') }}</div>
                <!-- <div class="text-[10px]">更新时间</div> -->
            </div>
            <div class="h-[1px] bg-gray-100 my-2"></div>
            <div class="grid grid-cols-3 grid-rows-3 relative">
                <div
                    v-for="(item, index) in keyData"
                    :key="index"
                    class="text-center relative py-3"
                    :class="index < 6 ? 'border-b border-gray-100' : ''"
                >
                    <div class="text-[14px]">{{ $t(`myData.${item.key}`) }}</div>
                    <div class="text-[#069ce7] font-semibold" :class="[
                        item.key == 'winAmount' && directInfo[item.key] > 0 ?  'text-red-500' : '',
                        item.key == 'winAmount' && directInfo[item.key] < 0 ?  'text-green-500' : ''
                    ]"><span v-if="item.key == 'winAmount' && directInfo[item.key] > 0">+</span>{{ directInfo[item.key] }}</div>

                    <!-- 🔹 Vertical border for middle column -->
                    <div
                        v-if="index % 3 === 1"
                        class="absolute top-1/4 bottom-1/4 left-0 w-[1px] bg-gray-100"
                    ></div>
                    <div
                        v-if="index % 3 === 1"
                        class="absolute top-1/4 bottom-1/4 right-0 w-[1px] bg-gray-100"
                    ></div>
                </div>
            </div>
        </div>

        <div class="bg-white p-2 rounded-lg mt-3">
            <div class="flex items-end justify-between">
                <div>{{ $t('myData.team_data') }}</div>
                <!-- <div class="text-[10px]">更新时间</div> -->
            </div>
            <div class="h-[1px] bg-gray-100 my-2"></div>
            <div class="grid grid-cols-3 grid-rows-3 relative">
                <div
                    v-for="(item, index) in keyData"
                    :key="index"
                    class="text-center relative py-3"
                    :class="index < 6 ? 'border-b border-gray-100' : ''"
                >
                    <div class="text-[14px]">{{ $t(`myData.${item.key}`) }}</div>
                    <div class="text-[#069ce7] font-semibold" :class="[
                        item.key == 'winAmount' && teamInfo[item.key] > 0 ?  'text-red-500' : '',
                        item.key == 'winAmount' && teamInfo[item.key] < 0 ?  'text-green-500' : ''
                    ]"><span v-if="item.key == 'winAmount' && teamInfo[item.key] > 0">+</span>{{ teamInfo[item.key] }}</div>

                    <!-- 🔹 Vertical border for middle column -->
                    <div
                        v-if="index % 3 === 1"
                        class="absolute top-1/4 bottom-1/4 left-0 w-[1px] bg-gray-100"
                    ></div>
                    <div
                        v-if="index % 3 === 1"
                        class="absolute top-1/4 bottom-1/4 right-0 w-[1px] bg-gray-100"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { SearchTimeEnum } from '@/api/agent';
import { myData } from '@/api/user';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const tabRefs = ref([]);
const tabsContainer = ref(null);

const active = ref(1);
const searchList = [
    {
        key: SearchTimeEnum.ALL,
        name: t("f_filter_all")
    },
    {
        key: SearchTimeEnum.TODAY,
        name: t("107018")
    },
    {
        key: SearchTimeEnum.YESTERDAY,
        name: t("107019")
    },

    {
        key: SearchTimeEnum.WEEK,
        name: t("107020")
    },
    {
        key: SearchTimeEnum.LAST_WEEK,
        name: t("107021")
    },
    {
        key: SearchTimeEnum.MONTH,
        name: t("f_filter_this_month")
    },
    {
        key: SearchTimeEnum.LAST_MONTH,
        name: t("f_filter_last_month")
    }
];

const keyData = ref([
    { key: 'totalMembers' },
    { key: 'newMembers' },
    { key: 'firstDepositMembers' },
    { key: 'depositAmount' },
    { key: 'withdrawAmount' },
    { key: 'firstDepositAmount' },
    { key: 'validBetAmount' },
    { key: 'rebateAmount' },
    { key: 'winAmount' },
]);

const directInfo = ref({
    totalMembers: 0,
    newMembers: 0,
    firstDepositMembers: 0,
    depositAmount: 0,
    withdrawAmount: 0,
    validBetAmount: 0,
    rebateAmount: 0,
    firstDepositAmount: 0,
    winAmount: 0
});

const teamInfo = ref({
    totalMembers: 0,
    newMembers: 0,
    firstDepositMembers: 0,
    depositAmount: 0,
    withdrawAmount: 0,
    validBetAmount: 0,
    rebateAmount: 0,
    firstDepositAmount: 0,
    winAmount: 0
});

type MyDataResponse = {
    code: number;
    data?: {
        data: {
            directInfo?: typeof directInfo.value;
            teamInfo?: typeof teamInfo.value;
        }
    };
};

const changeTab = async (item: { key: any; }, index: number) => {
    active.value = index;
    getInfo();
}

watch(active, (newIndex) => {
  const el = tabRefs.value[newIndex];
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }
});

const getInfo = async () => {
    const item = searchList[active.value];
    let params = {
        day: item.key
    }

    const { code, data } = await myData(params) as MyDataResponse;
    if(code == 200 && data) {
        directInfo.value = {
            totalMembers: Number(data.data.directInfo.totalMembers),
            newMembers: Number(data.data.directInfo.newMembers),
            firstDepositMembers: Number(data.data.directInfo.firstDepositMembers),
            depositAmount: Number(data.data.directInfo.depositAmount),
            withdrawAmount: Number(data.data.directInfo.withdrawAmount),
            validBetAmount: Number(data.data.directInfo.validBetAmount),
            rebateAmount: Number(data.data.directInfo.rebateAmount),
            firstDepositAmount: Number(data.data.directInfo.firstDepositAmount),
            winAmount: Number(data.data.directInfo.winAmount),
        };
        teamInfo.value = {
            totalMembers: Number(data.data.teamInfo.totalMembers),
            newMembers: Number(data.data.teamInfo.newMembers),
            firstDepositMembers: Number(data.data.teamInfo.firstDepositMembers),
            depositAmount: Number(data.data.teamInfo.depositAmount),
            withdrawAmount: Number(data.data.teamInfo.withdrawAmount),
            validBetAmount: Number(data.data.teamInfo.validBetAmount),
            rebateAmount: Number(data.data.teamInfo.rebateAmount),
            firstDepositAmount: Number(data.data.teamInfo.firstDepositAmount),
            winAmount: Number(data.data.teamInfo.winAmount),
        };
    }
}

onMounted(() => {
    getInfo();
})
</script>

<style scoped lang="scss">
.custom-tabs .van-tabs__wrap {
  background-color: #ddedfa !important;
}
</style>