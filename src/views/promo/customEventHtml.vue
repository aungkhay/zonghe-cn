<template>
    <div class="p-3">
        <div v-html="customHtml"></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const customHtml = computed(() => {
    return localStorage.getItem('customHtml');
})
</script>