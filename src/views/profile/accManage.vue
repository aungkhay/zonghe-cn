<template>
    <div class="p-3">
        <!-- <div class="flex flex-nowrap space-x-3 overflow-x-auto">
            <div 
                v-for="(item, index) in paymentMethods" 
                :key="index" 
                class="flex-shrink-0 min-w-20 text-center py-1 rounded-md cursor-pointer select-none px-2 text-[12px]"
                :class="selectedMethod.key == item.key ? 'bg-[#597ef7]/10 text-[#597ef7] border border-[#597ef7]' : 'bg-gray-200 text-gray-800'"
                @click="onPaymentMethodChange(item)"
            >
                <div class="flex items-center space-x-2">
                    <svg-icon class="text-[18px] rounded-full" :name="item.key"></svg-icon>
                    <span>{{ item.name }}</span>
                </div>
            </div>
        </div> -->

        <div class="grid grid-cols-3 gap-2">
            <div 
                v-for="(item, index) in paymentMethods" 
                :key="index" 
                class="text-center py-1 rounded-md cursor-pointer select-none px-2 text-[12px] border"
                :class="selectedMethod.key == item.key 
                    ? 'bg-[#597ef7]/10 text-[#597ef7] border-[#597ef7]' 
                    : 'bg-gray-200 text-gray-800'"
                @click="onPaymentMethodChange(item)"
            >
                <div class="flex items-center justify-center space-x-2">
                    <svg-icon class="text-[18px] rounded-full" :name="item.key"></svg-icon>
                    <span>{{ item.name }}</span>
                </div>
            </div>
        </div>

        <div class="mt-3">
            <div v-if="selectedMethod.key == 'bank'" class="space-y-3">
                <div 
                    v-for="(bank, index) in modelProps.accountCardList.filter(acc => acc.pixType == selectedMethod.defaultType)" :key="index"
                    class="flex items-center justify-between p-2 bg-gray-200 rounded-md"
                >
                    <div class="flex items-center space-x-3">
                        <svg-icon class="text-[25px]" :name="selectedMethod.key"></svg-icon>
                        <span class="text-sm">{{ bank.BankCard }}</span>
                    </div>
                    <svg-icon name="copy" class="text-[20px] ml-2 text-[var(--primary-color)] copy-icon" @click="copyAccount(bank.cardId)" />
                </div>
            </div>
            <div v-if="selectedMethod.key == 'usdt'" class="space-y-3">
                <div 
                    v-for="(bank, index) in modelProps.accountCardList.filter(acc => acc.pixType == 4 || acc.pixType == 5)" :key="index"
                    class="flex items-center justify-between p-2 bg-gray-200 rounded-md"
                >
                    <div class="flex items-center space-x-3">
                        <svg-icon class="text-[25px]" :name="selectedMethod.key"></svg-icon>
                        <span class="text-sm">{{ bank.BankCard }}</span>
                    </div>
                    <svg-icon name="copy" class="text-[20px] ml-2 text-[var(--primary-color)] copy-icon" @click="copyAccount(bank.cardId)" />
                </div>
            </div>
            <div v-if="['alipay', 'topay', 'kdpay', 'nopay'].includes(selectedMethod.key)" class="space-y-3">
                <div 
                    v-for="(bank, index) in modelProps.accountCardList.filter(acc => acc.pixType == selectedMethod.defaultType)" :key="index"
                    class="flex items-center justify-between p-2 bg-gray-200 rounded-md"
                >
                    <div class="flex items-center space-x-3">
                        <svg-icon class="text-[25px] rounded-full" :name="selectedMethod.key"></svg-icon>
                        <span class="text-sm">{{ bank.BankCard }}</span>
                    </div>
                    <svg-icon name="copy" class="text-[20px] ml-2 text-[var(--primary-color)] copy-icon" @click="copyAccount(bank.cardId)" />
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between bg-gray-200 mt-3 px-2 py-2 rounded-lg text-[var(--primary-color)] cursor-pointer" @click="goToAddAccount">
            <div class="flex justify-center items-center space-x-2">
                <div>
                    <svg-icon class="text-[25px] rounded-full" :name="selectedMethod.key"></svg-icon>
                </div>
                <div class="add-account-text">{{ selectedMethod.name }}</div>
            </div>
            <div class="flex items-center space-x-2">
                <span>{{ $t('f_add') }}</span>
                <svg-icon name="right" class="arrow-icon" />
            </div>
        </div>

    </div>

    <div v-if="showForm" class="px-3">
        <div v-if="selectedMethod.key == 'bank'">
            <div class="mb-3">{{ $t('manage_account.bind_bank') }}</div>
            <div class="bg-white p-2 rounded-md">
                <input v-model="bankProps.cardId" type="text" @input="validateBankInput('cardId')" class="w-full" :placeholder="$t('manage_account.bank_placeholder.cardId')">
            </div>
            <div v-if="bankErrMsg.cardId" class="text-red-500 text-[12px]">{{ bankErrMsg.cardId }}</div>

            <div class="bg-white p-2 rounded-md mt-3">
                <input v-model="bankProps.bankName" type="text" @input="validateBankInput('bankName')" class="w-full" :placeholder="$t('manage_account.bank_placeholder.bank_name')">
            </div>
            <div v-if="bankErrMsg.bankName" class="text-red-500 text-[12px]">{{ bankErrMsg.bankName }}</div>

            <div class="bg-white p-2 rounded-md mt-3">
                <input v-model="bankProps.bankArea" type="text" @input="validateBankInput('bankArea')" class="w-full" :placeholder="$t('manage_account.bank_placeholder.bank_area')">
            </div>
            <div v-if="bankErrMsg.bankArea" class="text-red-500 text-[12px]">{{ bankErrMsg.bankArea }}</div>

            <div v-if="!playerInfo.realName" class="flex justify-between items-center bg-white p-2 rounded-md mt-3 cursor-pointer" @click="goToBindRealName">
                <div class="text-gray-400">{{ $t('profile.bind_real_name') }}</div>
                <div class="flex items-center space-x-2 text-[var(--primary-color)]">
                    <span>{{ $t('profile.unbind_real_name') }}</span> 
                    <svg-icon name="right" class="arrow-icon" />
                </div>
            </div>

            <div v-else>
                <div class="bg-white p-2 rounded-md mt-3">
                    <input v-model="bankProps.realName" type="text" disabled @input="validateBankInput('realName')" class="w-full" :placeholder="$t('manage_account.bank_placeholder.real_name')">
                </div>
                <div v-if="bankErrMsg.realName" class="text-red-500 text-[12px]">{{ bankErrMsg.realName }}</div>
            </div>

            <div 
                class="mt-5 text-center rounded-md py-2 cursor-pointer select-none text-white"
                :class="canBindBank && !isSaving ? 'bg-[var(--primary-color)]' : 'bg-[var(--primary-disabled-color)]'" 
                @click="bindBank"
            >{{ $t('manage_account.save') }}</div>
        </div>
        <div v-if="selectedMethod.key == 'usdt'">
            <div class="mb-3">{{ t('manage_account.bind_usdt') }}</div>
            <div class="flex items-center space-x-3">
                <div 
                    v-for="(p, index) in selectedMethod.pixType" :key="index"
                    :class="selectedMethod.defaultType == p.type ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-300 text-black'"
                    class="py-1 min-w-20 text-center rounded-md cursor-pointer select-none"
                    @click="selectedMethod.defaultType = p.type; usdtErrMsg.cardId = ''; usdtProps.cardId = '';"
                >
                    {{ p.name }}
                </div>
            </div>
            <div class="bg-white p-2 rounded-md mt-3">
                <input v-model="usdtProps.cardId" type="text" @input="validateUSDTInput('cardId')" class="w-full" :placeholder="$t('manage_account.usdt_placeholder.address')">
            </div>
            <div v-if="usdtErrMsg.cardId" class="text-red-500 text-[12px]">{{ usdtErrMsg.cardId }}</div>
            <div 
                class="mt-5 text-center rounded-md py-2 cursor-pointer select-none text-white"
                :class="canBindUSDT && !isSaving ? 'bg-[var(--primary-color)]' : 'bg-[var(--primary-disabled-color)]'" 
                @click="binkUSDT"
            >{{ $t('manage_account.save') }}</div>
        </div>
        <div v-if="selectedMethod.key == 'alipay'">
            <div class="mb-3">{{ $t('manage_account.bind_alipay') }}</div>
            <div class="bg-white p-2 rounded-md">
                <input v-model="alipayProps.cardId" type="text" @input="validateAlipayInput('cardId')" class="w-full" :placeholder="$t('manage_account.alipay_placeholder.account')">
            </div>
            <div v-if="alipayErrMsg.cardId" class="text-red-500 text-[12px]">{{ alipayErrMsg.cardId }}</div>

            <div v-if="!playerInfo.realName" class="flex justify-between items-center bg-white p-2 rounded-md mt-3 cursor-pointer" @click="goToBindRealName">
                <div class="text-gray-400">{{ $t('profile.bind_real_name') }}</div>
                <div class="flex items-center space-x-2 text-[var(--primary-color)]">
                    <span>{{ $t('profile.unbind_real_name') }}</span> 
                    <svg-icon name="right" class="arrow-icon" />
                </div>
            </div>

            <div v-else>
                <div class="bg-white p-2 rounded-md mt-3">
                    <input v-model="alipayProps.realName" type="text" disabled @input="validateAlipayInput('realName')" class="w-full" :placeholder="$t('manage_account.alipay_placeholder.name')">
                </div>
                <div v-if="alipayErrMsg.realName" class="text-red-500 text-[12px]">{{ alipayErrMsg.realName }}</div>
            </div>

            <div 
                class="mt-5 text-center rounded-md py-2 cursor-pointer select-none text-white"
                :class="canBindAlipay && !isSaving ? 'bg-[var(--primary-color)]' : 'bg-[var(--primary-disabled-color)]'" 
                @click="bindAlipay"
            >{{ $t('manage_account.save') }}</div>
        </div>
        <div v-if="selectedMethod.key == 'topay'">
            <div class="mb-3">{{ $t('manage_account.bind_topay') }}</div>
            <div class="bg-white p-2 rounded-md">
                <input v-model="topayProps.cardId" type="text" @input="validateTopayInput('cardId')" class="w-full" :placeholder="$t('manage_account.topay_placeholder.account')">
            </div>
            <div v-if="topayErrMsg.cardId" class="text-red-500 text-[12px]">{{ topayErrMsg.cardId }}</div>

            <div class="bg-white p-2 rounded-md mt-3">
                <input v-model="topayProps.realName" type="text" @input="validateTopayInput('realName')" class="w-full" :placeholder="$t('manage_account.topay_placeholder.name')">
            </div>
            <div v-if="topayErrMsg.realName" class="text-red-500 text-[12px]">{{ topayErrMsg.realName }}</div>

            <div 
                class="mt-5 text-center rounded-md py-2 cursor-pointer select-none text-white"
                :class="canBindTopay && !isSaving ? 'bg-[var(--primary-color)]' : 'bg-[var(--primary-disabled-color)]'" 
                @click="bindTopay"
            >{{ $t('manage_account.save') }}</div>
        </div>
        <div v-if="selectedMethod.key == 'kdpay'">
            <div class="mb-3">{{ $t('manage_account.bind_kdpay') }}</div>
            <div class="bg-white p-2 rounded-md">
                <input v-model="kdpayProps.cardId" type="text" @input="validateKDpayInput('cardId')" class="w-full" :placeholder="$t('manage_account.kdpay_placeholder.account')">
            </div>
            <div v-if="kdpayErrMsg.cardId" class="text-red-500 text-[12px]">{{ kdpayErrMsg.cardId }}</div>

            <div class="bg-white p-2 rounded-md mt-3">
                <input v-model="kdpayProps.realName" type="text" @input="validateKDpayInput('realName')" class="w-full" :placeholder="$t('manage_account.kdpay_placeholder.name')">
            </div>
            <div v-if="kdpayErrMsg.realName" class="text-red-500 text-[12px]">{{ kdpayErrMsg.realName }}</div>

            <div 
                class="mt-5 text-center rounded-md py-2 cursor-pointer select-none text-white"
                :class="canBindKDpay && !isSaving ? 'bg-[var(--primary-color)]' : 'bg-[var(--primary-disabled-color)]'" 
                @click="bindKDpay"
            >{{ $t('manage_account.save') }}</div>
        </div>
        <div v-if="selectedMethod.key == 'nopay'">
            <div class="mb-3">{{ $t('manage_account.bind_nopay') }}</div>
            <div class="bg-white p-2 rounded-md">
                <input v-model="nopayProps.cardId" type="text" @input="validateNOpayInput('cardId')" class="w-full" :placeholder="$t('manage_account.nopay_placeholder.account')">
            </div>
            <div v-if="nopayErrMsg.cardId" class="text-red-500 text-[12px]">{{ nopayErrMsg.cardId }}</div>
            <div class="bg-white p-2 rounded-md mt-3">
                <input v-model="nopayProps.realName" type="text" @input="validateNOpayInput('realName')" class="w-full" :placeholder="$t('manage_account.nopay_placeholder.name')">
            </div>
            <div v-if="nopayErrMsg.realName" class="text-red-500 text-[12px]">{{ nopayErrMsg.realName }}</div>
            <div 
                class="mt-5 text-center rounded-md py-2 cursor-pointer select-none text-white"
                :class="canBindNOpay && !isSaving ? 'bg-[var(--primary-color)]' : 'bg-[var(--primary-disabled-color)]'" 
                @click="bindNOpay"
            >{{ $t('manage_account.save') }}</div>
        </div>
    </div>

    <WithdrawPasswordModal ref="passwordModal" @passwordVerified="handlePasswordVerified" @forgotPassword="handleForgotPassword"></WithdrawPasswordModal>
