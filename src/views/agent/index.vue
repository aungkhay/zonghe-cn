<template>
    <div class="agent-page">
        <!-- 页签导航栏 -->
        <div class="tab-bar" ref="tabBarRef">
            <div v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: activeTab === index }"
                @click="changeTab(index)">
                {{ $t(tab.name) }}
            </div>
        </div>

        <div v-if="activeTab === 0">
            <share-link />
        </div>
        <div v-if="activeTab === 1">
            <refer />
        </div>
        <div v-if="activeTab === 2">
            <all-data />
        </div>
        <!-- <div v-if="activeTab === 3">
            <refer-new />
        </div> -->
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref, nextTick, onMounted } from 'vue';
import { useI18n } from "vue-i18n";
import shareLink from './components/shareLink.vue';
import refer from './components/indexRefer.vue';
import AllData from './components/AllData.vue';
const tabBarRef = ref(null);
const activeTab = ref(0);
const { t } = useI18n();

const tabs = [
    { name: 'invite_link' },
    { name: 'my_data' },
    { name: 'all_data' },
    // { name: 'performance' }
];

// 返回上一页
const goBack = () => {
    router.back();
};
// 滚动到指定索引的标签页
const scrollToTabIndex = (index) => {
    try {
        if (!tabBarRef.value) return;

        const tabItems = tabBarRef.value.querySelectorAll('.tab-item');
        if (!tabItems || tabItems.length === 0) return;

        // 校正索引
        if (index < 0) index = 0;
        if (index >= tabItems.length) index = tabItems.length - 1;

        const tabBar = tabBarRef.value;
        if (!tabBar || typeof tabBar.scrollTo !== 'function' || !tabBar.offsetWidth) return;

        // 计算左侧和右侧应显示的标签页数量
        const leftCount = 1;
        const rightCount = 1;

        // 计算目标左侧第一个标签页的索引
        let firstVisibleIndex = index - leftCount;
        if (firstVisibleIndex < 0) firstVisibleIndex = 0;

        // 计算目标右侧最后一个标签页的索引
        let lastVisibleIndex = index + rightCount;
        if (lastVisibleIndex > tabItems.length - 1) lastVisibleIndex = tabItems.length - 1;

        // 获取第一个可见项和最后一个可见项
        const firstItem = tabItems[firstVisibleIndex];
        const lastItem = tabItems[lastVisibleIndex];

        if (!firstItem || !lastItem) return;

        // 计算滚动的left值，使目标项左右各有一个（如果有足够的标签页）
        const firstItemLeft = firstItem.offsetLeft;
        const lastItemRight = lastItem.offsetLeft + lastItem.offsetWidth;

        const tabBarWidth = tabBar.offsetWidth;

        // 目标滚动位置：让firstItem靠左，且保证lastItem能显示在可视区域内
        let scrollLeft = firstItemLeft;

        // 如果右侧超出，则调整scrollLeft
        if (lastItemRight - firstItemLeft > tabBarWidth) {
            scrollLeft = lastItemRight - tabBarWidth;
        }

        // 不允许负数
        scrollLeft = Math.max(0, scrollLeft);

        try {
            tabBar.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        } catch (error) {
            
            console.log('滚动操作失败:', error);
        }
    } catch (error) {

        console.log('scrollToTabIndex执行失败:', error);
        
    }
};

// 在组件初始化时获取状态
onMounted(async () => {
    // 使用延迟确保DOM已完全挂载
    setTimeout(() => {
        scrollToTabIndex(activeTab.value);
    }, 200);





});
// 切换标签页
const changeTab = (index) => {
    activeTab.value = index;

    // 滚动菜单栏以确保点击的项目可见
    nextTick(() => {
        scrollToTabIndex(index);
    });
};
</script> 

<style scoped lang="scss">
.agent-page {
    width: $max-width;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* 导航栏 */
.tab-bar {
    display: flex;
    align-items: center;
    background-color: var(--nav-bar-background);
    overflow-x: auto;
    height: 42px;
    position: sticky;
    top: 49px;
    z-index: 1001;
    -webkit-overflow-scrolling: touch;
    // box-shadow: 0 5px 6px rgba(0, 0, 0, 0.2);
}

.tab-bar::-webkit-scrollbar {
    display: none;
}

.tab-bar {
    scrollbar-width: none;
}

.tab-item {
    flex: 0 0 auto;
    padding: 10px 15px;
    font-size: 12px;
    color: #000;
    position: relative;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 50px;
    text-align: center;
}

.tab-item.active {
    font-size: 12px;
    font-weight: bold;
    color: var(--primary-color);
}

.tab-item::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 3px;
    background-color: var(--primary-color);
    transition:
        width 0.3s cubic-bezier(0.25, 0.1, 0.25, 1),
        left 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.tab-item.active::after {
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--primary-color);
}
</style> 