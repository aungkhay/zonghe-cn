<template>
    <div class="new-loading-page" v-if="modelProps.loadingShow" :class="{ 'new-loading-page-hide': modelProps.loadingProgress >= 100 }">
        <div class="logo-top"/>
        <!-- <div class="logo-middle"/> -->
        <!-- <div class="box flex items-center justify-center">
            <div class="logo w-[80px] h-[80px]"/>
        </div> -->
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
let modelProps = ref({
    loadingShow: true,
    loadingProgress: 0,
})

const show = () => {
    modelProps.value.loadingShow = true;
    modelProps.value.loadingProgress = 0;
}

const hide = () => {
    modelProps.value.loadingProgress = 100;
    setTimeout(() => {
        modelProps.value.loadingShow = false;
    }, 1000);
}

defineExpose({
    show,
    hide
})
</script>
<style lang="scss" scoped>
   .new-loading-page {
        max-width: $max-width;
        width: 100%;
        height: 100%;
        // background: url('#{$img-base-path}/public/loading_bg3.png')  center top;
        // background-size: 100% 100%;
        background: var(--app-background);
        text-align: center;
        overflow: hidden;
        position: fixed;
        top: 0;
        z-index: 2147483647;

        .box {
           position: fixed;
           bottom: 36px;
           left: 0;
           right: 0;
        }

        .logo {
            background: url('#{$img-base-path}/public/logo_2.png') no-repeat center center;
            background-size: 100% 100%;
        }

        .logo-top{
            // background: url('#{$img-base-path}/public/logo_1.png') no-repeat center center;
            background: url('#{$img-base-path}/home/hj_new_logo.png') no-repeat center center;
            background-size: 100% 100%;
            position: fixed;
            top:50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 277px;
            height: 80px;
        }

        .logo-middle{
            background: url('#{$img-base-path}/public/logo_4.png') no-repeat center center;
            background-size: 100% 100%;
            position: absolute;
            top: 55%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 343px;
            height: 262px;
        }
   }
   .new-loading-page-hide {
      animation: fold 0.6s ease-in-out forwards;
   }
   

    @keyframes fold {
        from {
            opacity: 1;
            transform: scale(1);
        }

        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }
</style>

