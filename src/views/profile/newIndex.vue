<template>
    <div class="bg-[#f4faff] text-[#505050] pb-[80px] h-screen overflow-y-auto">
        <div class="flex justify-between items-center p-3">
            <div class="flex">
                <div><img :src="`${imgBasePath}/newInfo/avatar_default.webpg`" class="w-[70px] h-[70px] rounded-full object-cover" /></div>
                <div class="pl-3 flex flex-col justify-between py-3">
                    <div class="font-semibold text-[15px] text-[#2b2b2b]">{{ $t('profile.account') }}: {{ playerInfo.userName.toUpperCase() }}</div>
                    <div class="flex items-center space-x-1 text-[#999999] font-semibold text-[15px]">
                        <span>ID:{{ playerInfo.userId }}</span>
                        <span @click="copyId">
                            <svg-icon class="text-[16px] text-[var(--primary-color)]" name="copy" />
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex">
                <div @click="goToSettings" class="flex flex-col items-center">
                    <img :src="`${imgBasePath}/profile/setting.png`" class="h-[25px]">
                    <div class="text-sm">{{ $t('profile.setting') }}</div>
                </div>
                <!-- <div @click="handelChangeLang" class="flex flex-col items-center">
                    <img :src="`${imgBasePath}/profile/language.png`" class="h-[25px]">
                    <div class="text-sm">{{ $t('profile.language') }}</div>
                </div> -->
            </div>
        </div>

        <div class="m-3 p-3 bg-white rounded-lg">
            <div class="font-semibold text-black">{{ $t('profile.my_wallet') }}</div>
            <div class="h-[1px] my-2 bg-gray-100"></div>
            <div class="flex justify-between items-center">
                <div>
                    <div class="flex space-x-3 items-center">
                        <div class="font-bold text-[20px] text-black">
                            {{ showHideMoney ? Number(playerInfo.amount).toFixed(2) : "****" }}
                        </div>
                        <div @click="toggleShowHideMoney">
                            <img v-if="showHideMoney" :src="`${imgBasePath}/profile/eye-open.png`" class="h-[14px]">
                            <img v-else :src="`${imgBasePath}/profile/eye-close.png`" class="h-[16px]">
                        </div>
                    </div>
                    <div class="text-[12px] mt-3">{{ $t('profile.current_level') }} <span class="text-orange-500">VIP{{ playerInfo.vipLevel}}</span></div>
                </div>
                <div class="flex space-x-5">
                    <div @click="handleDeposit" class="flex flex-col items-center">
                        <img :src="`${imgBasePath}/profile/deposit.png`" class="h-[25px]">
                        <div class="text-sm mt-1">{{ $t('profile.deposit') }}</div>
                    </div>
                    <div @click="handleWithdraw"  class="flex flex-col items-center">
                        <img :src="`${imgBasePath}/profile/withdrawal.png`" class="h-[25px]">
                        <div class="text-sm mt-1">{{ $t('profile.withdraw') }}</div>
                    </div>
                </div>
            </div>
            <div class="mt-1 relative" @click="goToVIP()">
                <div class="bg-[#738a9d] h-5 rounded-md"></div>
                <div 
                    class="bg-[#fec455] h-5 rounded-md absolute top-0"
                    :style="{ width: betProgressPercent + '%' }"
                ></div>
                <div class="flex justify-between items-center w-full h-4 px-2 text-[10px] text-white absolute top-0">
                    <div class="text-[12px] mt-[4px]">{{ $t('profile.up_level', {level: playerInfo.vipLevel+1}) }}</div>
                    <div class="text-[12px] mt-[4px]" v-if="modelProps.curBetNum >= modelProps.nextBetNum">{{betProgressPercent}}%</div>
                    <div class="text-[12px] mt-[4px]" v-else>{{modelProps.curBetNum}}/{{modelProps.nextBetNum}}</div>
                </div>
            </div>

            <div class="mt-1 relative" @click="goToVIP()">
                <div class="bg-[#738a9d] h-5 rounded-md"></div>
                <div 
                    class="bg-[#fec455] h-5 rounded-md absolute top-0"
                    :style="{ width: rechargeProgressPercent + '%' }"
                ></div>
                <div class="flex justify-between items-center w-full h-4 px-2 text-[10px] text-white absolute top-0">
                    <div class="text-[12px] mt-[4px]">{{ $t('profile.up_recharge', {level: playerInfo.vipLevel+1}) }}</div>
                    <div class="text-[12px] mt-[4px]" v-if="modelProps.curRechargeNum >= modelProps.nextRechargeNum">{{rechargeProgressPercent}}%</div>
                    <div class="text-[12px] mt-[4px]" v-else>{{ modelProps.curRechargeNum }}/{{modelProps.nextRechargeNum}}</div>
                </div>
            </div>
        </div>

        <div class="mx-3 bg-white pb-3 rounded-b-md">
            <div>
                <img :src="`${imgBasePath}/profile/banner.png`" class="w-full">
            </div>
            <div>
                <div class="my-3 px-3 font-semibold">{{ $t('profile.common_action') }}</div>
                <div class="grid grid-cols-4 grid-rows-2 gap-4">
                    <div v-for="(btn,index) in actionButtons" :key="index" class="flex flex-col items-center" @click="handleAction(btn)">
                        <div class="relative">
                            <div><img :src="btn.icon" class="h-8"></div>
                            <div 
                                v-if="btn.mark == 'noti_center' && noticeCount > 0" 
                                class="bg-red-600 p-1 min-w-[20px] rounded-full text-white text-[8px] text-center absolute top-[-10px] right-[-10px]"
                            >
                                {{ noticeCount > 99 ? '99+' : noticeCount }}
                            </div>
                        </div>
                        <div class="text-[10.5px] mt-2 text-center">{{ $t(btn.name) }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mx-3 bg-white p-4 rounded-md mt-3">
            <div class="flex items-center space-x-2" @click="goToAboutUs()">
                <div>
                    <img :src="`${imgBasePath}/profile/about.png`" class="h-[17px]">
                </div>
                <div class="font-semibold text-[14px]">{{ $t('profile.about_us') }}</div>
            </div>
            <div v-if="!isWebViewEnv && !isWebClipEnv">
                <div class="h-[1px] my-3 bg-gray-100"></div>
                <div class="flex items-center space-x-2" @click="downloadApp()">
                    <div>
                        <img :src="`${imgBasePath}/profile/download.png`" class="h-[17px]">
                    </div>
                    <div class="font-semibold text-[14px]">{{ $t('profile.download') }}</div>
                </div>
            </div>
            <div class="h-[1px] my-3 bg-gray-100"></div>
            <div class="flex items-center space-x-2" @click="logout">
                <div>
                    <img :src="`${imgBasePath}/profile/logout.png`" class="h-[17px]">
                </div>
                <div class="font-semibold text-[14px]">{{ $t('profile.logout') }}</div>
            </div>
        </div>

        <NewRecharge  v-model:show="showRecharge" />
        <ChangeLang ref="changeLang"></ChangeLang>
    </div>
</template>

<script setup lang="ts">
import { useUserStoreHook } from '@/store/modules/user';
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import Common from "@/utils/common/common";
import { vipInfoApi } from '@/api/vip';
import { getNotificationCount, logoutApi, userInfoApi } from '@/api/user';
import { showTipModel } from "@/components/TipModel/index.js";
import { useI18n } from "vue-i18n";
import router from '@/router';
import NewRecharge from '@/views/deposit/newIndex.vue';
import ChangeLang from "@/components/ChangeLang/index.vue";

const { t } = useI18n();

const { proxy } = getCurrentInstance();
const imgBasePath = proxy.$imgBasePath;
const refreshing = ref(false);
const showRecharge = ref(false);
const changeLang = ref();
const noticeCount = ref(0);
const isWebViewEnv = ref(false);
const isWebClipEnv = ref(false);

const showHideMoney = ref(localStorage.getItem("showHideMoney") === null
    ? true
    : localStorage.getItem("showHideMoney") === "true");

let modelProps = ref({
  refresh: false,
  curRechargeNum: "0",
  nextRechargeNum: "0",
  rechargeProgress: 0,
  curBetNum: "0",
  nextBetNum: "0",
  betProgress: 0,
  playerIdText: ""
});

const actionButtons = [
    { key: '1', name: 'profile.info_center', mark: 'noti_center', icon: `${imgBasePath}/profile/noti_center.png` },
    { key: '2', name: 'profile.account_management', mark: 'acc_manage', icon: `${imgBasePath}/profile/account-management.png` },
    { key: '3', name: 'profile.invite_friend', mark: 'invite_friend', icon: `${imgBasePath}/profile/invite-friend.png` },
    { key: '4', name: 'profile.my_report', mark: 'my_report', icon: `${imgBasePath}/profile/my-report.png` },
    { key: '5', name: 'profile.record', mark: 'record', icon: `${imgBasePath}/profile/record.png` },
    { key: '6', name: 'profile.bet_record', mark: 'bet_record', icon: `${imgBasePath}/profile/transaction-record.png` },
    { key: '7', name: 'profile.my_data', mark: 'my_data', icon: `${imgBasePath}/profile/agent-management.png` },
    { key: '8', name: 'VIP', mark: 'vip', icon: `${imgBasePath}/profile/vip.png` },
];

const playerInfo = computed(() => {
  return useUserStoreHook().playerInfo;
});

const handelChangeLang = () => {
  changeLang.value.show();
};

const toggleShowHideMoney = () => {
    showHideMoney.value = !showHideMoney.value;
    localStorage.setItem('showHideMoney', String(showHideMoney.value))
};

const goToSettings = () => {
    router.push('/settings');
}

const betProgressPercent = computed(() => {
    const percent = (Number(modelProps.value.curBetNum) / Number(modelProps.value.nextBetNum)) * 100;
    return Math.min(Math.round(percent), 100);
});

const rechargeProgressPercent = computed(() => {
    const percent = (Number(modelProps.value.curRechargeNum) / Number(modelProps.value.nextRechargeNum)) * 100;
    return Math.min(Math.round(percent), 100);
});

const getVipInfo = async () => {
  let { code, data } = await vipInfoApi();
  if (code == 200) {
    // console.log('vipInfoApi', data.data);
    const { vipLevel, rewardBet, currentBet, rewardRecharge } = data.data;
    useUserStoreHook().updatePlayerInfo("vipLevel", vipLevel);

    // Bet
    modelProps.value.curBetNum = Common.toFixed2(currentBet || '0'); // 当前打码
    modelProps.value.nextBetNum = Common.toFixed2(rewardBet || '0'); //下级打码
    // let Progress: any = (Number(currentBet || 0) / Number(rewardBet || 0)) * 100;
    // if (Number(currentBet || 0) > Number(rewardBet || 0)) {
    //     modelProps.value.betProgress = 100;
    // } else {
    //     modelProps.value.betProgress = Progress;
    // }

    // Recharge
    modelProps.value.curRechargeNum = Common.toFixed2(playerInfo.value.rechargeAmount || '0'); // 当前打码
    modelProps.value.nextRechargeNum = Common.toFixed2(rewardRecharge || '0'); //下级打码
    // let RechargeProgress: any = (Number(playerInfo.value.rechargeAmount || 0) / Number(rewardRecharge || 0)) * 100;
    // if (Number(currentBet || 0) > Number(rewardRecharge || 0)) {
    //     modelProps.value.rechargeProgress = 100;
    // } else {
    //     modelProps.value.rechargeProgress = RechargeProgress;
    // }
    // console.log('getVipInfo', modelProps.value);
  }
};

// 刷新资金
const refreshBlance = async () => {
    if (useUserStoreHook().isLogin !== true) {
        return false;
    }
    if (refreshing.value == true) {
        return false;
    }

    refreshing.value = true;
    let { code, data }: any = await userInfoApi();
    if (code == 200) {
        if (data.data) useUserStoreHook().changePlayerInfo(data.data || {})
    }

    setTimeout(function () {
        refreshing.value = false;
    }, 3000);
};

const handleWithdraw = () => {
    router.push('withdraw2');
}

const handleDeposit = () => {
    // showRecharge.value = true;
    router.push('/deposit');
}

const goToVIP = () => {
    router.push('/vipPlus');
}

const copyId = () => {
    navigator.clipboard.writeText(playerInfo.value.userId)
        .then(() => {
            // 显示复制成功提示
            if (typeof showTipModel === 'function') {
                showTipModel({
                    type: 1,
                    icon: "success",
                    title: t("id_copied")
                });
            }
        })
        .catch(err => {
            console.error('复制失败:', err);
        });
};

const handleAction = (action) => {
    switch (action.mark) {
        case 'noti_center':
            router.push('/noti-center');
            break;
        case 'acc_manage':
            router.push('/manage-acc');
            break;
        case 'invite_friend':
            router.push('/my-invite-link');
            break;
        case 'my_report':
            router.push('/my-report');
            break;
        case 'record':
            router.push('/txn-record');
            break;
        case 'bet_record':
            router.push('/bet-record');
            break;
        case 'my_data':
            router.push('/my-data');
            break;
        case 'vip':
            router.push('/vipPlus')
            break;
    
        default:
            break;
    }
}

const goToAboutUs = () => {
    router.push('/about-us');
}

const logout = () => {
  showTipModel({
    type: 2,
    title: t("106009"),
    subTitle: t("106016"),
    cancelBtnText: t("106015"),
    success: function () {
      confirmLogout();
    },
    cancel: function () { }
  });
};

function isWebView() {
    return navigator.userAgent.includes("HJWebView");
}

function isWebClip() {
    return (window.navigator as any)?.standalone === true;
}

const isIOS = () => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

const downloadApp = () => {
    if (isIOS()) {
        downloadIOS();
    } else if (isAndroid()) {
        downloadANROID();
    }
}

const downloadIOS = () => {
    const link = document.createElement('a');
    link.href = 'https://app.hjgju8.com/uploads/dl-hj.mobileconfig';
    link.download = 'huangjia.mobileconfig';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);  
}

const downloadANROID = () => {
    const link = document.createElement('a');
    link.href = 'https://app.hjgju8.com/uploads/dl-hj.apk';
    link.download = 'huangjia.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);  
}

const confirmLogout = async () => {
  let { code }: any = await logoutApi();
  if (code == 200) {
    useUserStoreHook().outLogin();
    useUserStoreHook().isExiting = true;
  } else {
    showTipModel({
      type: 1,
      title: t(code),
      icon: "fail"
    });
  }
};

const getNotiCount = async () => {
    const {code, data} = await getNotificationCount();
    if(code == 200) {
        noticeCount.value = Number(data.data) || 0;
    }
}

onMounted(async () => {
    isWebViewEnv.value = isWebView();
    isWebClipEnv.value = isWebClip();
    await refreshBlance();
    await getVipInfo();
    await getNotiCount();
})
</script>