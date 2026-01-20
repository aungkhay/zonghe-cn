<template>
    <div class="agent-overview">
        <div class="agent-container1" v-if="!isNotShowTitle">
            <!-- 代理奖牌 -->
            <div class="agent-medal">
                <div class="medal-icon" style="position: relative;">
                    <img :src="`${$imgBasePath}/agent/VIP_logo@2x.png`" style="width:46.7px;height:62px;" />
                    <span class="medal-number"
                        style="position: absolute; left: 50%; top: 57%; transform: translate(-50%, -50%);">2</span>
                </div>
            </div>
            <div class="agent-info2" style="margin-left: 10px;">
                <div class="info-row">
                    <div class="info-label">{{ $t('coletavel') || 'Coletável' }}</div>
                    <!-- <div class="info-value">{{ common.formatNum2Data(availableCommission,true) }}</div> -->
                    <div class="action-buttons">
                        <button v-scaleTap class="receive-btn"
                            :class="canReceive ? 'theme-indexQR-receive-btn-bg' : 'theme-indexQR-receive-btn-disabled'"
                            @click="receiveCommission">{{ $t('receber') }}</button>
                        <button v-scaleTap class="history-btn" @click="goHistory">{{ $t('historico') }}</button>
                    </div>
                </div>
                <div class="info-row mode-level-row">
                    <div class="info-item">
                        <span class="mode-label">{{ $t('agent_mode') }}</span>
                        <!-- <span class="mode-value">{{ $t('agent') }}</span> -->
                    </div>
                    <div class="info-item level-item">
                        <span class="level-label">{{ $t('level_difference') }}</span>
                        <!-- <span class="level-value">{{ $t('infinite_daily_settlement') }}</span> -->
                    </div>
                </div>
            </div>
        </div>

        <!-- 分割线 -->
        <div class="divider" v-if="!isNotShowTitle">
        </div>

        <div class="h-[10px]" v-if="isNotShowTitle" />
        <!-- 代理信息 -->
        <div class="agent-info">

            <!-- 推广链接区域 -->
            <div class="promotion-link">
                <div class="qr-code">
                    <div class="qr-code-container">
                        <QRCodeVue :value="inviteLink" :size="qrCodeSize" :margin="1" level="H" render-as="canvas"
                            class="qr-code-img" :cellSize="10" />
                    </div>
                    <div class="save-qr" @click="saveQRCode">{{ $t('click_to_save') }}</div>
                </div>
                <div class="link-box">

                    <div class="link-header">
                        <div class="section-title">{{ $t('my_link') }}</div>
                    </div>

                    <div class="link-container">
                        <div class="link-content">{{ inviteLink }}</div>
                        <div class="copy-btn" @click="copyLink">
                            <svg-icon class="text-[var(--primary-color)] text-[20px]" name="copy" />
                        </div>
                    </div>

                    <div class="link-display">


                        <div class="invite-info">
                            <div class="subordinates" @click="openHistory">{{ $t('direct_subordinates') }} {{
                                directSubordinates }}{{ " " + $t('f_gointo') }}
                            </div>
                            <div class="invite-code">
                                <span>{{ $t('invite_code') }}</span>
                                <span class="code">{{ inviteCode }}</span>
                                <div class="copy-btn-small" @click="copyInviteCode">
                                    <svg-icon class="theme-svg-color-light text-[18px]" name="copy" />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

            </div>

            <!-- 分享方式 -->
            <div class="share-methods" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag"
                @mouseleave="stopDrag" @touchstart="startDrag" @touchmove="onDrag" @touchend="stopDrag">
                <div class="share-item" @click="shareVia('partilhar')">
                    <div class="share-icon partilhar-icon">
                        <img :src="`${$imgBasePath}/agent/share1.png`" alt="Share" />
                    </div>
                    <div class="share-name">{{ $t('share') }}</div>
                </div>
                <div class="share-item" @click="shareVia('facebook')">
                    <div class="share-icon facebook-icon">
                        <img :src="`${$imgBasePath}/agent/share2.png`" alt="Facebook" />
                    </div>
                    <div class="share-name">Facebook</div>
                </div>
                <div class="share-item" @click="shareVia('instagram')">
                    <div class="share-icon instagram-icon">
                        <img :src="`${$imgBasePath}/agent/share3.png`" alt="Instagram" />
                    </div>
                    <div class="share-name">Instagram</div>
                </div>
                <div class="share-item" @click="shareVia('telegram')">
                    <div class="share-icon telegram-icon">
                        <img :src="`${$imgBasePath}/agent/share4.png`" alt="Telegram" />
                    </div>
                    <div class="share-name">Telegram</div>
                </div>
                <div class="share-item" @click="shareVia('whatsapp')">
                    <div class="share-icon whatsapp-icon">
                        <img :src="`${$imgBasePath}/agent/share5.png`" alt="WhatsApp" />
                    </div>
                    <div class="share-name">WhatsApp</div>
                </div>
                <div class="share-item" @click="shareVia('tiktok')">
                    <div class="share-icon tiktok-icon">
                        <img :src="`${$imgBasePath}/agent/share6.png`" alt="TikTok" />
                    </div>
                    <div class="share-name">TikTok</div>
                </div>
                <div class="share-item" @click="shareVia('kakao')">
                    <div class="share-icon kakao-icon">
                        <img :src="`${$imgBasePath}/agent/share7.png`" alt="Kakao" />
                    </div>
                    <div class="share-name">Kakao</div>
                </div>
                <div class="share-item" @click="shareVia('line')">
                    <div class="share-icon line-icon">
                        <img :src="`${$imgBasePath}/agent/share8.png`" alt="Line" />
                    </div>
                    <div class="share-name">Line</div>
                </div>

                <!-- 添加滑动提示 -->
                <div class="scroll-hint" v-if="showScrollHint">
                    <van-icon name="arrow" />
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import QRCodeVue from 'qrcode.vue';
import { useI18n } from "vue-i18n";
import { showTipModel } from '@/components/TipModel';
import { useUserStoreHook } from "@/store/modules/user";
import { agentInfoApi, AppAgentInfoVo, getAgentWeekRebateApi, receiveAgentWeekRebateApi, SearchTimeEnum } from '@/api/agent';
import common from '@/utils/common/common';
const props = defineProps({
    isNotShowTitle: {
        type: Boolean,
        default: false
    }
})



