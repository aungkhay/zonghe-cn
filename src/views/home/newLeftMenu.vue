<template>
    <div class="popup-bg-new">
        <div class="left-menu-box">
            <div class="mx-auto grid grid-cols-2 gap-[8px]"> 
                <div 
                    class="game-tab-item" 
                    :class="{ 'active': tabIndex == item.key }" 
                    v-scaleTap 
                    v-for="(item, index) in dataList" :key="index" 
                    @click="toGameTab(item)"
                >
                    <!-- <svg-icon class="theme-svg-color-light text-[30px]"  :name="tabIndex == item.key ? item.acImg_Key : item.img_Key " /> -->
                    <img :src="$imgBasePath + '/home/home-category/' + item.acImg_Key + '.png'" class="w-[35px] h-[35px]"/>
                    <div class="game-tab-item-text" :class="{ 'active': tabIndex == item.key }">{{ t(item.gameKey)}}</div>
                </div>  
            </div>

            <!-- <div v-scaleTap class="menu-box mt-[8px]" @click="router.push('/profile/report?tab=1')">
                <svg-icon class="text-[var(--primary-color)] text-[20px] ml-[20px]" name="bet" />
                <span class="ml-[10px]" >{{ $t('betting') }}</span>
            </div> -->

            <!-- <div v-scaleTap class="menu-box mt-[8px]" @click="router.push('/agent')">
                <svg-icon class="text-[var(--primary-color)] text-[20px] ml-[20px]" name="agent" />
                <span class="ml-[10px]" >{{ $t('agent') }}</span>
            </div> -->

            <div class="active-box mt-[8px] rounded-lg">
                <div class="flex flex-col items-center">
                    <span class="text-white">{{ $t('activity') }}</span>
                </div>
                <div class="grid grid-cols-2 gap-[4px] mt-[6px]">
                    <div v-scaleTap v-for="(item, index) in activeList" :key="index" @click="toActivityTab(item)">
                         <div class="btn-item" :style="{ 'backgroundImage': `url(${item.img})`}">
                             <span class="mt-[10px] ml-[10px]">{{item.name}}</span>
                         </div>
                        
                    </div>
                </div>
            </div>
        
            <!-- <div  v-scaleTap class="menu-box mt-[8px]" @click="emit('showLanguage')">
                <svg-icon class="text-[var(--primary-color)] text-[20px] ml-[20px]" name="lang" />
                <span class="ml-[10px]" >{{ $t('language') }}</span>
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { getCurrentInstance,ref } from 'vue';
const { proxy } = getCurrentInstance();
const $imgBasePath = proxy.$imgBasePath;
import { useI18n } from 'vue-i18n';
import router from '@/router';
const { t } = useI18n();
const props = defineProps({
    dataList: {
        type: Object,
        default: () => []
    },
    tabIndex: {
        type: String,
        default: ''
    },
})
const emit = defineEmits(['changeTab','showLanguage'])

const toGameTab = (item: any) => {
    console.log(item);
    emit('changeTab', item.key)
}
const activeList = ref([
    {key:'activity',name:t('activity'),img:$imgBasePath + '/newLeftMenu/activity.png'},  
    {key:'history',name:t('history'),img:$imgBasePath + '/newLeftMenu/history.png'},  
    {key:'VIP',name:t('VIP'),img:$imgBasePath + '/newLeftMenu/vip.png'},  
])

const toActivityTab = (item: any) => {
    console.log(item);
    switch(item.key){
        case 'activity':
            router.push('/promo')
           break
        case 'history':
            router.push('/vipPlus/history')
           break
        case 'VIP':
            router.push('/vipPlus')
           break
        default:
           break
    }   
}


</script>

<style lang="scss" scoped>
   .left-menu-box{
      padding-top: 10px;
      padding-left: 10px;
      padding-right: 10px;
      padding-bottom: 50px;
      height    : calc(100vh - var(--van-nav-bar-height));
      width: 188px;
      overflow-y: auto;
   }

   .game-tab-item{
        background: var(--secondary-color);
        border-radius: 10px;
        display: flex;

        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: 100%;
        height: 70px;
        margin-left: auto;
        margin-right: auto;

        &.active{
            position: relative;
            background: var(--primary-color);
        }

        .game-tab-item-text{
          font-weight: 400;
          font-size: 12px;
          color: #000000;
          
          &.active{
            font-weight: bold;
            color: #FFFFFF;
          }
        }
   }

   .popup-bg-new {
    //   @extend .theme-left-menu-bg;
      background-color: var(--nav-bar-background);
      position: relative;
      z-index: 0;
  }

  .menu-box{
    height: 40px;
    display: flex;
    align-items: center;
    border-radius: 7px;
    background: var(--secondary-color);

    span{
        font-weight: 500;
        font-size: 12px;
    }
  }

  .active-box{
    padding: 8px;
    background: var(--secondary-color);
    span{
        color: #000000;
        font-weight: 500;
        font-size: 12px;
    }
  }

  .btn-item{
    width: 74px;
    height: 50px;
    background-size: 100% 100%;
    background-repeat: no-repeat;

    span{
        font-weight: bold;
        font-size: 12px;
        color: #ffffff;
    }
  }
</style>
