<template>
    <div class="p-3">
        <div 
            v-for="(item, index) in services" 
            :key="index"
            class="p-3 mb-3 bg-white rounded-md"
            @click="goToService(item)"
        >
            <div class="flex items-center space-x-3">
                <div><img :src="item.imgSmall" alt="" srcset="" style="height: 50px;"></div>
                <div class="font-semibold">{{ item.title }}</div>
            </div>
        </div>
    </div>
    <Login @homeInit="{}" ref="loginRef" :captcha="needRecaptcha"></Login>
</template>

<script setup lang="ts">
import { floatingIconList } from '@/api/home';
import { useUserStoreHook } from '@/store/modules/user';
import { computed, onMounted, ref } from 'vue';
import CryptoJS from 'crypto-js';
import router from '@/router';
import Login from "@/components/Login/index.vue";

const services = ref([]);
const needRecaptcha = ref(true);
const playerInfo = computed(() => {
    return useUserStoreHook().playerInfo;
});

const getCustomerServices = async () => {
    const { code, data } = await floatingIconList();
    if (code === 200) {
        services.value = Array.isArray(data.data) ? data.data : [];
    }
}

const goToService = (item: any) => {         
    let url = item.jumpUrl;
    const visitId = playerInfo.value?.userId || '';
    const nickname = playerInfo.value?.userName || '';
    const timestamp = (new Date).getTime();
    const rawStr = nickname + timestamp;
    // console.log('rawStr', rawStr);
    const md5 = CryptoJS.MD5(rawStr).toString(CryptoJS.enc.Hex).toLowerCase();
    // console.log('md5', md5);
    const serviceURL = `${url + nickname}&t=${timestamp}&sign=${md5}`;
    // console.log(serviceURL);
    localStorage.setItem('serviceURL', serviceURL);
    router.push({ path: '/service/chat' });
}

onMounted(() => {
    getCustomerServices();
});
</script>