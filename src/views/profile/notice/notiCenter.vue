<template>
    <div ref="scrollContainer" class="p-3 overflow-y-auto bg-[#f4faff]" style="height: calc(100vh - 50px); -webkit-overflow-scrolling: touch;" @scroll="handleScroll">
        <div v-for="(noti, index) in notifications" :key="index" class="mb-3" @click="goToDetails(noti)">
            <div class="flex items-center justify-between bg-white p-2 rounded-lg">
                <div class="flex space-x-2 items-center">
                    <div class="h-10 w-10 bg-[var(--primary-color)] text-center flex items-center justify-center rounded-full">
                        <van-icon name="bell" size="20" class="text-white" />
                    </div>
                    <div>
                        <div class="font-bold w-[130px] truncate">{{ noti.title ?? '-' }}</div>
                        <div class="w-[130px] truncate text-gray-400 text-sm">{{ noti.titleTwo ?? '-' }}</div>
                    </div>
                </div>
                <div class="text-[12px] text-gray-600 w-[90]">{{ noti.createTime ?? '-' }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getNotifications } from '@/api/user';
import { onActivated, onMounted, ref } from 'vue';
import router from '@/router';

const pageSize = ref(13);
const pageNum = ref(1);
const notifications = ref([]);
const scrollContainer = ref(null);
const isLoading = ref(false);
const hasMore = ref(true);
const totalNotice = ref(0);

const getData = async () => {
    if (isLoading.value || !hasMore.value) return;

    isLoading.value = true;
    const {code, data} = await getNotifications({ pageNum: pageNum.value, pageSize: pageSize.value });
    if(code == 200) {
        totalNotice.value = data.total;
        notifications.value = notifications.value.concat(data.rows);
        if(notifications.value.length < totalNotice.value) {
            pageNum.value++;
        } else {
            hasMore.value = false;
        }
    }
    isLoading.value = false;
}

const goToDetails = (item: any) => {
    localStorage.setItem('noti_details', JSON.stringify(item));
    router.push('/noti-center/details');
}

const handleScroll = (e) => {
  const el = e.target;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
    // near bottom
    getData();
  }
};

onActivated(() => {
  pageNum.value = 1;
  notifications.value = [];
  hasMore.value = true;
  getData();
  // scroll back to top
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0;
  }
});

onMounted(() => {
    getData();
})
</script>