</template>

<script setup lang="ts">
import { cashoutAccountApi, checkJyPassword, withdrawInfoApi, saveCashoutAccountApi } from '@/api/withdraw';
import { showTipModel } from '@/components/TipModel';
import router from '@/router';
import Common from "@/utils/common/common";
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import WithdrawPasswordModal from "@/views/withdraw2/withdrawPasswordModal.vue";
import { useUserStoreHook } from '@/store/modules/user';

const { t } = useI18n();

const playerInfo = computed(() => {
  return useUserStoreHook().playerInfo;
});

const showAccount = ref(false);
const refreshing = ref(false);
const hasPassword = ref(false);
const passwordModal = ref();
const paymentMethods = ref([
    { 
        name: 'USDT', 
        key: 'usdt', 
        pixType: [
            { name: 'TRC20', type: 4 }, 
            // { name: 'ERC20', type: 5 }
        ], 
        defaultType: 4 
    },
    { name: t('manage_account.bank'), key: 'bank', pixType: [], defaultType: 6 },
    { name: t('manage_account.alipay'), key: 'alipay', pixType: [], defaultType: 8 },
    { name: 'Topay', key: 'topay', pixType: [], defaultType: 9 },
    { name: 'KDpay', key: 'kdpay', pixType: [], defaultType: 10 },
    { name: 'NoPay', key: 'nopay', pixType: [], defaultType: 11 },
]);
const selectedMethod = ref(paymentMethods.value[0]);
const showForm = ref(false);
const isSaving = ref(false);
const canBindBank = ref(false);
const jyPassword = ref('');
// Bank
const bankProps = ref({
    cardId: '',
    bankName: '',
    bankArea: '',
    realName: playerInfo.value.realName,
})
const bankErrMsg = ref({
    cardId: '',
    bankName: '',
    bankArea: '',
    realName: ''
})
// USDT
const canBindUSDT = ref(false);
const usdtProps = ref({
    cardId: '',
})
const usdtErrMsg = ref({
    cardId: ''
})
// Alipay
const canBindAlipay = ref(false);
const alipayProps = ref({
    cardId: '',
    realName: playerInfo.value.realName
})
const alipayErrMsg = ref({
    cardId: '',
    realName: ''
})
// Topay
const canBindTopay = ref(false);
const topayProps = ref({
    cardId: '',
    realName: ''
})
const topayErrMsg = ref({
    cardId: '',
    realName: ''
})
// KDpay
const canBindKDpay = ref(false);
const kdpayProps = ref({
    cardId: '',
    realName: ''
})
const kdpayErrMsg = ref({
    cardId: '',
    realName: ''
})
// NoPay
const canBindNOpay = ref(false);
const nopayProps = ref({
    cardId: '',
    realName: ''
})
const nopayErrMsg = ref({
    cardId: '',
    realName: ''
})

