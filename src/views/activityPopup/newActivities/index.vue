<template>
    <van-popup v-model:show="popupShow" style="background-color: transparent" :close-on-click-overlay="true"
        @click-overlay="handleOverlayClick">
        <div class="popup-bg2">
            <div class="main-box">
                <div class="left-box">
                    <div class="menu-item cursor-pointer" v-for="(item, index) in menuList" :key="index"
                        @click="activeIndex = index" :class="{ active: activeIndex === index }">
                        <div class="w-[20px] h-[20px]">
                            <svg-icon class="text-[var(--primary-color)]"
                                :class="{ 'theme-svg-color-light': activeIndex === index }" name="louder" />
                        </div>
                        <span class="title-text ml-[4px]" :class="{ active: activeIndex === index }">{{ item.title
                            }}</span>
                    </div>
                </div>
                <div class="content" @click="onClickContent(menuList[activeIndex])">
                    <img v-if="menuList[activeIndex].type == 0" :src="menuList[activeIndex].imgBig || $defaultImage"
                        class="w-[260px] h-[240px]">
                    <div v-else
                        class="text-left  text-[#000] text-[14px] max-h-[220px] overflow-y-auto pl-[10px] pr-[25px] pt-[10px] pb-[20px] "
                        v-html="menuList[activeIndex].content" style="word-break: break-all;"></div>
                </div>
            </div>
        </div>
        <div class="not-open-again">
            <van-checkbox v-model="notOpenAgain">
                <template #icon="props">
                    <svg-icon class="text-[20px] text-[var(--primary-color)]"
                        :name="notOpenAgain ? 'check' : 'uncheck'" />
                </template>
            </van-checkbox>
            <span class="text-[14px] text-white ml-2">{{ t('not_show_this_activity_anymore') }}</span>
        </div>
        <svg-icon v-scaleTap class="text-[30px] theme-svg-color-light box-close" name="close"
            @click="handleOverlayClick" />
    </van-popup>
</template>

<script setup lang="ts" name="newActivities">
import { getPupupList } from '@/api/activityPopup';
import { SPopManageConfigVo } from '@/model/activity';
import { useNewActPopupStoreHook } from '@/store/modules/newActPopus';
import common from '@/utils/common/common';
import { ref, computed, getCurrentInstance, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const { proxy } = getCurrentInstance();


// 默认图片路径
const $imgBasePath = proxy.$imgBasePath;

const $defaultImage = $imgBasePath + '/public/sample.png';

const popupShow = computed(() => {
    return useNewActPopupStoreHook().popups.newActivity.isShow;
})


const menuList = ref([] as SPopManageConfigVo[]);
const getPopupApi = async () => {
    const { code, data } = await getPupupList();
    if(code == 200){
        const list = data.data.filter((item) => item.isOpen == 1);
        menuList.value = list;
        //sortId大的在前面
        list.sort((a, b) => b.sortId - a.sortId);
    }
}

onMounted(async () => {
    await getPopupApi();
});

const onClickContent = (item: SPopManageConfigVo) => {
    if(item.jumpUrl && item.jumpUrl.length > 0){
        if(item.linkType == 0){
            common.jumpUrl(item.jumpUrl);
        }else{
            window.openWin(item.jumpUrl);
        }
    }
}

const activeIndex = ref(0);
const notOpenAgain = ref(false);

const handleOverlayClick = () => {
    // 自定义关闭逻辑
    useNewActPopupStoreHook().closePopup("newActivity",!notOpenAgain.value);
}
</script>
<style lang="scss" scoped>
   .main-box {
      width: 320px;
      display: flex;
      flex-direction: row;
   }

   .left-box {
      display: flex;
      flex-direction: column;
   }

   .menu-item {
      width: 90px;
      height: 40px;
      display: flex;
      align-items: center;
      padding-left: 8px;
      padding-right: 8px;

      &:first-child {
        border-top-left-radius: 8px;
      }
      &.active {
        background-color: var(--primary-color);       
      }
      
      .title-text {
         font-weight: 500;
         font-size: 12px;
         color: var(--primary-color);
         display: -webkit-box;
         -webkit-line-clamp: 2;
         -webkit-box-orient: vertical;
         overflow: hidden;
         text-overflow: ellipsis;

         &.active {
            color: var(--text-white);
         }
      }
   }

   .content {
      width: 100%;
      height: 100%;

      img {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        object-fit: cover;
      }
    
   }
   
   .not-open-again {
        @extend .theme-dark-tip-bg;
        width: fit-content;
        height: 32px;
        margin-top: 15px;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        align-items: center;
        padding-left: 12px;
        padding-right: 12px;
   }

   .box-close {
       margin-left: auto;
       margin-right: auto;
       margin-top: 15px;
   }

</style>
