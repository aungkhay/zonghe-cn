<template>
  <van-popup v-model:show="isShow" style="background-color: transparent">
   
      <div class="mian-box">
        <div v-if="loginProps.forgotPwdShow == false">
          <div class="tab-btn">
            <div
              v-if="useUserStoreHook().isDLApp == false"
              class="tab-btn-item cursor-pointer"
              :class="{ active: loginProps.tabCurrent === 'register' }"
              @click="loginProps.tabCurrent = 'register'"
            > 
              <svg-icon class="text-[20px] text-[var(--primary-color)]" name="reg" />
              {{ t("110001") }}
            </div>
            <div 
              class="tab-btn-item cursor-pointer"
              :class="{ active: loginProps.tabCurrent === 'login' }"
              @click="loginProps.tabCurrent = 'login'"
            > 
              <svg-icon class="text-[20px] text-[var(--primary-color)]" name="login" />
              {{ t("110000") }}
            </div>
           
          </div>
          <!-- 登录模块 -->
          <div class="login-box" v-if="loginProps.tabCurrent == 'login'">
            <div class="input-item bg-white rounded-md">
              <svg-icon
                class="text-[20px] text-[var(--primary-color)]"
                name="icon_user"
              />
              <input
                @input="verify"
                id="lnUsername"
                v-model="loginProps.formData.lnUsername"
                :placeholder="t('f_user_name')"
                type="text"
                maxlength="16"
                autocomplete="off"
              />
              <svg-icon
                class="text-[20px] text-[var(--primary-color)] mt-[5px]"
                name="icon_delete"
                v-if="loginProps.formData.lnUsername != ''"
                @click="loginProps.formData.lnUsername = ''"
              />
              <div
                class="input-verify"
                v-show="loginProps.verifyData.lnUsername == 'error'"
              >
                <svg-icon class="text-[14px] text-[var(--primary-color)]" name="warning" />
                <span>{{ $t("103006") }}</span>
              </div>
            </div>

            <div class="input-item bg-white rounded-md">
              <svg-icon
                class="text-[20px] text-[var(--primary-color)]"
                name="icon_psw"
              />
              <input
                @input="verify"
                id="lnPassword"
                v-model="loginProps.formData.lnPassword"
                :placeholder="t('f_password')"
                :type="loginProps.hidePwdInput ? 'password' : 'text'"
                maxlength="16"
                autocomplete="new-password"
              />
              <svg-icon
                class="text-[22px] text-[var(--primary-color)] mt-[5px] mr-[5px]"
                name="icon_delete"
                v-if="loginProps.formData.lnPassword != ''"
                @click="loginProps.formData.lnPassword = ''"
              />
              <svg-icon
                class="text-[14px] text-[var(--primary-color)]"
                :name="loginProps.hidePwdInput ? 'invisible' : 'visible'"
                @click="loginProps.hidePwdInput = !loginProps.hidePwdInput"
              />

              <div
                class="input-verify"
                v-show="loginProps.verifyData.lnPassword == 'error'"
              >
                <svg-icon class="text-[14px] text-[var(--primary-color)]" name="warning" />
                <span>{{ $t("103009") }}</span>
              </div>
            </div>

            <div v-if="props.captcha" class="flex items-center bg-white rounded-md space-x-2 h-8 my-3">
              <span class="ml-2"><van-icon name="certificate" size="18" class="text-[var(--primary-color)]" /></span>
              <div class="w-[100px] flex-1">
                <input 
                    v-model="loginProps.formData.code"
                    type="text" 
                    :placeholder="t('reset_password.enter_verification_code')" 
                    class="flex-1"
                >
              </div>
              <div @click="getCodeStatus">
                <img :src="loginProps.codeImg" alt="" class="rounded-r-md h-8">
              </div>
            </div>
              
            <div class="rem-row">
              <van-checkbox v-model="loginProps.formData.lnRemenber">
                <template #icon="props">
                  <svg-icon class="text-[20px] text-[var(--primary-color)]" :name="loginProps.formData.lnRemenber ? 'check' : 'uncheck'" />
                </template>
                <span>{{
                  $t("103002")
                }}</span>
              </van-checkbox>
              <!-- <span
                @click="useUserStoreHook().openForgetPwd()"
                class="cursor-pointer"
              >
                {{ $t("103003") }}
              </span> -->
            </div>

            <van-button
              class="theme-btn mt-[4px]"
              type="default"
              :disabled="loginProps.submitLock"
              @click="toSubmit()"
              >{{ $t("110000") }}</van-button
            >
          </div>

          <!-- 注册模块 -->
          <div class="register-box" v-if="loginProps.tabCurrent == 'register' && useUserStoreHook().isDLApp == false">
            <div class="input-item bg-white rounded-md">
              <svg-icon
                class="text-[20px] text-[var(--primary-color)]"
                name="icon_user"
              />
              <input
                @input="verify"
                id="regUsername"
                v-model="loginProps.formData.regUsername"
                :placeholder="t('f_user_name')"
                type="text"
                maxlength="16"
                autocomplete="off"
              />
              <svg-icon
                class="text-[20px] text-[var(--primary-color)] mt-[5px]"
                name="icon_delete"
                v-if="loginProps.formData.regUsername != ''"
                @click="loginProps.formData.regUsername = ''"
              />
              <div
                class="input-verify"
                v-show="loginProps.verifyData.regUsername == 'error'"
              >
                <svg-icon class="text-[14px]" name="warning" />
                <span>{{ $t("103006") }}</span>
              </div>
            </div>

            <div class="input-item bg-white rounded-md">
              <svg-icon
                class="text-[20px] text-[var(--primary-color)]"
                name="icon_psw"
              />
              <input
                @input="verify"
                id="regPassword"
                v-model="loginProps.formData.regPassword"
                :placeholder="t('f_password')"
                :type="loginProps.hidePwdInput ? 'password' : 'text'"
                maxlength="16"
                autocomplete="new-password"
              />
              <svg-icon
                class="text-[20px] text-[var(--primary-color)] mt-[5px]"
                name="icon_delete"
                v-if="loginProps.formData.regPassword != ''"
                @click="loginProps.formData.regPassword = ''; loginProps.verifyData.regPassword = 'none';"
              />
              <svg-icon
                class="text-[14px] text-[var(--primary-color)]"
                :name="loginProps.hidePwdInput ? 'invisible' : 'visible'"
                @click="loginProps.hidePwdInput = !loginProps.hidePwdInput"
              />

              <div
                class="input-verify"
                v-show="loginProps.verifyData.regPassword == 'error'"
              >
                <svg-icon class="text-[14px]" name="warning" />
                <span>{{ $t("103009") }}</span>
              </div>
            </div>

            <div class="flex items-center mt-[-5px] mb-[15px]">
                 <span class="strength-text">{{ $t('strength') }}</span>
                 <div v-for="item in 4" :key="item"  class= "ml-[5px] strength" :class="{'active': item <= pwdStrength}"></div>
            </div>

            <div class="input-item bg-white rounded-md">
              <svg-icon
                class="text-[20px] text-[var(--primary-color)]"
                name="icon_psw"
              />
              <input
                @input="verify"
                id="regRePassword"
                v-model="loginProps.formData.regRePassword"
                :placeholder="t('f_password_confirm')"
                :type="loginProps.hideRePwdInput ? 'password' : 'text'"
                maxlength="16"
                autocomplete="new-password"
              />
              <svg-icon
                class="text-[20px] text-[var(--primary-color)] mt-[5px]"
                name="icon_delete"
                v-if="loginProps.formData.regRePassword != ''"
                @click="loginProps.formData.regRePassword = ''; loginProps.verifyData.regRePassword = 'none'"
              />
              <svg-icon
                class="text-[14px] text-[var(--primary-color)]"
                :name="loginProps.hideRePwdInput ? 'invisible' : 'visible'"
                @click="loginProps.hideRePwdInput = !loginProps.hideRePwdInput"
              />

              <div
                class="input-verify"
                v-show="loginProps.formData.regRePassword && loginProps.formData.regPassword !== loginProps.formData.regRePassword"
              >
                <svg-icon class="text-[14px]" name="warning" />
                <span>{{ $t("103010") }}</span>
              </div>
            </div>
