<template>
    <div class="main-box">
       <!-- <div class="title-box">
           <span>{{t("no_rewards_to_claim")}} </span>
       </div> -->
       <div class="table-content">
           <div class="table-title-row">
              <div class="table-title-cell">{{t("level")}} </div>
              <div class="table-title-cell">{{t("reward_ratio")}} </div>
           </div>
           <div class="table-row" v-if="realData && realData.data" v-for="(item, index) in realData.data" :key="index">
              <div class="table-cell">{{ item.level}} </div>
              <div class="table-cell reward-text">{{ (item.rate * 100).toFixed(2).replace(/\.?0+$/, '') + '%' }}</div>
           </div>
       </div>
  
       <div class="descript">
          <div class="descript-title">{{t("activity_descript")}} </div>
          <div class="descript-content">{{t("sub_recharge_share_descript_content")}} </div>
       </div>
    </div>
  </template>
  
  <script lang="ts" setup>
    import { getGlobalSetting } from '@/api/activityPopup';
    import { ActiveSubRechargeShareConfigVo } from '@/model/activityEnum';
    import { onMounted, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
  
    const realData = ref<ActiveSubRechargeShareConfigVo>()
    
    onMounted(async () => {
        const {code, data} = await getGlobalSetting<ActiveSubRechargeShareConfigVo>({name:"ACTIVE_SUB_RECHARGE_SHARE"});
        if(code == 200){
           realData.value = data.data;
        }
    })
  
  </script>
  
  <style lang="scss" scoped>
      .main-box{
        //  padding-top: 15px;
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
            //   border: 1px solid $theme-nav-top-border-color;
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
                  background: $theme-bottom-bar-bg;
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
  
      }
  
  </style>
  