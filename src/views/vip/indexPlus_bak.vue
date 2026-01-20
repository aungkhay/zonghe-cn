<template>
  <div class="top-box top-box-margin">
    <div class="vip-info">
      <div
        class="vip-info-title">
        <span>
          {{ $t("777006") }}
        </span>
      </div>
      <div class="vip-logo-container">
        <img :src="`${$imgBasePath}/newInfo/vip_logo.png`" class="vip-logo" />
        <span class="my-vip-level-label vip-level-position">
          <span>{{ playerInfo.vipLevel }}</span>
        </span>
      </div>

      <div class="next-vip-text next-vip-text-flex">
        <div class="vip-info-align">
          <span class="vip-info-label">{{ $t('104000') }}</span>
          <span class="vip-level">
            <i>VIP{{ playerInfo.vipLevel+1 }}</i>
          </span>
        </div>
        <!-- <div class="vip-info-label" v-html="modelProps.vipText"></div> -->
        <div class="vip-info-align">
          <div class="vip-info-label">{{ $t('777001') }}</div>
          <span class="next-bet-num">
            {{ Common.formatNum2Data(Number(modelProps.nextBetNum),true) }}
          </span>

        </div>

      </div>
      <div v-scaleTap class="right" :class="modelProps.DailyRewardStatus ? 'right-active' : 'right-inactive'" @click="onCollect()">
        <span :class="modelProps.DailyRewardStatus ? 'active-text-color' : 'inactive-text-color'">
          {{ $t("104002") }}
        </span>
      </div>
      <div v-scaleTap class="right mt-[35px] right-active" @click="toHistory()">
        <span class="text-[var(--text-white)]">
          {{ $t("104006") }}
        </span>
      </div>
     
    </div>
  </div>

  <!-- VIP选项卡 -->
  <div class="vip-tabs vip-tabs-margin">
    <div class="title1">{{ $t("777002") }}</div>

    <div class="vip-tab-header">
      <div v-for="(tab, index) in tabs" :key="index" :class="['vip-tab-item', { active: activeTab === index }]"
        @click="switchTab(index)">
        {{ tab.title }}
      </div>
      <div class="tab-indicator" :style="{ left: indicatorLeft + 'px' }"></div>
    </div>
    <div class="tab-divider"></div>

  </div>

  <!-- VIP列表 - 每个选项卡的内容 -->
  <div class="vip-tab-content">
    <!-- 奖励增长列表 - 三列 -->
    <div v-show="activeTab === 0" class="vip-list vip-list-padding">
      <div class="vip-list-header">
        <div class="vip-list-cell">{{ $t("104010") }}</div>
        <div class="vip-list-cell with-info">{{ $t("104011") }} <span v-scaleTap class="info-icon info-icon-color" @click="onShowTips()">?</span></div>
        <div class="vip-list-cell">{{ $t("104012") }}</div>
      </div>
      <div class="vip-list-rows" ref="vipListRefGrowth">
        <div v-for="(item, index) in modelProps.vipConfigList" :key="index"
          :class="['vip-list-row', { 'active-row': playerInfo.vipLevel === item.vipLevel }]">
          <div class="vip-list-cell level-cell">
          
            <div class="level-container">
              <img :src="`${$imgBasePath}/newInfo/vip_logo.png`" class="level-logo" />
              <span class="my-vip-level-label level-label-position">
                <span>{{ item.vipLevel }}</span>
              </span>
            </div>
          </div>
          <div class="vip-list-cell">
            <div  class="progress-container">
              <div
                v-if="item.vipLevel > playerInfo.vipLevel"
                class="progress-value"
              >{{ Common.formatNum2Data(item.vipAccRecharge,true) }}</div>
              <div v-else-if="item.vipLevel==0">
                <span class="progress-value">—</span>
              </div>
              <div v-if="playerInfo.vipLevel+1=== item.vipLevel" class="progress-bar progress-bar-relative">
                <div class="progress-fill" :style="{ width: getProgressWidth(item.vipAccRecharge) + '%' }"></div>
                <span class="progress-text">
                  {{ Common.formatNum2Data(modelProps.curBetNum,true) }} / {{ Common.formatNum2Data(item.vipAccRecharge,true) }}
                </span>
              </div>
              <div v-else-if="playerInfo.vipLevel +1 > item.vipLevel && item.vipLevel>0" class="progress-bar progress-bar-relative">
                <div class="progress-fill" :style="{ width: getProgressWidth(item.vipAccRecharge) + '%' }"></div>
                <span class="progress-text">
                  {{ Common.formatNum2Data(item.vipAccRecharge,true) }} / {{ Common.formatNum2Data(item.vipAccRecharge,true) }}
                </span>
              </div>
            </div>
          </div>
          <div class="vip-list-cell">
            <span class="bonus-value">—</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 每周奖励选项卡 - 两列 -->
    <div v-show="activeTab === 1" class="vip-list vip-list-padding">
      <div class="vip-list-header">
        <div class="vip-list-cell">{{ $t("104010") }}</div>
        <div class="vip-list-cell">{{ $t("104014") }}</div>
      </div>
      <div class="vip-list-rows" ref="vipListRefWeekly">
        <div v-for="(item, index) in modelProps.vipConfigList" :key="index"
          :class="['vip-list-row', { 'active-row': playerInfo.vipLevel === item.vipLevel }]">
          <div class="vip-list-cell level-cell">
           
            <div class="level-container">
              <img :src="`${$imgBasePath}/newInfo/vip_logo.png`" class="level-logo" />
              <span class="my-vip-level-label level-label-position">
                <span>{{ item.vipLevel }}</span>
              </span>
            </div>
          </div>
          <div class="vip-list-cell">
            <span class="bonus-value">{{ Common.toFixed2(item.weekReward || 0) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 每月奖励选项卡 - 两列 -->
    <div v-show="activeTab === 2" class="vip-list vip-list-padding">
      <div class="vip-list-header">
        <div class="vip-list-cell">{{ $t("104010") }}</div>
        <div class="vip-list-cell">{{ $t("104015") }}</div>
      </div>
      <div class="vip-list-rows" ref="vipListRefMonthly">
        <div v-for="(item, index) in modelProps.vipConfigList" :key="index"
          :class="['vip-list-row', { 'active-row': playerInfo.vipLevel === item.vipLevel }]">
          <div class="vip-list-cell level-cell">
          
            <div class="level-container">
              <img :src="`${$imgBasePath}/newInfo/vip_logo.png`" class="level-logo" />
              <span class="my-vip-level-label level-label-position">
                <span>{{ item.vipLevel }}</span>
              </span>
            </div>
          </div>
         
          <div class="vip-list-cell">
            <span class="bonus-value">{{ Common.toFixed2(item.monthReward || 0) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- VIP特权选项卡 - 四列 -->
    <div v-show="activeTab === 3" class="vip-list">
      <div class="vip-list-header four-columns">
        <div class="vip-list-cell">{{ $t("104019") }}</div>
        <div class="vip-list-cell">VIP 1-5</div>
        <div class="vip-list-cell">VIP 6-15</div>
        <div class="vip-list-cell">VIP 16+</div>
      </div>
      <div class="vip-list-rows" ref="vipListRefPrivilege">
        <div v-for="(item, index) in vipPrivileges" :key="index" class="vip-list-row four-columns">
          <div class="vip-list-cell">
            <span class="privilege-name">{{ item.attribute }}</span>
          </div>
          <div class="vip-list-cell">
            <span class="privilege-value">{{ item.value2 }}</span>
          </div>
          <div class="vip-list-cell">
            <span class="privilege-value">{{ item.value3 }}</span>
          </div>
          <div class="vip-list-cell">
            <span class="privilege-value">{{ item.value4 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- vip表 - 保留原来的表格但默认隐藏 -->
  <div class="vip-table vip-table-hidden">
    <!-- <div class="title1" style="margin-top: 20px;">{{ $t("777002") }}</div> -->
    <div class="table-box" ref="tableRef">
      <div ref="tableRefitem" :class="{ 'actable': playerInfo.vipLevel == item.vipLevel }" class="table-item"
        v-for="(item, index) in modelProps.vipConfigList" :key="index">
        <div class="flex gap-[5px]">
          <div class="item">
            <!-- <img :src="`${$imgBasePath}/vip/vip_${item.vipLevel}.png`" class="w-[34px]"> -->
            <div class="mt-[5px] vptext">Lv {{ item.vipLevel }}</div>
          </div>
          <div class="item bg-second">
            <span> {{ $t('107043', [Common.toFixed2(item.vipAccRecharge)]) }}</span>
            <span>{{ $t("104004") }}</span>
          </div>
          <div class="item bg-third">
            <!-- <span> {{ $t('107043', [Common.toFixed2(item.dayReward)]) }}</span> -->
            <span>{{ $t("104005") }}</span>
          </div>
        </div>
        <div class="rechargeProgress" v-if="playerInfo.vipLevel == item.vipLevel">
          <div class="title">
            <span>{{ $t('104004') }} :</span>
            <div v-scaleTap class="flex items-center" @click="toHistory()">{{ $t("104009") }}</div>
          </div>
          <div class="progress-box">
            <span>{{ Common.toFixed2(playerInfo.rechargeAmount) }} / {{
              Common.toFixed2(modelProps.nextRechargeNum)
            }}</span>
            <div class="vip-progress-bg2">
              <van-progress class="vip-progress-bet" :show-pivot="false"
                :percentage="modelProps.rechargeProgress >= 100 ? 100 : modelProps.rechargeProgress" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bottom-sm">
    <div class="title">{{ $t("104008") }}</div>
    <div class="content">{{ $t("104007") }}</div>
  </div>

  <RewardBox ref="rewardBox" @confirm="confirmReward"></RewardBox>
</template>

<script setup lang="ts" name="vipPlus">
import { ref, onMounted, computed, nextTick, onUnmounted } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { vipDrawApi, vipInfoApi, vipListApi } from "@/api/vip/index";
import router from "@/router/index";
import Common from "@/utils/common/common";
import { useI18n } from "vue-i18n";
import { showTipModel } from "@/components/TipModel";
import common from "@/utils/common/common";
const { t } = useI18n();
const rewardBox = ref();

const rewardGold = ref(0);

const playerInfo = computed(() => {
  return useUserStoreHook().playerInfo;
});


// 选项卡定义
const tabs = ref([
  { title: t('104021'), key: 'level-up' },
  { title: t('104016'), key: 'weekly' },
  { title: t('104017'), key: 'monthly' },
  // { title: t('104018'), key: 'privilege' }
]);
const activeTab = ref(0);
const indicatorLeft = ref(0);

const onShowTips = () => {
  showTipModel({
  type: 2,                    // 确认弹窗类型
  title: t('104021'),              // 标题
  subTitle: t('104022'), // 副标题/内容
  // yesBtnText: "OK",         // 确认按钮文字
  // cancelBtnText: "取消",      // 取消按钮文字（如果不需要可以不设置）
  showXX: true,               // 是否显示右上角关闭按钮
  success: function() {       // 点击确认按钮的回调函数
    // 确认后的操作
  },
  cancel: function() {        // 点击取消按钮的回调函数
    // 取消后的操作
  }
});
}

// 选项卡切换
const switchTab = (index) => {
  activeTab.value = index;
  // 获取选中的选项卡元素
  nextTick(() => {
    const tabItems = document.querySelectorAll('.vip-tab-item');
    if (tabItems && tabItems[index]) {
      const tabItem = tabItems[index] as HTMLElement;
      const tabHeader = document.querySelector('.vip-tab-header') as HTMLElement;
      const tabIndicator = document.querySelector('.tab-indicator') as HTMLElement;

      if (tabItem && tabHeader && tabIndicator) {
        // 获取选项卡宽度
        const tabWidth = tabItem.offsetWidth;

        // 这里使用相对于容器的位置，因为tab-indicator现在位于vip-tab-header内部
        const tabItemLeft = tabItem.offsetLeft;

        // 设置指示器位置和宽度
        indicatorLeft.value = tabItemLeft + tabWidth / 2 - 20;
        tabIndicator.style.width = `${40}px`;

        // 确保滚动容器可以看到选中的选项卡
        tabHeader.scrollLeft = tabItemLeft - tabHeader.offsetWidth / 2 + tabWidth / 2;
      }
    }
    
    // 切换标签后，滚动到当前VIP等级
    scrollToCurrentVipLevel();
  });
};

// VIP特权数据
const vipPrivileges = computed(() => {
  return [
    { attribute: t('104019') + ' 1', value1: '1', value2: '2', value3: '3', value4: '4' },
    { attribute: t('104019') + ' 2', value1: '5', value2: '10', value3: '15', value4: '20' },
    { attribute: t('104019') + ' 3', value1: '2%', value2: '5%', value3: '8%', value4: '10%' },
    { attribute: t('104019') + ' 4', value1: '1000', value2: '2000', value3: '5000', value4: '10000' },
  ];
});

// 计算进度条宽度
const getProgressWidth = (targetValue) => {
  const current = Number(modelProps.value.curBetNum);
  const target = Number(targetValue);
  if (current >= target) return 100;
  if (target === 0) return 0;
  return (current / target) * 100;
};

// 定义变量
let modelProps = ref({
  vipConfigList: [],
  vipText: '',
  curRechargeNum: 0,  //当前领取
  nextRechargeNum: 0, //下一级
  maxRechargeNum: 0,  //最大领取
  betProgress: 0,  // 提现进度
  rechargeProgress: 0,  //充值进度
  curBetNum: '0',
  nextBetNum: '0',
  DailyRewardStatus: false, //是否有可领取奖励
  // DayRewardNumText: ''
});
const needBetNum = computed(() => {
  const result = Number(modelProps.value.nextBetNum) - Number(modelProps.value.curBetNum);
  return result < 0 ? 0 : result;
})


// const betProgress = computed(() => {
//     return (Number(playerInfo.value.totalBet) / Number(modelProps.value.curBetNum)) * 100;
// });

const getvipConfig = async () => {
  let { code, data }: any = await vipListApi();
  if (code == 200) {
    //将data.data的数据按vipLevel的从小到大排序
    data.data.sort((a, b) => a.vipLevel - b.vipLevel);
    data.data.map((item) => {
      // 去0
      // item.dayReward = Common.formatStringToNumber(item.dayReward);
      item.vipAccRecharge = Common.formatStringToNumber(item.upNeedBet);
      // item.vipAccRecharge =0;
      // 添加每周和每月奖励的模拟数据(根据实际接口调整)
      // item.weekReward = item.weekReward;
      // item.monthReward = item.monthReward;
    })

    modelProps.value.nextRechargeNum = data.data[playerInfo.value.vipLevel + 1 >= 36 ? 36 : playerInfo.value.vipLevel + 1].vipAccRecharge;
    modelProps.value.rechargeProgress = (Number(playerInfo.value.rechargeAmount) / data.data[playerInfo.value.vipLevel + 1 >= 36 ? 36 : playerInfo.value.vipLevel + 1].vipAccRecharge) * 100
    modelProps.value.vipConfigList = data.data;
    // modelProps.value.curRechargeNum = data.data[playerInfo.value.vipLevel].dayReward;
    // modelProps.value.maxRechargeNum = data.data[data.data.length - 1].dayReward;
    // modelProps.value.vipText = t("104001", [`<span class='money'>${data.data[playerInfo.value.vipLevel + 1].dayReward}</span>`, `<span class='money'>${data.data[data.data.length - 1].dayReward}</span>`])
  }
}

const getVipInfo = async () => {
  let { code, data }: any = await vipInfoApi();
  if (code == 200) {

    updateInfo(data);
    // const { vipLevel, rewardBet, currentBet } = data.data
    // const canGet = data.data.canReceiveTotal > 0;
    // rewardGold.value = data.data.canReceiveTotal || 0;
    // // modelProps.value.DayRewardNumText = t('107043', [Common.toFixed2(dayReward)])
    // modelProps.value.DailyRewardStatus = canGet
    // // 打码量
    // if (vipLevel == 0) {
    //   if (currentBet !== undefined && currentBet !== null) {
    //     modelProps.value.curBetNum = currentBet // 当前打码
    //   }
    //   if (rewardBet !== undefined && rewardBet !== null) {
    //     modelProps.value.nextBetNum = rewardBet  //下级打码
    //   }
    //   modelProps.value.betProgress = 100
    // } else {
    //   modelProps.value.curBetNum = currentBet // 当前打码
    //   modelProps.value.nextBetNum = rewardBet  //下级打码
    //   let Progress: any = (Number(currentBet) / Number(rewardBet)) * 100
    //   if (Number(currentBet) > Number(rewardBet)) {
    //     modelProps.value.betProgress = 100
    //   } else {
    //     modelProps.value.betProgress = Progress
    //   }
    // }
  }
};

const updateInfo = (data)=>{
  const { vipLevel, rewardBet, currentBet } = data.data
  const canGet = data.data.canReceiveTotal > 0;
    rewardGold.value = data.data.canReceiveTotal || 0;
    // modelProps.value.DayRewardNumText = t('107043', [Common.toFixed2(dayReward)])
    modelProps.value.DailyRewardStatus = canGet
    // 打码量
    if (vipLevel == 0) {
      if (currentBet !== undefined && currentBet !== null) {
        modelProps.value.curBetNum = currentBet // 当前打码
      }
      if (rewardBet !== undefined && rewardBet !== null) {
        modelProps.value.nextBetNum = rewardBet  //下级打码
      }
      modelProps.value.betProgress = 100
    } else {
      modelProps.value.curBetNum = currentBet // 当前打码
      modelProps.value.nextBetNum = rewardBet  //下级打码
      let Progress: any = (Number(currentBet) / Number(rewardBet)) * 100
      if (Number(currentBet) > Number(rewardBet)) {
        modelProps.value.betProgress = 100
      } else {
        modelProps.value.betProgress = Progress
      }
    }
}

const toHistory = () => {
  // 直接跳转到TopMenuBar的history对应路径
  router.push("/vipPlus/history");
  
  // 通过事件触发顶部菜单栏的激活状态更新
  // 如果系统中有提供全局事件总线，可以通过全局事件触发
  // 如果没有，路由变化会自动触发TopMenuBar中的路由监听
  nextTick(() => {
    // 路由变化后TopMenuBar会自动更新激活状态
    // 这里不需要额外操作，因为TopMenuBar已经监听了路由变化
  });
};

const onCollect = Common.debounce(async () => {

  const reward= rewardGold.value;

  if (!modelProps.value.DailyRewardStatus) return;
  let { code, data }: any = await vipDrawApi();
  if (code === 200) {

    // rewardBox.value.show({
    //   gold: data.data.canReceiveTotal || reward
    // });
    // updateInfo(data);
     // 统一组件
     //刷新
     showTipModel({
          type: 4,
          title: t("receive_success", [common.formatNum(data.data.canReceiveTotal || reward) || 0]),
          icon: "success",
          success: () => {
             getVipInfo();
          }
    });
    updateInfo(data);
    

  }
}, 500);

const tableRef = ref(null);

const scrollToHighlightedItem = () => {
  if (playerInfo.value.vipLevel == 0) return
  requestAnimationFrame(() => {
    const highlightedElement = tableRef.value.querySelector('.actable');
    if (highlightedElement) {
      highlightedElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
};
const confirmReward = async () => {
  getVipInfo();
};

const vipListRef = ref(null);

// 添加滚动监听器的引用
const vipListRefGrowth = ref(null);
const vipListRefWeekly = ref(null);
const vipListRefMonthly = ref(null);
const vipListRefPrivilege = ref(null);

// 滚动到当前VIP等级
const scrollToCurrentVipLevel = () => {
  nextTick(() => {
    // 根据当前激活的标签页选择正确的列表容器
    let listSelector = '.vip-list-rows';
    
    // 根据activeTab获取当前激活的列表
    switch (activeTab.value) {
      case 0:
        listSelector = '.vip-list:nth-child(1) .vip-list-rows';
        break;
      case 1:
        listSelector = '.vip-list:nth-child(2) .vip-list-rows';
        break;
      case 2:
        listSelector = '.vip-list:nth-child(3) .vip-list-rows';
        break;
      case 3:
        // 第四个标签页没有active-row，是特权页面
        return;
      default:
        listSelector = '.vip-list:nth-child(1) .vip-list-rows';
    }
    
    // 获取当前列表容器和激活行
    const listContainer = document.querySelector(listSelector) as HTMLElement;
    const activeRow = document.querySelector(`${listSelector} .active-row`) as HTMLElement;
    
    if (activeRow && listContainer) {
      setTimeout(() => {
        // 计算activeRow相对于listContainer的位置
        const scrollTop = activeRow.offsetTop - listContainer.offsetTop - (listContainer.clientHeight / 2) + (activeRow.clientHeight / 2);
        
        listContainer.scrollTo({ 
          top: scrollTop, 
          behavior: 'smooth' 
        });
      }, 300);
    }
  });
};

// 添加列表滚动监听器
const setupListScrollListener = (listElement: HTMLElement) => {
  if (!listElement) return;

  let isScrolling = false;
  let isTouching = false;
  let lastScrollTop = 0;

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    // 检查是否滚动到底部（允许3px的误差）
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 3;
    
    // 检查是否正在向下滚动
    const isScrollingDown = scrollTop > lastScrollTop;
    lastScrollTop = scrollTop;
    
    // 只有在用户正在触摸（移动端）或者正在滚动（桌面端）且到达底部时才触发页面滚动
    if (isAtBottom && isScrollingDown && !isScrolling) {
      // 防止重复触发
      isScrolling = true;
      
      // 获取列表容器在页面中的位置
      const listRect = target.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // 检查列表是否仍在可视区域内
      if (listRect.bottom > 0 && listRect.top < windowHeight) {
        // 触发页面向下滚动
        const scrollAmount = Math.min(40, windowHeight * 0.08); // 减少滚动距离，更自然
        
        window.scrollBy({
          top: 200,
          behavior: 'smooth'
        });
        console.log('scrollAmount', scrollAmount)
      }
      
      // 短暂延迟后重置状态，允许连续滚动
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }
  };

  // 触摸开始时标记正在触摸
  const handleTouchStart = () => {
    isTouching = true;
  };

  // 触摸结束时取消触摸状态
  const handleTouchEnd = () => {
    isTouching = false;
    // 重置滚动状态
    setTimeout(() => {
      isScrolling = false;
    }, 200);
  };

  // 添加滚动和触摸监听器
  listElement.addEventListener('scroll', handleScroll, { passive: true });
  listElement.addEventListener('touchstart', handleTouchStart, { passive: true });
  listElement.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  // 返回清理函数
  return () => {
    listElement.removeEventListener('scroll', handleScroll);
    listElement.removeEventListener('touchstart', handleTouchStart);
    listElement.removeEventListener('touchend', handleTouchEnd);
  };
};

// 设置所有列表的滚动监听器
const setupAllScrollListeners = () => {
  nextTick(() => {
    // 获取所有VIP列表容器
    const listContainers = document.querySelectorAll('.vip-list-rows') as NodeListOf<HTMLElement>;

    // 清理函数数组
    const cleanupFunctions: (() => void)[] = [];

    // 为每个列表容器设置滚动监听器
    listContainers.forEach((container) => {
      if (container) {
        const cleanup = setupListScrollListener(container);
        if (cleanup) {
          cleanupFunctions.push(cleanup);
        }
      }
    });

    // 在组件卸载时清理监听器
    onUnmounted(() => {
      cleanupFunctions.forEach(cleanup => cleanup());
    });
  });
};

onMounted(async () => {
  await getVipInfo();
  await getvipConfig();

  // 初始化选项卡指示器位置
  nextTick(() => {
    // 默认选中第一个选项卡
    switchTab(0);
    // 滚动到当前VIP等级
    scrollToCurrentVipLevel();
    // 设置列表滚动监听器
    setupAllScrollListeners();
  });
});

nextTick(() => {
  // bug必须延时器，不然dom没生成
  setTimeout(() => {
    scrollToHighlightedItem();
  }, 1000)
})
</script>
<style lang="scss" scoped>
@import "./indexPlus.scss";
</style>