const directSubordinates = ref(0);

const inviteLink = ref('');
const inviteCode = ref('');
const availableCommission = ref(0);
const canReceive = ref(false);

const qrCodeSize = ref(65);


const playerInfo = computed(() => {
    return useUserStoreHook().playerInfo;
});



const { t } = useI18n();

const router = useRouter();

// 复制邀请链接
const copyLink = () => {
    navigator.clipboard.writeText(inviteLink.value)
        .then(() => {
            // 显示复制成功提示
            // 使用 showTipModel 显示复制成功提示
            // @ts-ignore
            if (typeof showTipModel === 'function') {
                showTipModel({
                    type: 1,
                    icon: "success",
                    title: t("link_copied")
                });
            }
        })
        .catch(err => {
            console.error('复制失败:', err);
        });
};

const openHistory = () => {
    router.push({ name: 'agentFirstHistory' });
};

// 获取可领取佣金
const getReceiveCommission = async () => {
    const { code, data } = await getAgentWeekRebateApi();
    if (code === 200) {
        availableCommission.value = data.data;
        canReceive.value = availableCommission.value > 0;
    }
};

// 分享到社交媒体
const shareVia = (platform) => {
    console.log(`分享到 ${platform}`);
    // 根据不同平台实现分享逻辑
    switch (platform) {
        case 'partilhar':
            // 分享到社交媒体
            window.openWin('https://coinmates.top/', '_blank');
            break;
        case 'facebook':
            // 跳转到Facebook官网
            window.openWin('https://www.facebook.com/', '_blank');
            break;
        case 'instagram':
            // 跳转到Instagram官网
            window.openWin('https://www.instagram.com/', '_blank');
            break;
        case 'telegram':
            // 跳转到Telegram官网
            window.openWin('https://telegram.org/', '_blank');
            break;
        case 'whatsapp':
            // 跳转到WhatsApp官网
            window.openWin('https://www.whatsapp.com/', '_blank');
            break;
        case 'tiktok':
            // 跳转到TikTok官网
            window.openWin('https://www.tiktok.com/', '_blank');
            break;
        case 'kakao':
            // 跳转到Kakao官网
            window.openWin('https://www.kakao.com/', '_blank');
            break;
        case 'line':
            // 跳转到Line官网
            window.openWin('https://line.me/', '_blank');
            break;



    }
};

// 复制邀请码
const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode.value)
        .then(() => {
            // 显示复制成功提示
            if (typeof showTipModel === 'function') {
                showTipModel({
                    type: 1,
                    icon: "success",
                    title: t("invite_code_copied")
                });
            }
        })
        .catch(err => {
            console.error('复制失败:', err);
        });
};

