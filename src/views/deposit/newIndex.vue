<template>

      <van-popup :show="props.show" teleport="#app" position="bottom" class="recharge-popup" @click-overlay="close" >
        <transition name="slide-up">
            <div v-if="props.show" class="main-container">

                <div v-show="isShowRecharge">

                    <div class="flex justify-between items-center ml-[8px] mr-[8px] pt-[17px]" >
                        <svg-icon v-scaleTap class="text-[var(--primary-color)] text-[24px]" name="back" @click="goBack" />
                        <span class="text_1 center-text">{{ $t('102000') }}</span>
                         <svg-icon class="text-[var(--primary-color)] text-[24px]" name="recharge_log" @click="showHistory" />
                    </div>
                        

                    <div class="mt-[26px] ml-[20px] mr-[20px]">
                        <div class="flex items-center ">
                            <svg-icon class="text-[var(--primary-color)] text-[20px]" name="phone" />
                            <span class="text_3 ml-[5px]">Depósito on-line</span>
                        </div>
                        <div class="line2 mt-[10px]"/>

                        <div class="box mt-[20px] relative flex items-center">
                            <div class="flex items-center ml-[10px] ">
                                <img :src="$imgBasePath + '/public/pix.png'" class="w-[29px] h-[29px]"/>
                                <span class="text_4 ml-[10px]" >PIX</span> 
                            </div>
                            <div class="corner-check"/>
                        </div>

                        <div class="line mt-[10px]"/>
                        <div class="box mt-[20px] relative flex items-center">
                            <span class="text_4 ml-[10px]" >FOOTBALLSLOT</span> 
                        <div class="corner-check"/>
                        </div>
                        <div class="line mt-[10px]"/>
                        
                        <div class="mt-[12px]">
                            <span class="text_option">{{ $t('option') }}</span>
                        </div>
                        
                        <div class="grid-container">
                            <div
                                v-scaleTap
                            v-for="(amount, index) in amountList"
                                :key="index"
                                class="amount-box"
                                :class="{ selected: selectedAmount === amount }"
                                @click="selectAmount(amount)"
                            >   
                                <span>{{  common.formatStringToNumber(amount.price || '0') }}</span>
                                <div class="vip-badge" v-if="amount.giftPercentage != 0">{{ common.formatStringToNumber(amount.giftPercentage * 100)}}%</div>
                                <div class="corner-check" v-if="selectedAmount === amount"/>
                            </div>
                        </div>

                        <div class="input-wrapper flex items-center">
                            <svg-icon class="text-[var(--primary-color)] text-[20px]  ml-[18px]" name="rs" />
                            <input v-model="amount" type="number" class="amount-input ml-[8px]" :placeholder="placeholder" />
                            <svg-icon v-if="amount" class="text-[var(--primary-color)] text-[20px]  mr-[15px]" name="icon_delete" @click="amount = ''" />
                        </div>

                        <button v-scaleTap class="btn-deposit flex items-center justify-center w-full mt-[40px]" :class="{ active: isCanPay }" @click="deposit">
                            <span class="text-bold text-white text-[16px]">{{t('recharge_now')}}</span>
                        </button>

                        <div class="mt-[10px] pb-[10px] flex items-center justify-center">
                        </div>
                    </div>

                </div>

                <div v-show="!isShowRecharge">
                    <div class="flex items-center justify-between ml-[8px] mr-[8px] pt-[17px]" >
                        <svg-icon class="text-[var(--primary-color)] text-[24px]" name="back" @click="goBack" />
                        <span class="text_1">{{ $t('102001') }}</span>

                        <div class="w-[24px] h-[24px]"/>
                    </div>

                    <div class="mt-[20px] px-[20px] flex items-center justify-between">
                        <div class="dropdown-container">
                            <div v-scaleTap class="flex items-center justify-center menu-btn" @click="toggleMenu">
                                <span class="text_4">{{ selectedOption.label }}</span>
                                <svg-icon class="text-[var(--primary-color)] text-[16px] ml-[5px]" name="arrow_down" :class="{ 'rotate-180': isOpenMenu }" />
                            </div>

                            <div class="dropdown-menu" v-if="isOpenMenu">
                                <div
                                    v-for="option in options"
                                    :key="option.value"
                                    class="dropdown-item"
                                    @click="selectOption(option)"
                                    :class="{ active: selectedOption.value == option.value }"
                                >
                                    {{ option.label }}
                                </div>
                            </div>

                        </div>
                        <div class="flex">
                            <span class="text_3">{{ $t('102012') }}</span>
                            <span class="ml-[5px] text_5">R$ {{  common.formatStringToNumber(playerInfo.rechargeAmount || '0')  }}</span>
                        </div>
                    </div>
                    
                    <div v-if="dataList.length != 0"  class="min-h-[500px] overflow-y-auto px-[20px] pb-[20px]" >
                        <div class="logs-list-title flex items-center justify-center mt-[20px] px-[20px]">
                            <div class="title flex-1">{{ $t("107018") }}</div>
                            <div class="title flex-1">{{ $t("102014") }}</div>
                            <div class="title flex-1">{{ $t("102016") }}</div>
                            <div class="title flex-1">{{ $t("102017") }}</div>
                        </div>
                        
                        <div class="logs-list-item flex items-center px-[20px]" v-for="(item, index) in dataList" :key="index">
                            <div class="item-content flex-1">{{ item.createTime }}</div>
                            <div class="item-content flex-1">{{ common.formatStringToNumber(item.amount || '0')  }}</div>
                            <div class="item-content flex-1">{{ common.formatStringToNumber( ( parseInt(item.giveAmount as any) + parseInt(item.amount as any) ) || '0') }}</div>
                            <div class="item-content flex-1">{{ getStatus(item.status) }}</div>
                        </div>
                        
            
                    </div>
                    <div v-else class="flex items-center justify-center h-[500px]">
                        <NoData />
                    </div>
                </div>

                

            </div>
        </transition>
     </van-popup>


   
