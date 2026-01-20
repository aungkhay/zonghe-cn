<template>
  <div>
    <div class="top-menu-bar" ref="menuBarRef">
      <div v-if="showBackButton" class="back-btn" @click="goBack">
        <van-icon name="arrow-left" />
      </div>
      
      <div 
        v-for="(item, index) in menuItemsToShow" 
        :key="index" 
        class="menu-item" 
        :class="{ active: activeMenu === item.key }"
        @click="changeMenu(item.key, item.path, index, item.component)"
      >
        {{ $t(item.textId) }}
      </div>
    </div>
    <div class="top-menu-spacer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, defineProps, defineEmits } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

interface MenuItem {
  textId: string;
  key: string;
  path?: string;  // 路径可选
  component?: any; // 添加组件选项
}

const goBack = () => {
  if (props.directBack) {
    router.push('/profile');
  } else {
    router.go(-1);
  }
}

// 定义props
const props = defineProps({
  items: {
    type: Array as () => MenuItem[],
    default: () => []
  },
  defaultActive: {
    type: String,
    default: 'vip'
  },
  // 添加showBackButton参数，默认不显示
  showBackButton: {
    type: Boolean,
    default: false
  },
  // 添加directBack参数，默认不显示
  directBack: {
    type: Boolean,
    default: false
  }
});

// 定义emit
const emit = defineEmits(['component-change']);

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const menuBarRef = ref(null);

// 添加updateActiveTab方法供外部组件调用
const updateActiveTab = (key) => {
  if (key) {
    activeMenu.value = key;
    const index = menuItemsToShow.value.findIndex(item => item.key === key);
    if (index !== -1) {
      nextTick(() => {
        scrollToIndex(index);
      });
    }
  }
};

// 暴露方法给父组件使用
defineExpose({
  updateActiveTab
});

// 默认菜单项
const defaultMenuItems: MenuItem[] = [
  { textId: "105000", key: "eventos", path: "/promo" },   // Eventos
  { textId: "110006", key: "missao", path: "/agent" },    // Missão
  { textId: "110007", key: "vip", path: "/vipPlus" },     // VIP
  { textId: "105036", key: "rebate", path: "/activity/rebate" },  // Rebate
  { textId: "102020", key: "pendente", path: "" },  // 进行中 (Pendente) - 暂时没有对应页面
  { textId: "102002", key: "poupanca", path: "" },   // 礼包 (Poupança) - 暂时没有对应页面
  { textId: "104006", key: "history", path: "/history" },
  // { textId: "f_message_center", key: "message", path: "/messageCenter" }
];

// 使用传入的菜单项或默认菜单项
const menuItemsToShow = computed(() => props.items.length > 0 ? props.items : defaultMenuItems);

// 当前激活的菜单
const activeMenu = ref(props.defaultActive);

// 滚动到指定索引的菜单项
// 保证滚动后左右各有两个菜单项（如果有足够的菜单项）
const scrollToIndex = (index) => {
  try {
    if (!menuBarRef.value) return;

    const menuItems = menuBarRef.value?.querySelectorAll?.('.menu-item');
    if (!menuItems || menuItems.length === 0) return;

    // 校正索引
    if (index < 0) index = 0;
    if (index >= menuItems.length) index = menuItems.length - 1;

    const menuBar = menuBarRef.value;
    if (!menuBar || typeof menuBar.scrollTo !== 'function' || !menuBar.offsetWidth) return;

    // 计算左侧和右侧应显示的菜单项数量
    const leftCount = 1;
    const rightCount = 1;

    // 计算目标左侧第一个菜单项的索引
    let firstVisibleIndex = index - leftCount;
    if (firstVisibleIndex < 0) firstVisibleIndex = 0;

    // 计算目标右侧最后一个菜单项的索引
    let lastVisibleIndex = index + rightCount;
    if (lastVisibleIndex > menuItems.length - 1) lastVisibleIndex = menuItems.length - 1;

    // 获取第一个可见项和最后一个可见项
    const firstItem = menuItems[firstVisibleIndex];
    const lastItem = menuItems[lastVisibleIndex];

    if (!firstItem || !lastItem) return;

    // 计算滚动的left值，使目标项左右各有两个（如果有足够的菜单项）
    
    const firstItemLeft = firstItem.offsetLeft ;
    const lastItemRight = lastItem.offsetLeft + lastItem.offsetWidth;

    const menuBarWidth = menuBar.offsetWidth;

    // 目标滚动位置：让firstItem靠左，且保证lastItem能显示在可视区域内
    let scrollLeft = firstItemLeft;

    // 如果右侧超出，则调整scrollLeft
    if (lastItemRight - firstItemLeft > menuBarWidth) {
      scrollLeft = lastItemRight - menuBarWidth;
    }

    // 如果有返回按钮，向左滚动更多
    if (index === 0 && props.showBackButton) {
      scrollLeft -= 100;
    }

    // 不允许负数
    scrollLeft = Math.max(0, scrollLeft);

    try {
      menuBar.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    } catch (error) {
      console.log('滚动操作失败:', error);
    }
  } catch (error) {
    console.log('scrollToIndex执行失败:', error);
  }
};

