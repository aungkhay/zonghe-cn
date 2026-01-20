<template>
    <van-popup v-model:show="popupShow" style="background-color: transparent" :close-on-click-overlay="false">
        <div>
            <div class="main-box" @click="onClickCell(-1)">
                <div class="title"/>
                <div class="bg">
                    <div class="wheel">
                        <div class="grid">
                            <div class="cell" v-for="item in config" :key="item.key" @clic.stop="onClickCell(item.key)">
                                <div class="cell-bg" :style="{backgroundImage: `url(${$imgBasePath}${currentIndex === item.key ? item.bg_active : item.bg})`}">
                                    <img :src="`${$imgBasePath}${item.icon}`"  :style="{width:item.size.width,height:item.size.height}" >
                                    </img>
                                    <span v-if="item.key != -1" class="money-text" :class="{'big':item.isBig}">{{ getGridMoney(item.key) }} </span>
                                </div>
                            </div>                           
                        </div>
                    </div>
                    <div class="flex justify-center items-center mt-[32px] w-[140px] ml-[70px] ">
                        <span class="text-[10px] text-info text-center">
                            {{ $t('105021') }}
                        </span>
                    </div>
                </div>
            </div>

            <div v-scaleTap class="flex justify-center items-center mt-[20px]" @click="closePopup()">
                <svg-icon class="theme-svg-color-light text-[32px]" name="close" />
            </div>
        </div>

        <!-- <van-popup 
            v-model:show="rewardPopupShow" 
            style="background-color: transparent" 
            :overlay-style="{backgroundColor: 'transparent'}"
            :style="{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto'
            }"
        >
            <div class="reward-popup-bg reward-box">
                    <div class="flex justify-center items-center">
                        <span class="reward-title">Tips</span>
                    </div>
                    <div class="line mt-[10px]"  />
                    <div class="flex justify-center items-center mt-[40px]">
                        <img :src=" $imgBasePath + 'reward.png'" class="w-[70px] h-[70px]" v-if="targetAmount != 0">
                        <img :src=" $imgBasePath + 'icon0.png'" class="w-[70px] h-[70px]" v-else>
                    </div>
                    <div class="flex justify-center items-center mt-[15px] mb-[20px]">
                        <span class="reward-money" v-if="targetAmount != 0">
                            R${{ Number(targetAmount).toFixed(2).replace(/\.?0+$/, '') }}
                        </span>
                        <span class="reward-money" v-else>{{ $t('no_reward') }}</span>
                    </div>
                    <div class="button flex justify-center items-center" @click="rewardPopupShow = false">
                        <span>{{ $t('105012') }}</span>
                    </div>
            </div>
        </van-popup> -->
        
    </van-popup>
</template>
<script setup lang="ts">
import { marqueeApi, marqueeReturnApi } from '@/api/activityPopup';
import { showTipModel } from '@/components/TipModel';
import { AppTunrnTableListVo } from '@/model/activity';
import { useNewActPopupStoreHook } from '@/store/modules/newActPopus';
import common from '@/utils/common/common';
import { ref,getCurrentInstance, computed, watch} from 'vue';
import { useI18n } from 'vue-i18n';
const { proxy } = getCurrentInstance();
const { t } = useI18n();
const emit = defineEmits(['refreshMoney'])

const popupShow = computed(() => {
    return useNewActPopupStoreHook().popups.marquee.isShow;
})

const closePopup = () => {
   var isNeedOpenNextFresh = !isClick
   useNewActPopupStoreHook().closePopup("marquee",isNeedOpenNextFresh);
}

// const rewardPopupShow = ref(false);

const $imgBasePath = proxy.$imgBasePath + "/event/newMarquee/";

const config = ref([
    {key:1,bg:"1.png",bg_active:"1_2.png",icon:"icon0.png",size:{width:"28px",height:"29px"},isBig:false},
    {key:2,bg:"2.png",bg_active:"2_2.png",icon:"icon2.png",size:{width:"26.4px",height:"16px"},isBig:false},
    {key:3,bg:"3.png",bg_active:"3_2.png",icon:"icon3.png",size:{width:"28px",height:"29px"},isBig:false},
    {key:4,bg:"4.png",bg_active:"4_2.png",icon:"icon4.png",size:{width:"33px",height:"25px"},isBig:false},
    {key:-1,bg:"",bg_active:"",icon:"spin.png",size:{width:"56px",height:"34px"},isBig:false},
    {key:5,bg:"6.png",bg_active:"6_2.png",icon:"icon3.png",size:{width:"28px",height:"29px"},isBig:false},
    {key:6,bg:"7.png",bg_active:"7_2.png",icon:"icon7.png",size:{width:"32px",height:"20px"},isBig:false},
    {key:7,bg:"8.png",bg_active:"8_2.png",icon:"icon8.png",size:{width:"39px",height:"28px"},isBig:false},
    {key:8,bg:"9.png",bg_active:"9_2.png",icon:"icon9.png",size:{width:"36px",height:"28px"},isBig:false},
]);

