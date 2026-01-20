<template>
    <div class="new-bg">
        <div class="main-box">
            <div class="header-button-rect">
                <!-- <div v-scaleTap class="header-button-rect-item" @click="handleService">
                    <img :src="`${imgBasePath}/newInfo/icon_service.png`" class="w-[20px] h-[20px]" ></img>
                </div>
                <div v-scaleTap class="header-button-rect-item" @click="handleMessage">
                    <img :src="`${imgBasePath}/newInfo/icon_message.png`" class="w-[20px] h-[20px]" ></img>
                </div> -->
                <!-- <div class="header-button-rect-item" @click="handleUser">
                    <img :src="`${imgBasePath}/newInfo/icon_user.png`" class="w-[20px] h-[20px]" ></img>
                </div> -->
            </div>

            <div class="flex mt-[13px] items-center">
                <div class="ml-[12px]">
                    <img :src="`${imgBasePath}/newInfo/avatar_default.webpg`" class="w-[45px] h-[45px] rounded-full object-cover" />
                </div>
                <div class="ml-[10px]">
                    <div class="user-info-text">
                        <span>{{ $t("106002") }}:</span>
                        <span class="ml-[4px]">{{ playerInfo.userName }}</span>
                    </div>
                    <div class="user-info-text items-center mt-[2px]">
                        <span>ID:</span>
                        <span class="ml-[4px]">{{ playerInfo.userId }}</span>
                         <svg-icon v-scaleTap class="text-[13px] text-[var(--text-white)] ml-3" name="copy" @click="copyText(playerInfo.userId)"/>
                         <span style="display:inline-block;width:1px;height:14px;background:#E5E5E5;margin:0 15px;vertical-align:middle;"></span>
                         <svg-icon class="text-[17px] text-[#e60012]" name="cny"/>
                         <span class="ml-[4px]">{{ Number(playerInfo.amount).toFixed(2) }}</span>
                         <svg-icon class="text-[13px] text-[var(--text-white)] ml-3" name="refresh" :class="{ rotate: refreshing }"  @click="refreshBlance()"/>
                    </div>
                </div>
            </div>


            <div class="flex justify-between ml-[48px] mr-[48px] mt-[18px]">
                <div v-scaleTap class="button-box" @click="handleWithdraw">
                    <svg-icon name="saque_button" class="text-[40px] text-[var(--primary-color)]" />
                    <span class="button-text">{{ $t("110003") }}</span>
                </div>
                <div v-scaleTap class="button-box" @click="handleDeposit">
                    <svg-icon name="recharge_button" class="text-[40px] text-[var(--primary-color)]" />
                    <span class="button-text">{{ $t("110002") }}</span>
                </div>
                <div v-scaleTap class="button-box" @click="handleTransfer">
                    <svg-icon name="agent_button" class="text-[40px] text-[var(--primary-color)]" />
                    <span class="button-text">{{ $t("110006") }}</span>
                </div>
            </div>

            <div class="dark-bg mt-[15px] flex flex-col">
                <div class="flex items-center ml-[10px] mr-[10px] mt-[10px]">
                    <div class="vip-level-box">
                        <span class="vip-level-text">VIP{{ playerInfo.vipLevel}}</span>
                    </div>

                    <div class="ml-[12px]">
                        <div>
                            <span class="vip-level-text-2">  {{ $t("106011") }}</span>
                            <span class="vip-level-text-2 active pl-1">VIP{{ playerInfo.vipLevel + 1 }}</span>
                            <span class="vip-level-text-2 pl-1">{{ $t('required_bet_amount') }}</span>
                            <span class="font-bold text-[14px] pl-1 text-[var(--primary-color)]"> {{ modelProps.nextBetNum }}</span>
                        </div>
                    </div>
                </div>
                <div class="line"></div>
                <div class="flex items-center m-[10px]">
                    <div class="vip-icon-box flex items-center justify-center">
                        <span class="font-bold text-[var(--text-white)] text-[14px]">{{ playerInfo.vipLevel }}</span>
                    </div>

                    <div class="ml-[13px]">
                        <span class="font-bold text-black text-[12px]">{{ $t("promotion_required_bet_progress") }}</span>
                        <div class="vip-progress-bg mt-[15px]">
                            <van-progress 
                                class="vip-progress-recharge" 
                                :show-pivot="true" 
                                :percentage="modelProps.betProgress"
                                :pivot-text="`${modelProps.curBetNum}/${modelProps.nextBetNum}`" 
                            />
                        </div>
                    </div>
                </div>
                
                

            </div>

            <div class="box-bg mt-[10px]">
                <div v-for="item in menu1" :key="item.key" class="flex justify-between items-center h-[50px]" @click="onClickMenu(item)">
                    <div class="flex items-center">
                        <img :src="item.icon" class="w-[30px] h-[30px] ml-[7px]" ></img>
                        <span class="text-[var(--primary-color)] text-[14px] ml-[10px]">{{ item.name }}</span>
                    </div>
                    <svg-icon v-scaleTap class="text-[16px] text-[var(--primary-color)]" name="right"/>
                </div>
            </div>

            <div class="box-bg mt-[-20px]">
                <div v-for="item in menu2" :key="item.key" class="flex justify-between items-center h-[50px]" @click="onClickMenu2(item)">
                    <div class="flex items-center">
                        <img :src="item.icon" class="w-[30px] h-[30px] ml-[7px]" ></img>
                        <span class="text-[var(--primary-color)] text-[14px] ml-[10px]">{{ item.name }}</span>
                    </div>
                    <svg-icon v-scaleTap class="text-[16px] text-[var(--primary-color)]" name="right"/> 
                </div>
            </div>
        </div>
    </div>

    <!-- <van-popup v-model:show="showRecharge" teleport="#app" position="bottom" class="recharge-popup" @click-overlay="showRecharge = false" >
        <NewRecharge @close="showRecharge = false" />
    </van-popup> -->

    <NewRecharge  v-model:show="showRecharge" />

