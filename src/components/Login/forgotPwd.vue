<template>
  <van-popup v-model:show="isShow" style="background-color: transparent">
  
    <div class="mian-box">


      <!-- 标题 -->
      <div class="forgot-pwd-title">{{ $t("f_forgot_password") }}</div>
      <div class="step-container">
        <div class="step-indicator">
          <div class="step-wrapper">
            <div class="step-circle" :class="{ 'active': forgotPwdProps.currentStep >= 1 }">1</div>
            <div class="step-label">{{ $t("f_verify_id") }}</div>
          </div>
          <div class="step-line" :class="{ 'active': forgotPwdProps.currentStep >= 2 }"></div>
          <div class="step-wrapper">
            <div class="step-circle" :class="{ 'active': forgotPwdProps.currentStep >= 2 }">2</div>
            <div class="step-label">{{ $t("f_reset_password") }}</div>
          </div>
          <div class="step-line" :class="{ 'active': forgotPwdProps.currentStep >= 3 }"></div>
          <div class="step-wrapper">
            <div class="step-circle" :class="{ 'active': forgotPwdProps.currentStep >= 3 }">3</div>
            <div class="step-label">{{ $t("f_complete") }}</div>
          </div>
        </div>
      </div>
      <!-- step 1 -->
      <div class="step-1" v-if="forgotPwdProps.currentStep == 1">
        <div class="step-content">
          <div class="bg-white rounded-md input-item" >
            <svg-icon class="text-[20px] text-[var(--primary-color)]" name="icon_user"/>
            <input @input="verify" id="fgUsername" v-model="forgotPwdProps.formData.fgUsername"
              :placeholder="$t('f_user_name')" type="text" maxlength="16" autocomplete="off" class="ant-input" style="width:80px" />
            <svg-icon class="text-[20px] text-[var(--primary-color)] mt-[5px]" name="icon_delete"
              v-if="forgotPwdProps.formData.fgUsername != ''" @click="forgotPwdProps.formData.fgUsername = ''" />
            <div class="input-verify" v-show="forgotPwdProps.verifyData.fgUsername == 'error'">
              <svg-icon class="text-[14px]" name="warning" />
              <span>{{ $t("103006") }}</span>
            </div>
          </div>

          <div class="bg-white rounded-md input-item">
            <svg-icon class="text-[20px] text-[var(--primary-color)]" name="phone" />
            <input @input="verify" id="mobile" v-model="forgotPwdProps.formData.mobile" :placeholder="$t('103000')" type="text"
              class="ant-input" />
            <svg-icon class="text-[20px] text-[var(--primary-color)] mt-[5px]" name="icon_delete"
              v-if="forgotPwdProps.formData.mobile != ''" @click="forgotPwdProps.formData.mobile = ''" />
            <div class="input-verify" v-show="forgotPwdProps.verifyData.mobile == 'error'">
              <svg-icon class="text-[14px]" name="warning" />
              <span>{{ $t("f_11_mobile") }}</span>
            </div>
          </div>

          <div class="demo-tab">
            <div class="raa-demo" v-show="forgotPwdProps.verifyData.fgUsername == 'yes' &&
              forgotPwdProps.raaDemo
              ">
              <svg-icon class="text-[14px]" name="warning" />{{ $t("103016")
              }}<span @click="Common.contactCustomer()"></span>
            </div>
          </div>
        </div>

        <van-button class="theme-btn btn-submit" type="default" @click="toSubmit(1)">{{ $t("f_next") }}</van-button>
      </div>
      <!-- step 2 -->
      <div class="step-2" v-if="forgotPwdProps.currentStep == 2">
        <div class="step-content">
          <!-- 新密码输入 -->
          <div class="bg-white rouned-md input-item">
            <svg-icon class="text-[20px] theme-svg-color-dark" name="icon_psw" />
            <input @input="verify" id="fgPassword" v-model="forgotPwdProps.formData.fgPassword"
              :placeholder="$t('f_new_login_password')" :type="forgotPwdProps.hidePwdInput ? 'password' : 'text'"
              maxlength="16" autocomplete="off" class="ant-input" style="width:80px" />
              <svg-icon class="text-[20px] theme-svg-color-dark mt-[5px]" name="icon_delete"
              v-if="forgotPwdProps.formData.fgPassword != ''" @click="forgotPwdProps.formData.fgPassword = ''" />
              <svg-icon class="text-[14px] theme-svg-color-dark mt-[5px] mr-[5px]"
              :name="forgotPwdProps.hidePwdInput ? 'invisible' : 'visible'"
              @click="forgotPwdProps.hidePwdInput = !forgotPwdProps.hidePwdInput" />

            <div class="input-verify" v-show="forgotPwdProps.verifyData.fgPassword == 'error'">
              <svg-icon class="text-[16px]" name="warning" />
              {{ $t("103009") }}
            </div>
          </div>

          <!-- 确认新密码输入 -->
          <div class="bg-white rouned-md input-item">
            <svg-icon class="text-[20px] theme-svg-color-dark" name="icon_psw" />
            <input @input="verify" id="fgConfirmPassword" v-model="forgotPwdProps.formData.fgConfirmPassword"
              :placeholder="$t('f_confirm_password')" :type="forgotPwdProps.hideConfirmPwdInput ? 'password' : 'text'"
              maxlength="16" autocomplete="off" class="ant-input" style="width:80px" />
            <svg-icon class="text-[20px] theme-svg-color-dark mt-[5px] mr-[5px]" name="icon_delete"
              v-if="forgotPwdProps.formData.fgConfirmPassword != ''"
              @click="forgotPwdProps.formData.fgConfirmPassword = ''" />
            <svg-icon class="text-[14px] theme-svg-color-dark"
              :name="forgotPwdProps.hideConfirmPwdInput ? 'invisible' : 'visible'"
              @click="forgotPwdProps.hideConfirmPwdInput = !forgotPwdProps.hideConfirmPwdInput" />

            <div class="input-verify" v-show="forgotPwdProps.verifyData.fgConfirmPassword == 'error'">
              <svg-icon class="text-[16px]" name="warning" />
              {{ $t("103010") }}
            </div>
          </div>

        
        </div>

          <!-- 添加一个验证码输入框和验证码图片显示框 在同一水平线-->  
          <!-- <div class="flex"> -->
            <div class="flex flex-start">
            
              <div class="bg-white rounded-md input-item">
                <svg-icon class="text-[20px] theme-svg-color-dark" name="icon_code"/>
                <input @input="verify" id="smsCode" v-model="forgotPwdProps.formData.smsCode"
                  :placeholder="$t('f_sms_code')" type="text" maxlength="16" autocomplete="off" style="width: 80px;" />
                  <svg-icon class="text-[20px] theme-svg-color-dark mt-[5px]" name="icon_delete"
                    v-if="forgotPwdProps.formData.smsCode != ''" @click="forgotPwdProps.formData.smsCode = ''" />
                  <div class="w-[20px]" v-if="forgotPwdProps.formData.smsCode == ''"  />
              </div>
              <div class="captcha-container" @click="getSmsCode"> 
                  <img 
                    class="w-[100px] h-[32px]"
                    :src="'data:image/png;base64,' + forgotPwdProps.captchaImageSrc" 
                    alt="验证码"
                  />
              </div>
          </div>

        <van-button class="theme-btn btn-submit" type="default" @click="toSubmit(2)">{{ $t("f_next")
          }}</van-button>
      </div>

      <!-- step 3 -->
      <div class="step-3" v-if="forgotPwdProps.currentStep == 3">
        <!-- <div class="step-3-icon">
          <img :src="`${$imgBasePath}/public/icon_complete.png`" class="w-[60px]">
        </div> -->
        <div class="step-3-content mt-[10px] mb-[20px]" style="color: #043804; font-size: 13px; font-weight: 600;">{{ $t("f_password_reset_success") }} </div>
        <van-button class="theme-btn btn-submit" type="default" @click="toSubmit(3)">{{ $t("f_complete")
          }}</van-button>
      </div>
      

     
      
    </div>

      <svg-icon v-scaleTap class="text-[30px] theme-svg-color-light box-close" name="close"
      @click="useUserStoreHook().closeForgetPwd()" />
  </van-popup>