<!-- 
            <div class="theme-input-box input-item">
              <svg-icon class="text-[20px]" name="baxi" />
              <div class="area-code whitespace-nowrap">+55</div>
              <input
                @input="verify"
                id="regPhone"
                v-model="loginProps.formData.regPhone"
                :placeholder="$t('please_enter_phone_number')"
                type="number"
                maxlength="16"
                autocomplete="new-phone"
              />
              <svg-icon
                class="text-[20px] theme-svg-color-dark mt-[5px]"
                name="icon_delete"
                v-if="loginProps.formData.regPhone != ''"
                @click="loginProps.formData.regPhone = ''"
              />
              <div
                class="input-verify"
                v-show="loginProps.verifyData.regPhone == 'error'"
              >
                <svg-icon class="text-[14px]" name="warning" />
                <span>{{ $t("please_enter_valid_phone") }}</span>
              </div>
            </div> -->

            <div class="input-item bg-white rounded-md">
              <svg-icon class="text-[20px]" name="id" />
              <input
                @input="verify"
                id="regRealName"
                v-model="loginProps.formData.regRealName"
                :placeholder="$t('please_enter_real_name')"
                type="text"
                maxlength="255"
                autocomplete="new-name"
              />
              <svg-icon
                class="text-[20px] text-[var(--primary-color)] mt-[5px]"
                name="icon_delete"
                v-if="loginProps.formData.regRealName != ''"
                @click="loginProps.formData.regRealName = ''"
              />
              <div
                class="input-verify"
                v-show="loginProps.verifyData.regRealName == 'error'"
              >
                <svg-icon class="text-[14px]" name="warning" />
                <span>{{ $t("please_enter_real_name") }}</span>
              </div>
            </div>
            <div class="theme-input-box input-item" v-if="loginProps.codeShow">
              <svg-icon
                class="text-[20px] text-[var(--primary-color)]"
                name="icon_code"
              />
              <input
                @input="verify"
                id="code"
                v-model="loginProps.formData.code"
                placeholder="code"
                type="text"
                maxlength="4"
                autocomplete="new-verification-code"
              />
              <svg-icon
                class="text-[20px] text-[var(--primary-color)] mt-[5px]"
                name="icon_delete"
                v-if="loginProps.formData.code != ''"
                @click="loginProps.formData.code = ''"
              />
              <div
                class="input-verify"
                v-show="loginProps.verifyData.code == 'error'"
              >
                <svg-icon class="text-[14px]" name="warning" />
                <span>{{ $t("120005") }}</span>
              </div>
            </div>
            <div v-if="loginProps.codeShow" class="flex justify-center">
              <img :src="loginProps.codeImg" alt="">
            </div>

            <div class="flex items-center bg-white rounded-md space-x-2 h-8 my-3">
              <span class="ml-2"><van-icon name="certificate" size="18" class="text-[var(--primary-color)]" /></span>
              <div class="w-[100px] flex-1">
                <input 
                    v-model="loginProps.formData.code"
                    type="text" 
                    :placeholder="t('reset_password.enter_verification_code')" 
                    class="flex-1"
                >
              </div>
              <div @click="getCodeStatus">
                <img :src="loginProps.codeImg" alt="" class="rounded-r-md h-8">
              </div>
            </div>

            <div class="flex">
              <van-checkbox v-model="loginProps.formData.regAgree">
                <template #icon="props">
                  <svg-icon class="text-[20px] text-[var(--primary-color)]" :name="loginProps.formData.regAgree ? 'check' : 'uncheck'" />
                  </template
              ></van-checkbox>
              <div class="flex ml-[5px] items-center">
                <span class="agree-text">{{ $t("103007") }}</span>
                <span class="ml-[5px] agree-text-link" @click="showAgreeNode()">{{
                  $t("103008")
                }}</span>
              </div>
            </div>

            <van-button
              class="theme-btn btn-submit mt-[4px]"
              type="default"
              :disabled="loginProps.submitLock"
              @click="toSubmit()"
              >{{ $t("110001") }}</van-button
            >
          </div>

          <div class="demo-tab" v-if="false">
            <div class="flex justify-center items-center w-full" v-if="loginProps.tabCurrent == 'login'">
              <span 
                v-scaleTap
                @click="loginProps.tabCurrent = 'register'"
              >
                {{ $t("110001") }}</span
              >
            </div>
            <div class="flex justify-center items-center w-full" v-if="loginProps.tabCurrent == 'register'">
              <span 
                v-scaleTap
                @click="loginProps.tabCurrent = 'login'"
              >
                {{ $t("110000") }}</span
              >
            </div>
          </div>
          <!-- 添加谷歌登录按钮 -->
          <!-- <div class="flex justify-center items-center w-full mt-[10px]">
            <div 
              v-scaleTap
              class="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              @click="handleGoogleLogin"
            >
              <svg-icon class="theme-svg-color text-[36px]" name="google" />
            </div>
          </div> -->
        </div>
        <div v-if="loginProps.forgotPwdShow == true">
          <ForgotPwd @showLoginBox="showLoginBox"></ForgotPwd>
        </div>
      
      </div>
    

    <svg-icon
          v-scaleTap
          class="text-[30px] theme-svg-color-light box-close"
          name="close"
          @click="closeLoginBox()"
    />
    
  </van-popup>

  <ExplainPop ref="explainPop"></ExplainPop>
