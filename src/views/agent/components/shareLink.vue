<template>
<div class="content-area">
    <!-- 代理信息总览 -->
    <div>
        <indexQR />
    </div>



    <!-- 代理网络区域 -->
    <div class="agent-network">
        <div class="network-title">{{ $t('agent_network') }}</div>

        <div class="performance-summary">

            <div style="max-width: 50px; max-height: 50px; display: flex;">
                <img :src="`${$imgBasePath}/agent/head.png`"
                    style=" border-radius:50%; border: 2px solid #FFF1AD;">
                <div
                    style="position: absolute;  transform: translateX(30px) translateY(25px); width: 24px; height: 24px; background: #FFCC00; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #533726; font-weight: bold; box-shadow: 0 1px 4px rgba(0,0,0,0.12); z-index: 3;">
                    A
                </div>
            </div>

            <div class="performance-row">

                <div class="item-label">{{ $t('total_performance') }} 28500 {{ $t('total_commissions') }} 
                    <!-- <span class="highlight">225</span> -->
                </div>
                <div class="item-label">{{ $t('direct_performance') }} <span class="highlight" style="color: #fff;">5500</span></div>
                <div class="item-label">{{ $t('commission_return') }} 3% {{ $t('direct_commission') }} 
                    <!-- <span class="highlight">165</span> -->
                </div>
                <div class="item-label">{{ $t('others_performance') }} <span class="highlight" style="color: #fff;">3000</span>
                </div>
                <div class="item-label">{{ $t('echelon_commission') }} 2% {{ $t('other_commission') }} 
                    <!-- <span class="highlight">60</span> -->
                </div>
            </div>
        </div>

        <!-- 更新后的代理网络图表 -->
        <div class="line-map">
            <img :src="`${$imgBasePath}/agent/line1.png`" alt="Line Map"
                style=" transform: rotateY(180deg) translateY(-10px) translateX(13px); width: 70%; height: 70%; z-index: 1;" />
            <img :src="`${$imgBasePath}/agent/line2.png`" alt="Line Map"
                style="position: absolute;top: -10px;left: 43px;  width: 70%; height: 30%; z-index: 1;" />
            <img :src="`${$imgBasePath}/agent/line7.png`" alt="Line Map"
                style="position: absolute;top: -35px;left: 153px; transform: scale(0.65); z-index: 1;" />
            <img :src="`${$imgBasePath}/agent/line3.png`" alt="Line Map"
                style="position: absolute;top: -90px;left: 170px; transform: scale(0.67); z-index: 1;" />
            <img :src="`${$imgBasePath}/agent/line8.png`" alt="Line Map"
                style="position: absolute;top: -40px;left: 210px; transform: scale(0.67); z-index: 1;" />
            <img :src="`${$imgBasePath}/agent/line1.png`" alt="Line Map"
                style="position: absolute;top: -90px;left: 255px; transform: scale(0.7); z-index: 1;" />
            <img :src="`${$imgBasePath}/agent/line6.png`" alt="Line Map"
                style="position: absolute;top: 220px;left: 40px; transform: scale(0.6); z-index: 1;" />
            <img :src="`${$imgBasePath}/agent/line5.png`" alt="Line Map"
                style="position: absolute;top: 220px;left: 85px; transform: scale(0.6); z-index: 1;" />
            <img :src="`${$imgBasePath}/agent/line6.png`" alt="Line Map"
                style="position: absolute;top: 220px;left: 270px; transform: scale(0.6); z-index: 1;" />
        </div>
        <div class="network-chart">

            <!-- 第一层级连接节点 -->
            <div class="tier-connections tier-1-connections">
                <div class="connection-node left">
                    <div class="node-title">
                        {{ $t('c1_contribution_to_a') }} 20
                        <div class="node-subtitle">{{ $t('difference') }} 2%</div>
                    </div>
                </div>
                <div class="connection-node center">
                </div>
                <div class="connection-node right">
                    <div class="node-title">
                        {{ $t('c3_contribution_to_a') }} 0
                        <div class="node-subtitle">{{ $t('no_level_difference') }}</div>
                    </div>
                </div>
            </div>

            

            <!-- B层级节点 -->
            <div class="tier-b">

                <div class="agent-node ">
                    <div class="connection-node2">
                        {{ $t('b1_contribution') }} 20
                    </div>
                    <div class="agent-avatar">
                        <img :src="`${$imgBasePath}/agent/head.png`"
                            style=" border-radius:50%; border: 2px solid #FFF1AD;">
                        <div
                            style="position: absolute; bottom: 0px; right: 0px; width: 24px; height: 24px; background: #FFCC00; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #533726; font-weight: bold; box-shadow: 0 1px 4px rgba(0,0,0,0.12); z-index: 3;">
                            B1
                        </div>
                    </div>
                    <div class="agent-stats">
                        {{ $t('validated_bets') }}
                        <div class="bet-amount">500</div>
                    </div>
                </div>

                <div class="agent-node ">
                    <div class="connection-node2">
                        {{ $t('b2_contribution') }} 90
                    </div>
                    <div class="agent-avatar">
                        <img :src="`${$imgBasePath}/agent/head.png`"
                            style=" border-radius:50%; border: 2px solid #FFF1AD;">
                        <div
                            style="position: absolute; bottom: 0px; right: 0px; width: 24px; height: 24px; background: #FFCC00; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #533726; font-weight: bold; box-shadow: 0 1px 4px rgba(0,0,0,0.12); z-index: 3;">
                            B2
                        </div>
                    </div>
                    <div class="agent-stats">
                        {{ $t('validated_bets') }}
                        <div class="bet-amount">3000</div>
                    </div>
                </div>

                <div class="agent-node ">
                    <div class="connection-node2">
                        {{ $t('b3_contribution') }} 60
                    </div>
                    <div class="agent-avatar">
                        <img :src="`${$imgBasePath}/agent/head.png`"
                            style=" border-radius:50%; border: 2px solid #FFF1AD;">
                        <div
                            style="position: absolute; bottom: 0px; right: 0px; width: 24px; height: 24px; background: #FFCC00; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #533726; font-weight: bold; box-shadow: 0 1px 4px rgba(0,0,0,0.12); z-index: 3;">
                            B3
                        </div>
                    </div>
                    <div class="agent-stats">
                        {{ $t('validated_bets') }}
                        <div class="bet-amount">2000</div>
                    </div>
                </div>
            </div>

            <!-- 中间连接节点 -->
            <div class="tier-connections tier-mid-connections">

                <div class="connection-node center">
                    <div class="node-title">
                        {{ $t('c2_contribution') }}
                        <div class="node-subtitle">{{ $t('commission') }} 20</div>
                    </div>
                </div>

            </div>

            <div class="mid-node">
                <div class="connection-node2">
                        {{ $t('c2_contribution') }} 20
                    </div>
            </div>

            <!-- C层级节点 -->
            <div class="tier-c">
                <div class="agent-node c1-node">
                    <div class="connection-node2">
                        {{ $t('c1_contribution') }} 10
                    </div>
                    <div class="agent-avatar">
                        <img :src="`${$imgBasePath}/agent/head.png`"
                            style=" border-radius:50%; border: 2px solid #FFF1AD;">
                        <div
                            style="position: absolute; bottom: 0px; right: 0px; width: 24px; height: 24px; background: #FFCC00; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #533726; font-weight: bold; box-shadow: 0 1px 4px rgba(0,0,0,0.12); z-index: 3;">
                            C1
                        </div>
                    </div>
                    <div class="agent-stats">
                        {{ $t('validated_bets') }}
                        <div class="bet-amount">1000</div>
                    </div>
                </div>

                <div class="agent-node ">
                    <div class="connection-node2">
                        {{ $t('c2_contribution') }} 20
                    </div>
                    <div class="agent-avatar">
                        <img :src="`${$imgBasePath}/agent/head.png`"
                            style=" border-radius:50%; border: 2px solid #FFF1AD;">
                        <div
                            style="position: absolute; bottom: 0px; right: 0px; width: 24px; height: 24px; background: #FFCC00; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #533726; font-weight: bold; box-shadow: 0 1px 4px rgba(0,0,0,0.12); z-index: 3;">
                            C2
                        </div>
                    </div>
                    <div class="agent-stats">
                        {{ $t('validated_bets') }}
                        <div class="bet-amount">2000</div>
                    </div>
                </div>

                <div class="agent-node ">
                    <div class="connection-node2">
                        {{ $t('c3_contribution') }} 600
                    </div>
                    <div class="agent-avatar">
                        <img :src="`${$imgBasePath}/agent/head.png`"
                            style=" border-radius:50%; border: 2px solid #FFF1AD;">
                        <div
                            style="position: absolute; bottom: 0px; right: 0px; width: 24px; height: 24px; background: #FFCC00; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #533726; font-weight: bold; box-shadow: 0 1px 4px rgba(0,0,0,0.12); z-index: 3;">
                            C3
                        </div>
                    </div>
                    <div class="agent-stats">
                        {{ $t('validated_bets') }}
                        <div class="bet-amount">20000</div>
                    </div>
                </div>
            </div>

            <!-- 连接线 -->
            <div class="connection-lines"></div>
        </div>

        <!-- 示例说明 -->
        <div class="descript">
            <div class="descript-title">{{ $t('example_intro') }}</div>
            <div class="descript-content">
                <p>{{ $t('example_bet_rules') }}</p>
                <p>{{ $t('example_first_line') }}</p>
                <p>{{ $t('example_second_line') }}</p>

                <ol class="mt-4">
                    <li class="mb-2">{{ $t('example_item_1') }}</li>
                    <li class="mb-2">{{ $t('example_item_2') }}</li>
                    <li class="mb-2">{{ $t('example_item_3') }}</li>
                    <li class="mb-2">{{ $t('example_item_4') }}
                        <ul class="ml-6 mt-2">
                            <li class="mb-1">{{ $t('example_item_4_1') }}</li>
                            <li class="mb-1">{{ $t('example_item_4_2') }}</li>
                            <li class="mb-1">{{ $t('example_item_4_3') }}</li>
                        </ul>
                    </li>
                    <li class="mb-2">{{ $t('example_item_5') }}
                        <ul class="ml-6 mt-2">
                            <li class="mb-3">{{ $t('example_item_5_1') }}</li>
                            <li class="mb-3">{{ $t('example_item_5_2') }}</li>
                            <li class="mb-3">{{ $t('example_item_5_3') }}</li>
                            <li class="mb-3">{{ $t('example_item_5_4') }}</li>
                            <li class="mb-3">{{ $t('example_item_5_5') }}</li>
                            <li class="mb-3">{{ $t('example_item_5_6') }}</li>
                            <li class="mb-3">{{ $t('example_item_5_7') }}</li>
                        </ul>
                    </li>
                </ol>
            </div>
        </div>

        <div style="height: 100px;"></div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { useI18n } from "vue-i18n";
