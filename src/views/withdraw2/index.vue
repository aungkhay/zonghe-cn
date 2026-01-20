<template >
    <div class="withdraw-container" v-if="hasPassword">
        <!-- 使用TopBar组件并添加showBackButton参数 -->
        <TopBar ref="topBarRef" :items="topBarItems" :defaultActive="modelProps.tabKey.toLowerCase()"
            @component-change="handleComponentChange" :showBackButton="false" :directBack="true" />

        <!-- 提现界面 -->
        <div v-if="modelProps.tabKey === 'Withdraw'" class="withdraw-content">
            <div class="balance-section">
                <div class="balance-info">
                    <div class="balance-label">{{ $t('106000') }}</div>
                    <div class="balance-amount">
                        {{ playerInfo.amount }}
                        <svg-icon v-scaleTap name="refresh" class="text-[16px] text-[var(--primary-color)] refresh-icon ml-3" :class="{ rotate: refreshing }" @click="refreshBalance" />
                    </div>
                </div>
                <div class="bet-required">
                    {{ $t('102026') }} <span class="bet-required-highlight"> {{ $t('107043') }}: {{ Common.toFixed2(playerInfo.dama) }}</span>
                </div>
                <!-- <div class="divider-green"></div> -->
                <!-- <button v-scaleTap class="withdraw-btn normal">{{ $t('f_normal_withdraw') }}
                    <div class="corner-check"></div>
                </button> -->
            </div>

            <div class="grid grid-cols-3 gap-2 mx-3 my-3">
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



            <!-- 已有账户列表 -->
            <!-- <div v-if="modelProps.accountCardList.length > 0" class="account-list">
                <div v-for="(item, index) in modelProps.accountCardList" :key="index" class="account-card"
                    @click="changeAccountCard(item)">
                    <div class="account-info-row">
                        <span class="account-label">{{ $t('107051') }}</span>
                        <span class="account-value">{{ item.accountCodeName || '-' }}</span>
                    </div>
                    <div class="account-info-row">
                        <span class="account-label">{{ $t('107052') }}</span>
                        <span class="account-value">{{ item.BankCard }}</span>
                    </div>
                    <div class="account-info-row">
                        <span class="account-label">{{ $t('107053') }}</span>
                        <span class="account-value">{{ item.cardName }}</span>
                    </div>
                    <div class="account-bottom">
                        <svg-icon v-if="modelProps.accountCardIndex === item.id" class="check-icon"
                            name="icon_Select"></svg-icon>
                        <span>{{ $t('107054') }}</span>
                    </div>
                </div>
            </div> -->

            <!-- 添加账户 -->
            <div class="account-section">
                <div v-scaleTap class="account-item" v-if="accountList.length === 0" @click="addAccount">
                    <!-- <svg-icon name="id" class="text-[24px] theme-svg-color-light mr-[10px]" /> -->
                    <div class="account-text">{{ $t('102037') }}</div>
                    <svg-icon name="right" class="text-[16px] text-[var(--primary-color)]" />
                </div>
                <div class="account-items-container" v-else>
                    <div class="account-items" @click.stop="toggleAccountDropdown">
                        <div class="pix-icon-container pix-icon-margin">
                            <svg-icon :name="getAccountType(accountList.find(item => item.id === modelProps.accountCardIndex)?.pixType)" class="text-[25px] rounded-full"></svg-icon>
                        </div>
                         <div class="account-text account-text-margin">
                            <div v-if="[6,8,9,10,11].includes(accountList.find(item => item.id === modelProps.accountCardIndex)?.pixType)" class="pix-account-info-text">
                                {{ Common.formatBankCard(accountList.find(item => item.id === modelProps.accountCardIndex)?.cardId) }}
                            </div>
                            <div v-if="[4,5].includes(accountList.find(item => item.id === modelProps.accountCardIndex)?.pixType)" class="pix-account-info-text">
                                {{ Common.formatUSDTAddress(accountList.find(item => item.id === modelProps.accountCardIndex)?.cardId) }}
                            </div>
                        </div>
                        <svg-icon name="arrow_down" class="text-[16px] text-[var(--primary-color)] down-arrow-icon2" :class="{ 'rotate-180': modelProps.showAccountDropdown }" />
                    </div>

                    <svg-icon name="add_card" class="text-[34px] text-[var(--primary-color)]" @click="addAccount" />

                    <!-- 添加账户下拉列表 -->
                    <transition name="dropdown">
                        <div class="account-dropdown" v-if="modelProps.showAccountDropdown" @click.stop>
                            <div 
                                v-for="(item, index) in accountList" :key="index"
                                class="account-dropdown-item" @click="changeAccountCard(item)"
                                :class="{ 'selected': modelProps.accountCardIndex === item.id }"
                            >
                                <div class="pix-icon-container pix-icon-margin">
                                    <svg-icon :name="getAccountType(item.pixType)" class="text-[25px] rounded-full"></svg-icon>
                                </div>
                                <div class="account-text account-text-margin">
                                    <div v-if="[6,8,9,10,11].includes(item.pixType)" class="pix-dropdown-info-text">
                                        {{ Common.formatBankCard(item.cardId) }}
                                    </div>
                                    <div v-if="[4,5].includes(item.pixType)" class="pix-dropdown-info-text">
                                        {{ Common.formatUSDTAddress(item.cardId) }}
                                    </div>
                                 </div>
                                <svg-icon v-if="modelProps.accountCardIndex === item.id" class="text-[#00bbaf] check-icon" name="icon_Select"></svg-icon>
                            </div>
                        </div>
                    </transition>
                </div>

                <div class="notice-section" v-if="modelProps.accountCardList.length !== 0">
                    <!-- <svg-icon name="rs" class="text-[20px] text-[var(--primary-color)] mr-[10px]" /> -->
                    <input type="number" class="notice-text" v-model="inputValue"
                        :placeholder="$t('f_please_add_withdraw_account')" />
                </div>
            </div>



            <div class="pin-section">
                <div class="pin-header">
                    <div class="pin-title">{{ $t('f_withdraw_password') }}</div>
                    <svg-icon :name="showPin ? 'visible' : 'invisible'" class="text-[20px] text-[var(--primary-color)]" @click="togglePinVisibility" />
                </div>
                <div class="pin-input-container">
                    <div class="pin-input" v-for="(_, index) in 6" :key="index">
                        <input :type="showPin ? 'text' : 'password'" maxlength="1" class="pin-input-field"
                            v-model="modelProps.pinInputs[index]" @input="handlePinInput(index, $event)"
                            @keydown="handleBackspace(index, $event)" inputmode="numeric" pattern="[0-9]*"
                            ref="pinInputs" />
                    </div>
                </div>
            </div>

            <button class="confirm-btn" @click="submitWithdraw" :disabled="isSubmitDisabled">
                {{ $t('f_confirm') }}
            </button>
        </div>

        <!-- 提现记录 -->
        <div v-if="modelProps.tabKey === 'WithdrawRecords'" class="withdraw-records">
            <Records></Records>
        </div>

        <!-- 投注任务 -->
        <div v-if="modelProps.tabKey === 'BetTasks'" class="bet-tasks">
            <!-- 投注任务内容
            <div class="bet-tasks-content">
                <div class="tasks-placeholder">投注任务内容</div>
            </div> -->
        </div>

        <!-- 账户管理 -->
        <div v-if="modelProps.tabKey === 'ManageAccount'" class="account-manage">


            <!-- 账户列表 -->
            <div class="account-cards-container">
                <div class="account-manage-header">
                    <span class="account-title account-title-margin">{{ $t('f_account_management') }} <span class="account-title-count">({{ modelProps.accountCardList.length }}/{{ modelProps.bindCardMaxCount }})</span></span>
                    <svg-icon name="refresh" class="text-[12px] text-[var(--primary-color)] refresh-icon-wrapper" :class="{ rotate: refreshing }" @click="getCashoutAccount" />
                    <svg-icon :name="showAccount ? 'visible' : 'invisible'" class="text-[14px] text-[var(--primary-color)] eye-icon" @click="toggleAccountVisibility" />
                </div>
                <div v-for="(item, index) in modelProps.accountCardList" :key="index" class="pix-account-card"
                    :class="{ 'is-default': modelProps.accountCardIndex === item.id }">
                    <div class="pix-icon-container">
                        <img :src="$imgBasePath + '/public/pix.png'" class="pix-icon" />
                    </div>
                    <div class="pix-account-info">
                        <div class="pix-type">PIX <span class="pix-type-highlight">({{ getAccountType(item.pixType) || 'Email'
                                }})</span></div>
                        <div class="box-value">
                            <div class="pix-value">{{ showAccount ? item.cardId : maskEmail(item.cardId) }}
                            </div>
                            <svg-icon name="copy" class="text-[14px] ml-2 text-[var(--primary-color)] copy-icon" @click="copyAccount(item.cardId)" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="account-manage-spacer"></div>

            <!-- 添加新账户按钮 -->
            <div class="add-new-account-btn" @click="goToAddAccount">
                <div class="pix-icon-container">
                    <img :src="$imgBasePath + '/public/pix.png'" class="pix-icon" />
                </div>
                <div class="add-account-text">PIX (Email)</div>
                <div class="add-icon-wrapper">
                    <span>{{ $t('f_add') }}</span>
                    <svg-icon name="right" class="arrow-icon" />
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="withdraw-container"></div>
    </div>

    <BindCard ref="bindCard" @updateAccountInfo="getCashoutAccount"></BindCard>
    <WithdrawPasswordModal ref="passwordModal" @passwordVerified="handlePasswordVerified" @forgotPassword="handleForgotPassword"></WithdrawPasswordModal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStoreHook } from "@/store/modules/user";
