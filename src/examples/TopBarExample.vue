<template>
  <div>
    <!-- 使用自定义菜单项 -->
    <TopBar :items="customMenuItems" defaultActive="dashboard" />
    
    <div class="content">
      <h2>TopBar 使用示例</h2>
      <p>这是一个TopBar组件的使用示例，展示了如何自定义菜单项。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TopBar from '@/components/TopBar/index.vue';

// 自定义菜单项
const customMenuItems = [
  { textId: "f_dashboard", key: "dashboard", path: "/dashboard" },
  { textId: "f_members", key: "members", path: "/members" },
  { textId: "f_statistics", key: "statistics", path: "/statistics" },
  { textId: "f_settings", key: "settings", path: "/settings" }
];
</script>

<style lang="scss" scoped>
.content {
  padding: 60px 15px 15px;
}
</style> 