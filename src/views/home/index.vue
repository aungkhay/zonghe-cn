<template>
  <!-- 加载页 -->
  <LoadingPage ref="loadingPage"></LoadingPage>
  <!-- 顶部导航栏 -->
  <topNav ref="topNavBar" @enterLoginBtn="enterLoginBtn" @emitChangeLeft="changeLeftMenu" :isRotated="showLeftMenu"
    @enterDeposit="enterDeposit"></topNav>

  <!-- 首页主体部分 -->
  <div class="main-box">

    <div class="bg-[var(--nav-bar-background)] shadow-sm rounded-b-[25px] h-[250px]">
      <!-- 轮播图 -->
      <div class="swipe-boxs">
        <van-swipe class="swipe-box" :autoplay="2500" indicator-color="#FFF">
          <van-swipe-item v-scaleTap v-for="(item, index) in bannerList" :key="index" @touchstart="onTouchStart"
            @touchmove="onTouchMove" @touchend="onTouchEnd(item)">
            <img @dragstart.prevent :src="item.imgSmall" class="max-h-[140px]" />
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- 广播公告 -->
      <div class="notice-box mt-2">
        <van-icon :name="notice_gif" class="theme-svg-color text-[20px]" />

        <!-- <svg-icon class="theme-svg-color text-[20px]" name="notice_gif" /> -->
        <van-notice-bar class="notice" :text="noticeText" />
      </div>

      <!-- <div class="flex justify-center items-center mt-[5px]">
        <moneyGrow />
      </div> -->

      <div class="flex justify-between items-center mx-2 py-2">
        <div class="text-sm" v-if="isLogin">
          <div class="text-[var(--grey-text)] font-bold text-[18px]">
            <span>{{ $t('profile.account') }}:</span>
            <span class="ml-[4px]">{{ playerInfo?.userName }}</span>
          </div>
          <div class="text-[var(--grey-text)]">
            <span>ID:</span>
            <span class="ml-[4px]">{{ playerInfo.userId }}</span>
          </div>
        </div>
        <div class="text-sm" v-else>
          <div class="text-[var(--grey-text)] font-bold text-[18px]">
            <span>{{ $t("not_login") }}</span>
          </div>
          <div class="text-[var(--grey-text)]">
            <span>{{ $t("login_first") }}</span>
          </div>
        </div>
        <div class="flex items-center justify-center space-x-2">
          <div class="flex flex-col items-center cursor-pointer" @click="enterDeposit()">
            <img :src="`${$imgBasePath}/home/deposit.png`" class="h-11" alt="" srcset="">
            <div class="text-[11px] mt-[-3px]">{{ $t("110002") }}</div>
          </div>
          <div class="flex flex-col items-center cursor-pointer" @click="goToWithdraw()">
            <img :src="`${$imgBasePath}/home/withdrawal.png`" class="h-11" alt="" srcset="">
            <span class="text-[11px] mt-[-3px]">{{ $t("110003") }}</span>
          </div>
          <!-- <div class="flex flex-col items-center cursor-pointer" @click="goToAgent()">
            <img :src="`${$imgBasePath}/home/Agent.png`" class="h-11" alt="" srcset="">
            <span class="text-[11px] mt-[-3px]">{{ $t("110006") }}</span>
          </div> -->
          <div class="flex flex-col items-center cursor-pointer" @click="goToVip()">
            <img :src="`${$imgBasePath}/home/vipIcon.png`" class="h-11" alt="" srcset="">
            <span class="text-[11px] mt-[-3px]">{{ $t("106027") }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏模块 -->
    <!-- 热门 -->
    <div class="flex pr-2 space-x-2 pt-2">

      <div class="w-[65px]">
        <van-sticky :offset-top="50" @scroll="onStickyScroll">
          <div class="sidebar">
            <!-- Sliding background -->
            <div class="slider-bg" :style="`transform: translateY(${tabPosition * 70}px)`"></div>

            <!-- Tabs -->
            <div v-for="(item, index) in filteredGameTabList" :key="index" class="tab border-none"
              :class="{ active: tabIndex == item.key }" @click="changeTab(item.key, index)">
              <div class="flex flex-col items-center rounded-md mb-3 py-1 space-x-1 cursor-pointer"
                :class="tabIndex == item.key ? 'text-white' : 'text-[#111]'">
                <!-- <img :src="$imgBasePath + '/home/home-category/' + item.acImg_Key + `${tabPosition != index ? '-inactive' : ''}` + '.png'" class="w-[30px] h-auto" /> -->
                <img :src="getTabIcon(item, index)" class="w-[30px] h-auto" />
                <div class="game-tab-item-text text-[11px] transition" :class="{ 'active': tabIndex == item.key }">
                  {{ t(item.gameKey) }}
                </div>
              </div>
            </div>
          </div>
        </van-sticky>
      </div>

      <div class="flex-1 overflow-y-auto overflow-x-hidden pb-10 h-full">

        <div class="main-game">
          <div id="Popular" v-show="tabIndex == 'Popular' && hotGameList.length > 0 ">
            <LobbyGameBlock curGameTabKey="Popular" :gameList="hotGameList" :showPopularMore="showPopularMore"
              @toGamePage="toGamePage" />
            <!-- 显示更多热门游戏 -->
            <div class="popular-more mb-5" v-show="hotGameList.length > 0">
              <div v-scaleTap class="popular-more-btn space-x-2" @click="showPopularMore = !showPopularMore">
                <span>{{!showPopularMore ? $t("110011") : $t("show_less") }}</span>
                <svg-icon class="text-[var(--primary-color)] text-[14px]" name="chevrons_down"
                  :class="{ 'rotate-180': showPopularMore }" />
              </div>
            </div>
          </div>

          <!-- <div v-show="tabIndex == 'Popular' && newSlotList.length > 0">
            <LobbyGameBlock id="Slots" curGameTabKey="Slots" :gameList="newSlotList" @toGamePage="toGamePage" />
          </div> -->
          <div v-show="tabIndex == 'Popular' && blockChainList.length > 0">
            <LobbyGameBlock id="BlockChain" curGameTabKey="BlockChain" curGameTabName="BlockChain"
              :gameList="blockChainList" @toGamePage="toGamePage" />
          </div>
          <!-- <div v-show="tabIndex == 'Popular' && fishingList.length > 0">
              <LobbyGameBlock
                id="fishing"
                curGameTabKey="fishing"
                curGameTabName="fishing"
                :gameList="fishingList"
                @toGamePage="toGamePage"
              />
            </div> -->
          <div v-show="tabIndex == 'Lives' && liveList.length > 0">
            <LobbyGameBlock id="Live" curGameTabKey="Live" curGameTabName="Live" :gameList="liveList"
              @toGamePage="toGamePage" />
          </div>
          <div v-show="tabIndex == 'Slots' && cardGameList.length > 0">
            <div v-for="item in slotsList" :key="item.key" class="mb-3 rounded-lg" @click="toGamePage('all', 'all', 'Slots', 'Slots', item.key)">
              <div class="w-full h-32 relative rounded-lg shadow-md">
                <img :src="$imgBasePath + '/home/slots/' + item.key + '.png'" class="w-full h-full object-cover rounded-lg"/>
                <div class="absolute bottom-7 left-6 font-bold text-[20px] text-gray-700">{{ $t(item.key + '_game') }}</div>
              </div>
            </div>
          </div>
          <div v-show="tabIndex == 'Sports' && cardGameList.length > 0">
            <LobbyGameBlock id="Sports" curGameTabKey="Sports" curGameTabName="Sports" :gameList="sportList"
              @toGamePage="toGamePage" />
          </div>
          <div v-show="tabIndex == 'Card' && cardGameList.length > 0">
            <LobbyGameBlock id="Card" curGameTabKey="Card" curGameTabName="Card" :gameList="cardGameList"
              @toGamePage="toGamePage" />
          </div>
          <div v-show="tabIndex == 'Fishs' && fishingList.length > 0">
            <LobbyGameBlock id="fishing" curGameTabKey="Fish" curGameTabName="fishing" :gameList="fishingList"
              @toGamePage="toGamePage" />
          </div>
          <div v-show="tabIndex === 'Lotterys' && lotteryList.length > 0">
            <LobbyGameBlock id="Lotterys" curGameTabKey="Lotterys" curGameTabName="Lotterys" :gameList="lotteryList"
              @toGamePage="toGamePage" />
          </div>
          <!-- <div v-show="tabIndex == 'favoritos' && collectList.length > 0">
              <LobbyGameBlock
                id="Collect"
                curGameTabKey="Collect"
                :gameList="collectList"
                @toGamePage="toGamePage"
              />
            </div>
            <div v-show="tabIndex == 'History' && historyList.length > 0">
              <LobbyGameBlock
                id="History"
                curGameTabKey="History"
                :gameList="historyList"
                @toGamePage="toGamePage"
              />
            </div> -->
        </div>

      </div>
    </div>
    <!-- 底部内容 -->
    <!-- <div class="home-footer">
      <img :src="`${$imgBasePath}/home/18.png`" class="w-[45px] mx-auto" />
      <div class="txt-2 mt-[20px]">
        {{ $t("110009") }}
      </div>
      <img :src="`${$imgBasePath}/home/links.png`" class="w-[301px] mx-auto" />
    </div> -->
  </div>

  <!-- 各种弹窗 begin-->

  <PopupNewActivities ref="popupNewActivities" />


  <PopupTotalRechargeInfo ref="popupTotalRechargeInfo" />

  <DownloadActivity ref="downloadActivity" />

  <RegisterActivity ref="registerActivity" />


  <!-- 宝箱 -->
  <!-- <PopupMarquee /> -->
  <PopupMarqueeNew @refreshMoney="refreshMoney" />

  <!-- 右下角图标菜单 -->
  <!-- <RbIcon /> -->

  <!-- 左侧菜单栏 -->
  <van-popup v-model:show="showLeftMenu" teleport="#app" :duration="0.5" position="left" class="left-menu"
    :safe-area-inset-top="true" @click="closeLeftMenu()" :style="{ height: `${viewportHeight}px` }">

    <NewLeftMenu :dataList="gameTabList" :tabIndex="tabIndex" @changeTab="changeTab" @showLanguage="handelChangeLang" />
  </van-popup>
  <!-- 返回顶部按钮 -->
  <!-- <ScrollTop /> -->
  <!-- 语言修改 -->
  <ChangeLang ref="changeLang"></ChangeLang>
  <!-- 登录弹窗 -->
  <Login @homeInit="afterRegisterOK" ref="loginRef" :captcha="needRecaptcha"></Login>

  <ForgotPwd @showLoginBox="enterLoginBtn('login')" />

  <NewRecharge v-model:show="showRecharge" @refreshMoney="refreshMoney"></NewRecharge>

</template>

<script setup lang="ts" name="Home">
import { onBeforeRouteLeave } from "vue-router";
import LoadingPage from "./newLoadingPage.vue";
import Login from "@/components/Login/index.vue";
import RbIcon from "@/components/RbIcon/index.vue";
import NewLeftMenu from "./newLeftMenu.vue";
import topNav from "@/components/topNav/index.vue";
import LobbyGameBlock from "./lobbyGameBlock.vue";
import DownloadActivity from "@/views/activityPopup/downloadActivity/index.vue";
import RegisterActivity from "@/views/activityPopup/registerActivity/index.vue";
import {
  onActivated,
  onMounted,
  ref,
  getCurrentInstance,
  computed,
  onDeactivated,
  onUnmounted,
  nextTick,
  watch
} from "vue";
import notice_gif from '../../icons/svg/default/notice_gif.png'
import { useI18n } from "vue-i18n";
import { loopPictureApi, wideInfoApi, getService, getGlobalSetting, floatingIconList } from "@/api/home/index";
import { gameListApi, gameTypeListApi } from "@/api/game/index";
import Common from "@/utils/common/common";
import router from "@/router/index";
import { useUserStoreHook } from "@/store/modules/user";
import { getCommissionApi } from "@/api/share/index";
import { playedGame } from "@/api/game/index";
import PopupMarqueeNew from "@/views/activityPopup/Marquee/newIndex.vue";
import ChangeLang from "@/components/ChangeLang/index.vue";
import PopupNewActivities from "@/views/activityPopup/newActivities/index.vue";
import PopupTotalRechargeInfo from "@/views/activityPopup/totalRechargeInfo/index.vue";

import { useRoute } from "vue-router";
import { SActivitySwithVo } from "@/model/home";
import { useNewActPopupStoreHook } from "@/store/modules/newActPopus";
import NewRecharge from "@/views/deposit/newIndex.vue";
import ForgotPwd from "@/components/Login/forgotPwd.vue";
import { showTipModel } from "@/components/TipModel";
import common from "@/utils/common/common";
import slotsList from "@/config/slotsList.json";


const route = useRoute();
// 获取地址栏参数
const { uId, sId, isB, token }: any = route.query;

const { proxy } = getCurrentInstance();

// 默认图片路径
const $imgBasePath = proxy.$imgBasePath;

const startX = ref(0)
const startY = ref(0)
const moved = ref(false)
const needRecaptcha = ref(false);

function onTouchStart(e) {
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
  moved.value = false
}

function onTouchMove(e) {
  const dx = e.touches[0].clientX - startX.value
  const dy = e.touches[0].clientY - startY.value
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    moved.value = true
  }
}

