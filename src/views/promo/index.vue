<template>
  <div class="main-box">
    <!-- 顶部切换菜单 -->
    <!-- <div class="menu-tab-box">
      <div
        class="menu-tab"
        :class="{ 'menu-tab-active': curUsTab == 'event' }"
        @click="changeUs('event')"
      >
        <span class="menu-tab-title">
          {{ $t("110005") }}
          <i class="red-dot" v-if="eventRedDot">{{ eventRedDot }}</i>
        </span>
      </div>
      <div
        class="menu-tab"
        :class="{ 'menu-tab-active': curUsTab == 'mission' }"
        @click="changeUs('mission')"
      >
        <span class="menu-tab-title">
          {{ $t("101006") }}
        </span>
      </div>
    </div> -->

    <!-- 主体部分 -->
    <div class="main-content">
      <!-- event页面 -->
      <div class="event-list-box" v-show="curUsTab == 'event'">
        <!-- event列表 -->
        <div v-if="activityList.length" class="event-list space-y-3">
          <div
            v-for="(item, index) in activityList"
            :key="index"
            class="event-item"
            @click="Common.eventJump(item.openType, item.jumpUrl)"
          >
            <i class="red-dot" v-if="item.ReddotNum">{{ item.ReddotNum }}</i>
            <img class="active-img" :src="item.Img" />
            <p class="title">{{ $t(item.activityTitle) }}</p>
            <p class="content">

              <div v-html="item.activityContent" style="white-space: pre-line;"></div>
            </p>
            <!-- <div v-html="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'"></div> -->
            <div class="btnbox">
              <van-button
                class="theme-btn-submit btn-jump"
              >
                Expandir para mais
              </van-button>
            </div>
          </div>
        </div>

        <!-- 无数据状态 -->
        <NoData v-else />
      </div>

      <!-- mission页面 -->
      <div class="mission-list-box" v-show="curUsTab == 'mission'">
        <!-- mission列表 -->
        <div v-if="missionList.length">
          <div v-for="(item, index) in missionList" :key="index">
            <div class="mission-item">
              <!-- 左侧图标 -->
              <img :src="item.imgUrl" class="mission-icon" />

              <!-- 中间内容 -->
              <div class="mission-content">
                <!-- 标题文案 -->
                <div class="mission-title">{{ $t(item.taskName) }}</div>

                <!-- 进度条文案 -->
                <div class="mission-progress-box">
                  <!-- 任务1文案特殊处理 -->
                  <span>{{ `${item.statusName} / ${1}` }}</span>
                  <div class="progress-box">
                    <van-progress
                      class="progress"
                      :show-pivot="false"
                      :percentage="item.Progress"
                    />
                  </div>
                </div>
              </div>

              <!-- 右侧按钮 -->
              <div class="mission-btn-box">
                <van-button
                  :class="
                    item.status == 2
                      ? 'theme-btn-disable-small'
                      : 'theme-btn-submit-small'
                  "
                  :disabled="debounce"
                  class="mission-btn"
                  @click="jumpMission(item)"
                >
                  {{ item.btnName }}
                </van-button>

                <div class="mission-money">
                  <img
                    :src="`${$imgBasePath}/event/icon_money.png`"
                    class="h-[16px] mr-2"
                  />
                  {{ Common.toFixed2(item.taskReward) }}
                </div>
              </div>
              <div></div>
            </div>
            <!-- 分割线 -->
            <img
              :src="`${$imgBasePath}/event/line.png`"
              v-if="index != missionList.length - 1"
            />
          </div>
        </div>

        <!-- 无数据状态 -->
        <NoData v-else />

        <!-- 说明文案 -->
        <div class="illustrate">
          <p class="my-[10px]">{{ $t("105013") }}</p>
          <p>{{ $t("105014") }}</p>
          <p class="my-[10px]">{{ $t("105015") }}</p>
          <p>{{ $t("105016") }}</p>
          <p>{{ $t("105017") }}</p>
          <p>{{ $t("105018") }}</p>
          <p>{{ $t("105019") }}</p>
        </div>
      </div>
    </div>

    <!-- 保存网址教程 -->
    <Tutorial ref="tutorialRef" />
  </div>

  <!-- 免费转盘 -->
  <!-- <PopupMarquee /> -->
  <!-- 三礼包 -->
  <!-- <PopupThirdRecharge /> -->
  <!-- 奖励弹窗 -->
  <RewardBox ref="rewardBox"></RewardBox>
</template>

