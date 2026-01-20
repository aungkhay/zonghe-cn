<template>
  <van-popup :show="tipProps.isShow" teleport="#app"  :overlay="[2,3].includes(tipProps.type)"
  style="background-color: transparent">
    <!-- 弹窗容器 -->
    <div class="popup-container" :class="{ b: tipProps.mBLandscape }">
      <!-- 弱提示框 -->
      <div v-if="tipProps.type == 1" class="weak-popup">
        <svg-icon class="mr-[8px] text-[20px] theme-svg-color-dark" :name="tipProps.icon" />
        <text class="title">{{ tipProps.title }}</text>
      </div>

      <!-- 强提示框 & 输入提示框 -->
      <div v-if="tipProps.type == 2 || tipProps.type == 3" class="strong-popup">
        <div class="title">
          {{ tipProps.title }}
        </div>
        <div class="line"></div>
        <div class="subtitle">
          {{ tipProps.subTitle }}
        </div>

        <input
          v-if="tipProps.type == 3"
          class="theme-input-box input-box"
          v-model="tipProps.userInput"
        />

        <div class="buttons">
          <van-button
            type="default"
            :class="
              tipProps.cancelBtnText
                ? 'btn-submit'
                : 'btn-cancel'
            "
            @click="clickSuccess"
          >
            {{ tipProps.yesBtnText }}
          </van-button>
          <van-button
            type="default"
            v-if="tipProps.cancelBtnText"
            class="btn-cancel"
            @click="clickCancel"
          >
            {{ tipProps.cancelBtnText }}
          </van-button>
        </div>
      </div>

      
      <div class="strong-popup" v-if="tipProps.type == 4">
          <div class="flex justify-center items-center">
              <span class="reward-title">{{ $t('102050') }}</span>
          </div>
          <div class="line mt-[10px]"  />
          <div class="flex justify-center items-center mt-[30px]">
              <div class="w-[56px] h-[56px] reward-img" v-if="tipProps.icon == 'success'"/>
              <div class="w-[56px] h-[56px] reward-img2" v-else-if="tipProps.icon == 'fail'"/>
          </div>
          <div class="flex justify-center items-center mt-[6px] mb-[20px]">
              <span class="reward-money">
                  {{ tipProps.title }}
              </span>
          </div>
          <van-button class="button btn-cancel flex justify-center items-center" @click="clickSuccess">
              <span>{{ tipProps.yesBtnText }}</span>
          </van-button>
      </div>     
    </div>
    
    <div class="flex items-center justify-center mt-[20px]" v-show="tipProps.showXX">
      <div @click="clickCancel" class="clickCancle cursor-pointer">
      </div>
    </div>
  </van-popup>

  <!-- loading -->
  <van-popup
    :show="loadingProps.state"
    style="background-color: transparent"
    :overlay="false"
  >
    <!-- 弹窗容器 -->
    <div v-if="loadingProps.loadType == 2">
         <div class="w-[100px] h-[100px] loading-img"/>
         <div class="w-full flex justify-center">
           <span class="text-[16px] text-[#fff] text-center">{{ loadingProps.message }}</span>
         </div>
    </div>
    <div v-else>
        <div class="w-[80px] h-[80px] loading2-img"/>
    </div>

  </van-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

// 批量赋值
const assignProps = (target, ...sources) => {
  for (const source of sources) {
    for (const key in source) {
      if (source[key]) {
        target[key] = source[key];
      }
    }
  }
};

// 定义变量
let tipProps = ref({
  type: 2, // 类型
  icon: "success", // 图标样式
  isShow: false, // 弹窗是否显示
  showXX: false, // 是否显示xx
  title: t("102050"), // 标题
  subTitle: "", // 子标题
  yesBtnText: t("103015"), // 确认按钮文本
  cancelBtnText: "", // 取消按钮文本
  success: undefined, // 确认按钮事件
  cancel: undefined, // 取消按钮事件
  userInput: "", // 用户输入
  mBLandscape: false // 是否横屏
});

// 初始化变量
const init = () => {
  tipProps.value.isShow = false;

  setTimeout(() => {
    tipProps.value = {
      type: 2, // 类型
      icon: "success", // 图标样式
      isShow: false, // 弹窗是否显示
      showXX: false, // 是否显示xx
      title: t("102050"), // 标题
      subTitle: "", // 子标题
      yesBtnText: t("103015"), // 确认按钮文本
      cancelBtnText: "", // 取消按钮文本
      success: undefined, // 确认按钮事件
      cancel: undefined, // 取消按钮事件
      userInput: "", // 用户输入
      mBLandscape: false // 是否横屏
    };
  }, 300);
};

// 打开弹窗
const showModel = props => {
  // 进行批量赋值
  assignProps(tipProps.value, props);

  tipProps.value.isShow = true;

  if (tipProps.value.type == 1) {
    setTimeout(() => {
      init();
    }, 2000);
  }
};

// 点击确认按钮
const clickSuccess = () => {
  if (tipProps.value.type == 3 && tipProps.value.userInput == "") {
    return false;
  }

  if (tipProps.value.success) {
    tipProps.value.type == 3
      ? tipProps.value.success(tipProps.value.userInput)
      : tipProps.value.success();
  }

  init();
};

// 点击取消按钮
const clickCancel = () => {
  if (tipProps.value.cancel) {
    tipProps.value.cancel();
  }

  init();
};

// 是否显示loading
const loadingProps = ref({
  state: false,
  message: "",
  color: "#fff",
  loadType: 1  // 1 默認 2 足球
});
// 改变loading状态
const changeLoading = props => {
  // 进行批量赋值
  assignProps(loadingProps.value, props);
  if(props.loadType !== 2){
     loadingProps.value.loadType = 1
  }
};

// 主动暴露方法
defineExpose({
  showModel,
  changeLoading
});
</script>

<style lang="scss" scoped>
.reward-title{
    font-weight: bold;
    font-size: 18px;
    color: var(--text-black);
    text-align: center;
}
.reward-money{
    font-weight: bold;
    font-size: 20px;
    color: var(--text-black);
    text-align: var(--text-black);
}
.reward-img{
  background-image: url('#{$img-base-path}/event/newMarquee/reward.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.reward-img2{
  background-image: url('#{$img-base-path}/event/newMarquee/icon0.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.button{
  @extend .theme-btn;
  height: 28px;
    width: 90%;
    span{
        font-weight: bold;
        font-size: 16px;
        color: white;
    }
}

.clickCancle{
    background-image: url('#{$img-base-path}/event/newMarquee/close.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
}

.loading-img{
  background-image: url('#{$img-base-path}/public/loading.webp');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.loading2-img{
  background-image: url('#{$img-base-path}/public/loading2.webp');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}


@import "./index.scss";
</style>