const modelProps = ref({
    tabIndex: 0,
    tabKey: "Withdraw",
    tabList: [
        { key: "Withdraw", name: "102024" },
        { key: "BetTasks", name: "f_bet_tasks" },
        { key: "ManageAccount", name: "f_account_management" },
        { key: "WithdrawRecords", name: "f_withdraw_record" }
    ],
    withdrawMaxNum: null,
    withdrawMinNum: null,
    withdrawInputMoney: null,
    accountCardList: [] as any[],
    accountCardIndex: null,
    bindCardMaxCount: 0,
    pinInputs: ['', '', '', '', '', ''],
    showAccountDropdown: false, // 添加控制账户下拉框显示的状态
    pixTypeList: [] as any[],
});

const onPaymentMethodChange = (item: any) => {
    selectedMethod.value = item;
    showForm.value = false;
}

const validateBankInput = (name: String) => {
    switch (name) {
        case 'cardId':
            if(bankProps.value.cardId == '') {
                bankErrMsg.value.cardId = t('manage_account.bank_input.cardId_required');
            } else {
                bankErrMsg.value.cardId = '';
            }
            break;
        case 'bankName':
            if(bankProps.value.bankName == '') {
                bankErrMsg.value.bankName = t('manage_account.bank_input.bank_name_required');
            } else {
                bankErrMsg.value.bankName = '';
            }
            break;
        case 'bankArea':
            if(bankProps.value.bankArea == '') {
                bankErrMsg.value.bankArea = t('manage_account.bank_input.bank_area_required');
            } else {
                bankErrMsg.value.bankArea = '';
            }
            break;
        case 'realName':
            if(bankProps.value.realName == '') {
                bankErrMsg.value.realName = t('manage_account.bank_input.real_name_required');
            } else {
                bankErrMsg.value.realName = '';
            }
            break;
    
        default:
            break;
    }
    if(jyPassword.value != '' && bankErrMsg.value.cardId == '' && bankErrMsg.value.bankName == '' && bankErrMsg.value.bankArea == '' && bankErrMsg.value.realName == '') {
        canBindBank.value = true;
    } else {
        canBindBank.value = false;
    }
}