let imagecfg = {
   "no":{icon:"icon0.png",size:{width:"28px",height:"29px"}},
   "manhe":{icon:"icon3.png",size:{width:"28px",height:"29px"}},
   "coins":[
     {id:1,icon:"icon2.png",size:{width:"26.4px",height:"16px"}},
     {id:2,icon:"icon7.png",size:{width:"32px",height:"20px"}},
     {id:3,icon:"icon4.png",size:{width:"33px",height:"25px"}},
     {id:4,icon:"icon8.png",size:{width:"39px",height:"28px"}},
     {id:5,icon:"icon9.png",size:{width:"36px",height:"28px"}},
   ],
}



const getMarqueeList = async () => {
    const { code, data } = await marqueeApi();
    if (code === 200) {
        // 根据 gridType 设置 this.config 的内容
        const uniqueGridList = data.data.reduce((acc, item) => {
            if (!acc.find(existingItem => existingItem.grid === item.grid)) {
                acc.push(item);
            }
            return acc;
        }, [] as AppTunrnTableListVo[]);
        gridList.value = uniqueGridList;
        uniqueGridList.forEach((item: AppTunrnTableListVo) => {
            if (item.gridType === 3) {
                const targetConfig = config.value.find(cfg => cfg.key === item.grid);
                if (targetConfig) {
                    Object.assign(targetConfig, imagecfg.no);
                }
            } else if (item.gridType === 2) {
                const targetConfig = config.value.find(cfg => cfg.key === item.grid);
                if (targetConfig) {
                    Object.assign(targetConfig, imagecfg.manhe);
                }
            }
        });
      
        const sortedGridList = gridList.value
            .filter(gridItem => gridItem.gridType === 1)
            .sort((a, b) => parseFloat(a.money as any) - parseFloat(b.money as any));
        
        sortedGridList.forEach((sortedItem, sortedIndex) => {
            const coin = imagecfg.coins.find(coin => coin.id === sortedIndex + 1);
            if (coin) {
                const targetConfig = config.value.find(cfg => cfg.key === sortedItem.grid)
                if(targetConfig){
                    console.log(sortedItem.grid, sortedIndex,coin)
                    Object.assign(targetConfig, coin);
                    if(sortedIndex == sortedGridList.length - 1){
                        targetConfig.isBig = true;
                    }
                } 
            }
        });
        console.log(config.value)          // 按照 gridList 中 gridType = 1 的 money 从小到大排序
            


      
    }
}



const isSpinning = ref(false);
const gridList = ref([] as AppTunrnTableListVo[]);
const targetIndex = ref(-1);
const currentIndex = ref(-1);
const targetAmount = ref<number>(0);


const getGridItem = (grid: number) => {
    return gridList.value.find(item => item.grid === grid);
}

const getGridMoney = (grid: number) => {
    if(grid === -1) return "";
    var item = getGridItem(grid);
    if(!item) return "";
    if(item.gridType == 3)return "No reward"
    if(item.gridType == 2)return "?"
    return "R$" + common.formatStringToNumber(item.money || '0')
}

// 定义旋转顺序
const rotateOrder = [1, 2, 3, 5, 8, 7, 6, 4];

