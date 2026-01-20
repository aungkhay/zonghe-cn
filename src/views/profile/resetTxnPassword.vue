<template>
    <div class="p-3">
        <div class="flex items-center bg-gray-300 py-2 px-2 rounded-lg space-x-2">
            <span><van-icon name="lock" size="18" class="text-[var(--primary-color)]" /></span>
            <input 
                v-model="dataProps.oldPassword" 
                :type="showOldPassword ? 'text' : 'password'" 
                :placeholder="t('reset_password.enter_old_password')" 
                class="flex-1"
            >
            <span v-if="dataProps.oldPassword != ''" @click="dataProps.oldPassword = ''">
                <van-icon name="close" size="16" class="text-[var(--primary-color)]" />
            </span>
            <span @click="showOldPassword = !showOldPassword">
                <van-icon :name="showOldPassword ? 'eye' : 'closed-eye'" size="18" class="text-[var(--primary-color)]" />
            </span>
        </div>
        <div class="flex items-center bg-gray-300 py-2 px-2 rounded-lg space-x-2 mt-3">
            <span><van-icon name="lock" size="18" class="text-[var(--primary-color)]" /></span>
            <input 
                v-model="dataProps.password" 
                :type="showNewPassword ? 'text' : 'password'" 
                :placeholder="t('reset_password.enter_new_password')" 
                class="flex-1"
            >
            <span v-if="dataProps.password != ''" @click="dataProps.password = ''">
                <van-icon name="close" size="16" class="text-[var(--primary-color)]" />
            </span>
            <span @click="showNewPassword = !showNewPassword">
                <van-icon :name="showNewPassword ? 'eye' : 'closed-eye'" size="18" class="text-[var(--primary-color)]" />
            </span>
        </div>
        <div class="flex items-center bg-gray-300 py-2 px-2 rounded-lg space-x-2 mt-3">
            <span><van-icon name="lock" size="18" class="text-[var(--primary-color)]" /></span>
            <input 
                v-model="dataProps.confirmPassword" 
                :type="showConfirmPassword ? 'text' : 'password'" 
                :placeholder="t('reset_password.re_enter_password')" 
                class="flex-1"
            >
            <span v-if="dataProps.confirmPassword != ''" @click="dataProps.confirmPassword = ''">
                <van-icon name="close" size="16" class="text-[var(--primary-color)]" />
            </span>
            <span @click="showConfirmPassword = !showConfirmPassword">
                <van-icon :name="showConfirmPassword ? 'eye' : 'closed-eye'" size="18" class="text-[var(--primary-color)]" />
            </span>
        </div>
        <div 
            class="mt-5 text-white text-center py-2 rounded-lg cursor-pointer select-none" 
            :class="isValid ? 'bg-[var(--primary-color)] shadow-md' : 'bg-[var(--primary-disabled-color)]'" 
            @click="confirm"
        >{{ t('reset_password.change_password') }}</div>
    </div>
</template>
<script setup lang="ts">
import { resetJyPasswordApi } from '@/api/user';
import { showTipModel } from '@/components/TipModel';
import router from '@/router';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const dataProps = ref({
    oldPassword: '',
    password: '',
    confirmPassword: '',
});
const isLoading = ref(false);

const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isValid = computed(() =>
  dataProps.value.oldPassword !== '' &&
  dataProps.value.password !== '' &&
  dataProps.value.confirmPassword !== '' &&
  dataProps.value.password === dataProps.value.confirmPassword
);

const resetForm = () => {
  Object.keys(dataProps.value).forEach(key => {
    dataProps.value[key] = '';
  });
};

const confirm = async () => {
    if(isLoading.value || !isValid.value) return;

    const { code } = await resetJyPasswordApi({oldJyPassword: dataProps.value.oldPassword, newJyPassword: dataProps.value.password});
    if(code == 200) {
        resetForm();
        showTipModel({
            type: 1,
            icon: "success",
            title: t('reset_password.success')
        });
        setTimeout(() => {
            router.go(-1);
        }, 1000);
    } else {
        showTipModel({
            type: 1,
            icon: "fail",
            title: t(code)
        });
    }
}
</script>