const validateUSDTInput = (name: String) => {
    if(usdtProps.value.cardId == '') {
        usdtErrMsg.value.cardId = t('manage_account.usdt_input.address_required');
    } else {
        usdtErrMsg.value.cardId = '';
    }
    const ercRegex = /^0x[a-fA-F0-9]{40}$/;
    const trcRegex = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;

    if(selectedMethod.value.defaultType == 4 && !trcRegex.test(usdtProps.value.cardId)) {
        usdtErrMsg.value.cardId = t('manage_account.usdt_input.invalid_trc');
    } else if(selectedMethod.value.defaultType == 4 && trcRegex.test(usdtProps.value.cardId)) {
        usdtErrMsg.value.cardId = '';
    }

    if(selectedMethod.value.defaultType == 5 && !ercRegex.test(usdtProps.value.cardId)) {
        usdtErrMsg.value.cardId = t('manage_account.usdt_input.invalid_erc');
    } else if(selectedMethod.value.defaultType == 5 && ercRegex.test(usdtProps.value.cardId)) {
        usdtErrMsg.value.cardId = '';
    }

    if(jyPassword.value != '' && usdtErrMsg.value.cardId == '') {
        canBindUSDT.value = true;
    } else {
        canBindUSDT.value = false;
    }
}

const validateAlipayInput = (name: string) => {
    switch (name) {
        case 'cardId':
            if(alipayProps.value.cardId == '') {
                alipayErrMsg.value.cardId = t('manage_account.alipay_input.account');
            } else {
                alipayErrMsg.value.cardId = '';
            }
            break;
        case 'realName':
            if(alipayProps.value.realName == '') {
                alipayErrMsg.value.realName = t('manage_account.alipay_input.name');
            } else {
                alipayErrMsg.value.realName = '';
            }
            break;
    
        default:
            break;
    }
    if(jyPassword.value != '' && alipayErrMsg.value.cardId == '' && alipayErrMsg.value.realName == '') {
        canBindAlipay.value = true;
    } else {
        canBindAlipay.value = false;
    }
}