import indexQR from './indexQR.vue';
const { t } = useI18n();

// 在组件初始化时获取状态
onMounted(async () => {
    // 使用延迟确保DOM已完全挂载
 

    // inviteLink.value = common.getShareLink();



    // inviteCode.value = playerInfo.value.userId;

    // getReceiveCommission();
    // 获取代理信息
    // getAgentInfo();
});
</script>

<style scoped lang="scss">




/* 内容区域 */
.content-area {
    flex: 1;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}



/* 代理网络 */
.agent-network {
    border-radius: 8px;
    // padding: 15px;
    position: relative;
}

.network-title {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    margin-bottom: 15px;
}

.performance-summary {
    // @extend .theme-agent-bg;
    padding: 15px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: var(--primary-color);
    border-radius: 8px;
}

.performance-parent {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-left: 100px;
}

.performance-row {
    gap: 2px;
    margin-left: 30px;
}

.item-label {
    font-size: 10px;
    color: white;
    margin-bottom: 2px;
}

.item-label .highlight,
.row-left .highlight,
.row-right .highlight {
    color: $theme-agent-text-color-active;
    font-weight: bold;
}

.row-left {
    font-size: 12px;
    color: white;
    line-height: 1.3;
}

.row-right {
    font-size: 12px;
    color: white;
    line-height: 1.3;
}