import { userInfoApi } from "@/api/user/index";
import {
    withdrawInfoApi,
    cashoutAccountApi,
    withdrawApi,
    checkJyPassword
} from "@/api/withdraw/index";
import { showTipModel } from "@/components/TipModel/index.js";
import Common from "@/utils/common/common";
import router from "@/router/index";
import Records from "../withdraw2/records.vue";
import BindCard from "./bindCard.vue";
import TopBar from "@/components/TopBar/index.vue";
import WithdrawPasswordModal from "./withdrawPasswordModal.vue";

// 多语言
const { t } = useI18n();

const bindCard = ref();
const passwordModal = ref();
const inputValue = ref('');

// 检查用户是否已设置提现密码
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

const getAccountType = (type: number) => {
    if(type == 4 || type == 5) {
        return 'usdt';
    }
    if(type == 8) {
        return 'alipay';
    }
    if(type == 9) {
        return 'topay';
    }
    if(type == 10) {
        return 'kdpay';
    }
    if(type == 11) {
        return 'nopay';
    }
    return 'bank';
}
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
const accountList = ref([]);
const onPaymentMethodChange = (item: any) => {
    selectedMethod.value = item;
    accountList.value = modelProps.value.accountCardList.filter(a => a.pixType == item.defaultType);
     if(accountList.value.length > 0) {
        modelProps.value.accountCardIndex = accountList.value[0].id;
    }
}

