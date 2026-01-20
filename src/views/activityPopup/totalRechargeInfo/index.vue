<template>
    <van-popup v-model:show="popupShow" style="background-color: transparent" :close-on-click-overlay="true"  @click-overlay="handleOverlayClick">
        <div class="popup-bg">
            <div class="main-box">
                <div class="title-box">
                    <span class="title-text">{{ t("activity_total_recharge") }}</span>
                </div>
                <div class="table-content">
                    <div class="table-title-row">
                        <div class="table-title-cell px-3">{{ t("total_recharge") }}</div>
                        <div class="table-title-cell">{{ t("reward_amount") }}</div>
                    </div>
                    <div class="table-row" v-if="realData && realData.data"  v-for="(item, index) in realData.data" :key="index">
                        <div class="table-cell"> >={{  item.amount }}</div>
                        <div class="table-cell reward-text">{{ item.reward }}</div>
                    </div>
                </div>

                <div class="bottom-box">
                    <div class="check-box-rect">
                        <div class="check-box-rect-inner">
                            <van-checkbox
                                v-model="notOpenAgain"
                                    class="pr-[8px] square-checkbox"
                                    icon-size="13px"
                                    checked-color="#7E57C2"
                                    shape="square"
                                ></van-checkbox>
                            <span class="text-text">{{ t("not_show_today") }}</span>
                        </div>
                        <div class="check-box-rect-inner">
                            <van-checkbox
                                v-model="notOpenForever"
                                    class="pr-[8px] square-checkbox"
                                    icon-size="13px"
                                    checked-color="#7E57C2"
                                    shape="square"
                                ></van-checkbox>
                            <span class="text-text">{{ t("not_show_this_activity_anymore") }}</span>
                        </div>                   
                    </div>
                    <div v-scaleTap class="click-button" @click="handleClickButton" >
                        <span class="text-text">{{ $t("confirm") }}</span>
                    </div>
                </div>
            </div>


        </div>
       
        <svg-icon
          class="text-[30px] text-[#fff] box-close"
          name="close"
          @click="handleOverlayClick"
        />
    </van-popup>
</template>

<script setup lang="ts" name="totalRechargeInfo">
import { getGlobalSetting } from '@/api/activityPopup';
import { ActiveTotalRechargeConfigVo } from '@/model/activityEnum';
import router from '@/router';
import { useNewActPopupStoreHook } from '@/store/modules/newActPopus';
import { computed, watch , ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const popupShow = computed(() => {
    console.log("computed popupShow", useNewActPopupStoreHook().popups.activeTotalRecharge.isShow);
    return useNewActPopupStoreHook().popups.activeTotalRecharge.isShow;
})
const handleOverlayClick = () => {
    useNewActPopupStoreHook().closePopup("activeTotalRecharge",!notOpenAgain.value);
}
const handleClickButton = () => {
    useNewActPopupStoreHook().closePopup("activeTotalRecharge",!notOpenAgain.value);
    setTimeout(() => {
        router.push("/activity/totalRecharge");
    }, 800);
}

const realData = ref<ActiveTotalRechargeConfigVo>()

const getTabData = async () => {
    const {code, data} = await getGlobalSetting<ActiveTotalRechargeConfigVo>({name:"ACTIVE_TOTAL_RECHARGE"});
    if(code == 200){
        realData.value = data.data;
    }
}

watch(() => popupShow.value, (newValue) => {
    if(newValue) {
        getTabData();
    }
})
  
const notOpenAgain = ref(false);
const notOpenForever = ref(false);


</script>
<style lang="scss" scoped>
    .main-box {
        width: 288px;
        // min-height: 460px;
        display: flex;
        flex-direction: column;

        .title-box {
            margin-top: 16px;
            margin-bottom: 16px;
            padding-left: 26px;
            padding-right: 26px;
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
            .title-text {
                font-weight: bold;
                font-size: 14px;
                color: var(--text-black);
                text-align: center;
            }
        }

        .table-content {
            // margin-top: 15px;
            width: 100%;
            margin-left:  auto;
            margin-right: auto;

            // background: $theme-nav-top-bg;
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
                font-size: 12px;
                color: var(--text-black);
                white-space: nowrap;
                padding: 3px;
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
                font-size: 12px;
                color: var(--primary-color);
                &.reward-text {
                    color: var(--text-black);
                }
            }
        }

        .bottom-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 18px;
            margin-left: 22px;
            margin-right: 22px;
            margin-bottom: 20px;
            .check-box-rect {
                .check-box-rect-inner {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    &:first-child {
                        margin-bottom: 10px;
                    }
                    .text-text {
                        font-weight: 500;
                        font-size: 11px;
                        color: var(--primary-color);
                     }
                }
            }

            .click-button {
                min-width: 70px;
                height: 28px;
                background: var(--primary-color);
                border-radius: 4px 4px 4px 4px;
                text-align: center;
                .text-text {
                    font-weight: 500;
                    font-size: 12px;
                    color: white;
                }
            }
        }
    }

    .box-close {
        margin-left: auto;
        margin-right: auto;
        margin-top: 15px;
    }

</style>

