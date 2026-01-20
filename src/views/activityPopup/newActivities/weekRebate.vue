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
            <div class="table-cell">{{ '>=' + item.amount}} </div>
            <div class="table-cell reward-text">{{ (item.rate * 100).toFixed(2).replace(/\.?0+$/, '') + '%'}} </div>
         </div>
     </div>

     <div class="descript">
        <div class="descript-title">{{t("activity_descript")}} </div>
        <div class="descript-content">{{t("week_rebase_descript_content")}} </div>
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
  import { getGlobalSetting } from '@/api/activityPopup';
import { showTipModel } from '@/components/TipModel';
  import { ActiveDayBetConfigVo } from '@/model/activityEnum';
  import { onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  const iscanget = ref(false)

  const realData = ref<ActiveDayBetConfigVo>()

  const getTabData = async () => {
    const {code, data} = await getGlobalSetting<ActiveDayBetConfigVo>({name:"ACTIVE_WEEK_REBATE"});
    if(code == 200){
      realData.value = data.data;
    }
  }
  
  const getRewardData = async () => {}

  const handleClaim = async () => {
    //   const {code, data} = await receiveAgentWeekRebate();
    //   if(code == 200){
    //      showTipModel({
    //       type: 4,
    //       title: t("receive_success", [data.data.amount || 0]),
    //       icon: "success",
    //       success: () => {
    //         getRewardData();
    //       }
    //     });
    //   }
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
            color: $theme-text-color-dark;
          }
       }

       .table-content {
            margin-top: 15px;
            width: 355px;
            margin-left:  auto;
            margin-right: auto;

            background: $theme-nav-top-bg;
            border-radius: 6px;
            padding: 8px;

            .table-title-row {
                display: flex;
                flex-direction: row;
                
            }
        }

        .table-title-row{
            height: 40px;
            background: $theme-table-title-bg;
            border-radius: 6px;
            border: 1px solid $theme-nav-top-border-color;
            display: flex;
            flex-direction: row;
            align-items: center;
            .table-title-cell {
                flex: 1;
                text-align: center;
                font-weight: bold;
                font-size: 14px;
                color: white;
            }
        }

        .table-row {
            height: 32px;
            display: flex;
            flex-direction: row;
            align-items: center;
            &:nth-child(odd) {
                background: $theme-table-odd-bg;
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
                color: $theme-text-color-dark;
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
          background: $theme-nav-top-bg;
          border-radius: 6px;
          padding: 8px;  

          .descript-title{
            font-weight: 500;
            font-size: 16px;
            font-weight: bold;
            color: $theme-text-color-dark;
          }
          .descript-content{
            padding-top: 5px;
            font-weight: 500;
            font-size: 12px;
            color: $theme-text-color-placeholder;
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