</template>

<script setup lang="ts" name="login">
import ForgotPwd from "@/components/Login/forgotPwd.vue";
import ExplainPop from "@/components/ExplainPop/index.vue";
import { ref, computed, defineEmits, reactive, defineExpose, watch, nextTick } from "vue";
import Common from "@/utils/common/common";
import Base64 from "base-64";
import { loginApi, registerApi, getCode } from "@/api/user/index";
import { useUserStoreHook } from "@/store/modules/user";
import router from "@/router/index";
import { useI18n } from "vue-i18n";
import { showTipModel } from "@/components/TipModel/index.js";
import { useRoute } from "vue-router";
import common from "@/utils/common/common";

// 谷歌登录相关
import { googleTokenLogin } from 'vue3-google-login'

const props = defineProps({
  captcha: Boolean
});
const { t, locale } = useI18n();
const route = useRoute();
// 获取地址栏参数
const { uId, sId, isB }: any = route.query;
const emit = defineEmits(["homeInit"]);

const explainPop = ref();

// 监听store中的clearLoginForm状态，当为true时清空表单
watch(() => useUserStoreHook().clearLoginForm, (newVal) => {
  if (newVal) {
    clearFormData();
    // 重置状态
    useUserStoreHook().resetClearLoginForm();
  }
});