</template> 

<script setup lang="ts">
import { useUserStoreHook } from '@/store/modules/user';
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
const { proxy } = getCurrentInstance();
const imgBasePath = proxy.$imgBasePath;
import useClipboard from "vue-clipboard3";
import { showTipModel } from "@/components/TipModel/index.js";
import { useI18n } from "vue-i18n";
import { logoutApi, userInfoApi } from '@/api/user';
import { vipInfoApi, vipListApi } from '@/api/vip';
const { toClipboard } = useClipboard();
const { t } = useI18n();
import Common from "@/utils/common/common";
import router from '@/router';
import { useActPopupStoreHook } from '@/store/modules/actPopup';
import NewRecharge from '@/views/deposit/newIndex.vue';

const handleService = () => {
    console.log('handleService');
    router.push('/messageCenter');
}

const handleMessage = () => {
    console.log('handleMessage');
    router.push('/messageCenter');
}   

const handleUser = () => {
    console.log('handleUser');
    router.push('/profile/changePassword');
}   

const handleDeposit = () => {
    console.log('handleDeposit');
    showRecharge.value = true;
}


const handleTransfer = () => {
    console.log('handleTransfer');
    // router.push('/agent');
    router.push('/agent');
}

const playerInfo = computed(() => {
  return useUserStoreHook().playerInfo;
});

const copyText = text => {
  try {
    toClipboard(text.toString());
    showTipModel({
      type: 1,
      icon: "success",
      title: t("102018")
    });
  } catch (err) {
    showTipModel({
      type: 1,
      icon: "fail",
      title: t("102019")
    });
  }
};

const refreshing = ref(false);

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

// 定义变量
let modelProps = ref({
  refresh: false,
  curRechargeNum: 0,
  nextRechargeNum: 0,
  rechargeProgress: 0,
  curBetNum: "0",
  nextBetNum: "0",
  betProgress: 0,
  playerIdText: ""
});

