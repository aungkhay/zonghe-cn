<template>
    <div class="p-3">
        <div class="text-[20px] font-bold">{{ item.title ?? '-' }}</div>
        <div v-html="item.content"></div>
    </div>
</template>
<script setup lang="ts">
import { readNoti } from '@/api/user';
import { computed, onMounted } from 'vue';

const item = computed(() => {
    const data = JSON.parse(localStorage.getItem('noti_details') ?? '{}');
    return data;
})

const readItem = async () => await readNoti({ id: item.value.id });

onMounted(() => {
    readItem();
})
</script>