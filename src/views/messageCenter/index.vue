<template>
  <div class="message-center">
    <!-- 标题栏 -->
    <div class="header" style="display: flex; align-items: center; position: relative;">
      <div v-scaleTap class="back-btn" @click="goBack" style="display: flex; align-items: center;">
        <van-icon name="arrow-left" />
      </div>
      <h1 style="margin: 0 auto;color: #533726;">{{ $t('message_center') }}</h1>
    </div>
    <div style="height: 1px;background-color:#FFF1AD;"></div>

    <!-- 菜单栏 -->
    <div class="tab-bar" ref="tabBarRef">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: activeTab === index }"
        @click="changeTab(index)"
      >
        {{ $t(tab.textId) }}
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 客服支持页签 -->
      <div v-if="activeTab === 0">
        <!-- 在线客服区域 -->
        <div class="support-block">
          <div class="support-header">
            <div class="avatar">
              <img :src="`${$imgBasePath}/message/image_15@2x.png`" alt="Support" />
            </div>
            <div class="support-title">
              <h2>{{ $t('online_support_24_7') }}</h2>
              <p>{{ $t('talk_to_customer_service') }}</p>
              <div v-scaleTap class="support-button" @click="openOnlineService">
                <span style="color: #FFCC00; font-size: 14px;">{{ $t('online_service') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Telegram 客服区域 -->
        <div class="telegram-block">
          <h2 class="telegram-title">
            <img
              style="width: 17px; height: 17px; vertical-align: middle; margin-right: 10px;"
              :src="`${$imgBasePath}/message/Share_ 3D Icon@2x.png`"
              alt="Support"
            />
            <span style="vertical-align: middle;">{{ $t('telegram_support') }}</span>
          </h2>
          <div style="height: 1px;background-color:#59A157; margin-bottom: 9px;"></div>
          <div class="telegram-contact" style="margin-top: 3px;">
            <div class="telegram-info">
              <div class="telegram-logo">
                <img
                  style="width: 25px; height: 25px; vertical-align: middle; margin-right: 10px;"
                  :src="`${$imgBasePath}/message/Share_ 3D Icon@2x.png`"
                  alt="Support"
                />
              </div>
              <div class="telegram-id" style="color: #FFCC00; font-size: 10px;gap:0px">
                <h3 style="font-size: 10px;color:#FFCC00">W1-MERCURYPG</h3>
                <p style="font-size: 10px;font-weight: 500;">W1-MERCURYPG</p>
              </div>
            </div>
            <div class="contact-btn" @click="contactTelegram">
              {{ $t('contact_now') }}
            </div>
          </div>
        </div>
      </div>

      <!-- 新闻页签 -->
      <div v-else-if="activeTab === 1">
        <div class="news-content">
          <div class="news-item">
            <h3>{{ $t('news_title') || '公告标题' }}</h3>
            <p>{{ $t('news_content') || '这里是公告内容...' }}</p>
          </div>
        </div>
      </div>

      <!-- 通知页签 -->
      <div v-else-if="activeTab === 2">
        <div class="notification-content">
          <div class="notification-item">
            <h3>{{ $t('notification_title') || '通知标题' }}</h3>
            <p>{{ $t('notification_content') || '这里是通知内容...' }}</p>
          </div>
        </div>
      </div>

      <!-- 浮动面板页签 -->
      <div v-else-if="activeTab === 3">
        <div class="floating-panel-content">
          <div class="panel-item">
            <h3>{{ $t('floating_panel_title') || '浮动面板标题' }}</h3>
            <p>{{ $t('floating_panel_content') || '这里是浮动面板内容...' }}</p>
          </div>
        </div>
      </div>

      <!-- 建议奖励页签内容 -->
      <div v-else-if="activeTab === 4">
        <div class="feedback-content">
          <!-- 按钮区域 -->
          <div class="feedback-buttons">
            <div v-scaleTap class="create-feedback-btn" @click="createFeedback">{{ $t('create_feedback') || '创建反馈' }}</div>
            <div v-scaleTap class="my-feedback-btn">{{ $t('my_feedback') || '我的反馈' }}</div>
          </div>
          
          <!-- 反馈内容区域 -->
          <div class="feedback-form">
            <h3 class="feedback-title">{{ $t('feedback_content') || '反馈内容' }} <span>({{ $t('make_suggestions') || '提出改进建议' }})</span></h3>
            <div class="feedback-textarea">
              <textarea 
                v-model="feedbackText" 
                :placeholder="$t('feedback_placeholder') || '您的意见对我们很重要。任何有价值的建议都会被考虑，一旦采纳，重要性将决定现金奖励。随时提出建议！'"
                maxlength="200"
              ></textarea>
              <div class="char-count">{{feedbackText.length}}/200</div>
            </div>
            
            <!-- 图片上传区域 -->
            <div class="feedback-images">
              <h3 class="images-title"><span>{{ $t('images_dont_lie') || '图片不会说谎' }}</span> ({{ $t('easier_to_accept') || '更容易被接受' }})</h3>
              <div class="image-upload">
                <div class="upload-box">
                  <div class="plus-icon">+</div>
                </div>
                <p class="upload-desc">{{ $t('image_upload_desc') || '支持上传图片和视频（最大50MB）' }}</p>
              </div>
            </div>
            
            <!-- 规则说明 -->
            <div class="feedback-rules">
              <h3>{{ $t('reward_rules') || '奖励规则' }}</h3>
              <p>{{ $t('reward_rules_desc') || '我们特别设置了丰厚奖金，专门用于收集反馈，以优化系统和资源，为您提供更好的体验！一旦接受，奖励将根据实用性发放（不接受的除外）。' }}</p>
            </div>
            
            <!-- 提交按钮 -->
            <div class="submit-feedback">{{ $t('send_feedback') || '发送反馈' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const tabBarRef = ref(null);
const feedbackText = ref('');

// 标签页选项
const tabs = [
  { textId: 'support', key: 'support' },
  { textId: 'news', key: 'news' },
  { textId: 'notification', key: 'notification' },
  { textId: 'floating_panel', key: 'floatingPanel' },
  { textId: 'bonus', key: 'bonus' }
];

const activeTab = ref(0);

// 返回上一页
const goBack = () => {
  router.back();
};

// 打开在线客服
const openOnlineService = () => {
  console.log('Open online service');
};

// 联系Telegram
const contactTelegram = () => {
  console.log('Contact Telegram');
  window.openWin('https://t.me/W1MERCURYPG', '_blank');
};

// 创建反馈
const createFeedback = () => {
  console.log('Create feedback');
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

    // a计算滚动的left值，使目标项左右各有一个（如果有足够的标签页）
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

// 切换标签页
const changeTab = (index) => {
  activeTab.value = index;
  
  // 滚动菜单栏以确保点击的项目可见
  nextTick(() => {
    scrollToTabIndex(index);
  });
};

// 组件挂载后初始化
onMounted(() => {
  // 使用延迟确保DOM已完全挂载
  setTimeout(() => {
    scrollToTabIndex(activeTab.value);
  }, 200);
});
</script>

<style>
.message-center {
  min-height: 100vh;
  padding-bottom: 20px;
  /* 使用线性渐变实现足球场的绿色交替背景，并覆盖项目根背景 */
  
  /* background: repeating-linear-gradient(
    to bottom,
    #4CAF50 0px,
    #4CAF50 60px,
    #388E3C 60px,
    #388E3C 120px
  ) !important; */
  position: relative;
  /* z-index: 1; */
}


.header {
  display: flex;
  align-items: center;
  height: 44px;
  background-color: #FFCC00;
  padding: 0 15px;
  position: relative;
}

.header .back-btn {
  position: absolute;
  left: 15px;
  font-size: 20px;
  color: #333;
}

.header h1 {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.tab-bar {
  display: flex;
  align-items: center; /* 垂直居中 */
  background-color: #FFCC00;
  overflow-x: auto;
  /* padding: 0 10px; */
  height: 42px;
  position: relative;
  -webkit-overflow-scrolling: touch;
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
  font-size: 11px;
  color: #533726;
  position: relative;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 50px;
  text-align: center;
}

.tab-item:hover {
  background-color: rgba(255, 204, 0, 0.2); /* 浅黄色背景 */
}

.tab-item.active {
  font-size: 12px;
  font-weight: bold;
  color: #533726;
}

.tab-item::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 3px;
  background-color: #006400;
  transition: 
    width 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), 
    left 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.tab-item.active::after {
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #006400; /* 绿色指示器 */
}

.content {
  padding: 10px;
}

.support-block {
  margin: 15px 5px;
  padding: 15px;
  background-color: rgba(12, 96, 12, 0.6); /* 60% 透明度 */
  border-radius: 10px;
  color: white;
}

.support-header {
  display: flex;
  margin-bottom: 15px;
}

.avatar {
  width: 50px;
  height: 50px;
  /* border-radius: 50%; */
  overflow: hidden;
  margin-right: 10px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.support-title {
  flex: 1;
}

.support-title h2 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.support-title p {
  font-size: 12px;
  opacity: 0.8;
}

.support-button {
    margin-top: 10px;
  background-color: transparent;
  border: 1px solid #FFCC00;
  color: #333;
  text-align: center;
  width:112px;
  height:28px;
  /* padding: 8px; */
  border-radius: 5px;
  /* font-weight: bold; */
  cursor: pointer;
  
}

.telegram-block {
  margin: 15px 5px;
  padding: 15px;
  background-color: rgba(12, 96, 12, 0.6);
  border-radius: 10px;
  color: white;
}

.telegram-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.telegram-icon {
  margin-right: 10px;
  font-size: 20px;
}

.telegram-contact {
  display: flex;
  background-color: #FFF1AD;
  border-radius: 5px;
  padding: 10px;
  align-items: center;
  color: #333;
  width:315px;
  height:47px;
}

.telegram-info {
  display: flex;
  flex: 1;
  align-items: center;
}

.telegram-logo {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  margin-left: 8px;
  /* background-color: #0088cc; */
  /* border-radius: 10px; */
  color: white;
}

.telegram-icon-large {
  font-size: 24px;
}

.telegram-id {
  flex: 1;
}

.telegram-id h3 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 2px;
}

.telegram-id p {
  font-size: 12px;
  color: #666;
}

.contact-btn {
  background-color: #FF9900;
  color: white;
  padding: 8px;
  border-radius: 5px;
  font-size: 11px;
  width: 73px;
  height: 36px;
  font-weight: bold;
  cursor: pointer;
  line-height: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

/* 新闻页、通知页、浮动面板页样式 */
.news-content, .notification-content, .floating-panel-content {
  background-color: rgba(12, 96, 12, 0.6);
  border-radius: 10px;
  padding: 15px;
  margin: 15px 5px;
  color: white;
}

.news-item, .notification-item, .panel-item {
  margin-bottom: 15px;
}

.news-item h3, .notification-item h3, .panel-item h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #FFCC00;
}

.news-item p, .notification-item p, .panel-item p {
  font-size: 14px;
  line-height: 1.4;
}

/* 反馈页样式 */
.feedback-content {
  margin: 10px 0;
  padding: 0;
}

.feedback-buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
  justify-content: center;
  width: fit-content;
  /* max-width: 228px; */
  margin-left: 2px;
}

.create-feedback-btn, .my-feedback-btn {
  /* padding: 0px 15px; */
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 114px;
  height: 30px;
  line-height: 13px;
  color: #533726;
}

.create-feedback-btn {
  background-color: #FFCC00;
  color: #533726;
  flex: 1;
}

.my-feedback-btn {
  background-color: #FFFFFF;
  color: #666;
  flex: 1;
}

.feedback-form {
  background-color: rgba(12, 96, 12, 0.6);
  border-radius: 10px;
  padding: 15px;
  color: white;
}

.feedback-title {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 10px;
  line-height: 16px;
  color: #FFA400;
}

.feedback-title span {
  font-size: 14px;
  font-weight: normal;
  color:white;
  line-height: 16px;
}

.feedback-textarea {
  position: relative;
  margin-bottom: 15px;
}

.feedback-textarea textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: none;
  background-color: transparent;
  border: 1px solid white;
  color: white;
  resize: none;
  border-radius: 10px;
  font-size: 12px;
  
}

.feedback-textarea textarea::placeholder {
  color: #C9D4A5; /* 提示文字的颜色 */
  opacity: 1; /* 确保在所有浏览器中颜色显示一致 */
  line-height: 16px;
}


.char-count {
  position: absolute;
  bottom: -20px;
  right: 0px;
  font-size: 10px;
  color: #C9D4A5;
}

.feedback-images {
  margin-bottom: 15px;
}

.images-title {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
}

.images-title span {
  color: #FF9900;
}

.image-upload {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  margin-bottom: 10px;
}

.upload-box {
  width: 80px;
  height: 80px;
  border: 1px solid #C9D4A5;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.plus-icon {
  font-size: 30px;
  color: #C9D4A5;
}

.upload-desc {
  flex: 1;
  font-size: 12px;
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.8);
}

.feedback-rules {
  margin-bottom: 20px;
}

.feedback-rules h3 {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #FF9900;
}

.feedback-rules p {
  font-size: 12px;
  line-height: 1.4;
  color: #C9D4A5;
}

.submit-feedback {
  background-color: #FFCC00;
  color: #000000;
  text-align: center;
  padding: 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  width:325px;
  height:40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom:30px;
}
</style> 