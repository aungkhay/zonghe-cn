<template>
    <div class="box">
        <van-popup v-model:show="popupShow" style="background-color: transparent; overflow: hidden" :close-on-click-overlay="false" >

            <div class="light flex items-center justify-center">
                <div class="bg flex flex-col items-center justify-center">
                    <div class="flex items-center mt-[-35px]"> 
                        <div class="title ml-[60px] z-10"/>
                        <div class="people ml-[-45px] translate-x-[-10px]  translate-y-[-20px]  "/>
                    </div>

                    <div class="flex items-center justify-center  bg-[#FF]">
                        <div class="content px-[20px] text-center">
                            {{ $t("download_complete_rewards") }}
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-center mt-[16px]">
                        <img :src="$imgBasePath + '/event/newMarquee/reward.png'" alt="" class="w-[40px] h-[40px]" />
                        <div class="reward-content ml-[16px]">
                            R$ +{{ reward }}
                        </div>
                    </div> 
                    <div v-scaleTap class="button flex items-center justify-center mt-[16px]" :class="{'not-active': !isCanGet}" @click="onClickButton">
                        <svg-icon class="text-[18px] mr-[8px]" :class="isCanGet ? 'theme-svg-color-light' : 'theme-svg-color-light'" :name="isCanGet ? 'gift' : 'download'" />
                        <div class="ml-[8px]">   
                            {{ isCanGet ? $t("receive") : $t("go_to_download") }}
                        </div>
                    </div>  
                </div>
            </div>
            
            <div v-scaleTap class="close-button flex items-center justify-center" @click="closePopup">
                <svg-icon class="theme-svg-color-light text-[32px]" name="close" />
            </div>
        </van-popup>
    </div>
</template>

<script setup lang="ts">
import { getAppDownloadUrl, getGlobalSetting, getRegisterAndDownloadReward, receiveDownloadReward } from '@/api/activityPopup';
import { useI18n } from 'vue-i18n';
import { showTipModel } from '@/components/TipModel';
import { useNewActPopupStoreHook } from '@/store/modules/newActPopus';
import { ref,getCurrentInstance, computed, watch, onMounted } from 'vue';
const popupShow = computed(()=>{
    if(useNewActPopupStoreHook().popups.downloadActivity.isShowData){
        getTabData();
        getRewardData();
        getUrl();
        useNewActPopupStoreHook().popups.downloadActivity.isShowData = false;
    }
    return useNewActPopupStoreHook().popups.downloadActivity.isShow;
})
const { proxy } = getCurrentInstance();
const $imgBasePath = proxy.$imgBasePath;
const isCanGet = ref(false);
const closePopup = () => {
    useNewActPopupStoreHook().closePopup("downloadActivity");
}
const reward = ref<number>(0);
const { t } = useI18n();


// watch(()=>popupShow.value, async (newValue) => {
//     if(newValue){
//         await getTabData();
//         await getRewardData();
//         await getUrl();
//     }
// })
onMounted(async () => {
    await getTabData();
    await getRewardData();
    await getUrl();
})

const url = ref<string>("");
const getUrl = async () =>{
    const { code, data }:any = await getAppDownloadUrl();
    if(code == 200){
        url.value = data.data;
    }
}

const getRewardData = async () => {
    const {code, data} = await getRegisterAndDownloadReward();
    if(code == 200){
        isCanGet.value = data.data.downloadAmount > 0;
    }
}

const getTabData = async () => {
    const {code, data}:any = await getGlobalSetting({name:"ACTIVE_DOWN_LOAD_APP"});
    // console.log(data);  
    if(code == 200){
        reward.value = data.data.amount;
    }
}


const onClickButton = async() => {
    if(isCanGet.value){
        const {code, data}:any = await receiveDownloadReward();
        if(code == 200){
            showTipModel({
                type: 4,
                title: t("receive_success", [data.data || 0]),
                icon: "success",
                success: () => {
                    closePopup();
                    getTabData();
                    getRewardData();
                }
            });
        }
    }else{
        // 下载
        window.openWin(url.value, "_blank");
    }
}

</script>

<style lang="scss" scoped>

    .box{
        :deep(.van-popup--center) {
            max-width: $max-width;
            top      : 50%;
        }
    }

    .light{
        // width: 100vw;
        width: $max-width;
        height: 496px;
        background:url('#{$img-base-path}/event/newMarquee/light_new.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;
        overflow-x: hidden;
        box-sizing: border-box;
    }
    .bg {
        // width: $max-width;
        width: 288px;
        height: 330px;
        background:url('#{$img-base-path}/event/newMarquee/popup_new.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;

        
    }
    .title {
        width: 168px;
        height:85px;
        background:url('#{$img-base-path}/event/newMarquee/title_1.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;
        
    }
    .people {
        width: 160px;
        height: 160px;
        background:url('#{$img-base-path}/event/newMarquee/people_1.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;
    }

    .content {
        font-weight: 500;
        font-size: 14px;
        color: white;
    }

    .reward-content{
        font-weight: bold;
        font-size: 16px;
        color: white;
        text-stroke: 1px $theme-text-color-dark;
        -webkit-text-stroke: 1px $theme-text-color-dark;
    }

    .button{
        @extend .theme-btn;
        width:252px;
        height: 36px;
       
        
        &.not-active{
           background: $theme-btn-disable-bg;
           color: white;
        }

        .button-text{
            font-weight: 500;
            font-size: 15px;
            color: white;

        }

    }
</style>
