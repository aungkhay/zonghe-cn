<template>
    <div class="page">
        <div class="logo-rect">
            <div class="logo"/>
            <div class="logo-text">
                {{ $t("maintain") }}
            </div>
        </div> 
    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { loopPictureApi } from '@/api/home';
import router from '@/router';

onMounted(async () => {
    console.log('onMounted maintain!');
    const res = await loopPictureApi();
    if(res.code == 200){
       router.push('/home');
    }
});
</script>
<style lang="scss" scoped>
.page {
    max-width: $max-width;
    width: 100%;
    height: 100vh;
    background: #000;
    position: relative;
    .logo-rect{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .logo {
            width: 499px;
            height: 211px;
            background: url('#{$img-base-path}/public/maintain.png')  center center;
            background-size: 100% 100%;
        }
        .logo-text {
            font-weight: 500;
            font-size: 20px;
            color: #FFFFFF;
            text-align: center;
        }
    }
    
}
</style>