// 定义变量
let loginProps = ref({
  tabCurrent: "login",
  forgotPwdShow: false,
  formData: {
    lnUsername: "",
    lnPassword: "",
    lnRemenber: true,
    // 验证码
    code: '',
    uuid: '',
    regUsername: "",
    regPassword: "",
    regRePassword: "",
    regAgree: true,
    regPhone: "",
    regRealName: ""
  },
  verifyData: {
    lnUsername: "",
    lnPassword: "",
    code: '',
    regUsername: "",
    regPassword: "",
    regRePassword: "",
    regPhone: "",
    regRealName: ""
  },
  submitLock: false,
  hidePwdInput: true,
  hideRePwdInput: true,
  codeShow: false,
  codeImg: '',
  showXX: true // 是否显示xx
});

const isShow = computed(() => {
  if (useUserStoreHook().showLogin == true) {
    loginProps.value.forgotPwdShow = false;
    loginProps.value.tabCurrent = useUserStoreHook().loginTabCurrent;
    getCodeStatus();
  }
  return useUserStoreHook().showLogin;
});

const getCodeStatus = async () => {
  const { code, data }: any = await getCode();
  if (code === 200) {
    loginProps.value.codeShow = data.data.captchaEnabled;
    loginProps.value.formData.uuid = data.data.uuid;
    loginProps.value.codeImg = `data:image/jpeg;base64,${data.data.img}`;
  }
};