function onTouchEnd(item) {
  if (!moved.value) {
    Common.activityJump(item)
  }
}



// 多语言
const { t } = useI18n();
const changeLang = ref();
const emit = defineEmits(["enterLoginBtn", "emitChangeLeft","enterDeposit"]);

interface Game {
  gameId: number;
  sort: number;
  isStar: boolean;
}

onBeforeRouteLeave((to, from, next) => {
  if (to.path !== from.path) {
    window.scrollTo(0, 0);
  }
  next();
});

// 计算可视窗口的高度
const viewportHeight = ref(window.innerHeight);
// 左侧菜单栏状态
const showLeftMenu = ref(false);
// 更改菜单栏状态
const changeLeftMenu = status => {
  showLeftMenu.value = !showLeftMenu.value;
};
const closeLeftMenu = () => {
  showLeftMenu.value = false;
};

// 用户信息
const isLogin = computed(() => {
  return useUserStoreHook().isLogin;
});

// 用户信息
const playerInfo = computed(() => {
  return useUserStoreHook().playerInfo;
});

// 未登录按钮选中状态
const enterBtnType = ref<"login" | "register">("login");
// Login组件的ref
const loginRef = ref();

// 点击登录按钮
const enterLoginBtn = (tabCurrent: "login" | "register") => {
  enterBtnType.value = tabCurrent;
  useUserStoreHook().openLogin(tabCurrent);
};