/* 网络图表 - 新设计 */
.network-chart {
    position: relative;
    min-height: 450px;
    margin-bottom: 20px;
    z-index: 2;

}

.line-map {
    position: absolute;
    pointer-events: none;
    /* 保证不干扰下发内容的交互 */
    z-index: 1;
    /* 可根据需要调整层级，确保不遮挡主要内容 */
    left:20px;
}

/* 连接节点样式 */
.tier-connections {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 2;
}

.tier-1-connections {
    margin-bottom: 40px;
}

.tier-mid-connections {
    margin-top: 40px;
    margin-bottom: 40px;
}

.connection-node {
    // @extend .theme-agent-bg-small;
    padding: 8px;
    font-size: 9px;
    width: 126px;
    text-align: center;
    position: relative;
    background-color: #000;
    border-radius: 8px;
}

.connection-node2 {
    // @extend .theme-agent-bg-small;
    font-size: 9px;
    padding: 2px;
    color: white;
    /* width: 126px; */
    text-align: center;
    position: relative;
    top: -80px;
    background-color: #000;
    border-radius: 8px;
}

.mid-node {
    position: absolute;
    width: 100px;
    left: 170px;
    top: 330px;

}


.connection-node.left {
    align-self: flex-start;
}

.connection-node.center {
    visibility: hidden;
}