const showAgreeNode = () => {
  explainPop.value.show(t("103011"), t("103012"));
};

const verify = e => {
  if (loginProps.value.verifyData[e.target.id] == "" && e.target.value == "") {
    loginProps.value.verifyData[e.target.id] = "none";
    return false;
  }
  let curValue = e.target.value;
  switch (e.target.id) {
    case "lnUsername":
      if (curValue.match(/^[a-zA-Z0-9_-]{4,16}$/) == null) {
        loginProps.value.verifyData[e.target.id] = "error";
      } else {
        loginProps.value.verifyData[e.target.id] = "yes";
      }
      break;
    case "lnPassword":
      if (curValue.match(/^[a-zA-Z0-9_-]{6,16}$/) == null) {
        loginProps.value.verifyData[e.target.id] = "error";
      } else {
        loginProps.value.verifyData[e.target.id] = "yes";
      }
      break;

    case "regUsername":
      if (curValue.match(/^[a-zA-Z0-9_-]{4,16}$/) == null) {
        loginProps.value.verifyData[e.target.id] = "error";
      } else {
        loginProps.value.verifyData[e.target.id] = "yes";
      }
      break;
    case "regPassword":
      if (curValue == "") {
        loginProps.value.verifyData[e.target.id] = "none";
      } else if (curValue.match(/^[a-zA-Z0-9_-]{6,16}$/) == null) {
        loginProps.value.verifyData[e.target.id] = "error";
      } else {
        loginProps.value.verifyData[e.target.id] = "yes";
      }
      break;
    case "code":
      if (curValue.match(/^[a-zA-Z0-9]{4}$/) == null) {
        loginProps.value.verifyData[e.target.id] = "error";
      } else {
        loginProps.value.verifyData[e.target.id] = "yes";
      }
      break;
    case "regRePassword":
      if (loginProps.value.verifyData["regPassword"] == "yes") {
        if (curValue == "") {
          loginProps.value.verifyData[e.target.id] = "none";
        } else if (e.target.value !== loginProps.value.formData["regPassword"]) {
          loginProps.value.verifyData[e.target.id] = "error";
        } else {
          loginProps.value.verifyData[e.target.id] = "yes";
        }
      }
      break;
    case "regPhone":
      if (curValue.match(/^[0-9]{11}$/) == null) {
        loginProps.value.verifyData[e.target.id] = "error";
      } else {
        loginProps.value.verifyData[e.target.id] = "yes";
      }
      console.log("loginProps.value.verifyData[e.target.id]",loginProps.value.verifyData[e.target.id])
      break;
    case "regRealName":
      // 选填字段：如果为空则设为 "none"，有内容则验证长度
      if (curValue.trim() === "") {
        loginProps.value.verifyData[e.target.id] = "none";
      } else if (curValue.length < 2) {
        loginProps.value.verifyData[e.target.id] = "error";
      } else {
        loginProps.value.verifyData[e.target.id] = "yes";
      }
  }
  loginProps.value.formData[e.target.id] = e.target.value;
};


let isFromRegister = false;