</template>
<script lang="ts" setup>
import { depositApi, depositConfigApi, depositLogApi } from '@/api/deposit';
import { userInfoApi } from '@/api/user';
import { showTipModel } from '@/components/TipModel';
import { AppGoodsListVo, AppRechargeOrderHistoryVo } from '@/model/vip';
import router from '@/router';
import { useUserStoreHook } from '@/store/modules/user';
import common from '@/utils/common/common';
import { computed, getCurrentInstance, watch , ref } from 'vue';
const { proxy } = getCurrentInstance();
const $imgBasePath = proxy.$imgBasePath;
import { useI18n } from 'vue-i18n';
const { t } = useI18n();


const props = defineProps({
   show: Boolean
})

const emit = defineEmits(['update:show','refreshMoney'])

const close = () => {
    emit('update:show', false)
    if(!isShowRecharge.value){
        isShowRecharge.value = true;
    }
}
const isShowRecharge = ref(true)

const showHistory = ()=>{
    isShowRecharge.value = false
    getLogs();
}

const goBack = () => {
   if(isShowRecharge.value){
      close()
   }else{
      isShowRecharge.value = true
   }
}


const amountList = ref([] as AppGoodsListVo[])

const selectedAmount = ref(null)

function selectAmount(amount:AppGoodsListVo) {
   selectedAmount.value = amount
}

const amount = ref('')

const placeholder = ref('')

const isOpenMenu = ref(false)

const dataList = ref([] as AppRechargeOrderHistoryVo[])

const options = [
  { label: t('f_filter_all'), value: null },
  { label: t('107018'), value: 'TODAY' },
  { label: t('107019'), value: 'YESTERDAY' },
  { label: t('107020'), value: 'WEEK' },
  { label: t('107021'), value: 'LAST_WEEK' },
  { label: t('f_filter_this_month'), value: 'MONTH' },
  { label: t('107022'), value: 'LAST_MONTH' },
]