</template>

<script setup lang="ts">
import { ref, defineEmits, computed } from "vue";
import Common from "@/utils/common/common";
import Base64 from "base-64";
import { useI18n } from "vue-i18n";
import { showTipModel } from "@/components/TipModel/index.js";
import { sendCodeApi, checkAccountNameApi, resetPasswordApi, getCode } from "@/api/user/index";
import { useUserStoreHook } from "@/store/modules/user";

const { t } = useI18n();
const emit = defineEmits(['showLoginBox'])

const isShow = computed(() => {
  return useUserStoreHook().showForgetPwd
})

// 定义变量
let forgotPwdProps = ref({
  currentStep: 1,
  hidePwdInput: true,
  hideConfirmPwdInput: true,
  raaDemo: false,
  captchaImageSrc: "",
  uuid: "",
  formData: {
    fgUsername: "",
    fgPassword: "",
    fgConfirmPassword: "",
    mobile: "",
    smsCode: ""
  },
  verifyData: {
    fgUsername: "",
    fgPassword: "",
    fgConfirmPassword: "",
    mobile: ""
  },
  smsBtnLock: false,
  smsLdTime: 60
});

const verify = e => {
  let curValue = e.target.value;
  
  // 如果输入为空，重置验证状态
  if (!curValue || curValue.trim() === '') {
    forgotPwdProps.value.verifyData[e.target.id] = "";
    forgotPwdProps.value.formData[e.target.id] = curValue;
    return;
  }

  switch (e.target.id) {
    case "fgUsername":
      forgotPwdProps.value.raaDemo = false;
      if (curValue.match(/^[a-zA-Z0-9_-]{4,16}$/) == null) {
        forgotPwdProps.value.verifyData[e.target.id] = "error";
      } else {
        forgotPwdProps.value.verifyData[e.target.id] = "yes";
      }
      break;
    case "mobile":
      // 只允许输入数字
      if (!/^\d*$/.test(curValue)) {
        e.target.value = curValue.replace(/\D/g, '');
        curValue = e.target.value;
      }
      if (curValue.length === 0) {
        forgotPwdProps.value.verifyData[e.target.id] = "";
      } else if (curValue.length !== 11) {
        forgotPwdProps.value.verifyData[e.target.id] = "error";
      } else {
        forgotPwdProps.value.verifyData[e.target.id] = "yes";
      }
      break;
    case "fgPassword":
      if (curValue.match(/^[a-zA-Z0-9_-]{6,16}$/) == null) {
        forgotPwdProps.value.verifyData[e.target.id] = "error";
      } else {
        forgotPwdProps.value.verifyData[e.target.id] = "yes";
      }
      // 当密码改变时，同时验证确认密码
      if (forgotPwdProps.value.formData.fgConfirmPassword) {
        if (curValue !== forgotPwdProps.value.formData.fgConfirmPassword) {
          forgotPwdProps.value.verifyData.fgConfirmPassword = "error";
        } else {
          forgotPwdProps.value.verifyData.fgConfirmPassword = "yes";
        }
      }
      break;
    case "fgConfirmPassword":
      if (!forgotPwdProps.value.formData.fgPassword) {
        forgotPwdProps.value.verifyData[e.target.id] = "error";
      } else if (curValue !== forgotPwdProps.value.formData.fgPassword) {
        forgotPwdProps.value.verifyData[e.target.id] = "error";
      } else {
        forgotPwdProps.value.verifyData[e.target.id] = "yes";
      }
      break;
  }

  forgotPwdProps.value.formData[e.target.id] = curValue;
};
// const sendSms = async () => {
//   if (forgotPwdProps.value.smsBtnLock == true) {
//     return false;
//   }
//   let params = {
//     mobile: forgotPwdProps.value.formData.mobile,
//     type: 5
//   };
//   let { code, data }: any = await sendCodeApi(params);