const toSubmit = async (isBozhuLogin: boolean = false) => {
  // loginProps.value.submitLock = true;
  // 设置是否博主
  useUserStoreHook().changeBozhu(isBozhuLogin);

  let initUrl = Common.getStorage("initUrl");
  let initHost = Common.getStorage("initHost");
  if (!initUrl) {
    initUrl = window.location.href;
  }
  if (!initHost) {
    initHost = window.location.hostname;
  }
  let regData: any = {
    grantType: "password",
    clientId: import.meta.env.VITE_CLIENT_ID,
    host: initHost
  };

  if (loginProps.value.tabCurrent == "register") {
    if (loginProps.value.verifyData.regUsername != "yes") {
      showTipModel({
        type: 1,
        icon: "fail",
        title: t("f_username_error")
      });
      loginProps.value.submitLock = false;
      return false;
    }
    
    if (loginProps.value.verifyData.regPassword != "yes") {
      showTipModel({
        type: 1,
        icon: "fail",
        title: t("f_password_error")
      });
      loginProps.value.submitLock = false;
      return false;
    }
    
    if (loginProps.value.verifyData.regRePassword != "yes") {
      showTipModel({
        type: 1,
        icon: "fail",
        title: t("f_confirm_password_error")
      });
      loginProps.value.submitLock = false;
      return false;
    }
    //close by mma
    // if (loginProps.value.verifyData.regPhone != "yes") {
    //   showTipModel({
    //     type: 1,
    //     icon: "fail",
    //     title: t("f_phone_error")
    //   });
    //   loginProps.value.submitLock = false;
    //   return false;
    // }
    
    // regRealName 为选填字段：只有当有内容但验证失败时才阻止提交
    if (loginProps.value.formData.regRealName && loginProps.value.formData.regRealName.trim() !== "" && loginProps.value.verifyData.regRealName === "error") {
      showTipModel({
        type: 1,
        icon: "fail",
        title: t("f_real_name_error")
      });
      loginProps.value.submitLock = false;
      return false;
    }
    
    if (loginProps.value.codeShow && loginProps.value.verifyData.code != "yes") {
      showTipModel({
        type: 1,
        icon: "fail",
        title: t("f_verification_code_error")
      });
      loginProps.value.submitLock = false;
      return false;
    }

    if (loginProps.value.formData.regAgree != true) {
      showTipModel({
        type: 1,
        icon: "fail",
        title: t("190123")
      });

      loginProps.value.submitLock = false;
      return false;
    }

    regData.username = loginProps.value.formData.regUsername;
    regData.password = loginProps.value.formData.regPassword;
    //close by mma
   // regData.mobile = loginProps.value.formData.regPhone;
    regData.realName = loginProps.value.formData.regRealName;

    //将当前网页url作为regUrl参数
    regData.regUrl = window.location.href;

    if (loginProps.value.formData.code) {
      regData.code = loginProps.value.formData.code;
      regData.uuid = loginProps.value.formData.uuid;
    }

    // if (Common.getStorage("sId")) {
    //   regData.salesmanId = Common.getStorage("sId");
    //   //去掉非数字
    //   regData.salesmanId = regData.salesmanId.replace(/\D/g, "");
      
    // }else{
    //   regData.salesmanId = null;
    // }

    // if(!regData.salesmanId){
    //   if (Common.getStorage("uId")) {
    //     regData.parentId = Common.getStorage("uId");
    //     //去掉非数字
    //     regData.parentId = regData.parentId.replace(/\D/g, "");
    //   } else  {
    //     regData.parentId = null;
    //   }
    // }
    if (uId) {
      regData.parentId = uId;
    }

    if (isB) {
      regData.isBlogger = isB == "1" ? "true" : "false";
    } else if (Common.getStorage("isB")) {
      regData.isBlogger = Common.getStorage("isB") == "1" ? "true" : "false";
    }
    
    if (isNaN(parseFloat(regData.parentId))) {
      regData.parentId = null;
    }
    
  } else {
    if (
      loginProps.value.verifyData.lnUsername != "yes" ||
      loginProps.value.verifyData.lnPassword != "yes"
    ) {
      if (loginProps.value.verifyData.lnUsername != "yes") {
        showTipModel({
          type: 1,
          icon: "fail",
          title: t("f_username_error")
        });
      } else if (loginProps.value.verifyData.lnPassword != "yes") {
        showTipModel({
          type: 1,
          icon: "fail",
          title: t("f_password_error")
        });
      }
      loginProps.value.submitLock = false;
      return false;
    }
    regData.username = loginProps.value.formData.lnUsername;
    regData.password = loginProps.value.formData.lnPassword;
  }

  if(props.captcha) {
    regData.uuid = loginProps.value.formData.uuid;
    regData.code = loginProps.value.formData.code;
  }

  let method =
    loginProps.value.tabCurrent == "register" ? registerApi : loginApi;

  // console.log("regData", regData);
  let { code, data }: any = await method(regData);
  loginProps.value.submitLock = false;

  if (code == 200) {
    if (loginProps.value.tabCurrent == "register") {
      // // 切换登录免密码 Switch to password-free login
      // loginProps.value.tabCurrent = "login";
      // const { regUsername, regPassword } = loginProps.value.formData;
      // loginProps.value.formData.lnUsername = regUsername;
      // loginProps.value.formData.lnPassword = regPassword;
      // loginProps.value.verifyData.lnUsername = "yes";
      // loginProps.value.verifyData.lnPassword = "yes";
      // // 免用户点击登录直接登录 Log in directly without users clicking on login
      // useUserStoreHook().closeLogin();
      // isFromRegister = true;
      // toSubmit();

      const { user_info, telegram, access_token, client_id } = data.data;
      Common.setStorage("telegram", telegram);
      Common.setStorage("lnUsername", regData.username);
      useUserStoreHook().login(access_token, user_info);
      if (loginProps.value.formData.lnRemenber == true) {
        Common.setStorage("lnPassword", Base64.decode(regData.password));
      } else {
        Common.removeStorage("lnPassword");
      }
      // locale.value = "zh";
      useUserStoreHook().closeLogin();
      router.push("/");
    } else {
      const { user_info, telegram, access_token, client_id } = data.data;
      Common.setStorage("telegram", telegram);
      Common.setStorage("lnUsername", regData.username);
      useUserStoreHook().login(access_token, user_info);
      if (loginProps.value.formData.lnRemenber == true) {
        Common.setStorage("lnPassword", Base64.decode(regData.password));
      } else {
        Common.removeStorage("lnPassword");
      }
      // locale.value = Common.getCurLang() || "zh";
      useUserStoreHook().closeLogin();
      router.push("/");

      // 首页初始化
      emit("homeInit",isFromRegister);
      isFromRegister = false;
    }
  } else if (code == 999999) {
    toSubmit(true);
  } else if (code == 100006) {
    showTipModel({
      type: 1,
      icon: "fail",
      title: t(code)
    });
    getCodeStatus()
  } else if (code == 100003) {
    //清空uId
    showTipModel({
      type: 1,
      icon: "fail",
      title: t(code)
    });
    Common.removeStorage("uId");
  }
  else {
    showTipModel({
      type: 1,
      icon: "fail",
      title: t(code)
    });
  }

  loginProps.value.submitLock = false;
};

