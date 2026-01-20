<template>
    <div class="p-3">
        <div class="p-3 bg-white rounded-lg">
            <div @click="goToResetPassword" class="flex items-center justify-between py-2 cursor-pointer">
                <div  class="flex items-center space-x-2">
                    <span><van-icon name="lock" size="18" class="text-[var(--primary-color)]" /></span>
                    <span>{{ $t('profile.login_password') }}</span>
                </div>
                <span><van-icon name="arrow" size="18" class="text-[var(--secondary-dark-color)]" /></span>
            </div>
            <div class="h-[1px] bg-gray-100"></div>
            <div @click="goToResetTxnPassword" class="flex items-center justify-between py-2 cursor-pointer">
                <div class="flex items-center space-x-2">
                    <span><van-icon name="lock" size="18" class="text-[var(--primary-color)]" /></span>
                    <span>{{ $t('profile.withdraw_password') }}</span>
                </div>
                <span class="space-x-1 text-[var(--secondary-dark-color)]"><span v-if="!alreaySetWithdrawPassword">{{ $t('profile.set_withdraw_password') }}</span><van-icon name="arrow" size="18"/></span>
            </div>
            <div class="h-[1px] bg-gray-100"></div>
            <div @click="goToBindRealName" class="flex items-center justify-between py-2 cursor-pointer">
                <div class="flex items-center space-x-2">
                    <span><van-icon name="contact" size="18" class="text-[var(--primary-color)]" /></span>
                    <span>{{ $t('profile.bind_real_name') }}</span>
                </div>
                <span class="space-x-1 text-[var(--secondary-dark-color)]">
                    <span v-if="playerInfo.realName == null || playerInfo.realName == ''">{{ $t('profile.unbind_real_name') }}</span>
                    <van-icon name="arrow" size="18"/>
                </span>
            </div>
            <div class="h-[1px] bg-gray-100"></div>
            <div @click="goToBindPhone" class="flex items-center justify-between py-2 cursor-pointer">
                <div class="flex items-center space-x-2">
                    <span><van-icon name="phone" size="18" class="text-[var(--primary-color)]" /></span>
                    <span>{{ $t('profile.bind_phone') }}</span>
                </div>
                <span class="space-x-1 text-[var(--secondary-dark-color)]">
                    <span v-if="playerInfo.mobile == null || playerInfo.mobile == ''">{{ $t('profile.unbind_real_name') }}</span>
                    <van-icon name="arrow" size="18"/>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { checkJyPassword } from '@/api/withdraw';
import router from '@/router';
import { useUserStoreHook } from '@/store/modules/user';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { showTipModel } from '@/components/TipModel';

const { t } = useI18n();
const alreaySetWithdrawPassword = ref(false);
const playerInfo = computed(() => {
  return useUserStoreHook().playerInfo;
});

const checkWithdrawPasswordStatus = async () => {
    // 这里应该调用API检查用户是否已设置提现密码
    // 临时模拟逻辑：检查localStorage或用户信息
    const { code, data }: any = await checkJyPassword();
    if (data && data.data == true) {
        alreaySetWithdrawPassword.value = true;
    }
};

const goToResetPassword = () => {
    router.push('/reset-password');
}

const goToResetTxnPassword = () => {
    if(alreaySetWithdrawPassword.value) {
        router.push('/reset-txn-password');
    } else {
        router.push('/withdraw2/setPassword');
    }
}

const goToBindRealName = () => {
    if(playerInfo.value.realName) {
        showTipModel({
            type: 1,
            icon: "success",
            title: t('201007')
        });
    } else {
        router.push('/bind-real-name');
    }
}

const goToBindPhone = () => {
    if(playerInfo.value.mobile) {
        showTipModel({
            type: 1,
            icon: "success",
            title: t('100050')
        });
    } else {
        router.push('/bind-phone');
    }
}

onMounted(() => {
    checkWithdrawPasswordStatus();
})
</script>