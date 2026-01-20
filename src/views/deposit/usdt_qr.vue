<template>
    <div style="height: calc(100vh - 50px);" class="flex flex-col items-center justify-center px-3">
        <div class="text-center mb-5">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi, sapiente maiores officiis tenetur, eos est quos dolore aut omnis quis aliquam at officia! Maiores voluptate eius veritatis sapiente id odio?</div>
        <QrcodeVue :value="qrcodeValue" :size="200" />
        <div class="flex items-center space-x-2 border border-gray-300 p-3 rounded-lg mt-5">
            <!-- <div class="text-sm w-48 truncate overflow-hidden whitespace-nowrap">{{ qrcodeValue }}</div> -->
            <div class="text-[12px]">{{ qrcodeValue }}</div>
            <span @click="copyAddress">
                <svg-icon class="text-[16px] text-[var(--primary-color)]" name="copy" />
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import { computed } from 'vue';
import { showTipModel } from "@/components/TipModel/index.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const qrcodeValue = computed(() => {
    return localStorage.getItem('qrcode') || '';
})

const copyAddress = () => {
    navigator.clipboard.writeText(qrcodeValue.value)
        .then(() => {
            // 显示复制成功提示
            if (typeof showTipModel === 'function') {
                showTipModel({
                    type: 1,
                    icon: "success",
                    title: t("address_copied")
                });
            }
        })
        .catch(err => {
            console.error('复制失败:', err);
        });
};
</script>