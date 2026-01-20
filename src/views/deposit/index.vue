<template>
    <div class="p-3 relative">
        
        <div class="text-gray-600">{{ $t('deposit.deposit_method') }}</div>
        <div class="grid grid-cols-3 gap-2 ml-2 mb-3 mt-2">
            <div 
                v-for="(t, index) in types" :key="index" 
                class="px-2 py-1 rounded-md cursor-pointer bg-white border"
                :class="selectedType === t.label ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-white'"
                @click="changeType(t.label)"
            >
                <div v-if="t.label !== 'custom'" class="flex items-center space-x-2">
                    <img :src="t.logo" alt="" class="w-9 h-9 object-contain rounded-lg" />
                    <div class="text-[12px] text-center">{{ t.label }}</div>
                </div>
                <div v-else class="flex items-center space-x-2">
                    <div class="bg-[var(--primary-color)] h-9 w-9 rounded-lg flex justify-center items-center">
                        <svg-icon name="customer-service" class="text-2xl" />
                    </div>
                    <div class="text-[12px] text-center">{{ $t("deposit.custom") }}</div>
                </div>
            </div>
        </div>
        <div class="text-gray-600">{{ $t('deposit.select_payment_method') }}</div>
        <div class="grid grid-cols-2 gap-3 mt-2">
            <div
                v-for="(channel, index) in channels"
                :key="index"
                class="relative flex items-center p-2 rounded-lg border bg-white"
                :class="selectedChannelId === channel.id ? 'border-[var(--primary-color)]' : ''"
                @click="changeChannel(channel)"
            >
                <div class="flex items-center space-x-2">
                    <div><img :src="channel.logo" alt="" width="30" class="rounded-md" /></div>
                    <div class="flex flex-col">
                        <span class="text-[14px]">{{ channel.name }}</span>
                        <span class="text-[11px] text-gray-500">
                            {{ $t('deposit.limit', { min: channel.amountMin, max: channel.amountMax }) }}
                        </span>
                    </div>
                </div>
                <div v-if="Number(channel.bonusRate) > 0" class="absolute right-0 top-[-10px] bg-red-600 text-white text-[11px] rounded-sm px-2 py-0.5">{{ $t('deposit.send') }} {{ Number(channel.bonusRate) * 100 }}%</div>
                <div v-if="selectedChannelId == channel.id" class="corner-check"></div>
            </div>
        </div>
        <div v-if="selectedType.toLocaleLowerCase() == 'usdt'" class="p-3 mt-3 bg-white rounded-md">
            <div class="flex flex-col justify-center text-center">
                <div>1 USDT = {{ selectedChannel.exchangeRate }} CNY</div>
                <div class="flex justify-center my-2">
                    <QrcodeVue :value="qrcodeValue" :size="100" />
                </div>
                <div class="text-amber-500 flex justify-center items-center">
                    <svg-icon class="text-[16px] mr-1" name="warning"/>{{ $t('deposit.minimum_usdt') }} <span class="font-bold mx-1" style="color: rgb(255 12 0); margin-bottom: 2px;">{{ selectedChannel.amountMin }}</span> USDT
                </div>
            </div>
            <div class="bg-[#f4f7fc] rounded-md p-3 mt-3">
                <div class="text-gray-400 text-sm">{{ $t('deposit.address')}}</div>
                <div class="flex justify-center space-x-3 ">
                    <div class="font-medium text-[#2a3747] tracking-widest">{{ qrcodeValue }}</div>
                    <span @click="copyAddress">
                        <svg-icon class="text-[20px] text-[var(--primary-color)]" name="copy" />
                    </span>
                </div>
            </div>
        </div>

        <div v-if="selectedType.toLocaleLowerCase() != 'usdt'">
            <div v-if="selectedChannel && selectedChannel?.rechargeStr == ''">
                <label for="amountInput" class="text-sm text-gray-600">{{ $t('deposit.enter_amount') }}</label>
                <div class="bg-white p-1 rounded-lg">
                    <input id="amountInput" type="number" v-model="amount" class="w-full p-2 border rounded-lg" />
                </div>
                <div v-if="selectedChannel" class="text-gray-600 text-[12px]">
                    {{ $t('deposit.amount_range', { min: selectedChannel.amountMin, max: selectedChannel.amountMax }) }}
                </div>
            </div>
            <div v-else-if="selectedChannel && selectedChannel.rechargeStr != ''">
                <div class="text-sm text-gray-600 mt-3">{{ $t('deposit.select_amount') }}</div>
                <div class="grid grid-cols-3 gap-3 my-3">
                    <div 
                        v-for="(amt, index) in amountArr" :key="index" 
                        class="relative bg-white p-2 rounded-lg text-center cursor-pointer border transition"
                        :class="amount == parseFloat(amt) ? 'border-[var(--primary-color)]' : ''"
                        @click="amount = parseFloat(amt)"
                    >
                        {{ amt }}
                        <div v-if="amt == amount" class="corner-check"></div>
                    </div>
                </div>
            </div>
            <div class="mt-5">
                <button 
                    class="w-full bg-[var(--primary-color)] text-white py-2 rounded-lg" 
                    :class="!isLoading && canDeposit ? '' : 'opacity-50 cursor-not-allowed'"
                    :disabled="isLoading || !canDeposit" 
                    @click="deposit()"
                >
                    {{ $t('deposit.deposit_now') }}
                </button>
            </div>
        </div>

        <div class="bg-white mb-3 mt-8 p-3 rounded-lg">
            <div class="text-gray-600 flex items-center space-x-1"><svg-icon name="info"></svg-icon><span>{{ $t('deposit.payment_remark') }}</span></div>
            <div class="text-gray-500 text-[12px]">{{ selectedChannel?.remark }}</div>
        </div>

        <button
            ref="draggableBtn"
            v-scaleTap
            class="draggable-btn"
            @click="goService"
            @mousedown="startDrag"
            @touchstart="startDrag"
            :style="{ left: `${pos.x}px`, top: `${pos.y}px` }"
        >
            <svg-icon class="service-btn" name="customer-service" />
            <div class="text-white text-sm mt-1">{{ $t('101004') }}</div>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { depositApi, rechargeChannel } from '@/api/deposit';