const validateTopayInput = (name: string) => {
    switch (name) {
        case 'cardId':
            if(topayProps.value.cardId == '') {
                topayErrMsg.value.cardId = t('manage_account.topay_input.account');
            } else {
                topayErrMsg.value.cardId = '';
            }
            break;
        case 'realName':
            if(topayProps.value.realName == '') {
                topayErrMsg.value.realName = t('manage_account.topay_input.name');
            } else {
                topayErrMsg.value.realName = '';
            }
            break;
    
        default:
            break;
    }
    if(jyPassword.value != '' && topayErrMsg.value.cardId == '' && topayErrMsg.value.realName == '') {
        canBindTopay.value = true;
    } else {
        canBindTopay.value = false;
    }
}

const validateKDpayInput = (name: string) => {
    switch (name) {
        case 'cardId':
            if(kdpayProps.value.cardId == '') {
                kdpayErrMsg.value.cardId = t('manage_account.kdpay_input.account');
            } else {
                kdpayErrMsg.value.cardId = '';
            }
            break;
        case 'realName':
            if(kdpayProps.value.realName == '') {
                kdpayErrMsg.value.realName = t('manage_account.kdpay_input.name');
            } else {
                kdpayErrMsg.value.realName = '';
            }
            break;
    
        default:
            break;
    }
    if(jyPassword.value != '' && kdpayErrMsg.value.cardId == '' && kdpayErrMsg.value.realName == '') {
        canBindKDpay.value = true;
    } else {
        canBindKDpay.value = false;
    }
}