// 游戏tab吸顶
// 添加状态变量跟踪吸顶状态
const isTabSticky = ref(false);

// 处理吸顶事件
const onStickyScroll = params => {
  isTabSticky.value = params.isFixed;
};

// 轮播图列表 Slideshow list
const bannerList = ref([] as SActivitySwithVo[]);
// 获取轮播图 Get the carousel image
const getBanner = async () => {
  try {
    let { code, data } = await loopPictureApi();
    if (code !== 200) throw new Error("Failed to get banner data.");
    let picture = data.data;
    bannerList.value = picture.filter(item => item.isOpen == 1);
  } catch (error) {
    console.error("Error fetching banner:", error);
  }
};
// 获取客服链接
const getServiceApi = async () => {
  let { code, data }: any = await getService(window.location.hostname);
  if (code == 200) {
    Common.setStorage("telegram", data.data);
  }
};

// 广播公告
const noticeText = ref();
// 新闻
const noticeList = ref([]);
const indicatorStyle = ref({ left: '0px', width: '0px' })

watch(() => route.query.uId, (newUId) => {
  if (newUId) {
    // 处理uId变化的逻辑
    console.log('uId changed to:', newUId);
    //去掉非数字
    newUId = (newUId as string).replace(/\D/g, '');

    Common.setStorage('uId',newUId as string);
    //去掉sid
    Common.removeStorage('sId');

  }
});
watch(() => route.query.sId, (newUId) => {
  if (newUId) {
    // 处理uId变化的逻辑
    console.log('sId changed to:', newUId);
    //去掉非数字
    newUId = (newUId as string).replace(/\D/g, '');
    Common.setStorage('sId',newUId as string);
    //去掉sid
    Common.removeStorage('uId');

  }
});