<script setup lang="ts" name="Promo">
import NoData from "@/components/NoData/index.vue";
import Tutorial from "./Tutorial.vue";
import {
  globalActivityApi,
  fuxingTaskListApi,
  updateFuxingTaskApi,
  fuxingTaskDrawApi
} from "@/api/promo/index";
import {getCommissionApi} from "@/api/share/index";
import { onActivated, ref, getCurrentInstance, inject, Ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import Common from "@/utils/common/common";
import router from "@/router/index";
import { showTipModel } from "@/components/TipModel/index";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
// import PopupMarquee from "@/views/activityPopup/Marquee/index.vue";
// import PopupThirdRecharge from "@/views/activityPopup/thirdRecharge/index.vue";

const { proxy } = getCurrentInstance();

const route = useRoute();

// 多语言
const { t } = useI18n();

// 默认图片路径
const $imgBasePath = proxy.$imgBasePath;

// 选中tab
const curUsTab = ref("event");
// 切换tab
const changeUs = (val: "event" | "mission") => {
  if (useUserStoreHook().isLogin) {
    if (curUsTab.value == val) return;

    curUsTab.value = val;

    if (val == "event") {
      getActivityList();
    }

    if (val == "mission") {
      getMissionList();
    }
  } else {
    useUserStoreHook().openLogin();
  }
};

// 活动列表红点
const eventRedDot = ref(0);
// 活动列表
const activityList = ref([]);
const pageLookTimes = ref(0);
// 获取活动列表
const getActivityList = async () => {
  let handlingCache = 2;
  if (pageLookTimes.value > 0) {
    handlingCache = 1;
  }

  let { code, data }: any = await globalActivityApi({}, handlingCache);
  if (code == 200) {
    let newList = data.data;
    let lang = Common.getCurLang();
    for (let i of newList) {
      i.Img = `${$imgBasePath}/event/${lang}/${i.img}.png`;
    }
    activityList.value = newList;
  }
};

// 保存网址教程ref实例
const tutorialRef = ref();
// 任务列表
const missionList = ref([]);
// 获取任务列表
const getMissionList = async () => {
  let { code, data }: any = await fuxingTaskListApi();
  if (code == 200) {
    data.data.map(item => {
      item.imgUrl = `${$imgBasePath}/event/${item.taskIcon}.png`;
      item.statusName = item.status == 0 ? 0 : 1;
      item.Progress = item.status == 0 ? 0 : 100;
      item.btnName = item.status == 0 ? t("105010") : t("105011");
    });
    missionList.value = data.data;
  }
};

// 特别处理活动推荐文字
const handleActivityContent = async () => {
  let { code, data }: any = await getCommissionApi();
  if (code == 200) {
    const {firstCharge, firstChargePercent, firstChargeCommission, firstChargePercentCommission} =data.data
    activityList.value.map((item) => {
      item.activityContent = t(item.activityContent)
      // console.log(item.activityContent, 'item')
      if (item.jumpUrl == 'share') {
        item.activityContent = t('105042', [t('107043', [firstCharge]),t('107043', [firstChargePercent]) , t('107043', [firstChargeCommission]), firstChargePercentCommission]);
      }
    })
  }
};

// 执行任务
const jumpMission = item => {
  if (useUserStoreHook().isLogin) {
    if (item.status == 0) {
      switch (item.id) {
        // 跳转充值
        case 1000:
          router.push("/deposit");
          break;
        // 打开app下载
        case 1001:
          Common.downloadApp();
          finishMission(item.id);
          break;
        // 保存网址教程
        case 1002:
          tutorialRef.value.show();
          finishMission(item.id);
          break;
        // 跳转官方群
        case 1003:
          window.openWin(item.taskJump);
          finishMission(item.id);
          break;
      }
    } else if (item.status == 1) {
      // 必须首冲完成才能领取
      if (missionList.value[0].status != 0) {
        getReward(item.id);
      } else {
        showTipModel({
          type: 1,
          icon: "fail",
          title: t("105002")
        });
      }
    }
  } else {
    useUserStoreHook().openLogin();
  }
};
// 完成任务
const finishMission = async id => {
  let { code }: any = await updateFuxingTaskApi(id);
  if (code == 200) await getMissionList();
};
// 奖励弹窗ref实例
const rewardBox = ref();

const debounce = ref(false);
// 领取奖励
const getReward = async (taskId: any) => {
  debounce.value = true;
  setTimeout(() => {
    // 关闭请求锁
    debounce.value = false;
  }, 3000);
  let { code, data }: any = await fuxingTaskDrawApi(taskId);
  if (code === 200) {
    rewardBox.value.show({
      gold: Common.toFixed2(data.data)
    });
    await getMissionList();
  }
};

onActivated(async () => {
  // 获取地址栏参数，判断是否默认tab
  if (route.query.tab) {
    curUsTab.value = route.query.tab as string;
  }
  await getActivityList();
  // getMissionList();
  await handleActivityContent();
  pageLookTimes.value++;
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
