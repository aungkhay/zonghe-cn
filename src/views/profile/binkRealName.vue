<template>
    <div class="p-3">
        <div class="border border-gray-300 rounded-md p-2">
            <input v-model="realName" type="text" :placeholder="$t('bind_real_name.placeholder')">
        </div>
        <button 
            class="w-full text-white rounded-md py-2 mt-5"
            :class="realName == '' ? 'bg-[var(--primary-disabled-color)]' : 'bg-[var(--primary-color)]'"
            :disabled="realName == ''"
            @click="bind"
        >{{ $t('bind_real_name.bind') }}</button>
    </div>
</template>

<script setup lang="ts">
import { bindRealName } from '@/api/user';
import { showTipModel } from '@/components/TipModel';
import router from '@/router';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const realName = ref('');
const isLoading = ref(false);

const bind = async () => {
    if(isLoading.value) return;

    isLoading.value = true;
    const { code, data } = await bindRealName({ realName: realName.value });
    if(code == 200) {
        showTipModel({
            type: 1,
            icon: "success",
            title: t('bind_real_name.bind_success')
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