// 获取广播公告
const getNotice = async () => {
  try {
    let {code,data} = await wideInfoApi();
    if (code !== 200) throw new Error("Failed to get notice data.");
    noticeText.value = "";
    data.data.forEach(item => {
        if(item.switchOpen === 1){
          let lan = playerInfo.value.language === 'zh' ? 'zh' : (playerInfo.value.language || 'zh');
          noticeText.value += item[lan]
        }
    });

  } catch (error) {
    console.error("Error fetching notice:", error);
  }
};

// 游戏标识
const gameFlag = ref("Popular");
const gameTabList = [
  {
    key: "Popular",
    img_Key: "Popular",
    acImg_Key: "Popular",
    gameKey: "Popular"
  },
    {
    key: "Lives",
    img_Key: "Live",
    acImg_Key: "Live",
    gameKey: "Live"
  },
  {
    key: "Slots",
    img_Key: "Slot",
    acImg_Key: "Slot",
    gameKey: "Slots"
  },
  {
    key: "Fishs",
    img_Key: "Fish",
    acImg_Key: "Fish",
    gameKey: "Fish"
  },
  {
    key: "Sports",
    img_Key: "Sport",
    acImg_Key: "Sport",
    gameKey: "Sports"
  },
  {
    key: "Card",
    img_Key: "Card",
    acImg_Key: "Card",
    gameKey: "Card"
  },
  {
    key: "Lotterys",
    img_Key: "Lottery",
    acImg_Key: "Lottery",
    gameKey: "Lotterys"
  },
 
  // {
  //   key: "History",
  //   img_Key: "History",
  //   acImg_Key: "History",
  //   gameKey: "Recente"
  // },
  // {
  //   key: "favoritos",
  //   img_Key: "Collect",
  //   acImg_Key: "Collect",
  //   gameKey: "Favoritos"
  // },

];