//   if (code == 200) {
//     forgotPwdProps.value.smsBtnLock = true;
//     let intervalObj = setInterval(function () {
//       forgotPwdProps.value.smsLdTime = forgotPwdProps.value.smsLdTime - 1;
//       if (forgotPwdProps.value.smsLdTime <= 1) {
//         forgotPwdProps.value.smsBtnLock = false;
//         forgotPwdProps.value.smsLdTime = 60;
//         clearInterval(intervalObj);
//       }
//     }, 1000);

//     showTipModel({
//       type: 1,
//       icon: "success",
//       title: t("190119")
//     });
//   }
// };

const toSubmit = async type => {
  if (type == 1) {
    if (forgotPwdProps.value.verifyData.fgUsername != "yes") {
      forgotPwdProps.value.verifyData.fgUsername = "error";
      return false;
    }
    if (forgotPwdProps.value.verifyData.mobile != "yes") {
      forgotPwdProps.value.verifyData.mobile = "error";
      return false;
    }
    let params = {
      userName: forgotPwdProps.value.formData.fgUsername,
      mobile: forgotPwdProps.value.formData.mobile
    };

    // forgotPwdProps.value.formData.mobile = "123";
    // forgotPwdProps.value.currentStep = type + 1;

    let { code, data }: any = await checkAccountNameApi(params);
    if (code == 200) {
      forgotPwdProps.value.uuid = data.data.uuid;
      forgotPwdProps.value.captchaImageSrc = data.data.img;
      // if (!data.mobile) {
      //   forgotPwdProps.value.raaDemo = true;
      // } else {
      // forgotPwdProps.value.formData.mobile = data.mobile;
      forgotPwdProps.value.currentStep = type + 1;
      // }
    } else {
      showTipModel({
        type: 1,
        icon: "fail",
        title: t(code)
      });
      
    }
  }

  if (type == 2) {
    // 验证新密码
    if (forgotPwdProps.value.verifyData.fgPassword != "yes") {
      forgotPwdProps.value.verifyData.fgPassword = "error";
      return false;
    }

    // 验证确认密码
    if (forgotPwdProps.value.verifyData.fgConfirmPassword != "yes") {
      forgotPwdProps.value.verifyData.fgConfirmPassword = "error";
      return false;
    }

    // 检查两次密码是否一致
    if (forgotPwdProps.value.formData.fgPassword !== forgotPwdProps.value.formData.fgConfirmPassword) {
      forgotPwdProps.value.verifyData.fgConfirmPassword = "error";
      showTipModel({
        type: 1,
        icon: "fail",
        title: t("103010")
      });
      return false;
    }

    let params = {
      userName: forgotPwdProps.value.formData.fgUsername,
      mobile: forgotPwdProps.value.formData.mobile,
      uuid: forgotPwdProps.value.uuid,
      code: forgotPwdProps.value.formData.smsCode,
      password: forgotPwdProps.value.formData.fgPassword
    };

    let { code, data }: any = await resetPasswordApi(params);

    if (code == 200) {
      forgotPwdProps.value.currentStep = type + 1;
    } else {
      showTipModel({
        type: 1,
        icon: "fail",
        title: t(code)
      });

      // if(code == 100006){
        //重新获取验证码
        getSmsCode();
      // }
    }
  }

  if (type == 3) {
    //关闭当前弹窗,变为步骤1,并清空数据
    useUserStoreHook().closeForgetPwd();
    forgotPwdProps.value.currentStep = 1;
    forgotPwdProps.value.formData = {
      fgUsername: "",
      fgPassword: "",
      fgConfirmPassword: "",
      mobile: "",
      smsCode: ""
    };
    forgotPwdProps.value.verifyData = {
      fgUsername: "",
      fgPassword: "",
      fgConfirmPassword: "",
      mobile: ""
    };
    emit('showLoginBox');
  }
};

const getSmsCode = async () => {

  let { code, data }: any = await getCode();
  if(code == 200){
    forgotPwdProps.value.captchaImageSrc = data.data.img;
    forgotPwdProps.value.uuid = data.data.uuid;

  }else{
    showTipModel({
      type: 1,
      icon: "fail",
      title: t(code)
    });
  }
}
</script>

<style lang="scss" scoped>
@import "./forgotPwd.scss";
</style>
