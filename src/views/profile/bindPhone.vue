<template>
    <div class="p-3">
        <div class="border border-gray-300 rounded-md p-2">
            <input v-model="phone" type="number" :placeholder="$t('bind_phone.placeholder')">
        </div>
        <div class="text-red-500 text-[11px]">*{{ $t('bind_phone.limit') }}</div>
        <button 
            class="w-full text-white rounded-md py-2 mt-5"
            :class="String(phone).length != 11 ? 'bg-[var(--primary-disabled-color)]' : 'bg-[var(--primary-color)]'"
            :disabled="String(phone).length != 11"
            @click="bind"
        >{{ $t('bind_real_name.bind') }}</button>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { showTipModel } from '@/components/TipModel';
import { bindPhone } from '@/api/user';
import { useUserStoreHook } from '@/store/modules/user';

const { t } = useI18n();
const phone = ref('');
const isLoading = ref(false);

const bind = async () => {
    if(isLoading.value || String(phone.value).length != 11) return;

    isLoading.value = true;
    const { code, data } = await bindPhone({ mobile: phone.value });
    if(code == 200) {
        showTipModel({
            type: 1,
            icon: "success",
            title: t('bind_phone.bind_success')
        });
        setTimeout(() => {
            router.go(-2);
        }, 1000);
    } else {
        showTipModel({
            type: 1,
            icon: "fail",
            title: t(code)
        });
    }
    isLoading.value = false;
}
</script>