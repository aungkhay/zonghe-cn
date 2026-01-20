<template>
  <div class="password-container">
    <!-- 使用NavBar组件 -->
    <!-- <NavBar :title="$t('f_set_withdrawal_password')" :directHome="true" /> -->

    <!-- 主要内容区域 -->
    <div class="content">
      <!-- 提示信息 -->
      <!-- <div class="info-section">
        <div class="info-text">{{ $t("f_first_time_password_tip") }}</div>
      </div> -->

      <!-- 密码设置区域 -->
      <div class="password-section">
        <!-- <div class="password-label">{{ $t("f_set_withdrawal_password") }}</div> -->

        <!-- 新密码输入 -->
        <div class="password-input-section">
          <div class="pin-header">
            <div class="input-label">{{ $t("f_new_password") }}</div>
            <svg-icon :name="showNewPassword ? 'visible' : 'invisible'" class="text-[16px] theme-svg-color-dark" @click="toggleNewPasswordVisibility" />
          </div>
          <div class="pin-input-container">
            <div v-for="(_, index) in 6" :key="`new-${index}`" class="pin-input"
              :class="{ 'first': index === 0, 'last': index === 5 }">
              <input :type="showNewPassword ? 'text' : 'password'" maxlength="1" class="pin-input-field"
                v-model="newPassword[index]" @input="handlePinInput('new', index, $event)"
                @keydown="handleBackspace('new', index, $event)" inputmode="numeric" pattern="[0-9]*"
                :ref="el => { if (el) newPasswordInputs[index] = el as HTMLInputElement }"
                @keypress="e => e.key.match(/[a-zA-Z]/) ? e.preventDefault() : null" />
            </div>
          </div>
        </div>

        <!-- 确认密码输入 -->
        <div class="password-input-section">
          <div class="pin-header">
            <div class="input-label">{{ $t("f_confirm_password") }}</div>
            <svg-icon :name="showConfirmPassword ? 'visible' : 'invisible'" class="text-[16px] theme-svg-color-dark" @click="toggleConfirmPasswordVisibility" />
          </div>
          <div class="pin-input-container">
            <div v-for="(_, index) in 6" :key="`confirm-${index}`" class="pin-input"
              :class="{ 'first': index === 0, 'last': index === 5 }">
              <input :type="showConfirmPassword ? 'text' : 'password'" maxlength="1" class="pin-input-field"
                v-model="confirmPassword[index]" @input="handlePinInput('confirm', index, $event)"
                @keydown="handleBackspace('confirm', index, $event)" inputmode="numeric" pattern="[0-9]*"
                @keypress="e => e.key.match(/[a-zA-Z]/) ? e.preventDefault() : null"
                :ref="el => { if (el) confirmPasswordInputs[index] = el as HTMLInputElement }" />
            </div>
          </div>
        </div>

        <!-- 两个密码框都输入后才验证,且不为"" -->
        <div class="input-verify"
          v-show="!isFormValid && newPassword.join('').length === 6 && confirmPassword.join('').length === 6">
          <svg-icon class="text-[14px] text-white" name="warning" />
          <span class="text-[#f8a40d] text-[12px]">{{ $t("f_password_mismatch_error") }}</span>
        </div>
      </div>

      <!-- 注意事项 -->
      <div class="notice-section">
        <div class="notice-text">{{ $t("f_password_protection_notice") }}</div>
      </div>

      <!-- 确认按钮 -->
      <div class="button-section">
        <button v-scaleTap class="confirm-button" :class="{ disabled: !isFormValid }" :disabled="!isFormValid"
          @click="handleConfirm">
          {{ $t("f_confirm") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="SetPassword">
import { ref, computed, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import router from "@/router/index";
import { showTipModel } from "@/components/TipModel";
import NavBar from "@/components/NavBar/index.vue";
import { bindJyPasswordApi } from "@/api/withdraw";
import { useCachedViewStoreHook } from "@/store/modules/cachedView";

const { t } = useI18n();

// 响应式数据
const newPassword = ref(['', '', '', '', '', '']);
const confirmPassword = ref(['', '', '', '', '', '']);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const newPasswordInputs = ref<HTMLInputElement[]>([]);
const confirmPasswordInputs = ref<HTMLInputElement[]>([]);

// 计算属性
const isFormValid = computed(() => {
  const newPass = newPassword.value.join('');
  const confirmPass = confirmPassword.value.join('');
  return newPass.length === 6 && confirmPass.length === 6 && newPass === confirmPass;
});

// 方法
const toggleNewPasswordVisibility = () => {
  showNewPassword.value = !showNewPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// PIN码输入处理（参考withdraw2/index.vue）
const handlePinInput = (type: 'new' | 'confirm', index: number, event: any) => {
  const value = event.target.value;
  const currentPassword = type === 'new' ? newPassword.value : confirmPassword.value;
  const currentInputs = type === 'new' ? newPasswordInputs.value : confirmPasswordInputs.value;

  if (value.length <= 1) {
    currentPassword[index] = value;
    // 自动跳到下一个输入框
    if (value && index < 5) {
      const nextInput = currentInputs[index + 1];
      if (nextInput) nextInput.focus();
    }
  }
};

// 处理退格键（参考withdraw2/index.vue）
const handleBackspace = (type: 'new' | 'confirm', index: number, event: KeyboardEvent) => {
  const currentPassword = type === 'new' ? newPassword.value : confirmPassword.value;
  const currentInputs = type === 'new' ? newPasswordInputs.value : confirmPasswordInputs.value;

  if (event.key === 'Backspace' && !currentPassword[index] && index > 0) {
    // 如果当前输入为空且按下退格键，跳到前一个输入框
    const prevInput = currentInputs[index - 1];
    if (prevInput) {
      prevInput.focus();
      currentPassword[index - 1] = '';
    }
  }
};

const handleConfirm = async () => {
  if (!isFormValid.value) {
    if (newPassword.value.join('').length < 6) {
      showTipModel({
        type: 1,
        icon: "fail",
        title: t("f_password_length_error")
      });
      return;
    }

    if (confirmPassword.value.join('').length < 6) {
      showTipModel({
        type: 1,
        icon: "fail",
        title: t("f_confirm_password_length_error")
      });
      return;
    }

    if (newPassword.value.join('') !== confirmPassword.value.join('')) {
      showTipModel({
        type: 1,
        icon: "fail",
        title: t("f_password_mismatch_error")
      });
      return;
    }
  }

  const { code, data }: any = await bindJyPasswordApi({
    jyPassword: newPassword.value.join('')
  });
  if (code == 200) {
    showTipModel({
      type: 2,
      icon: "success",
      title: t("f_password_set_success"),
      subTitle: t("f_password_set_success_tip"),
      yesBtnText: t("f_confirm"),
      success:  () => {
        // 清理withdraw2组件的缓存，防止出现重复界面
        useCachedViewStoreHook().delCachedView({ name: 'withdraw2' } as any);
        
        
        router.push('/manage-acc');
      }
    });
  } else {
    showTipModel({
      type: 1,
      icon: "fail",
      title: t("f_password_set_failed"),
      subTitle: t("f_password_set_failed_tip")
    });
  }

  
};
</script>

<style lang="scss" scoped>
.password-container {
  min-height: 100vh;
  position: relative;
  padding-bottom: 100px;
}

.content {
  padding: 0 16px;
}

.info-section {
  margin: 15px 0;

  .info-text {
    font-size: 14px;
    color: $theme-text-color-bright;
    font-weight: bold;
    line-height: 1.5;
  }
}

.password-section {
  margin-top: 10px;
  .password-label {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-black);
    margin-bottom: 15px;
  }

  .input-verify {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
  }
}

.password-input-section {
  margin-bottom: 14px;

  .pin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;

    .input-label {
      font-size: 14px;
      // font-weight: 600;
      color: #666666;
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
      background-color: rgb(255, 255, 255);
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #e4e4e4;

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
        font-size: 20px;
        color: var(--text-black);
        caret-color: var(--primary-color);
      }
    }
  }
}

.notice-section {
  margin: 20px 0;
  background-color: white;
  border: 1px solid rgb(235, 234, 234);
  border-radius: 8px;
  padding: 10px 7px;

  .notice-text {
    font-size: 12px;
    // font-weight: bold;
    color: rgb(238, 0, 0);
    line-height: 1.5;
  }
}

.button-section {
  margin-top: 30px;

  .confirm-button {
    @extend .theme-btn;
    width: 100%;
    height: 40px;
    border: none;
    transition: all 0.2s ease;
    background-color: var(--primary-color);
    
    &.disabled {
      background: #a1b5f5;
      color: white;
      cursor: not-allowed;
    }
  }
}
</style>