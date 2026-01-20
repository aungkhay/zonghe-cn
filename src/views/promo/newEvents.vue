<template>
  <div class="container">
      <!-- <div class="side-bar">
          <div class="side-bar-item" v-for="item in menuList" :key="item.key" @click="handleMenuClick(item.key)">
            <img :src="$imgBasePath + '/public/all_event_icon.png'" alt="" class="w-[16px] h-[16px] mr-[10px]" v-if="item.key == 'all'" >
            <span>{{item.title}}</span>
          </div>
      </div> -->
      <div class="main-content">
        <div v-scaleTap class="event-item" v-for="item in activityList" :key="item.id" @click="onClickEvent(item)">
            <div class="event-item-img">
            <img :src="item.imgBig || defaultImg" alt="">
            </div>
        </div>
      </div>
  </div>

  <PopupMarqueeNew />
  <DownloadActivity />
  <RegisterActivity />
  <Login @homeInit="{}" ref="loginRef" :captcha="needRecaptcha"></Login>
</template>


<script setup lang="ts" name="Promo">
import { popupWindowDetail } from '@/api/activity';
import { loopPictureApi } from '@/api/home';
import { SPopManageConfigVo } from '@/model/activity';
import { SActivitySwithVo } from '@/model/home';
import router from '@/router';
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import Common from '@/utils/common/common';
import PopupMarqueeNew from '@/views/activityPopup/Marquee/newIndex.vue';
import DownloadActivity from '@/views/activityPopup/downloadActivity/index.vue';
import RegisterActivity from '@/views/activityPopup/registerActivity/index.vue';
import Login from "@/components/Login/index.vue";

const needRecaptcha = ref(true);

   const $imgBasePath = getCurrentInstance().proxy.$imgBasePath;

   const defaultImg = $imgBasePath + '/event/banner_sample.png';

   const menuList = [
       {title:'All',key:'all',path:''},
    //    {title:'History',key:'history',path:'/history'},
   ];

   const handleMenuClick = (key:string) => {
       if(key == "history"){
          router.push('/history');
       }
   }

   const activityList = ref<SActivitySwithVo[]>([]);

   const getActivityList = async () => {
      const res = await loopPictureApi();
      if(res.code == 200){
         activityList.value = res.data.data.filter((item:SActivitySwithVo) => item.isOpen == 1);
      }
   }
  
   const onClickEvent = async(item:SActivitySwithVo) => {
        if(item.customHtml) {
            localStorage.setItem('customHtml', item.customHtml);
            router.push('/custom-event-html');
        } else {
            Common.activityJump(item)
        }
   }

   onMounted(() => {
       console.log('onMounted newEvents!');
       getActivityList();
   });


</script>

<style scoped lang="scss">
   .container{
    padding   : 0px 0px 0px 0px;
    box-sizing: border-box;
    min-height: 100%;
    display: flex;
    .side-bar{
         flex: 0 0 100px;
         min-height: calc(100vh - 500px);
        //  max-height: calc(100vh - 115px);
            
         background-color: #047C04;
         .side-bar-item{
            width: 88px;
            height: 36px;
            background: #FFF1AD;
            border-radius: 4px 4px 4px 4px;
            margin-top: 15px;
            margin-left: auto;
            margin-right: auto;

            display: flex;                /* 开启flex布局 */
            justify-content: center;      /* 水平居中 */
            align-items: center;         

            span{

                font-weight: 500;
                font-size: 14px;
                color: #533726;  
            }
         }
      }

      .main-content{
          width: calc(100vw);
          
          &:last-child{
            margin-bottom: 100px;
          }

          .event-item{
                width: 100%;
                margin-top: 10px;

                .event-item-img{
                    width: calc(100% - 30px);
                    margin-left: auto;
                    margin-right: auto;

                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 10px;
                    }
                }
            }
          


         

          
      }

      
      
   }
</style>