const filteredGameTabList = computed(() => {
  return gameTabList;
});

// 游戏tab索引
const tabIndex = ref("Popular");
const tabPosition = ref(0);
// 切换游戏tab
const changeTab = async (key, position) => {
  // console.log(key,"leeeeeeekey")

  showLeftMenu.value = false;
  // if(key == 'Lives'){
  //    toGamePage('all', 'all', 'Lives', 'Lives')
  // } else 

  tabIndex.value = key;
  gameFlag.value = key;
  tabPosition.value = position;

  if(key == 'favoritos'){
      collectList.value = Common.getGameStar();
  }

  // if(key == 'Slots'){
  //   toGamePage('all', 'all', 'Slots', 'Slots')
  // }
  // else{
  //   tabIndex.value = key;
  //   gameFlag.value = key;
  //   tabPosition.value = position;

  //   if(key == 'favoritos'){
  //      collectList.value = Common.getGameStar();
  //   }
  // }
  // 等待DOM更新
  await nextTick();
const el = gameTabListRef.value?.querySelector('.game-tab-item.active');
el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

};

const getTabIcon = (item, index) => {
  const suffix = tabPosition.value !== index ? '-inactive' : '';
    return `${$imgBasePath}/home/home-category/${item.acImg_Key}${suffix}.png`;
}


// 跳转游戏页面
const toGamePage = (
  gameType = "all",
  usTab = "all",
  gamePlayType = "all",
  title = "game",
  key = "pg-game"
) => {
  if (useUserStoreHook().isLogin) {
    if (title == "BlockChain" || title == "fishing") {
      //  router.push(
      //   `/gameList?gameType=${gameType}&usTab=${usTab}&gamePlayType=${gamePlayType}&title=${title}`
      // );
     router.push(`/gameTypeList?gameType=${title}&title=${title}`);
    } else if(title == 'Slots') {
      router.push(
        `/gameList?gameType=${gameType}&usTab=${usTab}&gamePlayType=${gamePlayType}&title=${title}&curKey=${key}`
      );
    } else {
      router.push(
        `/gameList?gameType=${gameType}&usTab=${usTab}&gamePlayType=${gamePlayType}&title=${title}`
      );
    }
  } else {
    useUserStoreHook().openLogin();
  }
};