// 旋转动画函数
const rotateAnimation = async (targetIndex: number) => {
    if (isSpinning.value) return;
    isSpinning.value = true;
    
    
    // 随机生成旋转圈数 (3-5圈)
    const circles = Math.floor(Math.random() * 3) + 3;
    // 计算总步数
    const totalSteps = circles * 8 + rotateOrder.indexOf(targetIndex);
    
    // 当前索引
    let currentStep = 0;


     // 速度控制函数
     const getSpeed = (step: number) => {
        const total = totalSteps;
        // 前20%慢速
        if (step < total * 0.2) {
            return 200; // 200ms
        }
        // 中间60%快速
        else if (step < total * 0.8) {
            return 50; // 50ms
        }
        // 最后20%减速
        else {
            // 计算最后阶段的进度 (0-1)
            const progress = (step - total * 0.8) / (total * 0.2);
            // 从50ms逐渐增加到300ms
            return 50 + progress * 250;
        }
    };

    // 动画函数
    const animate = () => {
        if (currentStep > totalSteps) {
            isSpinning.value = false;
            setTimeout(() => {
                // rewardPopupShow.value = true;

                if (targetAmount.value === 0) {
                    showTipModel({
                        type: 4,
                        title: t("f_no_prize"),
                        icon: "fail",
                        success: () => {
                            closePopup();
                            emit("refreshMoney");
                        }
                    });
                } else {
                    showTipModel({
                        type: 4,
                        title: t("receive_success", [common.formatNum(targetAmount.value)]),
                        icon: "success",
                        success: () => {
                            closePopup();
                            emit("refreshMoney");
                        }
                    });
                }

            }, 300);
            return;
        }
        
        // 计算当前位置
        const currentIndexTemp  = rotateOrder[currentStep % 8];
        // 更新显示
        currentIndex.value = currentIndexTemp;
        
        // 继续动画
        currentStep++;
        setTimeout(animate, getSpeed(currentStep));
    };
    
    // 开始动画
    animate();
};

// 防止快速点击！
let isGameStart = false;
let isClick = false;
const gameStart = async() =>{
    if(isSpinning.value || isGameStart) return;
    isGameStart = true;
    isClick = true;
    setTimeout(() => {
        isGameStart = false;
    }, 1000);
    const { code, data } = await marqueeReturnApi();
    if(code === 200){
        targetIndex.value = data.data.grid;
        targetAmount.value = data.data.amount;
        await rotateAnimation(targetIndex.value);
    }
}

const onClickCell = (key: number) => {
    console.log("点击了",key);
    if(key != -1) return;
   
    gameStart();
}

watch(() => popupShow.value, (newValue) => {
    if(newValue) {
        getMarqueeList();
    }
})


</script>
<style scoped lang="scss">
.main-box{
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
}
.title{
    width: 220px;
    height: 56.92px;
    background: url('#{$img-base-path}/event/newMarquee/title2.png') no-repeat center;
    background-size: 100% 100%;
    z-index: 1
}

.bg{
    margin-top: -15px;
    width: 274px;
    height: 301px;
    background: url('#{$img-base-path}/event/newMarquee/bg_new.png') no-repeat center;
    background-size: 100% 100%;
}

.wheel{
    margin-top: 35px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.grid{
    width: fit-content;
    display              : grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap             : 10px 5px;
}

.cell{
   .cell-bg{
      width: 61px;
      height: 54px;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
   }
   .icon-img{
        transform: scale(0.5);
        transform-origin: left top;
   }
}

.text-info{
    color: $theme-text-color-dark;
}


.money-text{
    font-weight: bold;
    font-size: 8px;
    color: $theme-text-color-dark;
    text-align: center;

    &.big{
        color: $theme-text-color-bright;
    }
}

.reward-popup-bg{
  position: relative;
  background: linear-gradient( 180deg, #DAE349 0%, #60D275 100%);
  border-radius: 10px;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;    // 宽度自适应
    height: 70%;    // 高度可根据实际需求调整，比如顶部占30%
    background: url('#{$img-base-path}/public/bg_top.png') no-repeat center top;
    background-size: 100% 100%; // 拉伸填满
    pointer-events: none;
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;    // 宽度自适应
    height: 30%;    // 高度可根据实际需求调整，比如底部占20%
    background: url('#{$img-base-path}/public/bg_bottom.png') no-repeat center bottom;
    background-size: 100% 100%; // 拉伸填满
    z-index: -1;
    pointer-events: none;
  }
}

.reward-box{
    width: 100%;
    height: 280px;
    padding-top: 16px;
    padding-bottom: 25px;
    padding-left: 17px;
    padding-right: 17px;
}

.reward-title{
    font-weight: bold;
    font-size: 21px;
    color: $theme-text-color-dark;
    text-align: center;
}

.reward-money{
    font-weight: bold;
    font-size: 20px;
    color: $theme-text-color-bright;
}

.line{
    width: 100%;
    border-bottom: 1px solid #FFF;
}

.button{
    height: 35px;
    background: #FFCC00;
    border-radius: 20px 20px 20px 20px; 
    span{
        font-weight: bold;
        font-size: 16px;
        color: #000000;
    }
}

</style>