const validateNOpayInput = (name: string) => {
    switch (name) {
        case 'cardId':
            if(nopayProps.value.cardId == '') {
                nopayErrMsg.value.cardId = t('manage_account.nopay_input.account');
            } else {
                nopayErrMsg.value.cardId = '';
            }
            break;
        case 'realName':
            if(nopayProps.value.realName == '') {
                nopayErrMsg.value.realName = t('manage_account.nopay_input.name');
            } else {
                nopayErrMsg.value.realName = '';
            }
            break;
    
        default:
            break;
    }
    if(jyPassword.value != '' && nopayErrMsg.value.cardId == '' && nopayErrMsg.value.realName == '') {
        canBindNOpay.value = true;
    } else {
        canBindNOpay.value = false;
    }
}

const resetBankForm = () => {
    bankProps.value.cardId = '';
    bankProps.value.bankName = '';
    bankProps.value.bankArea = '';
    bankProps.value.realName = '';
    bankErrMsg.value.cardId = '';
    bankErrMsg.value.bankName = '';
    bankErrMsg.value.bankArea = '';
    bankErrMsg.value.realName = '';
}

const goToBindRealName = () => {
    router.push('/bind-real-name');
}

const bindBank = async () => {
    if(!canBindBank.value || isSaving.value) return;
    isSaving.value = true;
    const params = {
        jyPassword: jyPassword.value,
        pixType: selectedMethod.value.defaultType,
        ...bankProps.value
    }
    const { data, code } = await saveCashoutAccountApi(params);
    if(code == 200) {
        showForm.value = false;
        resetBankForm();
        getCashoutAccount();
    } else {
        showTipModel({
            type: 1,
            icon: "fail",
            title: data.msg
        });
    }
    isSaving.value = false;
    canBindBank.value = false;
}