// 复制账户
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

const showAccount = ref(false);
const toggleAccountVisibility = () => {
    showAccount.value = !showAccount.value;
};

// 玩家信息
const playerInfo = computed(() => {
    return useUserStoreHook().playerInfo;
});

// 定义TopBar菜单项
const topBarItems = [
    { textId: "102024", key: "withdraw", path: "", component: 'Withdraw' },
    // { textId: "f_bet_tasks", key: "bettasks", path: "", component: 'BetTasks' },
    // { textId: "f_account_management", key: "manageaccount", path: "", component: 'ManageAccount' },
    { textId: "f_withdraw_record", key: "withdrawrecords", path: "", component: 'WithdrawRecords' },
];

// 添加ref以便访问TopBar组件
const topBarRef = ref(null);

// 处理TopBar组件变化事件
const handleComponentChange = ({ key, component }) => {
    if (component) {
        modelProps.value.tabKey = component;

        // 根据组件名称找到对应的索引
        const tabIndex = modelProps.value.tabList.findIndex(item => item.key === component);
        if (tabIndex !== -1) {
            modelProps.value.tabIndex = tabIndex;
        }

        // 同时更新TopBar的激活状态
        nextTick(() => {
            if (topBarRef.value) {
                topBarRef.value.updateActiveTab(key);
            }
        });
    }
};


// 定义变量
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

const pinInputs = ref<HTMLInputElement[]>([]);

// 切换标签
const changeTab = (tabIndex: number) => {
    modelProps.value.tabIndex = tabIndex;
    modelProps.value.tabKey = modelProps.value.tabList[tabIndex].key;

    // 同步更新TopBar的激活状态
    const currentTabKey = modelProps.value.tabList[tabIndex].key;
    const correspondingTopBarItem = topBarItems.find(item => item.component === currentTabKey);

    if (correspondingTopBarItem && topBarRef.value) {
        nextTick(() => {
            topBarRef.value.updateActiveTab(correspondingTopBarItem.key);
        });
    }
};