// 保存二维码
const saveQRCode = () => {
    // 全兼容：先查找容器下canvas，再查找直接class
    let canvas = document.querySelector('.qr-code-img canvas') as HTMLCanvasElement | null;;
    if (!canvas) {
        canvas = document.querySelector('.qr-code-img') as HTMLCanvasElement | null;;
    }
    if (canvas && canvas.tagName === 'CANVAS') {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.download = 'invite.png';
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        // 兼容img/svg方案
        const img = document.querySelector('.qr-code-img img') as HTMLImageElement | null;
        if (img) {
            const a = document.createElement('a');
            a.download = 'invite.png';
            a.href = img.src;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            alert(t("f_qr_code_not_found"));
        }
    }
};
// 领取佣金
const receiveCommission = async () => {
    if (!canReceive.value) return;
    // 这里添加领取佣金的逻辑
    console.log('领取佣金');

    // 模拟API调用
    const { code, data }: any = await receiveAgentWeekRebateApi();
    if (code === 200) {
        //刷新
        showTipModel({
            type: 4,
            title: t("receive_success", [common.formatNum(data.data.amount) || 0]),
            icon: "success",
            success: () => {
                getReceiveCommission();
            }
        });

    }
};

// 跳转历史记录
const goHistory = () => {
    router.push({ name: 'agentHistory' });
};

// 获取代理信息
const getAgentInfo = async () => {
    // 模拟API调用获取代理信息
    const { code, data } = await agentInfoApi({ day: SearchTimeEnum.YESTERDAY });
    if (code === 200) {
        directSubordinates.value = data.data.team.teamCount;
        // console.log(data);
    }

};


// 拖拽相关状态
const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);
const showScrollHint = ref(true);

// 开始拖拽
const startDrag = (e: MouseEvent | TouchEvent) => {
    isDragging.value = true;
    const container = e.currentTarget as HTMLElement;
    startX.value = 'touches' in e ? e.touches[0].pageX : e.pageX;
    scrollLeft.value = container.scrollLeft;
    container.style.cursor = 'grabbing';
    showScrollHint.value = false;
};

// 拖拽中
const onDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return;
    e.preventDefault();
    const container = e.currentTarget as HTMLElement;
    const x = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const walk = (startX.value - x) * 2;
    container.scrollLeft = scrollLeft.value + walk;
};

// 停止拖拽
const stopDrag = (e: MouseEvent | TouchEvent) => {
    isDragging.value = false;
    const container = e.currentTarget as HTMLElement;
    container.style.cursor = 'grab';
};

// 在组件初始化时获取状态
onMounted(async () => {
    // 使用延迟确保DOM已完全挂载

    inviteLink.value = common.getShareLink();

    inviteCode.value = playerInfo.value.userId;

    getReceiveCommission();
    // 获取代理信息
    getAgentInfo();

    // 检查内容是否超出容器
    nextTick(() => {
        const container = document.querySelector('.share-methods') as HTMLElement;
        if (container) {
            showScrollHint.value = container.scrollWidth > container.clientWidth;
        }
    });
});


</script>

<style scoped lang="scss">
/* 代理信息总览 */
.agent-overview {
    // @extend .theme-agent-indexQR-bg;
    padding: 0px 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    position: relative;
    z-index: 2;
    background-color: #fff;
    border-radius: 8px 8px 8px 8px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.agent-container1 {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 15px;
    position: relative;
}

.agent-medal {
    position: relative;
    width: 65px;
    height: 65px;
    padding-left: 13px;
}

.medal-icon {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    /* 关键：让子元素可以绝对定位重叠 */
}

.medal-number {
    font-size: 20px;
    font-weight: bold;
    color: $theme-indexQR-medal-number-color;
}

.agent-info {
    flex: 1;
    margin-left: 5px;
    width: 100%;
}

.info-row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 8px;
    flex-wrap: nowrap;
    margin-top: 12px;
    white-space: nowrap;
    /* 防止子元素换行 */
}

.mode-level-row {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    /* border-top: 1px solid rgba(255, 255, 255, 0.1); */
    padding-top: 0px;
    margin-top: 0px;
}

.info-label {
    font-size: 12px;
    color: var(--primary-color);
    margin-right: 2px;
}

.info-value {
    font-size: 12px;
    font-weight: Medium;
    color: $theme-indexQR-value-color;
}

.action-buttons {
    display: flex;
    gap: 10px;
    margin-left: 10px;
    margin-right: 5px;
}

.receive-btn {
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}

.receive-btn:disabled {
    background-color: #DDDDDD !important;
    color: #888888 !important;
    cursor: not-allowed;
}

.history-btn {
    @extend .theme-indexQR-receive-btn-bg;
    border: none;
    font-weight: 600;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 12px;
    /* opacity: 0.8; */
    cursor: pointer;
}

.info-item {
    margin-bottom: 5px;
    margin-top: 5px;
    display: flex;
    flex-direction: column;
}

.mode-label {
    font-size: 12px;
    color: var(--primary-color);
    display: block;
    margin-bottom: 2px;
}

