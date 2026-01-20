<template>
    <div class="bg-[#f4faff] p-3" style="height: calc(100vh - 50px); overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <div id="bannerContainer" class="rounded-lg text-white bg-[#5f616c]">
            <div class="flex items-start justify-between px-4 py-2 bg-gray-100/20 rounded-lg">
                <div class="text-center space-y-2">
                    <div class="text-[12px]">{{ $t('vip.current_level') }}</div>
                    <div class="relative h-11">
                        <div><img :src="`${$imgBasePath}/profile/crown.png`" class="h-9"></div>
                        <div class="absolute bottom-0 font-semibold w-full text-yellow-300 text-[14px]">VIP{{ playerInfo.vipLevel }}</div>
                    </div>
                </div>
                <div class="text-right space-y-2">
                    <div class="text-[12px]">{{ $t('vip.next_level') }} <span class="text-yellow-300">VIP{{ playerInfo.vipLevel + 1 }}</span></div>
                    <div class="text-xl font-semibold">{{ getNextLevelRecharge(playerInfo.vipLevel) }}</div>
                </div>
            </div>
            <div class="flex items-center justify-between text-[11px] px-3 py-2">
                <div>{{ $t('profile.account') }}: <span class="uppercase">{{ playerInfo.userName }}</span></div>
                <div class="flex items-center space-x-3">
                    <div class="bg-[#457acb] px-2 py-1 rounded-lg cursor-pointer" @click="onCollect()">{{ $t("104002") }}</div>
                    <div class="bg-[#99b98d] px-2 py-1 rounded-lg cursor-pointer" @click="toHistory()">{{ $t("104006") }}</div>
                </div>
            </div>
        </div>

        <div class="mt-5 bg-white py-2 px-3 rounded-lg text-[#646464]">
            <div class="flex items-center justify-between">
                <div>{{ $t('vip.current_level') }}</div>
                <!-- <div class="text-[11px]">更新时间</div> -->
            </div>
            <div class="h-[1px] bg-gray-100 my-2"></div>
            <div class="flex items-center justify-around text-center">
                <div class="space-y-2 text-[14px]">
                    <div>{{ $t('vip.accumulated_bet') }}</div>
                    <div class="text-[#3db4ee] font-bold">{{ modelProps.curBetNum }}</div>
                </div>
                <div class="space-y-2 text-[14px]">
                    <div>{{ $t('vip.current_level') }}</div>
                    <div class="text-yellow-300 font-semibold">VIP{{ playerInfo.vipLevel }}</div>
                </div>
                <div class="space-y-2 text-[14px]">
                    <div>{{ $t('vip.upgrade_need') }}</div>
                    <div class="text-[#3db4ee] font-bold">{{ Number(Number(modelProps.nextRechargeNum) - Number(modelProps.curBetNum)).toFixed(1) }}</div>
                </div>
            </div>
            <div class="bg-[#ddedfa] flex items-center justify-between rounded-xl my-3">
                <div 
                    v-for="(tab, index) in tabs" :key="index" 
                    @click="switchTab(index)"
                    class="px-5 py-1 rounded-xl text-[12px] cursor-pointer"
                    :class="activeTab == index ? 'bg-[#3e83ea] text-white' : ''"
                >
                    {{ tab.title }}
                </div>
            </div>

            <!-- List -->
            <div v-if="activeTab == 0">
                <div class="grid grid-cols-4 text-[12px] mt-4 text-center font-semibold py-1">
                    <div>{{ $t("104010") }}</div>
                    <div>{{ $t('vip.promotion_recharge') }}</div>
                    <div>{{ $t("104011") }}</div>
                    <div>{{ $t("104012") }}</div>
                </div>
                <div
                    v-for="(item, index) in modelProps.vipConfigList"
                    :key="index"
                    class="grid grid-cols-4 text-[12px] py-2 text-center"
                    :class="index % 2 === 0 ? 'bg-[#ddedfa]' : ''"
                >
                    <div>VIP{{ item.vipLevel }}</div>
                    <div>{{ Number(item.upNeedRecharge) }}</div>
                    <div>{{ Number(item.upNeedBet) }}</div>
                    <div>{{ item.upReward }}</div>
                </div>
            </div>
            <div v-if="activeTab == 1">
                <div class="grid grid-cols-2 text-[12px] mt-4 text-center font-semibold py-1">
                    <div>{{ $t("104010") }}</div>
                    <div>{{ $t("104014") }}</div>
                </div>
                <div
                    v-for="(item, index) in modelProps.vipConfigList"
                    :key="index"
                    class="grid grid-cols-2 text-[12px] py-2 text-center"
                    :class="index % 2 === 0 ? 'bg-[#ddedfa]' : ''"
                >
                    <div>VIP{{ item.vipLevel }}</div>
                    <div>{{ Number(item.weekReward || 0) }}</div>
                </div>
            </div>
            <div v-if="activeTab == 2">
                <div class="grid grid-cols-2 text-[12px] mt-4 text-center font-semibold py-1">
                    <div>{{ $t("104010") }}</div>
                    <div>{{ $t("104015") }}</div>
                </div>
                <div
                    v-for="(item, index) in modelProps.vipConfigList"
                    :key="index"
                    class="grid grid-cols-2 text-[12px] py-2 text-center"
                    :class="index % 2 === 0 ? 'bg-[#ddedfa]' : ''"
                >
                    <div>VIP{{ item.vipLevel }}</div>
                    <div>{{ Number(item.monthReward || 0) }}</div>
                </div>
            </div>

        </div>

        <div class="my-5 text-[#646464]">
            <div class="text-red-500 text-[12px] mb-2">{{ $t("104008") }}</div>
            <div class="text-[10px]">{{ $t("104007") }}</div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { vipDrawApi, vipInfoApi, vipListApi } from '@/api/vip';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Common from "@/utils/common/common";
import { useUserStoreHook } from '@/store/modules/user';
import router from '@/router';
import { showTipModel } from '@/components/TipModel';

const { t } = useI18n();

const activeTab = ref(0);
const tabs = ref([
  { title: t('104021'), key: 'level-up' },
  { title: t('104016'), key: 'weekly' },
  { title: t('104017'), key: 'monthly' },
]);
const rewardGold = ref(0);

let modelProps = ref({
  vipConfigList: [],
  vipText: '',
  curRechargeNum: 0,  //当前领取
  nextRechargeNum: 0, //下一级
  maxRechargeNum: 0,  //最大领取
  betProgress: 0,  // 提现进度
  rechargeProgress: 0,  //充值进度
  curBetNum: '0',
  nextBetNum: '0',
  DailyRewardStatus: false, //是否有可领取奖励
  // DayRewardNumText: ''
});

const playerInfo = computed(() => {
  return useUserStoreHook().playerInfo;
});


const switchTab = (index) => {
  activeTab.value = index;
};

const toHistory = () => {
  router.push("/vipPlus/history");
};

const getNextLevelRecharge = (level) :any => {
    try {
        const vip = modelProps.value.vipConfigList.find(v => v.vipLevel == level + 1);
        return vip.vipAccRecharge;
    } catch (error) {
        return 0;
    }
}

const onCollect = Common.debounce(async () => {

  const reward= rewardGold.value;

  if (!modelProps.value.DailyRewardStatus) return;
  let { code, data }: any = await vipDrawApi();
  if (code === 200) {
    showTipModel({
        type: 4,
        title: t("receive_success", [Common.formatNum(data.data.canReceiveTotal || reward) || 0]),
        icon: "success",
        success: () => {
            getVipInfo();
        }
    });
    updateInfo(data);
  }
}, 500);

const getvipConfig = async () => {
  let { code, data }: any = await vipListApi();
  if (code == 200) {
    data.data.sort((a, b) => a.vipLevel - b.vipLevel);
    data.data.map((item) => {
      item.vipAccRecharge = Common.formatStringToNumber(item.upNeedBet);
    })

    modelProps.value.nextRechargeNum = data.data[playerInfo.value.vipLevel + 1 >= data.data.length ? data.data.length : playerInfo.value.vipLevel + 1].vipAccRecharge;
    modelProps.value.rechargeProgress = (Number(playerInfo.value.rechargeAmount) / data.data[playerInfo.value.vipLevel + 1 >= data.data.length ? data.data.length : playerInfo.value.vipLevel + 1].vipAccRecharge) * 100
    modelProps.value.vipConfigList = data.data;
  }
}

const updateInfo = (data)=>{
  const { vipLevel, rewardBet, currentBet } = data.data
  const canGet = data.data.canReceiveTotal > 0;
    rewardGold.value = data.data.canReceiveTotal || 0;
    // modelProps.value.DayRewardNumText = t('107043', [Common.toFixed2(dayReward)])
    modelProps.value.DailyRewardStatus = canGet
    // 打码量
    if (vipLevel == 0) {
      if (currentBet !== undefined && currentBet !== null) {
        modelProps.value.curBetNum = currentBet // 当前打码
      }
      if (rewardBet !== undefined && rewardBet !== null) {
        modelProps.value.nextBetNum = rewardBet  //下级打码
      }
      modelProps.value.betProgress = 100
    } else {
      modelProps.value.curBetNum = currentBet // 当前打码
      modelProps.value.nextBetNum = rewardBet  //下级打码
      let Progress: any = (Number(currentBet) / Number(rewardBet)) * 100
      if (Number(currentBet) > Number(rewardBet)) {
        modelProps.value.betProgress = 100
      } else {
        modelProps.value.betProgress = Progress
      }
    }
}

const getVipInfo = async () => {
  let { code, data }: any = await vipInfoApi();
  if (code == 200) {
    updateInfo(data);
  }
};

onMounted(async () => {
  await getVipInfo();
  await getvipConfig();
});
</script>

<style scoped lang="scss">
#bannerContainer {
    background: url("#{$img-base-path}/profile/vip-bg.png") no-repeat center;
    background-size: cover;
    background-position: center;
}
</style>