const selectedOption = ref(options[0])

const toggleMenu = () => {
    isOpenMenu.value = !isOpenMenu.value
}

const selectOption = (option) => {
  selectedOption.value = option
  isOpenMenu.value = false
  getLogs()
}


const minRecharge = ref(0)
const maxRecharge = ref(0)

const getDepositConfig = async () => {
    const { code, data } = await depositConfigApi();
    if(code == 200) {
        placeholder.value = "Min: " + data.data.minRecharge + " Max: " + data.data.maxRecharge
        minRecharge.value = data.data.minRecharge
        maxRecharge.value = data.data.maxRecharge
        let tempList = data.data?.list || []
        if (tempList && tempList.length > 0) {
            tempList.sort((a, b) => parseFloat(a.price as any) - parseFloat(b.price as any))
        }
        amountList.value = tempList
    }
}

const isCanPay = computed(() => {
    if( (amount.value != null && amount.value != '') || selectedAmount.value != null) {
        return true
    }
    return false
})

let isSubmitLock = false;
const deposit = async () => {

    if(!isCanPay)return;
    if(isSubmitLock) return;
    isSubmitLock = true;
    console.log("deposit", amount.value, selectedAmount.value)
    let params = {}
    if(amount.value != null && amount.value != '') {
       params["customNum"] = amount.value
       if( (amount.value as any)  < minRecharge.value || (amount.value as any) > maxRecharge.value) {
            showTipModel({
                type: 1,
                icon: "fail",
                title: t('please_enter_number_between', [minRecharge.value, maxRecharge.value])
            });
            isSubmitLock = false;
            return;
        }
    }else{  
        if(!selectedAmount.value?.id){
            showTipModel({
                type: 1,
                icon: "fail",
                title: t('please_select_amount')
            });
            isSubmitLock = false;
            return;
        }
        params["id"] = selectedAmount.value.id
       
    }
   try {
     
    let { code, data } = await depositApi(params);
    isSubmitLock = false;
    amount.value = ''
    selectedAmount.value = null
    if(code == 200) {
        let payUrl = data.data.payUrl;
        if(payUrl != null && payUrl != ''){
            window.localStorage.setItem('qrcode', encodeURIComponent(payUrl));
            window.openWin(payUrl, '_blank');
        }else{
            router.push(`/`);
        }
        // getDepositConfig();
        emit('refreshMoney')
        emit('update:show', false)
    }
   }catch (error) {
    console.log(error)
    isSubmitLock = false;
   }
    
}

const playerInfo = computed(() => {
  return useUserStoreHook().playerInfo;
});

const refreshBlance = async () => {
    let { code, data }: any = await userInfoApi();
    const { amount, rechargeAmount } = data.data
    if (code == 200) {
        useUserStoreHook().updatePlayerInfo("amount", amount);
        useUserStoreHook().updatePlayerInfo("rechargeAmount", rechargeAmount);
    }
}


watch(() => props.show, (newValue) => {
    if(newValue) {
        getDepositConfig()
        refreshBlance()
        getLogs()
    }
})

const getLogs = async () => {
    let params = {day: selectedOption.value.value}
    let { code, data }: any = await depositLogApi({pageSize: 20, pageNum: 1}, params);
    if(code == 200) {
        const {rows, total} = data
        dataList.value = rows
    }
}

const getStatus = (status: number) => {
    const statusOp = {
        0: t('102020'),
        1: t('102018'),
        2: t('102019')
    }
    return statusOp[status]
}




</script>
<style scoped lang="scss">

.recharge-popup{
    z-index: 99999;
    // min-height: 630px;
    max-width: $max-width;
    left: 50%;
    transform: translateX(-50%);
    background-color: transparent;
}

.main-container{
    // @extend .theme-left-menu-bg;
    border-radius: 10px 10px 0px 0px;
    max-width: $max-width;
    height: 100%;
    background-color: var(--app-background);
}

.text_1{
    font-weight: bold;
    font-size: 21px;
    color: #000;
}

