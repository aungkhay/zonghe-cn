<template>
    <div class="brgames-box" :class="{ 'b': mBLandscape }">
        <div class="brgames-top">
            <span class="gold">{{ $t("107043", [Number(modelProps.DayRewardNum).toFixed(2)]) }}</span>

            <van-button @click="getReward()" :class="modelProps.DailyRewardStatus ? 'submit' : 'disbaled'"
                class="theme-button-default  theme-btn-submit">
                {{ $t("104002") }}
            </van-button>
        </div>

        <div class="proccess-main">
            <div class="progress-box">
                <span>{{ Common.toFixed2(modelProps.totalBet) }} / {{
                    Common.toFixed2(modelProps.curBetNum)
                }}</span>
                <div class="vip-progress-bg2">
                    <van-progress class="vip-progress-recharge" :show-pivot="false"
                        :percentage="betProgress >= 100 ? 100 : betProgress" />
                </div>
            </div>
        </div>
    </div>

    <!-- 奖励弹窗 -->
    <RewardBox ref="rewardBox" @confirm="confirmReward" :mBLandscape="mBLandscape"></RewardBox>
</template>

<script setup lang="ts">
import { useUserStoreHook } from "@/store/modules/user";
import { bountyInfoApi, bountyReceiveApi } from "@/api/activity/index";
import { userInfoApi } from "@/api/user/index";
import { onMounted, onUnmounted, ref, computed } from "vue";
import { showTipModel } from "@/components/TipModel";
import { useI18n } from "vue-i18n";
import Common from "@/utils/common/common";
// 多语言
const { t } = useI18n();

const props = defineProps({
    mBLandscape: {
        type: Boolean,
        default: false
    }
});

// 定义变量
let modelProps = ref({
    totalBet: 0,
    bountyId: null,
    rebateList: [],
    curBetNum: 0,
    maxBetNum: 0,  //最大领取
    DayRewardNum: 0, //当前可领取奖励
    DailyRewardStatus: false
});

const betProgress = computed(() => {
    return (Number(modelProps.value.totalBet) / Number(modelProps.value.curBetNum)) * 100;
});

// 奖励弹窗ref实例
const rewardBox = ref();
// 关闭奖励弹窗回调
const confirmReward = async () => {
    // 获取页面数据
    getBountyInfoApi();
};
const time = ref(null);

const getUserinfo = async () => {
    let { code, data }: any = await userInfoApi();
    if (code == 200) {
        const { totalBet, bountyId } = data.data
        modelProps.value.totalBet = totalBet;
        modelProps.value.bountyId = bountyId
        if (modelProps.value.bountyId) {
            modelProps.value.rebateList.filter((item) => {
                // 领取最后一个id，说明已经领取要去找下一级 边界最大值就不进行操作
                if (item.id == Number(modelProps.value.bountyId + 1) && modelProps.value.bountyId != modelProps.value.maxBetNum) {
                    modelProps.value.DayRewardNum = item.reward
                    modelProps.value.curBetNum = item.needBet
                }
            })
        } else {
            modelProps.value.DayRewardNum = modelProps.value.rebateList[0].reward
            modelProps.value.curBetNum = modelProps.value.rebateList[0].needBet
        }
        if (modelProps.value.bountyId > modelProps.value.maxBetNum) {
            modelProps.value.DailyRewardStatus = false
        } else {
            modelProps.value.DailyRewardStatus = Number(modelProps.value.totalBet) >= Number(modelProps.value.curBetNum) ? true : false
        }
    }
};

const getBountyInfoApi = async () => {
    let { code, data }: any = await bountyInfoApi();
    if (code == 200) {
        modelProps.value.rebateList = data.data;
        modelProps.value.maxBetNum = data.data[data.data.length - 1].id;
    }
}



// 领取奖励
const getReward = Common.debounce(async () => {
    if (!modelProps.value.DailyRewardStatus) return
    const { code, data }: any = await bountyReceiveApi();

    if (code == 200) {
        const { amount, bountyId } = data.data
        modelProps.value.rebateList.map(item => {
            if (item.id == Number(bountyId + 1)) modelProps.value.curBetNum = item.needBet
        })
        rewardBox.value.show({
            gold: Common.toFixed2(amount)
        });
    }
}, 1000);

onMounted(async () => {
    time.value = setInterval(getUserinfo, 5000)
    // 获取页面配置
    await getBountyInfoApi()
    await getUserinfo()
});

onUnmounted(() => {
    clearInterval(time.value)
});
</script>

<style lang="scss" scoped>
@import "./bountyTop.scss";
</style>