import router from '@/router';
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import QrcodeVue from 'qrcode.vue'
import { showTipModel } from "@/components/TipModel/index.js";
import { useI18n } from "vue-i18n";
import { floatingIconList } from '@/api/home';
import { get } from 'node_modules/axios/index.cjs';
import { useUserStoreHook } from '@/store/modules/user';
import CryptoJS from 'crypto-js';

const { t } = useI18n();
const types = ref([]);
const selectedType = ref('');
const channels = ref([]);
const groupedChannels = ref({});
const selectedChannelId = ref(null);
const selectedChannel = ref(null);
const amountArr = ref([]);
const amount = ref(0);
const qrcodeValue = ref('');
const isLoading = ref(false);
const canDeposit = computed(() => {
    return (
      amount.value > 0 &&
      selectedChannel.value &&
      selectedChannel.value.amountMin <= amount.value && amount.value <= selectedChannel.value.amountMax
    );
})
const services = ref([]);
const playerInfo = computed(() => {
    return useUserStoreHook().playerInfo;
});
const draggableBtn = ref(null)
const pos = reactive({ x: 0, y: 0 }) // initial position
const drag = reactive({
  active: false,
  offsetX: 0,
  offsetY: 0,
  moved: false, // 👈 detect movement
  startX: 0,
  startY: 0,
})

const copyAddress = () => {
    navigator.clipboard.writeText(qrcodeValue.value)
        .then(() => {
            // 显示复制成功提示
            if (typeof showTipModel === 'function') {
                showTipModel({
                    type: 1,
                    icon: "success",
                    title: t("deposit.address_copied")
                });
            }
        })
        .catch(err => {
            console.error('复制失败:', err);
        });
};

const goToService = () => {    

    console.log(services.value);
    if (services.value.length === 0) {
        return;
    }
    let url = services.value[0].jumpUrl;
    const visitId = playerInfo.value?.userId || '';
    const nickname = playerInfo.value?.userName || '';
    const timestamp = (new Date).getTime();
    const rawStr = nickname + timestamp;
    // console.log('rawStr', rawStr);
    const md5 = CryptoJS.MD5(rawStr).toString(CryptoJS.enc.Hex).toLowerCase();
    // console.log('md5', md5);
    const serviceURL = `${url + nickname}&t=${timestamp}&sign=${md5}`;
    // console.log(serviceURL);
    localStorage.setItem('serviceURL', serviceURL);
    router.push({ path: '/service/chat' });
}

const changeType = async (type: string) => {

    if (type === 'custom') {
        goToService();
        return;
    }
    // router.

    selectedType.value = type;
    channels.value = (groupedChannels.value[selectedType.value] || []).sort((a: any, b: any) => a.sortId - b.sortId);
    selectedChannel.value = channels.value.length > 0 ? channels.value[0] : null;
    if(selectedChannel.value) {
        selectedChannelId.value = selectedChannel.value.id;
        if(selectedChannel.value.rechargeStr) {
            amountArr.value = selectedChannel.value.rechargeStr.split(',');
        }
    }
    if(type.toLocaleLowerCase() == 'usdt') {
        let params = {
            customNum: Number(selectedChannel.value.amountMin),
            payChannelId: selectedChannelId.value,
        }
        let { code, data } = await depositApi(params);
        if(code == 200) {
            qrcodeValue.value = data.data.payUrl;
        }
    }
}

const getRechargeChannel = async () => {
    const { code, data } = await rechargeChannel();
    if (code == 200) {
        const list = Array.isArray(data.data) ? data.data : [];
        const grouped = list.reduce((acc, item) => {
            (acc[item.type] = acc[item.type] || []).push(item);
            return acc;
        }, {});
        groupedChannels.value = grouped;
        types.value = [
            ...new Map(
                list.map(item => [item.type, { label: item.type, logo: item.logo }])
            ).values()
        ].sort((a, b) => {
            if (a.label === 'USDT') return -1; // a goes first
            if (b.label === 'USDT') return 1;  // b goes first
            return 0;                          // keep original order
        });
        types.value.push({ label: 'custom' });
        const defaultType = types.value.length > 0 ? types.value[0].label : '';
        changeType(defaultType);
    }
}