// 滚动到激活的菜单项
const scrollToActive = () => {
  try {
    // 确保组件已挂载且menuBarRef已存在
    if (!menuBarRef.value) return;
    
    const activeIndex = menuItemsToShow.value.findIndex(item => item.key === activeMenu.value);
    if (activeIndex >= 0) {
      // 使用setTimeout替代nextTick，确保DOM已完全渲染
      setTimeout(() => {
        try {
          scrollToIndex(activeIndex);
        } catch (error) {
          console.log('延迟滚动执行失败:', error);
        }
      }, 200);
    }
  } catch (error) {
    console.log('scrollToActive执行失败:', error);
  }
};

// 点击菜单项切换
const changeMenu = (key, path, index, component) => {
  if (path) {
    router.push(path);
  } else if (component) {
    // 由父组件处理组件的展示
    emit('component-change', { key, component });
  } else {
    // 如果既没有path也没有明确指定component，则使用key作为component
    emit('component-change', { key, component: key });
  }
  activeMenu.value = key;
  
  // 滚动菜单栏以确保点击的项目可见
  nextTick(() => {
    scrollToIndex(index);
  });
};

// 安全地执行滚动初始化
const safeInitScroll = () => {
  try {
    // 构建路径映射
    const pathMap: Record<string, string> = {};
    menuItemsToShow.value.forEach(item => {
      if (item.path) {
        pathMap[item.path] = item.key;
      }
    });
    
    // 找到当前路径对应的菜单项
    let foundMatch = false;
    for (const [path, key] of Object.entries(pathMap)) {
      if (route.path === path) {
        activeMenu.value = key;
        foundMatch = true;
        break;
      }
    }
    
    // 无论是否找到匹配，都尝试滚动到活动菜单项
    setTimeout(() => {
      scrollToActive();
    }, 300);
  } catch (error) {
    console.log('初始滚动设置失败:', error);
  }
};

// 在组件挂载后初始化
onMounted(() => {
  try {
    // 使用延迟确保DOM已完全挂载
    setTimeout(() => {
      safeInitScroll();
    }, 200);
  } catch (error) {
    console.log('挂载后滚动初始化失败:', error);
  }
});

// 路由变化时更新激活的菜单和滚动位置
watch(() => route.path, (newPath) => {
  try {
    // 构建路径映射
    const pathMap: Record<string, string> = {};
    menuItemsToShow.value.forEach(item => {
      if (item.path) {
        pathMap[item.path] = item.key;
      }
    });
    
    // 找到当前路径对应的菜单项
    for (const [path, key] of Object.entries(pathMap)) {
      if (newPath === path) {
        activeMenu.value = key;
        // 延迟执行滚动以确保DOM已更新
        setTimeout(() => {
          scrollToActive();
        }, 200);
        break;
      }
    }
  } catch (error) {
    console.log('路由变化处理失败:', error);
  }
}, { immediate: false }); // 改为false，让onMounted先执行
</script>

<style lang="scss" scoped>
.top-menu-bar {
  display: flex;
  align-items: center;
  width: $max-width; /* 修改宽度为499px，与页面内容一致 */
  gap: 20px;
  height: 42px;
  padding-left: 10px;
  background-color: var(--nav-bar-background);
  max-width: $max-width;
  position: fixed;
  z-index: 100;
  overflow-x: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  
  /* 隐藏滚动条 */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Firefox */
  scrollbar-width: none;
  
  /* iOS支持 */
  -webkit-overflow-scrolling: touch;
}

/* 返回按钮样式 */
.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 100%;
  color: $theme-text-color-dark;
  font-size: 20px;
  cursor: pointer;
  background-color: $theme-nav-bar-bg;
  position: sticky;
  left: 0;
  z-index: 101;
  padding: 0 10px;
  
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 20px;
    width: 1px;
    background-color: rgba(83, 55, 38, 0.2);
  }
}

.menu-item {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: gray;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  white-space: nowrap;
  padding: 0 8px;
  min-width: 60px;
}

.menu-item.active {
  font-weight: bold;
  color: var(--primary-color);
  font-size: 12px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--primary-color);
  }
}

.top-menu-spacer {
  height: 42px;
  width: 100%;
}
</style> 