const getVipInfo = async () => {
  let { code, data } = await vipInfoApi();
  if (code == 200) {
    console.log('vipInfoApi', data.data);
    const { vipLevel, rewardBet, currentBet } = data.data;
    useUserStoreHook().updatePlayerInfo("vipLevel", vipLevel);
    // 打码量
    // if (vipLevel == 0) {
    //     modelProps.value.curBetNum = "0"; // 当前打码
    //     modelProps.value.nextBetNum = "0"; //下级打码
    //     modelProps.value.betProgress = 100;
    // } else {
    //     modelProps.value.curBetNum = Common.toFixed2(currentBet); // 当前打码
    //     modelProps.value.nextBetNum = Common.toFixed2(rewardBet); //下级打码
    //     let Progress: any = (Number(currentBet) / Number(Common.toFixed2(rewardBet))) * 100;
    //     if (Number(currentBet) > Number(rewardBet)) {
    //         modelProps.value.betProgress = 100;
    //     } else {
    //         modelProps.value.betProgress = Progress;
    //     }
    // }

    modelProps.value.curBetNum = Common.toFixed2(currentBet || '0'); // 当前打码
    modelProps.value.nextBetNum = Common.toFixed2(rewardBet || '0'); //下级打码
    let Progress: any = (Number(currentBet || 0) / Number(rewardBet || 0)) * 100;
    if (Number(currentBet || 0) > Number(rewardBet || 0)) {
        modelProps.value.betProgress = 100;
    } else {
        modelProps.value.betProgress = Progress;
    }
    console.log('getVipInfo', modelProps.value);
  }
};

const getvipConfig = async () => {
  let { code, data } = await vipListApi();
  if (code == 200) {
    console.log('vipListApi', data.data);
    data.data.map(item => {
      // 去0
      item.dayReward = Common.formatStringToNumber(item.dayReward);
      item.vipAccRecharge = Common.formatStringToNumber(item.vipAccRecharge);
    });
    modelProps.value.nextRechargeNum =
      data.data[
        playerInfo.value.vipLevel + 1 >= 36 ? 36 : playerInfo.value.vipLevel + 1
      ].vipAccRecharge;
    modelProps.value.rechargeProgress =
      (Number(playerInfo.value.rechargeAmount) /
        data.data[
          playerInfo.value.vipLevel + 1 >= 36
            ? 36
            : playerInfo.value.vipLevel + 1
        ].vipAccRecharge) *
      100;
    modelProps.value.curRechargeNum =
      data.data[playerInfo.value.vipLevel].dayReward;
  }
};

const handleWithdraw = () => {
    router.push('withdraw2');
}

const handleTest = () => {
    router.push('withdraw');
}

onMounted(async () => {
    await refreshBlance();
    await getVipInfo();
    // await getvipConfig();
})


const menu1 = [
    // {key: '1', name: t('find_balance'), mark:'找回余额', icon: `${imgBasePath}/newInfo/menu_icon_1.png`}, 这个菜单暂时没有
    // {key: '2', name: t('account_info'), mark:'账户信息', icon: `${imgBasePath}/newInfo/menu_icon_2.png`},
    {key: '3', name: t('betting'), mark:'投注', icon: `${imgBasePath}/newInfo/menu_icon_3.png`},
    {key: '4', name: t('report'), mark:'报表', icon: `${imgBasePath}/newInfo/menu_icon_4.png`},
    {key: '5', name: t('withdrawal_management'), mark:'提现管理', icon: `${imgBasePath}/newInfo/menu_icon_5.png`},
];

const onClickMenu = (item) => {
     switch(item.key) {
        case '1':
            break
        case '2':
            break
        case '3':
            router.push('/profile/report?tab=1');
            break
        case '4':
            router.push('/profile/report');
            break;
        case '5':
            router.push('/withdraw2');
            break
        default:
            break;
        
            
     }
}




const menu2 = [
    {key: '1', name: t('invite'), mark:'邀请', icon: `${imgBasePath}/newInfo/menu2_icon_1.png`},
    // {key: '2', name: t('data'), mark:'数据', icon: `${imgBasePath}/newInfo/menu2_icon_2.png`},
    // {key: '3', name: t('security_settings'), mark:'安全设置', icon: `${imgBasePath}/newInfo/menu2_icon_3.png`},
    // {key: '5', name: t('referral_reward'), mark:'推荐奖励', icon: `${imgBasePath}/newInfo/menu2_icon_5.png`},
    {key: '6', name: t('logout'), mark:'退出登陆', icon: `${imgBasePath}/newInfo/menu2_icon_7.png`}
];