const jumpGame = async gameItem => {
  if (!useUserStoreHook().isLogin) {
    useUserStoreHook().openLogin();
    return false;
  }

  let playerInfo = useUserStoreHook().playerInfo;
  const toGame = () => {
    // 保存当前路由地址到本地存储
    const currentRoute = router.currentRoute.value;
    const sourceRoute = {
      path: currentRoute.path,
      query: currentRoute.query,
      fullPath: currentRoute.fullPath
    };
    localStorage.setItem('gameSourceRoute', JSON.stringify(sourceRoute));
    console.log(gameItem);
    
    // 跳转到游戏页面
    router.push(
      `/gameDetail?roomId=${gameItem.id || gameItem.gameId}&screen=${gameItem.screen || 1}`
    );
  };
  toGame();
};

// 收藏列表
const collectList = ref([]);
// 历史列表
const historyList = ref([]);
// 大厅热门游戏列表
const hotGameList = ref([]);
// 捕鱼列表
const fishingList = ref([]);
// 区块链列表
const blockChainList = ref([]);
//5
const liveList = ref([])
//2card game
const cardGameList = ref([])
const newSlotList = ref([]);
const lotteryList = ref([]);
const sportList = ref([]);
// 获取热门游戏列表 Get a list of popular games
const getGameLists = async () => {
  const { data, code }: any = await gameListApi();
  // console.log("1111111111111111",data)
  if (code == 200) {
    // Common.setStorage("allGame", JSON.stringify(data.data));
    let starList: any = Common.getGameStar();
    hotGameList.value = data.data.filter((item: any) => item.pop == 1);
    hotGameList.value.sort((a, b) => {
      return b.sort - a.sort;
    });
    hotGameList.value.map(item => {
      const isStarred = starList.some(
        starredGame => starredGame.id === item.id
      );
      item.isStar = isStarred;
    });
    showPopularText.value = t("110010", [hotGameList.value.length]);
  }
};

// 获取游戏
// 1：slot2：火箭Crash Game
// 3：捕鱼Fish Game
// 4：视讯
// 5：体育
// 6：彩票
// 7：桌游Table Game
// 8：棋牌Poker Game

const getGameTypeList = async (type: any) => {
  let page = {
    pageNum: 1,
    pageSize: 100
  };
  const { data, code }: any = await gameTypeListApi(page, { gameType: type });
  // console.log(data,"getGameTypeList")
  if (code == 200) {
    const gameList = {
      1: newSlotList,
      2: cardGameList , 
      3: fishingList,
      4:blockChainList,
      5:liveList,
      6:lotteryList,
      7:sportList
    };
    gameList[type].value = data.rows.filter((item: any) => item.lobby == 1);
    // console.log("gameList",type, gameList[type].value);
  }
};

const getHistoryList = async () => {
  try {
    if(useUserStoreHook().isExiting){
      useUserStoreHook().isExiting = false;
      return;
    }

    if(!useUserStoreHook().isLogin){
      return;
    }

    const { code, data }: any = await playedGame();
    if (code === 200 && Array.isArray(data.data) && data.data.length > 0) {

      // 检查内容是否相同
      const newList = data.data;
      const currentList = historyList.value;
      
      // 比较列表是否发生变化
      const hasChanged = !arraysEqual(currentList, newList);
      
      if (hasChanged) {
        // 如果内容不同，清空并刷新list
        historyList.value = [];
        // 使用 nextTick 确保DOM更新后再设置新数据
        await nextTick();
        historyList.value = newList;
      } else {
        // 如果内容相同，直接赋值
        historyList.value = newList;
      }
    }
  } catch (error) {
    console.error("Error initializing game list:", error);
  }
};

// 添加数组比较函数
const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  
  // 比较每个元素的关键属性（假设游戏对象有id属性）
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].id !== arr2[i].id || arr1[i].gameId !== arr2[i].gameId) {
      return false;
    }
  }
  
  return true;
};