// 添加账户
const addAccount = () => {
    router.push('/manage-acc'); return;
    // router.push('/withdraw/bindCard');
    changeTab(2);
    handleComponentChange({ key: 'manageaccount', component: 'ManageAccount' });

    // 手动更新TopBar组件的选中状态
    nextTick(() => {
        // 设置当前激活的标签
        const manageAccountIndex = topBarItems.findIndex(item => item.key === 'manageaccount');
        if (manageAccountIndex !== -1 && topBarRef.value) {
            topBarRef.value.updateActiveTab('manageaccount');
        }
    });
};

// 获取提现信息
const getWithdrawInfo = async () => {
    const { code, data }: any = await withdrawInfoApi();
    if (code == 200) {
        const { minAmount, maxAmount, maxBankCardNum,pixTypeList } = data.data;
        modelProps.value.withdrawMinNum = minAmount;
        modelProps.value.withdrawMaxNum = maxAmount;
        modelProps.value.bindCardMaxCount = maxBankCardNum;
        modelProps.value.pixTypeList = pixTypeList;

    }
};

// 获取提现账户
const getCashoutAccount = async () => {
    refreshing.value = true;
    const { code, data }: any = await cashoutAccountApi();
    if (code == 200 && data.data && data.data.length > 0) {
        data.data.map((item: any) => {
            item.BankCard = Common.formatBankCard(item.cardId);
        });

        modelProps.value.accountCardIndex = data.data[0].id;
        modelProps.value.accountCardList = data.data;
       
        // modelProps.value.accountCardIndex = data.data[0].id;
        // modelProps.value.accountCardList = data.data;
        accountList.value = modelProps.value.accountCardList.filter(a => a.pixType == selectedMethod.value.defaultType);
        if(accountList.value.length > 0) {
            modelProps.value.accountCardIndex = accountList.value[0].id;
        }
    }
    setTimeout(() => {
        refreshing.value = false;
    }, 500); // 添加短暂延迟以显示刷新动画
};

// 选择账户卡
const changeAccountCard = (item: any) => {
    modelProps.value.accountCardIndex = item.id;
    modelProps.value.showAccountDropdown = false; // 选择后关闭下拉框
};

// 切换账户下拉框显示状态
const toggleAccountDropdown = () => {
    modelProps.value.showAccountDropdown = !modelProps.value.showAccountDropdown;
};

// 刷新余额
const refreshing = ref(false);
const refreshBalance = async () => {
    if (useUserStoreHook().isLogin !== true) {
        return false;
    }
    if (refreshing.value == true) {
        return false;
    }

    refreshing.value = true;
    const { code, data }: any = await userInfoApi();
    if (code == 200 && data && data.data) {
        const { amount, dama, withdrawAmount } = data.data;
        useUserStoreHook().updatePlayerInfo("amount", amount);
        useUserStoreHook().updatePlayerInfo("dama", dama);
        useUserStoreHook().updatePlayerInfo("withdrawAmount", withdrawAmount);
    }

    setTimeout(() => {
        refreshing.value = false;
    }, 2000);
};

// 提交按钮禁用状态
const isSubmitDisabled = computed(() => {
    const pinComplete = modelProps.value.pinInputs.every(pin => pin !== '');
    return !pinComplete || !inputValue.value || Number(inputValue.value) > Number(playerInfo.value.amount);
    // return Number(inputValue.value) > Number(playerInfo.value.amount) || modelProps.value.accountCardList.length === 0 || !pinComplete || Number(inputValue.value) < modelProps.value.withdrawMinNum || Number(inputValue.value) > modelProps.value.withdrawMaxNum 
});

