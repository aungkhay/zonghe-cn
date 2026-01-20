<template>
    <div
        class="main-box-new cursor-pointer"
        @click="$emit('click')"
    >
        <!-- 箭头 -->
        <svg-icon name="arrow_right" class="text-[var(--primary-color)] absolute text-[16px]" :class="arrowClass" />
        <!-- 宝箱主体 -->
        <div class="chest-box">
            <!-- <img :src="isOpen ? $chest_open : $chest_close" class="w-12 h-12 mx-auto mb-1" >
                <div class="text-label"><span>{{ label }}</span></div>
            </img> -->
            <div class="chest-box-img" :class="isOpen === 2 ? 'opened' : isOpen === 1 ? 'can-open' : ''" >
                <div class="text-rect" :class="isOpen === 2 ? 'opened' : ''" ><span>{{ label }}</span></div>
            </div>
            <div class="text-reward">{{ reward }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance()



const props = defineProps({
  isOpen: Number,
  label: String,
  reward: String,
  direction: String, // right, down, left
});

// 箭头旋转 + 定位
const arrowClass = computed(() => {
  switch (props.direction) {
    case 'up':
      return '-top-[15px] left-1/2 -translate-x-1/2 rotate-270';
    case 'down':
      return '-bottom-[15px] left-1/2 -translate-x-1/2 rotate-90';
    case 'left':
      return 'left-[-15px] top-1/2 -translate-y-1/2 rotate-180';
    case 'right':
      return 'right-[-15px] top-1/2 -translate-y-1/2';
    default:
      return '';
  }
});
</script>

<style scoped lang="scss">
   .main-box-new{
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
;
      .chest-box{
         text-align: center;
         padding: 0px;
        
      }
       
      .chest-box-img{
         width: 70px;
         height: 70px;
         background-image: url('#{$img-base-path}/public/chest_close.png');
         background-size: 100% 100%;
         background-repeat: no-repeat;
         background-position: center;
         margin-left: auto;
         margin-right: auto;
         
         &.can-open{
            background-image: url('#{$img-base-path}/public/chest.png');
         }

         &.opened{
            background-image: url('#{$img-base-path}/public/chest_open.png');
         }

         display: flex;
        //  align-items: center;
         justify-content: center;
      }

     
      .text-rect{
        min-width: 50px;
        height: 18px;
        background: $theme-chest-node-text-rect-bg;
        border-radius: 3px 3px 3px 3px;
        
        margin-top: 40px;
        margin-left: auto;
        margin-right: auto;

        display: flex;
        align-items: center;
        justify-content: center;

        span{
            font-weight: 500;
            font-size: 11px;
            color: black
        }

        &.opened{
           background: $theme-chest-node-opened-bg;
           span{
             font-weight: 500;
             font-size: 11px;
             color: white;
           }
        }
      }



      .text-reward{
        //  margin-top: 6px;
         margin-left: auto;
         margin-right: auto;
         font-weight: 500;
         font-size: 11px;
         color: var(--primary-color);
   
      }
     
   }

</style>