.connection-node.right {
    align-self: flex-start;
}

.node-title {
    font-size: 9px;
    color: white;
    text-align: center;
}

.node-subtitle {
    font-size: 10px;
    color: #ccc;
    margin-top: 3px;
}

/* Agent节点样式 */
.tier-b {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 2;
    margin-top: 100px;
}

.tier-c {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 2;
    margin-top: 40px;
}

.tier-b {
    margin-bottom: 40px;
}

.agent-node {
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #000;
    margin-top: -5px;
    padding: 10px;
    width: 101px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    background-color: #000;
    border-radius: 8px;
   
}

.agent-avatar {
    width: 60px;
    height: 60px;
    /* background-color: #ffcc00; */
    /* border-radius: 50%; */
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    top: -30px;
    position: absolute;
    z-index: 2;
    overflow: hidden;
}

.agent-stats {
    font-size: 9px;
    color: var(--primary-color);
    text-align: center;
    bottom: 10px;
    position: absolute;
}

.bet-amount {
    /* font-weight: bold; */
    /* font-size: 14px; */
}


/* 示例说明区域 */
.descript {
    margin-top: 15px;
    // padding-left: 20px;
    // padding-right: 20px;
    // margin-left: 10px;
    // margin-right: 10px;
    // background: #000;
    border-radius: 6px;
    padding: 8px;

    .descript-title {
        font-weight: 500;
        font-size: 16px;
        font-weight: bold;
        padding-top: 10px;
        padding-left: 10px;
        color: var(--primary-color);
    }
    .descript-content {
        padding-top: 5px;
        padding-left: 10px;
        padding-right: 10px;
        font-weight: 500;
        font-size: 12px;
        color: #525252;
    }
}

.example-calculations {
    font-size: 12px;
    color: white;
    line-height: 1.5;
}

.calc-item {
    margin-bottom: 5px;
}

/* 动画效果 */
@keyframes pulse {
    0% {
        opacity: 0.6;  }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.6;
    }
}


/* 响应式设计 */
@media (max-width: 499px) {
    .share-methods {
        justify-content: flex-start;
    }

    .share-item {
        /* width: 20%; */
        margin-bottom: 10px;
    }
}

.level-item {
    margin-left: 15px;
    /* 移除左边距 */
  }
  
</style> 