const onClickMenu2 = (item) => {
    switch(item.key) {
        case '1':
            router.push('/agent');
            break;
        case '2':          
            break;
        case '3':
            break
        case '5':
            break
        case '6':
            outLogin();
            break   
    }
}

const outLogin = () => {
     
  showTipModel({
    type: 2,
    title: t("106009"),
    subTitle: t("106016"),
    cancelBtnText: t("106015"),
    success: function () {
      logout();
    },
    cancel: function () { }
  });
};

const logout = async () => {
  let { code }: any = await logoutApi();
  if (code == 200) {
    // useActPopupStoreHook().popupBoxRefresh();
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


const showRecharge = ref(false);


</script>

<style scoped lang="scss">
.new-bg {
    padding-top: 10px;
    // padding-left: 8px;
    // padding-right: 8px;
    padding-bottom: 100px;
    overflow-y: auto;
    &::before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;    // 宽度自适应
        height: 230px;    // 高度可根据实际需求调整，比如顶部占30%
        background: linear-gradient(var(--primary-color), var(--app-background)), 
            url('#{$img-base-path}/newInfo/bg.png') no-repeat center top;
        background-size: 100% 100%; // 拉伸填满
        pointer-events: none;
    }
}

.main-box {
    position: relative;
    z-index: 1;
}

.header-button-rect {
   width: fit-content;
   display: flex;
   margin-left: auto;  
   gap: 16px;
}

.user-info-text {
    display: flex;
    span {
        font-weight: bold;
        font-size: 13px;
        color: var(--text-white);

        &:first-child {
            color: var(--text-white);
        }
    }
}

.button-box{
    display: flex;
    flex-direction: column;
    align-items: center;
}

.button-text{
    font-weight: bold;
    font-size: 12px;
    color: var(--primary-color);
    margin-top: 3px;
}

.dark-bg{
    width: 352px;
    min-height: 125px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 5px 6px rgba(0, 0, 0, 0.2);
    background-color: var(--nav-bar-background);
    border-radius: 10px 10px 10px 10px;
}

.vip-level-box{
    // @extend .theme-profile-vip-box-bg;
    width: 60px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-color);
    border-radius: 5px;
    // border: 1px solid #74a6f8;

    .vip-level-text{
        font-weight: bold;
        font-size: 12px;
        color: var(--text-white);
        font-style: italic;
    }
}

.vip-level-text-2{
    font-weight: bold;
    font-size: 12px;
    color: var(--primary-color);

    &.active{
        color: var(--primary-color);
        font-style: italic;
    }
}

.vip-icon-box{
  background: url('#{$img-base-path}/newInfo/vip_logo.png') no-repeat center;
  background-size: 100% 100%;
  width: 40px;
  height: 40px;
}

.vip-progress-bg{
    // background: url('#{$img-base-path}/newInfo/bar_bg.png') no-repeat center;
    // background-size: 100% 100%;
    background: var(--primary-color);
    // box-shadow: 0px 1px 0px 0px #afd2ff;
    border-radius: 5px 5px 5px 5px; 
    width: 270px;
    height: 20px;
}

.vip-progress-recharge{
    // --van-progress-color: url("#{$img-base-path}/newInfo/bar_progress.png") no-repeat center;
    --van-progress-color:#04BE02;
    --van-progress-height: 5px;
    --van-progress-pivot-background: transparent;
    background: transparent;
    height: 14px;
    width: 262px;
    margin-left: auto;
    margin-right: auto;
}

.box-bg{
    // @extend .theme-profile-bg2;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
   
    padding-top: 10px;
    padding-left: 8px;
    padding-right: 8px;
    padding-bottom: 10px;

}

.rotate {
    transform: rotate(3600deg);
    transition: transform 3s ease;
}

.line{
    @extend .theme-profile-vip-box-line;
    height: 1px;
    margin-top:8px;
    margin-left: 13px;
    margin-right: 13px;
}



</style>
