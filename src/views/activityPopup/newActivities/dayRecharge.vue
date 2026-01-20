<template>
    <div class="main-box">
       <div class="title-box" v-if="!iscanget">
           <span>{{t("no_rewards_to_claim")}} </span>
       </div>
       <div class="table-content">
           <div class="table-title-row">
              <div class="table-title-cell">{{t("bet")}} </div>
              <div class="table-title-cell">{{t("reward_ratio")}} </div>
           </div>
           <div class="table-row" v-if="realData && realData.data" v-for="(item, index) in realData.data" :key="index">
              <div class="table-cell">{{ '>=' + item.bet}} </div>
              <div class="table-cell reward-text">{{ (item.rate * 100).toFixed(2).replace(/\.?0+$/, '') + '%' }}</div>
           </div>
       </div>
  
       <div class="descript">
          <div class="descript-title">{{t("activity_descript")}} </div>
          <div class="descript-content">{{t("day_recharge_descript_content")}} </div>
       </div>

       <!-- <div class="bottom-box" v-if="iscanget"> -->
       <div class="bottom-box">
            <button v-scaleTap
                class="img-bg-btn" @click="handleClaim"
            >
            {{ t('receber') }}
            </button>
       </div>
    </div>
  </template>
  
  <script lang="ts" setup>
    import { getGlobalSetting, getRechargeReward, receiveRechargeReward } from '@/api/activityPopup';
import { showTipModel } from '@/components/TipModel';
    import { ActiveWeekRechargeConfigVo } from '@/model/activityEnum';        
import common from '@/utils/common/common';
    import { onMounted, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
  
    const realData = ref<ActiveWeekRechargeConfigVo>()
    const iscanget = ref(false)
    
    let isClicking = false
    const handleClaim = async () => {   
      console.log("handleClaim");
      if(isClicking)return
      isClicking = true
      const {code, data} = await receiveRechargeReward({type: 0});
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
      isClicking = false
    }

    const getTabData = async () => {
        const {code, data} = await getGlobalSetting<ActiveWeekRechargeConfigVo>({name:"ACTIVE_DAY_RECHARGE"});
        if(code == 200){
           realData.value = data.data;
        }
    }

    const getRewardData = async () => {
        const {code, data} = await getRechargeReward({type: 0});
        console.log(data);
        if(code == 200){
           iscanget.value = data.data.amount > 0
        }
    }

    

    onMounted(async () => {
        getTabData()
        getRewardData()
    })
  
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
            //   &:nth-child(odd) {
            //       background: var(--secondary-dark-color);
            //       border-radius: 6px;
            //   }
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
                      color: $theme-text-color-bright;
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
              color: var(--text-grey);
            }
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
             .img-bg-btn{
                @extend .theme-btn;
                width: 355px;
                height: 40px;
             }
          }
  
  </style>
  