const closeLoginBox = () => {
  useUserStoreHook().closeLogin();
};

const showLoginBox = () => {
  loginProps.value.forgotPwdShow = false;
};

// 谷歌登录处理方法
const handleGoogleLogin = () => {
  // 使用 vue3-google-login 触发谷歌登录
  googleTokenLogin()
    .then((response: any) => {
      console.log('谷歌登录成功:', response);
      // 调用后端API处理谷歌登录
      processGoogleLogin(response.access_token);
    })
    .catch((error: any) => {
      console.error('谷歌登录失败:', error);
      showTipModel({
        type: 1,
        icon: "fail",
        title: t("f_google_login_failed") || "谷歌登录失败"
      });
    });
};

// 处理谷歌登录响应 Handling Google Sign-in Response
const processGoogleLogin = async (googleToken: string) => {
  try {
    let initUrl = Common.getStorage("initUrl") || window.location.href;
    let initHost = Common.getStorage("initHost") || window.location.hostname;
    
    let googleData: any = {
      grantType: "google",
      clientId: import.meta.env.VITE_CLIENT_ID,
      host: initHost,
      token: googleToken
    };

    // 添加推荐人信息 Add referrer information
    if (Common.getStorage("sId")) {
      googleData.salesmanId = Common.getStorage("sId").replace(/\D/g, "");
    } else if (Common.getStorage("uId")) {
      googleData.parentId = Common.getStorage("uId").replace(/\D/g, "");
    }

    // 添加博主标识 Add blogger logo
    if (isB) {
      googleData.isBlogger = isB == "1" ? "true" : "false";
    } else if (Common.getStorage("isB")) {
      googleData.isBlogger = Common.getStorage("isB") == "1" ? "true" : "false";
    }

    //将当前网页url作为regUrl参数 Pass the current web page URL as the regUrl parameter
    googleData.regUrl = window.location.href;

    loginProps.value.submitLock = true;

    // 先尝试登录
    let { code, data }: any = await loginApi(googleData);
    
    if (code == 200) {
      // 登录成功
      const { user_info, telegram, access_token, client_id } = data.data;
      Common.setStorage("telegram", telegram);
      useUserStoreHook().login(access_token, user_info);
      locale.value = Common.getCurLang() || "zh";
      useUserStoreHook().closeLogin();
      router.push("/");
      
      console.log('谷歌登录成功完成');
      emit("homeInit", false);
    } 

    else {
      throw new Error(t(code) || "登录失败");
    }
  } catch (error: any) {
    console.error('处理谷歌登录失败:', error);
    showTipModel({
      type: 1,
      icon: "fail",
      title: error.message || t("f_google_login_failed") || "谷歌登录失败"
    });
  } finally {
    loginProps.value.submitLock = false;
  }
};