.level-label {
    font-size: 12px;
    color: rgb(87, 87, 87);
    display: block;
    margin-bottom: 2px;
    white-space: wrap;
    line-height: 1.2;
}

.level-value {
    font-size: 12px;
    color: #fff;
    display: block;
}

.mode-value {
    font-size: 12px;
    color: #C9D4A5;
    display: block;
}

/* 推广链接区域 */
.promotion-link {
    display: flex;
    flex-direction: row;
    /* background-color: #046A04; */
    width: 100%;
    border-radius: 10px;
    padding: 5px;
    /* border: 1px dashed rgba(255, 255, 255, 0.3); */
}

.link-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* margin-bottom: 10px; */
}

.section-title {
    font-size: 12px;
    color: var(--primary-color);
    font-weight: bold;
}

.link-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 10px;
    margin-left: 15px;
}

.link-container {
    /* flex: 1 1 100%;  */
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 7px 10px;
    width: 100%;
    /* padding: 8px; */
    /* margin-bottom: 15px; */
    border: 1px solid var(--secondary-dark-color);
}

.link-content {
    flex: 1;
    font-size: 12px;
    line-height: normal;
    max-width: 155px;
    color: rgb(87, 87, 87);
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
}

.copy-btn {
    min-width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: #046A04; */
    border-radius: 4px;
    cursor: pointer;
    margin-left: auto;
    /* margin-right: 8px; */
}

.copy-btn img {
    width: 16px;
    height: 16px;
}

.link-display {
    display: flex;
    align-items: flex-start;
    gap: 15px;
}

.qr-code {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.qr-code-container {
    width: 74px;
    height: 74px;
    background-color: var(--secondary-color);
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;

}

.qr-code-img {
    width: 70px;
    height: 70px;
}

.save-qr {
    @extend .theme-indexQR-receive-btn-bg;
    margin-top: 0px;
    padding: 6px 12px;
    border-radius: 0 0 8px 8px;
    font-size: 12px;
    font-weight: 600;
    line-height: normal;
    cursor: pointer;
    text-align: center;
    font-weight: bold;
    width: 74px;
}



.invite-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.subordinates {
    font-size: 11px;
    color: rgb(87, 87, 87);
    /* margin-bottom: 10px; */
}

.invite-code {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: rgb(87, 87, 87);
    margin-top: 3px;
}

.code {
    font-weight: bold;
    margin-left: 5px;
    color: var(--primary-color)
}

.copy-btn-small {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: #046A04; */
    /* border-radius: 2px; */
    cursor: pointer;
    /* 向上移动1px */
    margin-top: -5px;
}

.copy-btn-small img {
    width: 16px;
    height: 16px;
}

/* 分享方式 */
.share-methods {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 15px;
    margin-top: 10px;
    padding: 0 5px;
    margin-right: 20px;
    overflow-x: auto;
    /* width: 100%; */
    justify-content: flex-start;
    gap: 4px;
    /* 支持拖动 */

}

/* Webkit浏览器隐藏滚动条 */
.share-methods::-webkit-scrollbar {
    display: none;
}

.share-item {
    min-width: 54px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
}

.share-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background-size: 24px 24px;
    background-position: center;
    background-repeat: no-repeat;
}

.partilhar-icon {
    background-image: var(--copy-icon-url);
    background-size: 100% 100%;
}

.facebook-icon {
    background-image: var(--copy-icon-url);
    background-size: 100% 100%;
}

.instagram-icon {
    background-image: var(--copy-icon-url);
    background-size: 100% 100%;
}

.telegram-icon {
    background-image: var(--copy-icon-url);
    background-size: 100% 100%;
}

.whatsapp-icon {
    background-image: var(--copy-icon-url);
    background-size: 100% 100%;
}

.tiktok-icon {
    background-image: var(--copy-icon-url);
    background-size: 100% 100%;
}

.kakao-icon {
    background-image: var(--copy-icon-url);
    background-size: 100% 100%;
}

.line-icon {
    background-image: var(--copy-icon-url);
    background-size: 100% 100%;
}



/* 移除伪元素样式，因为我们现在直接使用背景图片 */
.partilhar-icon::after,
.facebook-icon::after,
.instagram-icon::after,
.telegram-icon::after,
.whatsapp-icon::after,
.tiktok-icon::after {
    display: none;
}

.share-name {
    font-size: 11px;
    color: rgb(87, 87, 87);
    text-align: center;
    margin-top: 5px;
}

.scroll-hint {
    position: absolute;
    right: 10px;
    bottom: 40px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
    animation: pulse 2s infinite;
    pointer-events: none;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.6;
    }

    50% {
        opacity: 1;
    }
}


.divider {
    background-color: var(--secondary-color);
    height: 1px;
    margin-top: -15px;
    width: 100%;
}
</style>