// 显示更多热门游戏
const showPopularMore = ref(false);
const showPopularText = ref();

// 是否是被邀请
const isShare = () => {
  // 登录就不需要弹出
  if (useUserStoreHook().isLogin) return;
  if ((uId && uId != "") || (isB && isB != "") || (sId && sId != "")) {
    enterLoginBtn("login");
  }
};

const handelChangeLang = () => {
  changeLang.value.show();
};

const getCommissionData = async () => {
  let { code, data }: any = await getCommissionApi();
  if (code == 200) {
    useUserStoreHook().setShareInfo(data.data);
  }
};

const loadingPage = ref(null);

const _init = async () => {
  loadingPage.value.show();
  isShare();
  // banner
  getBanner();
  // 获取广播公告
  // getNotice();
  // 热门
  await getGameLists();
  
  //new Slot
  getGameTypeList(1);
  // 火箭
  getGameTypeList(2);
  // 捕鱼
  getGameTypeList(3);
  getGameTypeList(4);
  getGameTypeList(5);
  getGameTypeList(6);
  getGameTypeList(7);
  // Where recaptcha is needed in login or register
  await globalSettings();
  // 客服
  //TODO 用别的逻辑的了
  // await getServiceApi();
  loadingPage.value.hide();

  // await globalActivityApi({}, 3);
};

const getDataApi = async () => {
  // await useActPopupStoreHook().popupBoxData();
  await useNewActPopupStoreHook().initPopups();

  // 获取推荐奖金
  await getCommissionData();
};

//TODO 注册成功后的弹窗
let isNeedPopupWindowAfterRegister = false;


const afterRegisterOK = (isFromRegister:boolean)=>{
  if(isFromRegister){
   showTipModel({
      type: 2,
      title: t('register_success'),
      subTitle: t('lets_play'),
      icon: "success", // 图标样式
      showXX:true,
      yesBtnText:t('recharge'),
      success: ()=>{
        // showRecharge.value = true;
        isNeedPopupWindowAfterRegister = true;
        router.push('/deposit');
      },
      cancel: ()=>{
         getDataApi();
      }
    });
  }else{
    getDataApi();
  }
}




const handleResize = () => {
  viewportHeight.value = window.innerHeight;
};
const navBarHeight = ref(38);
const checkStickyState = () => {
  if (gameTabBox.value) {
    isTabSticky.value = window.pageYOffset > tabBoxOffsetTop.value;
  }
};
onUnmounted(() => {
  window.removeEventListener("scroll", checkStickyState);
  window.removeEventListener("resize", Common.throttle(handleResize, 200));
  window.removeEventListener("scroll", Common.throttle(handleResize, 500));
});

// 使用不同的ref名称避免冲突
const gameTabListRef = ref(null);

// 吸顶
const gameTabBox = ref(null);
const tabBoxOffsetTop = ref(0);
// 检测设备类型的更可靠方法
const isDesktop = ref(false);

const detectDeviceType = () => {
  // 方法1: 使用 navigator.userAgent 检测
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent);
  
  // 方法2: 检测触摸支持
  const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // 方法3: 屏幕宽度检测 (作为辅助判断)
  const isWideScreen = window.innerWidth > 768;
  
  // 综合判断: 如果不是移动设备且没有触摸支持，或者是宽屏设备，则认为是桌面设备
  isDesktop.value = (!isMobile && !hasTouchSupport) || (isWideScreen && !hasTouchSupport);
  

};

interface GlobalSettingResponse {
  data: {
    captcha?: boolean;
    [key: string]: any;
  };
  code: number;
}

const globalSettings = async () => {
  const { data, code } = await getGlobalSetting({name: 'ENUM_SWITCH_CONFIG'}) as GlobalSettingResponse;
  if(code == 200) {
    needRecaptcha.value = data.data.captcha;
  }
} 

