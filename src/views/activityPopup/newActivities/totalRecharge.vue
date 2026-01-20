<template>
  <div class="main-box">
     <div class="title-box" v-if="!iscanget">
         <span>{{t("no_rewards_to_claim")}} </span>
     </div>
     <div class="table-content">
         <div class="table-title-row">
            <div class="table-title-cell">{{t("total_recharge")}} </div>
            <div class="table-title-cell">{{t("reward_amount")}} </div>
         </div>
         <div class="table-row" v-if="realData && realData.data" v-for="(item, index) in realData.data" :key="index">
            <div class="table-cell">{{ '>=' + item.amount}} </div>
            <div class="table-cell reward-text">{{  item.reward }} </div>
         </div>
     </div>

     <div class="descript">
        <div class="descript-title">{{t("activity_descript")}} </div>
        <div class="descript-content">{{t("total_recharge_descript_content")}} </div>
     </div>

     <div class="bottom-box" v-if="iscanget">
       <button v-scaleTap
          class="img-bg-btn" @click="handleClaim"
       >
        {{ t('receber') }}
     </button>
     </div>
  </div>
</template>

<script lang="ts" setup>
  import { getGlobalSetting, getTotalRechargeRecord, receiveTotalRecharge } from '@/api/activityPopup';
import { showTipModel } from '@/components/TipModel';
import { ActiveTotalRechargeConfigVo } from '@/model/activityEnum';
  import { computed, onMounted, ref } from 'vue';
  import common from '@/utils/common/common';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

  const realData = ref<ActiveTotalRechargeConfigVo>()
  const receiveData = ref([] as number[])


  const getTabData = async () => {
    const {code, data} = await getGlobalSetting<ActiveTotalRechargeConfigVo>({name:"ACTIVE_TOTAL_RECHARGE"});
    if(code == 200){
      realData.value = data.data;
    }
  }

  
  const amount = ref(0)
  const getRewardData = async () => {
    const {code, data} = await getTotalRechargeRecord();
    if(code == 200){
       receiveData.value = data.data.receiveList || []
       amount.value = data.data.amount || 0
    }
  }

  const iscanget = computed(() => {
      return getCanReceiveList.value.length > 0
  })
  const getCanReceiveList = computed(() => {
      const list = []
      const receiveValueList = receiveData.value.map(item => parseInt(item.toString()));

      for(let i = 0; i < realData.value?.data.length; i++){
        let v1  = parseInt(amount.value.toString());
        let v2 = parseInt(realData.value?.data[i].amount.toString());
        if(v1 >= v2){
           if(!receiveValueList.includes(v2)){
             list.push(v2)
           }
        }
      }
      console.log(list);
      return list
  })


  
  onMounted(() => {
      getTabData();
      getRewardData();

  })
 
  let isClicking = false;
  const handleClaim = async () => {   
    console.log("handleClaim");
    if(isClicking)return
    isClicking = true;
    const list = getCanReceiveList.value;
    console.log(list);
    const {code, data} = await receiveTotalRecharge({receiveList:list});
    if(code == 200){
       showTipModel({
        type: 4,
        title: t("receive_success", [common.formatNum(data.data.amount) || 0]),
        icon: "success",
        success: () => {
          getRewardData();
        }
      });
    }
    isClicking = false;
  }

</script>

<style lang="scss" scoped>
    .main-box{
       padding-top: 15px;
       padding-bottom: 100px;
       position: relative;
       .title-box{
          display: flex;
          justify-content: center;
          align-items: center;
          span{
            font-weight: bold;
            font-size: 16px;
            color: var(--primary-color);
          }
       }

       .table-content {
            margin-top: 15px;
            width: 355px;
            margin-left:  auto;
            margin-right: auto;

            background: var(--secondary-color);
            border-radius: 6px;
            padding: 8px;

            .table-title-row {
                display: flex;
                flex-direction: row;
                
            }
        }

        .table-title-row{
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
                font-size: 14px;
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
                font-size: 14px;
                color: var(--primary-color);
                &.reward-text {
                    color: var(--text-black);
                }
            }
        }

        .descript{
          margin-top: 15px;
          padding-left: 20px;
          padding-right: 20px;

          margin-left: 10px;
          margin-right: 10px;
          background: var(--secondary-color);
          border-radius: 6px;
          padding: 8px;  

          .descript-title{
            font-weight: 500;
            font-size: 16px;
            font-weight: bold;
            color: var(--primary-color);
          }
          .descript-content{
            padding-top: 5px;
            font-weight: 500;
            font-size: 12px;
            color: var(--content-description);
          }
        }

        .bottom-box{
           position: fixed;
           width: $max-width;
           bottom: 60px;
           height: 65px;
           display: flex;
           justify-content: center;
           align-items: center;
           background: $theme-nav-top-bg;
           .img-bg-btn{
              @extend .theme-btn;
              width: 325px;
              height: 40px;
           }
        }

    }

</style>