const binkUSDT = async () => {
    if(!canBindUSDT.value || isSaving.value) return;
    isSaving.value = true;
    const params = {
        jyPassword: jyPassword.value,
        pixType: selectedMethod.value.defaultType,
        ...usdtProps.value
    }
    const { data, code } = await saveCashoutAccountApi(params);
    if(code == 200) {
        showForm.value = false;
        usdtProps.value.cardId = '';
        usdtErrMsg.value.cardId = '';
        getCashoutAccount();
    } else {
        showTipModel({
            type: 1,
            icon: "fail",
            title: data.msg
        });
    }
    isSaving.value = false;
    canBindUSDT.value = false;
}

const bindAlipay = async () => {
    if(!canBindAlipay.value || isSaving.value) return;
    isSaving.value = true;
    const params = {
        jyPassword: jyPassword.value,
        pixType: selectedMethod.value.defaultType,
        ...alipayProps.value
    }
    const { data, code } = await saveCashoutAccountApi(params);
    if(code == 200) {
        showForm.value = false;
        alipayProps.value.cardId = '';
        alipayProps.value.realName = '';
        alipayErrMsg.value.cardId = '';
        alipayErrMsg.value.realName = '';
        getCashoutAccount();
    } else {
        showTipModel({
            type: 1,
            icon: "fail",
            title: data.msg
        });
    }
    isSaving.value = false;
    canBindAlipay.value = false;
}

const bindTopay = async () => {
    if(!canBindTopay.value || isSaving.value) return;
    isSaving.value = true;
    const params = {
        jyPassword: jyPassword.value,
        pixType: selectedMethod.value.defaultType,
        ...topayProps.value
    }
    const { data, code } = await saveCashoutAccountApi(params);
    if(code == 200) {
        showForm.value = false;
        topayProps.value.cardId = '';
        topayProps.value.realName = '';
        topayErrMsg.value.cardId = '';
        topayErrMsg.value.realName = '';
        getCashoutAccount();
    } else {
        showTipModel({
            type: 1,
            icon: "fail",
            title: data.msg
        });
    }
    canBindTopay.value = false;
    isSaving.value = false;
}

const bindKDpay = async () => {
    if(!canBindKDpay.value || isSaving.value) return;
    isSaving.value = true;
    const params = {
        jyPassword: jyPassword.value,
        pixType: selectedMethod.value.defaultType,
        ...kdpayProps.value
    }
    const { data, code } = await saveCashoutAccountApi(params);
    if(code == 200) {
        showForm.value = false;
        kdpayProps.value.cardId = '';
        kdpayProps.value.realName = '';
        kdpayErrMsg.value.cardId = '';
        kdpayErrMsg.value.realName = '';
        getCashoutAccount();
    } else {
        showTipModel({
            type: 1,
            icon: "fail",
            title: data.msg
        });
    }
    canBindKDpay.value = false;
    isSaving.value = false;
}

const bindNOpay = async () => {
    if(!canBindNOpay.value || isSaving.value) return;
    isSaving.value = true;
    const params = {
        jyPassword: jyPassword.value,
        pixType: selectedMethod.value.defaultType,
        ...nopayProps.value
    }
    const { data, code } = await saveCashoutAccountApi(params);
    if(code == 200) {
        showForm.value = false;
        nopayProps.value.cardId = '';
        nopayProps.value.realName = '';
        nopayErrMsg.value.cardId = '';
        nopayErrMsg.value.realName = '';
        getCashoutAccount();
    } else {
        showTipModel({
            type: 1,
            icon: "fail",
            title: data.msg
        });
    }
    canBindNOpay.value = false;
    isSaving.value = false;
}