// 清空登录和注册表单数据
const clearFormData = () => {
  // 清空表单数据
  loginProps.value.formData = {
    lnUsername: loginProps.value.formData.lnUsername, //不变
    lnPassword: "",
    lnRemenber: true,
    code: '',
    uuid: '',
    regUsername: "",
    regPassword: "",
    regRePassword: "",
    regAgree: true,
    regPhone: "",
    regRealName: ""
  };
  
  // 清空验证状态
  loginProps.value.verifyData = {
    lnUsername: loginProps.value.verifyData.lnUsername, //不变
    lnPassword: "",
    code: '',
    regUsername: "",
    regPassword: "",
    regRePassword: "",
    regPhone: "",
    regRealName: ""
  };
  
  // 重置其他状态
  loginProps.value.submitLock = false;
  loginProps.value.hidePwdInput = true;
  loginProps.value.hideRePwdInput = true;
  

};

// 移除readonly属性防止浏览器自动填充
const removeReadonly = (event: Event) => {
  const target = event.target as HTMLInputElement;
  target.removeAttribute('readonly');
};

// 暴露方法给外部调用
defineExpose({
  clearFormData
});

//获取密码强度
const pwdStrength = computed(() => {
  const password = loginProps.value.formData.regPassword;
  let score = 0
  if (password.length >= 8) {
    score += 1
  }

  if (/[a-zA-Z]/.test(password)) {
    score += 1
  }

  if (/\d/.test(password)) {
    score += 1
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1
  }
  // console.log("pwdStrength",score)
  return score
})

</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
