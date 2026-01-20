<template>
  <!-- 头像替换 -->
  <van-popup
    v-model:show="modelProps.isShow"
    style="background-color: transparent"
  >
    <div class="head-change-box">
      <div class="title">
        <van-icon name="cross" size="18" class="close-btn" @click="close()" />
        <span>{{ $t("110006") }}</span>
      </div>
      <div class="tab-btn-box">
        <div
          class="tab-btn"
          :class="{ 'Male-act': modelProps.headImgArrKey == 'Male' }"
          @click="changeHeadImgArrKey('Male')"
        >
          <svg-icon name="Male" class="text-[16px]" /><span>Male</span>
        </div>
        <div
          class="tab-btn"
          :class="{ 'Female-act': modelProps.headImgArrKey == 'Female' }"
          @click="changeHeadImgArrKey('Female')"
        >
          <svg-icon name="Female" class="text-[16px]" /><span>Female</span>
        </div>
      </div>
      <div class="head-img-list">
        <van-row :gutter="[20, 20]">
          <van-col
            span="6"
            v-for="(cItem, cIndex) in modelProps.headImgArr"
            :key="cIndex"
            ><img
              :src="$imgBasePath + '/profile/headImg/' + cItem + '.png'"
              :class="{ 'grayscale-[1]': modelProps.headImgCurIndex != cItem }"
              @click="changeHeadImg(cItem)"
          /></van-col>
        </van-row>
      </div>

      <van-button
        class="theme-btn-submit-large btn-submit"
        type="default"
        :disabled="modelProps.submitLock"
        @click="submitHeadImg()"
        >{{ $t("190001") }}</van-button
      >
    </div>
  </van-popup>
</template>
<script setup lang="ts" name="svgDemo">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { updateHeadIconIdApi } from "@/api/user/index";
import { useUserStoreHook } from "@/store/modules/user";

const { t } = useI18n();

// 定义变量
let modelProps = ref({
  isShow: false,
  headImgMale: [1002, 1004, 1006, 1008, 1010, 1012],
  headImgFemale: [1001, 1003, 1005, 1007, 1009, 1011],
  headImgArrKey: "Male",
  headImgArr: [],
  headImgCurIndex: 0,
  submitLock: false
});

const changeHeadImg = (imgId: number) => {
  modelProps.value.headImgCurIndex = imgId;
};

const changeHeadImgArrKey = (key: string) => {
  modelProps.value.headImgArrKey = key;
  modelProps.value.headImgArr = modelProps.value["headImg" + key];
};

const submitHeadImg = async () => {
  if (!modelProps.value.headImgCurIndex) return false;
  modelProps.value.submitLock = true;
  let { code, data }: any = await updateHeadIconIdApi({
    headIconId: modelProps.value.headImgCurIndex
  });
  if (code == 200) {
    useUserStoreHook().updatePlayerInfo(
      "headIconId",
      modelProps.value.headImgCurIndex
    );
    close();
  }
  modelProps.value.submitLock = false;
};

const show = () => {
  modelProps.value.headImgCurIndex = useUserStoreHook().playerInfo.headIconId;
  if (modelProps.value.headImgMale.includes(modelProps.value.headImgCurIndex)) {
    changeHeadImgArrKey("Male");
  } else {
    changeHeadImgArrKey("Female");
  }

  modelProps.value.isShow = true;
};
const close = () => {
  modelProps.value.isShow = false;
};

onMounted(() => {});

defineExpose({
  show
});
</script>

<style lang="scss" scoped>
.head-change-box {
  width: 320px;
  min-height: 200px;
  background: white;
  border-radius: 10px;
  padding-bottom: 22px;
  display: flex;
  flex-direction: column;
  position: relative;

  .title {
    width: 100%;
    height: 50px;
    text-align: center;
    color: $theme-title-color;
    font-size: 16px;
    padding: 10px 20px;
    position: relative;

    .close-btn {
      position: absolute;
      right: 15px;
      top: 15px;
      color: $theme-title-color;
    }
  }

  .head-img-list {
    padding: 0 10px;
  }

  .tab-btn-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 50px;
    padding: 0 45px;

    .tab-btn {
      width: 100px;
      height: 30px;
      border-radius: 15px;
      padding: 6px 10px;
      display: flex;
      color: #fff;
      filter: grayscale(1);
      font-size: 14px;
      align-items: center;
      justify-content: center;
      background-color: #562cff;

      span {
        padding-left: 6px;
      }
    }

    .Male-act {
      filter: grayscale(0);
      background-color: #562cff;
    }

    .Female-act {
      filter: grayscale(0);
      background-color: #ff5045;
    }
  }

  .btn-submit {
    margin-top: 20px;
    width: 260px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
