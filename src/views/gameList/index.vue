<template>
  <!-- 页面顶部 -->
  <NavBar :title="$t(title as string) || $t('105031')" />

  <div class="game-list-box">
    <!-- 顶部搜索模块 -->
    <div class="header">

        <div class="overflow-x-auto pr-4 pl-[10px] mb-2 w-full">
          <div class="flex flex-nowrap justify-start">
            <div v-for="item in slotsList" :key="item.key" class="flex-shrink-0 pr-[13.5px]" :class="{'pr-[0px]': item.key == 'evoplay'}" @click="changeGameTab(item.key)">
              <div class="rounded-xl w-[60px] h-[60px] text-center flex flex-col justify-center items-center text-white" :class="curGameTab == item.key ? 'bg-[var(--primary-color)]' :'bg-[var(--secondary-color)]'">
                <img :src="$imgBasePath + '/slot-category/' + item.key + '.png'" class="w-[35px] h-[35px]"/>
                <span class="text-[11px] " :class="curGameTab == item.key ? 'text-white' : 'text-gray-400'">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="w-full px-2 pb-2">
          <div class="theme-input-box">
            <input v-model="searchStr" :placeholder="$t('search')" />
            <svg-icon  v-scaleTap name="icon_delete" class="text-[red] mt-[4px] text-[20px] mr-1" v-show="searchStr" @click="searchStr = ''; getGameList();" />
            <svg-icon  v-scaleTap name="search" class="text-[var(--primary-color)] mr-[10px] text-[17px]" @click="getGameList()" />
          </div>
        </div>
    </div>
    <div class="total-container ">
      <!-- <div class="side-bar" v-if="gamePlayType == 'Slots'">
          <div class="side-bar-item" v-for="item in slotsList" :key="item.key" :class="curGameTab == item.key ? 'active' : ''" @click="changeGameTab(item.key)">
            <svg-icon :name="item.svg" class="theme-svg-color" :class="{
              'text-[30px]': item.svg == 'Spribe',
              'text-[20px]': item.svg != 'Spribe'
            }"/>
            <span>{{ item.name }}</span>
          </div>
      </div> -->

      <div class="content"> 
        <!-- 右侧游戏列表 -->
        <div class="content-right-box" v-show="!gpHide">
          <!-- 无数据状态 -->
          <NoData v-if="!gpHide && isEmpty && searchStr != ''" class="ml-[35px] mt-[100px]" />
          <template v-if="!gpHide && isEmpty && searchStr == ''">
            <div class="game-list">
              <div
                v-for="n in 12"
                :key="'maintenance-' + n"
              >
                <div class="maintenance-card">
                  <svg-icon name="maintain" class="icon"/>
                  <div class="text">{{ $t('maintain') }}</div>
                </div>
              </div>
            </div>
          </template> 
          <div class="game-list pb-14" v-else>
            <GameBox v-for="item in gameList" :key="item.id" :item="item" />
          </div>
          <!-- 游戏列表 -->
        </div>
      </div>
    </div>


    <!-- 内容模块 -->


    <!-- 底部分页 -->
    <div class="footer">
      <div class="pagination-box">
        <!-- 跳到首页 -->
        <van-icon
          @click="changePage(1)"
          name="arrow-double-left"
          class="pagination-first"
        />
        <van-pagination
          v-model="page.pageNum"
          :total-items="page.total"
          :items-per-page="page.pageSize"
          :show-page-size="4"
          @change="changePage"
        >
          <template #prev-text>
            <van-icon name="arrow-left" />
          </template>
          <template #next-text>
            <van-icon name="arrow" />
          </template>
        </van-pagination>
        <!-- 跳到尾页 -->
        <van-icon
          @click="changePage(Math.ceil(page.total / page.pageSize))"
          name="arrow-double-right"
          class="pagination-last"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="GameList">
import NavBar from "@/components/NavBar/index.vue";
import slotsList from "@/config/slotsList.json";
import { ref, onMounted, onActivated  } from "vue";
import { useRoute } from "vue-router";
import Common from "@/utils/common/common";
import { useI18n } from "vue-i18n";
import { slotGameListApi } from "@/api/game/index";
import common from "@/utils/common/common";
import { hideLoadingModel, showLoadingModel } from "@/components/TipModel";

// 多语言
const { t } = useI18n();

const route = useRoute();

// 获取地址栏参数
const { gameType, gamePlayType, title, curKey } = route.query;

// 搜索绑定
const searchStr = ref("");

// 选中游戏tab
const curGameTab = ref("pg");
// 更改选中游戏tab
const changeGameTab = (key) => {
  curGameTab.value = key;
  page.value.pageNum = 1;
  getGameList();
};

// 使用不同的ref名称避免冲突
const gameTabListRef = ref(null);
// 添加滚动控制函数
const scrollTabList = direction => {
  if (!gameTabListRef.value) return;

  const scrollAmount = 150; // 每次滚动的像素数
  const currentScroll = gameTabListRef.value.scrollLeft;

  if (direction === "left") {
    gameTabListRef.value.scrollTo({
      left: currentScroll - scrollAmount,
      behavior: "smooth"
    });
  } else {
    gameTabListRef.value.scrollTo({
      left: currentScroll + scrollAmount,
      behavior: "smooth"
    });
  }
};
// 是否有数据
const isEmpty = ref(false);
// 骨屏
const gpHide = ref(true);
// 分页
const page = ref({
  total: 10000,
  pageSize: 30,
  pageNum: 1
});
// 更改分页
const changePage = currentPage => {
  page.value.pageNum = currentPage;
  getGameList();
};
// 游戏列表
const gameList: any = ref([]);
// 获取游戏列表
const getGameList = async () => {
  gpHide.value = true;
  if (gamePlayType == "Slots") {
    // 获取游戏列表
    showLoadingModel({
      message: "loading",
    });
    let Gameopt: any = {
      pg: 1,
      pp: 2,
      jdb: 3,
      jili: 4,
      evoplay:5,
      ssr:14,
      spribe:15,
      cq9: 111,
      mg: 136,
    };
    const { pageSize, pageNum }: any = page.value;
    let pageObj = {
      pageSize,
      pageNum
    };
    let params = {
      [common.getParamsLang()]: searchStr.value,
      platform: Gameopt[curGameTab.value]
    };
    const { code, data }: any = await slotGameListApi(pageObj, params);
    if (code == 200) {
      const { rows, total } = data;
      gpHide.value = false;
      page.value.total = total || 0;
      gameList.value = rows;
    }
  } else {
    // 本地取收藏
    gameList.value = Common.getGameStar();
    page.value.total = Common.getGameStar().length;
  }
  if (page.value.total <= 0) {
    isEmpty.value = true;
    hideLoadingModel()
  } else {
    isEmpty.value = false;
    setTimeout(() => {
      hideLoadingModel()
    }, 1000)
  }
};

// onMounted(() => {
  
//   // changeGameTab(gameType);
//   console.log('curKey', curKey);
//   // const curKeyStr = Array.isArray(curKey) ? curKey[0] : curKey;
//   // curGameTab.value = curKeyStr || "pg";
//   changeGameTab(curGameTab.value);
// });

onActivated(() => {
  const curKey = route.query.curKey;
  let curKeyStr = Array.isArray(curKey) ? curKey[0] : curKey;
  curGameTab.value = curKeyStr || "pg";
  changeGameTab(curGameTab.value);
});
</script>

<style lang="scss" scoped>
@import "./index.scss";

::v-deep(.game-list .game-item .game-item-bottom span) {
  max-width: 100px !important;
}
</style>
