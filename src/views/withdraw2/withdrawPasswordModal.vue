<template>
  <!-- 提现密码验证弹窗 -->
  <van-popup v-model:show="modelProps.passwordModalShow" style="background-color: transparent"
    overlay-class="withdraw-custom-overlay" :overlay-style="{ top: '0px' }" @close="handleClose">
    <div class="popup-bg password-modal-box">
      <div class="modal-title">
        <span>{{ $t("f_withdraw_password") }}</span>
      </div>

      <!-- 一条白线 -->
      <div class="white-line"></div>

      <div class="password-container">
        <div class="password-label">{{ $t("f_withdraw_password") }}</div>

        <!-- 密码输入区域 -->
        <div class="password-input-section">
          <div class="pin-input-container">
            <div v-for="(_, index) in 6" :key="`password-${index}`" class="pin-input"
              :class="{ 'first': index === 0, 'last': index === 5 }">
              <input type="password" maxlength="1" class="pin-input-field" v-model="withdrawPassword[index]"
                @input="handlePasswordInput(index, $event)" @keydown="handleBackspace(index, $event)"
                inputmode="numeric" pattern="[0-9]*"
                @keypress="e => e.key.match(/[a-zA-Z]/) ? e.preventDefault() : null"
                :ref="el => { if (el) passwordInputs[index] = el as HTMLInputElement }" />
            </div>
          </div>
          <div class="rowbox" style="display: flex;justify-content: space-between;">
            <div class="security-tip">
              {{ $t("f_password_security_tip") }}
            </div>
            <!-- <div class="forgot-password" @click="forgotPassword">
              {{ $t("f_forgot_password") }}?
            </div> -->
          </div>

        </div>

        <!-- 错误提示 -->
        <div class="input-verify" v-show="showError">
          <svg-icon class="text-[14px] text-white" name="warning" />
          <span class="error-text">{{ $t("f_password_error") }}</span>
        </div>


      </div>

      

      <van-button v-scaleTap class="next-button" v-if="isPasswordComplete" @click="verifyPassword()" type="default"
        :disabled="modelProps.lockSubmit">{{ $t('f_next') }}</van-button>
      <van-button v-scaleTap class="next-button disabled" v-else type="default">{{ $t('f_next') }}</van-button>
    </div>
    <!-- 关闭按钮 -->
    <svg-icon
        v-scaleTap
        class="text-[30px] theme-svg-color box-close"
        name="close"
        @click="handleClose()"
      />
  </van-popup>
</template>

<script setup lang="ts" name="WithdrawPasswordModal">
import { ref, computed, defineEmits } from "vue";
import { useI18n } from "vue-i18n";
import { showTipModel } from "@/components/TipModel/index.js";
import router from "@/router";
import { compareJyPassword } from "@/api/withdraw";

// 多语言
const { t } = useI18n();

const emit = defineEmits(["passwordVerified", "forgotPassword"]);

// 响应式数据
const withdrawPassword = ref(['', '', '', '', '', '']);
const passwordInputs = ref<HTMLInputElement[]>([]);
const showError = ref(false);

// 定义变量
const modelProps = ref({
  passwordModalShow: false,
  lockSubmit: false,
});

// 计算属性
const isPasswordComplete = computed(() => {
  return withdrawPassword.value.every(digit => digit !== '');
});

// 密码输入处理
const handlePasswordInput = (index: number, event: any) => {
  const value = event.target.value;

  if (value.length <= 1) {
    withdrawPassword.value[index] = value;
    showError.value = false; // 重置错误状态

    // 自动跳到下一个输入框
    if (value && index < 5) {
      const nextInput = passwordInputs.value[index + 1];
      if (nextInput) nextInput.focus();
    }
  }
};

// 处理退格键
const handleBackspace = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !withdrawPassword.value[index] && index > 0) {
    // 如果当前输入为空且按下退格键，跳到前一个输入框
    const prevInput = passwordInputs.value[index - 1];
    if (prevInput) {
      prevInput.focus();
      withdrawPassword.value[index - 1] = '';
    }
  }
};

// 验证密码
const verifyPassword = async () => {
  if (!isPasswordComplete.value) {
    return;
  }

  const password = withdrawPassword.value.join('');

  // 这里应该调用API验证密码
  // 临时模拟验证逻辑

  const { code, data }: any = await compareJyPassword({
    jyPassword: password
  });

  if (code == 200) {
    close();
    emit("passwordVerified",password);
  } else {
    showTipModel({
      type: 1,
      icon: "fail",
      title: t(code)
    });
    showError.value = true;
    // 清空密码
    withdrawPassword.value = ['', '', '', '', '', ''];
    // 焦点回到第一个输入框
    if (passwordInputs.value[0]) {
      passwordInputs.value[0].focus();
    }
  }
};

// 忘记密码
const forgotPassword = () => {
  // emit("forgotPassword");
  // 进入设置提现密码界面（忘记密码时重新设置）
  router.push("/withdraw2/resetPassword");
  close();
};

// 显示弹窗
const show = () => {
  modelProps.value.passwordModalShow = true;
  showError.value = false;
  withdrawPassword.value = ['', '', '', '', '', ''];
};

// 关闭弹窗
const close = () => {
  modelProps.value.passwordModalShow = false;
  withdrawPassword.value = ['', '', '', '', '', ''];
  showError.value = false;
};

const handleClose = () => {
  close();
};

defineExpose({
  show,
  close
});
</script>

<style lang="scss" scoped>
@import "./bindCard.scss";

.password-modal-box {
  padding: 20px;
  position: relative;
  margin: 0 auto;
  // margin-top: 20vh;
}
.box-close {
    z-index: 99;
    margin-top: 35px;
    cursor:pointer;
    position: relative;
    margin-left: auto;
    margin-right: auto;
}

.modal-title {
  text-align: center;
  margin-bottom: 15px;

  span {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-black);
  }
}

.white-line {
  width: 100%;
  height: 1px;
  background-color: var(--secondary-dark-color);
  margin-bottom: 15px;
}

.password-container {
  .password-label {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 15px;
    text-align: left;
  }
}


.password-input-section {
  margin-bottom: 20px;

  .pin-input-container {
    display: flex;
    gap: 1px;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;

    .pin-input {
      width: 45px;
      height: 45px;
      background-color: var(--secondary-dark-color);
      display: flex;
      justify-content: center;
      align-items: center;
      // border: 1px solid $theme-recharge-border-color;
      

      &.first {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }

      &.last {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }

      .pin-input-field {
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
        outline: none;
        text-align: center;
        font-size: 18px;
        color: white;
        caret-color: white;
      }
    }
  }

  .rowbox {
    display: flex;
    justify-content: space-between;
  }
}

.input-verify {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-bottom: 15px;

  span {
    font-size: 12px;
  }

  .error-text {
    color: white;
  }
}

.security-tip {
  font-size: 9px;
  color: $theme-text-color-dark;
  line-height: 1.4;
  text-align: left;
  width: 200px;
  text-overflow: ellipsis;
}



.next-button {
  @extend .theme-btn;
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;

  &.disabled {
    background: var(--primary-disabled-color);
    color: white；
  }
}
</style>