const changeChannel = (channel: any) => {
    selectedChannelId.value = channel.id;
    selectedChannel.value = channel;
    if(channel.rechargeStr) {
        amountArr.value = channel.rechargeStr.split(',');
    }
}

const deposit = async () => {
    if(isLoading.value || !canDeposit.value) {
        return;
    }
    isLoading.value = true;
    try {
        let params = {
            customNum: Number(amount.value),
            payChannelId: selectedChannelId.value,
        }

        let { code, data } = await depositApi(params);
        if (code == 200) {
            let payUrl = data.data.payUrl;
            if(payUrl != null && payUrl != ''){
                window.localStorage.setItem('qrcode', encodeURIComponent(payUrl));
                if(selectedType.value.toLocaleLowerCase() == 'usdt') {
                    router.push('/deposit/usdt-qrview');
                } else {
                    window.openWin(payUrl, '_blank');
                }
            }else{
                router.push(`/`);
            }
        }
    } catch (error) {
        console.error('Deposit error:', error?.data?.msg);
    } finally {
        isLoading.value = false;
    }
}

function startDrag(e: MouseEvent | TouchEvent) {
  drag.active = true
  drag.moved = false

  const clientX = e.type === 'touchstart' ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
  const clientY = e.type === 'touchstart' ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY

  drag.startX = clientX
  drag.startY = clientY
  drag.offsetX = clientX - pos.x
  drag.offsetY = clientY - pos.y

  e.preventDefault()

  window.addEventListener('mousemove', onDrag, { passive: false })
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag, { passive: false })
  window.addEventListener('touchend', stopDrag)
}

function onDrag(e: MouseEvent | TouchEvent) {
    if (!drag.active) return
    e.preventDefault()

    const clientX = e.type.includes('touch')
        ? (e as TouchEvent).touches[0].clientX
        : (e as MouseEvent).clientX
    const clientY = e.type.includes('touch')
        ? (e as TouchEvent).touches[0].clientY
        : (e as MouseEvent).clientY

    const dx = clientX - drag.startX
    const dy = clientY - drag.startY
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) drag.moved = true

    const button = draggableBtn.value as HTMLElement
    if (!button) return

    const buttonWidth = button.offsetWidth
    const buttonHeight = button.offsetHeight

    // Restrict movement so the button stays fully visible
    const minX = 10 // padding from left
    const minY = 10 // padding from top
    const maxX = window.innerWidth - buttonWidth - 10 // right edge padding
    const maxY = window.innerHeight - buttonHeight - 60 // bottom edge padding

    // Apply clamped coordinates
    pos.x = Math.min(Math.max(clientX - drag.offsetX, minX), maxX)
    pos.y = Math.min(Math.max(clientY - drag.offsetY, minY), maxY)
}


function stopDrag(e: MouseEvent | TouchEvent) {
  // 🧩 Only trigger click if the user didn’t really move
  if (!drag.moved) {
    let target = e.target as HTMLElement

    // Find the closest button (or the draggable button itself)
    target = target.closest('button.draggable-btn') as HTMLElement

    if (target && typeof target.click === 'function') {
      target.click()
    }
  }

  drag.active = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
}

const goService = () => {
    // router.push('/customer-service');
    const item = services.value[0]; // Assuming you want to go to the first service
    if(!item) return;

    let url = item.jumpUrl;
    const visitId = playerInfo.value?.userId || '';
    const nickname = playerInfo.value?.userName || '';
    const timestamp = (new Date).getTime();
    const rawStr = nickname + timestamp;
    const md5 = CryptoJS.MD5(rawStr).toString(CryptoJS.enc.Hex).toLowerCase();
    const serviceURL = `${url + nickname}&t=${timestamp}&sign=${md5}`;
    localStorage.setItem('serviceURL', serviceURL);
    router.push({ path: '/service/chat' });
}

const getCustomerServices = async () => {
    const { code, data } = await floatingIconList();
    if (code === 200) {
        services.value = Array.isArray(data.data) ? data.data : [];
    }
}

onMounted(() => {
    const btn = draggableBtn.value
    if (btn) {
        const rect = btn.getBoundingClientRect()
        pos.x = window.innerWidth - rect.width - 10   // 10px from right
        pos.y = window.innerHeight - rect.height - 120 // 120px from bottom
    }
    getRechargeChannel();
    getCustomerServices();
});


</script>

<style scoped lang="scss">

.corner-check {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-bottom: 20px solid var(--primary-color);
    border-left: 20px solid transparent;
    border-bottom-right-radius: 5px;

    &::after {
        content: '✔';
        position: absolute;
        bottom: -20px;
        right: 2px;
        font-size: 10px;
        color: white;
    }
}

.draggable-btn {
    position: absolute;
    cursor: grab;
    z-index: 10;
    background-color: var(--primary-color);
    padding: 10px;
    border-radius: 10%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    .service-btn {
        width: 30px;
        height: 30px;
        color: white;
    }
}


</style>