const toggleAccountVisibility = () => {
    showAccount.value = !showAccount.value;
};

const handlePasswordVerified = (pinCode:string) => {
    // 密码验证成功后显示绑卡弹窗
    // bindCard.value.show(modelProps.value.bindCardMaxCount, modelProps.value.pixTypeList,pinCode);
    jyPassword.value = pinCode;
    showForm.value = true;
};

const handleForgotPassword = () => {
    // 这里可以跳转到忘记密码页面或显示相关提示
    showTipModel({
        type: 1,
        icon: "fail",
        title: t("f_contact_customer_service")
    });
};

const getCashoutAccount = async () => {
    refreshing.value = true;
    const { code, data }: any = await cashoutAccountApi();
    if (code == 200 && data.data && data.data.length > 0) {
        data.data.map((item: any) => {
            if([6,8,9,10,11].includes(item.pixType)) {
                // 6 => bank | 8 => alipay | 9 => topay | 10 => kdpay | 11 => nopay
                item.BankCard = Common.formatBankCard(item.cardId);
            } else if(item.pixType == 4 || item.pixType == 5) {
                // 4 => TRC20 | 5 => ERC20
                item.BankCard = Common.formatUSDTAddress(item.cardId);
            }
        });

        modelProps.value.accountCardIndex = data.data[0].id;
        modelProps.value.accountCardList = data.data;
       
        // modelProps.value.accountCardIndex = data.data[0].id;
        // modelProps.value.accountCardList = data.data;
    }
    setTimeout(() => {
        refreshing.value = false;
    }, 500); // 添加短暂延迟以显示刷新动画
};

const copyAccount = (value) => {
    navigator.clipboard.writeText(value)
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

const checkWithdrawPasswordStatus = async () => {
    // 这里应该调用API检查用户是否已设置提现密码
    // 临时模拟逻辑：检查localStorage或用户信息
    const { code, data }: any = await checkJyPassword();
    if (data && data.data == true) {
        return true;
    }else{
        router.push('/withdraw2/setPassword');
        return false;
    }
};

const getWithdrawInfo = async () => {
    const { code, data }: any = await withdrawInfoApi();
    if (code == 200) {
        const { minAmount, maxAmount, maxBankCardNum, pixTypeList } = data.data;
        modelProps.value.withdrawMinNum = minAmount;
        modelProps.value.withdrawMaxNum = maxAmount;
        modelProps.value.bindCardMaxCount = maxBankCardNum;
        modelProps.value.pixTypeList = pixTypeList;
    }
};

const goToAddAccount = () => {
    //如果已经大于最大数量
    if (modelProps.value.accountCardList.length >= modelProps.value.bindCardMaxCount) {
        showTipModel({
            type: 1,
            icon: "fail",
            title: t("f_max_bind_card") // 请先绑定账户
        });
        return;
    }
    
    // 弹出密码验证弹窗
    passwordModal.value.show();
};

onMounted(async () => {
    // 首先检查是否已设置提现密码
    hasPassword.value = await checkWithdrawPasswordStatus();    
    // 只有在已设置密码的情况下才继续初始化其他功能
    if (hasPassword.value) {
        getWithdrawInfo();
        getCashoutAccount();

        // 设置初始最大绑卡数量(如果API调用失败)
        if (!modelProps.value.bindCardMaxCount) {
            modelProps.value.bindCardMaxCount = 5;
        }

        // 添加点击body关闭下拉框的事件监听
        document.addEventListener('click', (e) => {
            // 如果下拉框已打开，且点击区域不在下拉框内，也不是箭头图标，则关闭下拉框
            const target = e.target as HTMLElement;
            const dropdown = document.querySelector('.account-dropdown');
            const arrowIcon = document.querySelector('.down-arrow-icon2');

            if (modelProps.value.showAccountDropdown &&
                dropdown && !dropdown.contains(target) &&
                arrowIcon && !arrowIcon.contains(target)) {
                modelProps.value.showAccountDropdown = false;
            }
        });
    }
});

</script>