.center-text{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.text_2{
    font-weight: 400;
    font-size: 12px;
    color: var(--primary-color);
}

.text_3{
    font-weight: 500;
    font-size: 12px;
    color: var(--primary-color);
}

.text_option{
    font-weight: 500;
    font-size: 15px;
    color: var(--text-black);
}

.line{
  position: relative;
  width: 100%;
  height: 1px; // 设为粗线的高度
  background: var(--secondary-color); // 粗线颜色 
}


.line2{

  position: relative;
  width: 100%;
  height: 1px; // 设为粗线的高度
  background: var(--secondary-color);

  &::before{
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 40%;
    height: 2px; // 细线的高度
    background: var(--primary-color);// 细线颜色（你可以根据实际颜色调整）
    z-index: 1;
  }
}





.box{
    width: 150px;
    height: 49px;
    border-radius: 6px 6px 6px 6px;
    border: 1px solid var(--primary-color);
}

.corner-check {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-bottom: 20px solid var(--primary-color);
  border-left: 20px solid transparent;

  &::after{
    content: '✔';
    position: absolute;
    bottom: -20px;
    right: 2px;
    font-size: 10px;
    color: white;
  }
}

.vip-badge{
  position: absolute;
  top: -10px;
  right: -10px;
  background: red;
  border-radius: 4px 4px 4px 0px;
  padding: 2px 6px;
  font-weight: 500;
  font-size: 10px;
  color: white;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 12px 0 15px 0;
}

.amount-box {
  position: relative;
  height: 39px;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid var(--primary-color);

  font-weight: 500;
  font-size: 16px;
  color: var(--primary-color);
  
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &.selected{
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
  }

}

.input-wrapper{
    border-radius: 6px 6px 6px 6px;
    border: 1px solid var(--primary-color);
    height: 40px;
}



.amount-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-weight: 500;
  font-size: 14px;
   color: #000;

   &::placeholder{
    color: var(--secondary-dark-color); // 提示文本颜色
    font-size: 14px; // 提示文本字号
    font-weight: 400; // 提示文本字重
    opacity: 1; // 某些浏览器需要
   }

    // 隐藏 number 类型的上下箭头
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    &[type="number"] {
        -moz-appearance: textfield;
    }
}

.btn-deposit{
    
    background: $theme-btn-disable-bg;
    height: 40px;
    border-radius: 6px;  

    &.active{
        background: var(--primary-color);
    }
}

.dropdown-container {
  position: relative;
  width: 150px;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
    border-radius: 6px;
    margin-top: 4px;
    z-index: 10;
    width: 100%;
    //   border: 1px solid var(--primary-color);
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.2);
}

.dropdown-item {
  padding: 10px;
  color: #000;
  cursor: pointer;

  &.active{
    color: var(--primary-color);
  }
}



.menu-btn{
    // width: 74px;
    width: fit-content;
    padding-left:  10px;
    padding-right: 10px;
    height: 24px;
    background: transparent;
    border-radius: 20px 20px 20px 20px;
    border: 1px solid var(--primary-color);
}

.text_4{
    font-weight: bold;
    font-size: 12px;
    color: var(--primary-color);
}

.text_5{
    font-weight: bold;
    font-size: 12px;
    color: $theme-text-color-bright;
}

.logs-list-title{
    height: 45px;
    background: $theme-game-list-header-bg;
    border-radius: 6px;
    border: 1px solid $theme-recharge-light-line ;


    .title{
        font-weight: bold;
        font-size: 12px;
        color: white;
        text-align: center;
    }
}


.logs-list-item{
    height: 45px;
    border-radius: 6px;

    &:nth-child(even){
        background: $theme-table-even-bg;
    }

    &:nth-child(odd){
        background:  $theme-game-list-header-bg;
    }
  
    .item-content{
        font-weight: 500;
        font-size: 12px;
        color: white;
        text-align: center;
    }
  
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0.5;
}
.slide-up-enter-to, .slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}





</style>