// 提交提现申请
const submitWithdraw = async () => {
    if (modelProps.value.accountCardList.length === 0) {
        showTipModel({
            type: 1,
            icon: "fail",
            title: t("102053") // 请先绑定账户
        });
        return;
    }

    if (Number(playerInfo.value.dama) > 0) {
        showTipModel({
            type: 1,
            icon: "fail",
            title: t("102052") // 需要完成投注才能提现
        });
        return;
    }

    // 验证PIN码
    const pinComplete = modelProps.value.pinInputs.every(pin => pin !== '');
    if (!pinComplete) {
        showTipModel({
            type: 1,
            icon: "fail",
            title: t("f_please_enter_withdraw_password")
        });
        return;
    }

    //查看是否低于或超出提现限制
    if (Number(inputValue.value) < modelProps.value.withdrawMinNum) {
        showTipModel({
            type: 1,
            icon: "fail",
            title: t("f_withdraw_amount_below_limit") // 提现金额低于限制
        });
        return;
    }
    if (Number(inputValue.value) > modelProps.value.withdrawMaxNum) {
        showTipModel({
            type: 1,
            icon: "fail",
            title: t("f_withdraw_amount_exceed_limit") // 提现金额超出限制
        });
        return;
    }

    const pinCode = modelProps.value.pinInputs.join('');
    const { code, data }: any = await withdrawApi({
        amount: Number(inputValue.value), // 全额提现
        cardPrivateId: modelProps.value.accountCardIndex,
        jyPassword: pinCode
    });

    if (code == 200) {
        showTipModel({
            type: 2,
            icon: "success",
            title: t("102050"),
            subTitle: t("102051"),
            yesBtnText: t("103015"),
            success: () => {
                refreshBalance();
                modelProps.value.pinInputs = ['', '', '', '', '', ''];
                inputValue.value ='';
            }
        });
    } else {
        showTipModel({
            type: 1,
            title: t(code),
            icon: "fail"
        });
    }
};

// 返回上一页
const goBack = () => {
    router.go(-1);
}

// PIN码输入
const handlePinInput = (index: number, event: any) => {
    const value = event.target.value;
    if (value.length <= 1) {
        modelProps.value.pinInputs[index] = value;
        // 自动跳到下一个输入框
        if (value && index < 5) {
            const nextInput = document.querySelectorAll('.pin-input-field')[index + 1] as HTMLInputElement;
            if (nextInput) nextInput.focus();
        }
    }
};

// 处理退格键
const handleBackspace = (index: number, event: KeyboardEvent) => {
    if (event.key === 'Backspace' && !modelProps.value.pinInputs[index] && index > 0) {
        // 如果当前输入为空且按下退格键，跳到前一个输入框
        const prevInput = document.querySelectorAll('.pin-input-field')[index - 1] as HTMLInputElement;
        if (prevInput) {
            prevInput.focus();
            modelProps.value.pinInputs[index - 1] = '';
        }
    }
};

// 切换PIN输入的可见性
const showPin = ref(false);
const hasPassword = ref(false);
const togglePinVisibility = () => {
    showPin.value = !showPin.value;
};

// 屏蔽邮箱中间部分
const maskEmail = (email) => {
    // if (!email) return '****';
    if (!email.includes('@')) return email.substring(email.length - 4).padStart(email.length, '*');
    const parts = email.split('@');
    if (parts.length !== 2) return '****';
    return `****${parts[1]}`;
};

// 跳转到添加账户页面
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

// 密码验证成功后的处理
const handlePasswordVerified = (pinCode:string) => {
    // 密码验证成功后显示绑卡弹窗
    bindCard.value.show(modelProps.value.bindCardMaxCount, modelProps.value.pixTypeList,pinCode);
};

// 忘记密码处理
const handleForgotPassword = () => {
    // 这里可以跳转到忘记密码页面或显示相关提示
    showTipModel({
        type: 1,
        icon: "fail",
        title: t("f_contact_customer_service")
    });
};

