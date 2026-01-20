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
                @keyup="checkConfirmationPassword"
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
                @keyup="checkConfirmationPassword"
            >
            <span v-if="dataProps.confirmPassword != ''" @click="dataProps.confirmPassword = ''">
                <van-icon name="close" size="16" class="text-[var(--primary-color)]" />
            </span>
            <span @click="showConfirmPassword = !showConfirmPassword">
                <van-icon :name="showConfirmPassword ? 'eye' : 'closed-eye'" size="18" class="text-[var(--primary-color)]" />
            </span>
        </div>
        <div v-if="confirmPasswordErrorMsg" class="text-[10px] text-red-500 mt-1">{{ confirmPasswordErrorMsg }}</div>

        <div class="flex items-center bg-gray-300 rounded-lg space-x-2 mt-3">
            <span class="ml-2"><van-icon name="certificate" size="18" class="text-[var(--primary-color)]" /></span>
            <input 
                v-model="dataProps.code" 
                type="text" 
                :placeholder="t('reset_password.enter_verification_code')" 
                class="flex-1"
            >
            <span @click="getCodeStatus">
                <img :src="dataProps.codeImg" alt="" class="rounded-r-lg">
            </span>
        </div>

        <div 
            class="mt-5 text-white text-center py-2 rounded-lg cursor-pointer select-none" 
            :class="isValid ? 'bg-[var(--primary-color)] shadow-md' : 'bg-[var(--secondary-dark-color)]'" 
            @click="confirm"
        >{{ t('reset_password.change_password') }}</div>
    </div>
</template>

<script setup lang="ts">
import { getCode, resetPasswordApi, userInfoApi } from '@/api/user';
import { showTipModel } from '@/components/TipModel';
import { useUserStoreHook } from '@/store/modules/user';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import router from '@/router';

const { t } = useI18n();
const playerInfo = computed(() => {
  return useUserStoreHook().playerInfo;
});
const isLoading = ref(false);

const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const confirmPasswordErrorMsg = ref('');
const isValid = computed(() =>
  dataProps.value.oldPassword !== '' &&
  dataProps.value.password !== '' &&
  dataProps.value.confirmPassword !== '' &&
  dataProps.value.password === dataProps.value.confirmPassword &&
  dataProps.value.code !== ''
);

const dataProps = ref({
    oldPassword: '',
    password: '',
    confirmPassword: '',
    codeImg: '',
    uuid: '',
    code: ''
});

const resetForm = () => {
  Object.keys(dataProps.value).forEach(key => {
    dataProps.value[key] = '';
  });
};

const checkConfirmationPassword = () => {
    if(dataProps.value.password != '' && dataProps.value.confirmPassword != '' && dataProps.value.password != dataProps.value.confirmPassword) {
        confirmPasswordErrorMsg.value = t('reset_password.confirm_password_error');
    } else {
        confirmPasswordErrorMsg.value = '';
    }
}

const confirm = async () => {
    if(isLoading.value || !isValid.value) return;

    if(dataProps.value.oldPassword == dataProps.value.password) {
        showTipModel({
            type: 1,
            icon: "fail",
            title: t("reset_password.same_password")
        });
        return;
    }

    const params = {
        uuid: dataProps.value.uuid,
        code: dataProps.value.code,
        password: dataProps.value.password,
        oldPassword: dataProps.value.oldPassword,
        userName: playerInfo.value.userName,
    }
    const { code }: any = await resetPasswordApi(params);
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
        dataProps.value.code = '';
        getCodeStatus();
        showTipModel({
            type: 1,
            icon: "fail",
            title: t(code)
        });
    }
}

const getCodeStatus = async () => {
  const { code, data }: any = await getCode();
  if (code === 200) {
    dataProps.value.uuid = data.data.uuid;
    dataProps.value.codeImg = `data:image/jpeg;base64,${data.data.img}`;
  }
};

const getUseinfo = async () => {
  let { code, data }: any = await userInfoApi();
  const { totalWin, totalBet } = data.data;
  if (code == 200) {
    useUserStoreHook().updatePlayerInfo("totalBet", totalBet);
    useUserStoreHook().updatePlayerInfo("totalWin", totalWin);
  }
};

onMounted(() => {
    getCodeStatus();
    getUseinfo();
})
</script>