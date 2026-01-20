<template>
    <div>
        <!-- {{ serviceURL }} -->
        <iframe 
            v-if="serviceURL" 
            :src="serviceURL" 
            frameborder="0" 
            class="w-full"
            style="height: calc(100vh - 50px);"
        ></iframe>
    </div>
</template>

<script setup lang="ts">
const serviceURL = localStorage.getItem('serviceURL') || '';
</script>