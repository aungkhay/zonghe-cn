# TopBar 组件

这是一个可复用的顶部导航栏组件，支持自定义菜单项、滚动效果和路由跳转，还可以展示自定义Vue组件。

## 使用方法

1. 导入组件

```javascript
import TopBar from '@/components/TopBar/index.vue';
```

2. 在模板中使用

```html
<template>
  <TopBar :items="customMenuItems" defaultActive="home" @component-change="handleComponentChange" />
</template>
```

3. 定义自定义菜单项

```javascript
const customMenuItems = [
  // 使用路由路径的菜单项
  { textId: "f_home", key: "home", path: "/home" },
  // 使用Vue组件的菜单项
  { textId: "f_about", key: "about", component: AboutComponent },
  { textId: "f_contact", key: "contact", path: "/contact" }
];
```

4. 处理组件切换事件

```javascript
const handleComponentChange = ({ key, component }) => {
  // 在这里处理组件的显示逻辑
  currentComponent.value = component;
  showComponentModal.value = true;
};
```

## 属性

| 属性名 | 类型 | 描述 | 默认值 |
|--------|------|------|--------|
| items | Array | 菜单项数组，每项包含textId(多语言ID)、key(唯一标识符)和path(路由路径)或component(Vue组件) | [] |
| defaultActive | String | 默认激活的菜单项 | 'vip' |

## 事件

| 事件名 | 参数 | 描述 |
|--------|------|------|
| component-change | { key, component } | 当点击包含component的菜单项时触发 |

## 菜单项格式

每个菜单项需要包含以下属性：

- `textId`: 多语言文件中的词条ID
- `key`: 菜单项的唯一标识符
- 以下两个属性至少提供一个：
  - `path`: 点击菜单项时跳转的路径
  - `component`: 点击菜单项时显示的Vue组件

## 完整示例

```vue
<template>
  <div>
    <TopBar :items="menuItems" defaultActive="dashboard" @component-change="handleComponentChange" />
    
    <div class="content">
      <!-- 路由页面内容 -->
      <router-view v-if="!showComponentModal"></router-view>
      
      <!-- 组件内容 -->
      <component :is="currentComponent" v-if="showComponentModal"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TopBar from '@/components/TopBar/index.vue';
import DashboardComponent from './DashboardComponent.vue';

const showComponentModal = ref(false);
const currentComponent = ref(null);

const menuItems = [
  { textId: "f_dashboard", key: "dashboard", component: DashboardComponent },
  { textId: "f_members", key: "members", path: "/members" },
  { textId: "f_statistics", key: "statistics", path: "/statistics" },
  { textId: "f_settings", key: "settings", path: "/settings" }
];

const handleComponentChange = ({ key, component }) => {
  currentComponent.value = component;
  showComponentModal.value = true;
};
</script>

<style lang="scss" scoped>
.content {
  padding-top: 42px; // 为TopBar预留空间
}
</style>
```

## 注意事项

1. 确保在多语言文件中已定义了所有菜单项的`textId`对应的词条
2. 组件会自动处理路由变化，并激活对应的菜单项
3. TopBar的高度为42px，可以通过CSS变量进行自定义
4. 组件会自动处理滚动，确保激活的菜单项可见
5. 如果同时提供了`path`和`component`，优先使用`path`进行路由跳转 