onMounted(async () => {
    // 首先检查是否已设置提现密码
    hasPassword.value = await checkWithdrawPasswordStatus();    
    // 只有在已设置密码的情况下才继续初始化其他功能
    if (hasPassword.value) {
        getWithdrawInfo();
        getCashoutAccount();
        refreshBalance();

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

<style lang="scss" scoped>
.down-arrow-icon2 {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.corner-check {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0;
  border-radius: 0 0 9px 0;
  height: 0;
  border-bottom: 20px solid orange;
  border-left: 20px solid transparent;

  &::after{
    content: '✔';
    position: absolute;
    bottom: -20px;
    right: 2px;
    font-size: 10px;
    color: white;
  }
}

.withdraw-container {
    padding: 0;
    min-height: calc(100vh - var(--van-nav-bar-height));
    position: relative;

    .bet-tasks {
        padding: 60px 15px 15px;

        .tasks-placeholder {
            @extend .theme-withdraw-bg;
            padding: 20px;
            color: white;
            text-align: center;
            margin-top: 20px;
        }
    }

    .balance-section {
        @extend .theme-withdraw-bg;
        background-color: rgb(243, 242, 242);
        padding: 15px;
        margin: 10px;
        

        .balance-info {
            display: flex;
            align-items: center;
            gap: 10px;
            justify-content: flex-start;

            .balance-label {
                font-size: 12px;
                color: var(--secondary-dark-grey);
                font-weight: 500;
            }

            .balance-amount {
                font-size: 13px;
                color: var(--secondary-dark-grey);
                font-weight: 550;
                display: flex;
                align-items: center;

                .refresh-icon {
                    &.rotate {
                        animation: rotate 1s linear infinite;
                    }
                }
            }
        }

        .bet-required {
            margin-top: 8px;
            font-size: 12px;
            color: var(--secondary-dark-grey);
            font-weight: 500;
        }
    }



    .withdraw-btn {
        position: relative;
        width: 100%;
        height: 40px;
        border-radius: 10px;
        color: var(--text-white);
        background-color: var(--primary-color);
        font-size: 14px;
        font-weight: 550;
        pointer-events: none;
    }



    .account-section {
        padding: 0 10px;
        margin-top: 5px;
        position: relative; // 添加定位上下文

        .account-item {
            @extend .theme-withdraw-bg;
            height: 50px;
            display: flex;
            align-items: center;
            padding: 0 15px;
            cursor: pointer;

            .account-text {
                flex: 1;
                font-size: 12px;
                color: $theme-text-color-light;
                font-weight: 500;
            }

         
        }

        .account-items-container {
            position: relative; // 添加相对定位
            display: flex; // 恢复flex布局
            align-items: center; // 恢复垂直居中对齐
        }

        .account-items {
            @extend .theme-withdraw-bg;
            height: 50px;
            display: flex;
            align-items: center;
            padding: 0 7px;
            margin-right: 15px;
            width: 100%;
            border: 1px solid var(--secondary-dark-color);

            cursor: pointer;

            .account-icon {
                width: 24px;
                height: 24px;
                margin-right: 10px;
            }

            .pix-icon-container {
                width: 28px;
                height: 28px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 10px;

                .pix-icon {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }


            }

            .account-text {
                flex: 1;
                font-size: 12px;
                color: #C9D4A5;
                font-weight: 500;
            }

            .arrow-icon {
                width: 16px;
                height: 16px;
                color: #FFF1AD;
            }
        }

        .notice-section {
            @extend .theme-withdraw-bg;
            height: 50px;
            display: flex;
            align-items: center;
           
            margin-top: 10px;
            padding: 0 15px;

            .notice-icon {
                width: 20px;
                height: 20px;
                margin-right: 10px;
            }

            .notice-text {
                font-size: 12px;
                color: #000;
                width: 100%;

                &::placeholder{
                    color: var(--secondary-dark-color);
                }
            }
        }

        .account-dropdown {
            @extend .theme-withdraw-add-account-bg;
            position: absolute;
            top: 100%;
            left: 0;
            width: calc(100% - 45px); // 减去右侧添加按钮的宽度
            z-index: 10;
            margin-top: 5px;
            max-height: 200px;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); // 添加阴影效果
            .account-dropdown-item {
                display: flex;
                align-items: center;
                padding: 10px;
                cursor: pointer;
                &.selected {
                    background-color: #597ef793;
                    color: white;
                }

                .pix-icon {
                    width: 24px;
                    height: 24px;
                }

                .check-icon {
                    margin-left: auto;
                    width: 20px;
                    height: 20px;
                }
            }
        }
    }

    .pin-section {
        padding: 0 15px;
        margin-top: 20px;

        .pin-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;

            .pin-title {
                font-size: 16px;
                font-weight: 600;
                color: #000;
            }

            .eye-icon {
                width: 14px;
                height: 14px;
                cursor: pointer;

            }
        }

        .pin-input-container {
            display: flex;
            gap: 1px;
            justify-content: center;
            align-items: center;

            .pin-input {
                width: 60px;
                height: 55px;
                background: var(--secondary-color);
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid var(--secondary-dark-color);

                .pin-input-field {
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    text-align: center;
                    font-size: 20px;
                    color: #000;
                    caret-color: #000;
                }
            }

            .pin-input:first-child {
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
            }

            .pin-input:last-child {
                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;
            }
        }
    }

    .confirm-btn {
        @extend .theme-btn;
        width: calc(100% - 30px);
        height: 44px;
        margin: 40px 15px 20px;
        border: none;
        outline: none;
        cursor: pointer;

        &:disabled {
            // background: $theme-btn-disable-bg;
            background: #a4b7f7;
            color: white;
            cursor: not-allowed;
        }
    }

    .account-manage {
        padding: 10px;
        display: flex;
        flex-direction: column;
        // min-height: calc(100vh - 60px);
        width: 100%;
        /* 减去TopBar的高度 */

        .account-manage-header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 8px;

            .eye-icon {
                width: 18px;
                height: 18px;
                margin-top: 12px;
                margin-right: 13px;
                margin-left: auto;
                cursor: pointer;
            }


            .account-title {
                font-size: 12px;
                font-weight: bold;
                color: #000;
                margin-left: 17px;
                margin-top: 12px;
            }


            .refresh-icon-wrapper {
                width: 16px;
                height: 16px;
                display: flex;
                margin-top: 12px;
                margin-left: 10px;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                &.rotate {
                  animation: rotate 1s linear infinite;
                }
               
            }
        }

        .account-cards-container {
            @extend .theme-withdraw-bg;
            margin-bottom: 15px;
            padding-bottom: 10px;

           
            .pix-account-card {
                display: flex;
                align-items: center;
                padding: 5px;
                margin-left: 12px;
                margin-right: 12px;
                margin-bottom: 10px;
                background: var(--secondary-dark-color);
                border-radius: 10px 10px 10px 10px;


                .pix-icon-container {
                    width: 28px;
                    height: 28px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 10px;

                    .pix-icon {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                }

                .pix-account-info {
                    flex: 1;

                    .pix-type {
                        font-size: 12px;
                        color: var(--primary-color);
                        font-weight: 500;
                    }

                    .box-value {
                        display: flex;
                        flex-direction: row;

                        .pix-value {
                            font-size: 10px;
                            color: #000;
                        }

                        .copy-account-btn {
                            margin-left: 10px;
                            cursor: pointer;

                        }

                        .copy-icon {
                            width: 16px;
                            height: 16px;
                            margin-top: -1px;
                        }
                    }

                }

                .set-default-btn {
                    background-color: rgba(255, 204, 0, 0.2);
                    color: #FFCC00;
                    font-size: 12px;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .default-label {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .check-icon {
                        width: 22px;
                        height: 22px;
                    }
                }
            }
        }

        .account-manage-spacer {
            flex: 1;
        }

        .add-new-account-btn {
            @extend .theme-withdraw-bg;
            display: flex;
            align-items: center;
            
            padding: 8px;
            cursor: pointer;
            // margin-top: auto;
            margin-bottom: 65px;
            .pix-icon-container {
                width: 36px;
                height: 36px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: 8px;

                margin-right: 10px;

                .pix-icon {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }

            .add-account-text {
                flex: 1;
                color: var(--primary-color);
                font-size: 14px;
                font-weight: 500;
            }

            .add-icon-wrapper {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-right: 10px;
                color: var(--primary-color);
                font-size: 14px;

                .arrow-icon {
                    margin-left: 10px;
                    width: 16px;
                    height: 16px;
                    color: var(--primary-color);
                }
            }
        }
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

// 添加下拉动画
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
.bet-required-highlight {
  color: var(--primary-color);
  font-weight: bold;
}
.divider-green {
  height: 1px;
  width: 100%;
  background-color: $theme-withdraw-divider-color;
  margin-top: 10px;
  margin-bottom: 10px;
}
// .account-items-custom {
//   background-color: #0A6E0A !important;
//   height: 50px !important;
// }
.pix-icon-margin {
  margin-left: 5px !important;
}
.account-text-margin {
  margin-left: 5px !important;
}
.add-account-img {
  width: 34px !important;
  height: 26px !important;
  margin-right: 5px !important;
}
.account-title-margin {
  margin-left: 10px !important;
}
.pix-type-highlight {
  color: var(--primary-color) !important;
}

.pix-account-info-text {
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 500;
}

.pix-account-info-subtext {
  color: $theme-text-color-light;
  font-size: 10px;
  margin-top: 3px;
}

.pix-dropdown-info-text {
//   color: #fff;
  font-size: 12px;
  font-weight: 500;
}

.pix-dropdown-info-subtext {
  color: $theme-text-color-light;
  font-size: 10px;
  margin-top: 3px;
}
</style>