onMounted(async () => {

  if (gameTabBox.value) {
    tabBoxOffsetTop.value = gameTabBox.value.offsetTop;
  }
  // 初始检测设备类型
  detectDeviceType();
  
  // 监听窗口大小变化时重新检测
  window.addEventListener("resize", () => {
    detectDeviceType();
  });
  
  // 添加滚动监听
  window.addEventListener("scroll", checkStickyState);
  collectList.value = Common.getGameStar();
  // console.log("collectList", collectList.value);
  _init();
  window.addEventListener("resize", Common.throttle(handleResize, 200));
  window.addEventListener("scroll", Common.throttle(handleResize, 500));
});

const topNavBar = ref();

onActivated(async () => {
  // 首先检查URL中是否有token参数，如果有则先完成token登录
  const urlParams = new URLSearchParams(window.location.search);
  //一个生命周期只执行一次
  if (urlParams.has('token') && !useUserStoreHook().isTokenLogined) {
    useUserStoreHook().isTokenLogined = true;
    console.log('onActivated: 检测到URL中的token，先进行token登录');
    const userStore = useUserStoreHook();

    userStore.outLogin(false);
    
    // 如果用户还未登录，则使用token进行登录
    // if (!userStore.isLogin) {
      const loginSuccess = await userStore.handleUrlToken();
      if (!loginSuccess) {
        console.error('onActivated: Token登录失败，跳过后续API调用');
        return;
      }
      console.log('onActivated: Token登录成功，继续执行后续操作');
      
      // 等待一小段时间确保store状态完全更新
      await new Promise(resolve => setTimeout(resolve, 100));
    // }
  }

  // Token登录完成后，再执行需要登录状态的API调用
  try {
    // 获取活动弹窗数据 Get active pop-up window data
    useNewActPopupStoreHook().initPopups();
    
    // 获取历史游戏记录
    await getHistoryList();
    
    // 刷新余额信息
    if (topNavBar.value) {
      await topNavBar.value.refreshBlance();
    }
    
    console.log('onActivated: 所有API调用完成');
  } catch (error) {
    console.error('onActivated: API调用出错:', error);
  }
});

const refreshMoney = async() => {
  console.log("refreshMoney");
  await topNavBar.value.refreshBlance();
}

onDeactivated(() => {});

const showRecharge = ref(false);
const enterDeposit = () => {
  // console.log("enterDeposit");
  // showRecharge.value = true;
  if (useUserStoreHook().isLogin == false) {
    useUserStoreHook().openLogin();
    return false;
  }
  router.push('/deposit');
}
const goToWithdraw = () => {
  if (useUserStoreHook().isLogin == false) {
    useUserStoreHook().openLogin();
    return false;
  }
  console.log("goToWithdraw");
  router.push('/withdraw2');
}
const goToAgent = () => {
  router.push('/agent');
}
const goToVip = () => {
  if (useUserStoreHook().isLogin == false) {
    useUserStoreHook().openLogin();
    return false;
  }
  router.push('/vipPlus');
}
watch(()=>showRecharge.value, (newVal)=>{
   if(!newVal && isNeedPopupWindowAfterRegister){
      getDataApi();
   }
})

// 监听token参数变化 (仅用于日志记录，主要逻辑在onActivated中处理)
watch(() => route.query.token, (newToken, oldToken) => {
  // 只有当token真正发生变化时才记录日志，避免immediate触发时序问题
  if (newToken && newToken !== oldToken) {
    console.log('watch: URL中的Token参数发生变化:', newToken);
    console.log('watch: token登录逻辑将在onActivated中处理');
  }
}); // 移除 immediate: true，避免时序竞争

</script>

<style lang="scss" scoped>
@import "./index.scss";

.sidebar {
  position: relative;
  width: 65px;
  background: #F3F6FF;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  border-radius: 0 20px 20px 0;
  overflow: hidden;
  border-right: 2px solid white;
  box-shadow: 1px 0 2px #F1F1F9C9;
}

.slider-bg {
  position: absolute;
  left: 0;
  top: 0px;
  width: 75px;
  height: 100px;
  background: url('#{$img-base-path}/home/home-category/tab-bg.png') center/cover;
  transition: transform 0.4s ease;
  z-index: 0;
}

.tab {
  position: relative;
  width: 100px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  cursor: pointer;
  z-index: 1;
}

.tab.active {
  font-weight: bold;
}
</style>
