<template>
  <!-- 绑卡弹窗 -->
  <van-popup v-model:show="modelProps.bindCardBoxShow" class="popup-transparent"
    overlay-class="withdraw-custom-overlay" :overlay-style="{ top: '0px' }" @close="handleClose">
    <div class="popup-bg bind-card-box">
      <div class="pix-title">
        <span>{{ $t("102037") }}</span>
      </div>

      <div class="select-container">
        <div class="px-2 py-1 border border-[var(--primary-color)] rounded-md">
          <SelectBox :modeType="3" listType="custom" :svgIcons="true" :model="modelProps.cardInfo.pixType"
            :listArr="modelProps.cardType" @change="changePixType" ></SelectBox>
        </div>

        <!-- CNPJ 和 CPF 共用的账号输入框 -->
        <div class="theme-input-box input-item cpf-input" v-if="modelProps.cardInfo.pixType == '0' || modelProps.cardInfo.pixType == '1'">
          <svg-icon name="icon_cpf_white" class=" theme-svg-color-dark input-icon" />
          <input @input="verify" id="accountNumber" 
            :placeholder="modelProps.cardInfo.pixType == '0' ? t('f_cnpj_placeholder') : t('f_enter_11_digit_cpf')" 
            type="text" v-model="modelProps.cardInfo.accountNumber" autocomplete="off" class="ant-input" />
        </div>
        <div class="input-verify" v-show="(modelProps.cardInfo.pixType == '0' || modelProps.cardInfo.pixType == '1') && modelProps.verifyData.accountNumber == 'error'">
          <svg-icon class="text-[14px] theme-svg-color-dark" name="warning" />
          <span>{{ modelProps.cardInfo.pixType == '0' ? t('f_cnpj_format_error') : t("f_cpf_format_error") }}</span>
        </div>

        <!-- CPF 类型才显示姓名输入框 -->
        <!-- <div class="name-input theme-input-box input-item" v-if="modelProps.cardInfo.pixType == '1' && showNameInput">
          <img :src="`${$imgBasePath}/withdraw/icon_bank.png`" class="input-icon">
          <input @input="verify" id="accountName" :placeholder="t('102041')" type="text" @keydown="preventNumbers"
            v-model="modelProps.cardInfo.accountName" autocomplete="off" class="ant-input" />
          <div class="input-verify" v-show="modelProps.verifyData.accountName == 'error'">
            <svg-icon class="text-[14px]" name="warning" />
            <span>{{ $t("f_name_format_error") }}</span>
          </div>
        </div> -->

        <!-- 电话类型输入框 -->
        <div class="theme-input-box input-item phone-input" v-if="modelProps.cardInfo.pixType == '2'">
          <svg-icon name="icon_phone_white" class=" theme-svg-color-dark input-icon" />
          <input @input="verify" id="accountPhone" :placeholder="t('102043')" type="text"
            v-model="modelProps.cardInfo.accountPhone" autocomplete="off" class="ant-input" />
        </div>
        <div class="input-verify" v-show="modelProps.cardInfo.pixType == '2' && modelProps.verifyData.accountPhone == 'error'">
          <svg-icon class="text-[14px] theme-svg-color-dark" name="warning" />
          <span>{{ $t("f_phone_format_error") }}</span>
        </div>

        <!-- 邮箱类型输入框 -->
        <div class="theme-input-box input-item email-input" v-if="modelProps.cardInfo.pixType == '3'">
          <svg-icon name="icon_email_white" class=" theme-svg-color-dark input-icon" />
          <input @input="verify" id="accountEmail" :placeholder="$t('102044')" type="text"
            v-model="modelProps.cardInfo.accountEmail" autocomplete="off" class="ant-input" />
        </div>
        <div class="input-verify" v-show="modelProps.cardInfo.pixType == '3' && modelProps.verifyData.accountEmail == 'error'">
          <svg-icon class="text-[14px] theme-svg-color-dark" name="warning" />
          <span>{{ $t("f_email_format_error") }}</span>
        </div>

        <div class="verification-tip">
          {{ $t("102045") }}
        </div>
      </div>

      <van-button v-scaleTap class="next-button" v-if="verifyPass" @click="submit()" type="default"
        :disabled="modelProps.lockSubmit">{{ $t('f_next') || 'Próximo' }}</van-button>
      <van-button v-scaleTap class="next-button disabled" v-else type="default" @click="tipMsg()">{{ $t('f_next') || 'Próximo'
      }}</van-button>
    </div>
  </van-popup>
</template>
<script setup lang="ts" name="Tools">
import { ref, onMounted, computed, defineEmits } from "vue";
import { useI18n } from "vue-i18n";
import { showTipModel } from "@/components/TipModel/index.js";
import SelectBox from "@/components/SelectBox/index.vue";
import { saveCashoutAccountApi } from "@/api/withdraw/index";

// 多语言
const { t } = useI18n();

const emit = defineEmits(["updateAccountInfo"]);

// 控制是否显示姓名输入框
const showNameInput = ref(true);

const inputCount = ref(0);

// 定义变量
const modelProps = ref({
  pinInputs: '',
  cardType: [
    { key: '0', name: "CNPJ", svg: "icon_cpf_white" },
    { key: '1', name: "CPF", svg: "icon_cpf_white" },
    { key: '2', name: "PHONE", svg: "icon_phone_white" },
    { key: '3', name: "EMAIL", svg: "icon_email_white" },
  ],
  bindCardBoxShow: false,
  lockSubmit: false,
  bindCardMaxCount: 0,
  pixTypeList: [],
  overlayStyle: { 'background-color': 'rgba(0, 0, 0, 0.7)' },
  cardInfo: {
    pixType: '1',
    accountName: null,
    accountNumber: null,
    accountPhone: null,
    accountEmail: null
  },
  verifyData: {
    accountName: "",
    accountNumber: "",

    accountPhone: "",
    accountEmail: ""
  }
});

const preventNumbers = (e: KeyboardEvent) => {
  if (e.key >= '0' && e.key <= '9') {
    e.preventDefault();
  }
};

const verifyPass = computed(() => {

  const _ = inputCount.value;

  console.log(modelProps.value.verifyData);
  
  // 根据不同的PIX类型验证对应的字段
  const pixType = modelProps.value.cardInfo.pixType;
  
  switch (pixType) {
    case '0': // CNPJ
      return modelProps.value.verifyData.accountNumber === "yes";
    case '1': // CPF
      return modelProps.value.verifyData.accountNumber === "yes" 
            // &&  modelProps.value.verifyData.accountName === "yes";
    case '2': // PHONE
      return modelProps.value.verifyData.accountPhone === "yes";
    case '3': // EMAIL
      return modelProps.value.verifyData.accountEmail === "yes";
    default:
      return false;
  }
});

const verify = e => {

  inputCount.value++;
  let curValue = e.target.value;

  console.log(`验证字段: ${e.target.id}, 输入值: "${curValue}"`);

  // 如果输入为空，重置为none状态，不显示错误
  if (curValue.trim() === "") {
    modelProps.value.verifyData[e.target.id] = "none";
    modelProps.value.cardInfo[e.target.id] = e.target.value;
    console.log(`${e.target.id} 输入为空，设置为 none`);
    return false;
  }

  // 声明变量在switch外部
  var strArr = [];
  var newStr;
  var cnpjFormatted;
  const pixType = modelProps.value.cardInfo.pixType;

  switch (e.target.id) {
    case "accountName":
      if (curValue.match(/^[A-Za-zÀ-ÿ\s]{1,50}$/) == null) {
        modelProps.value.verifyData[e.target.id] = "error";
        console.log(`${e.target.id} 验证失败，设置为 error`);
      } else {
        modelProps.value.verifyData[e.target.id] = "yes";
        console.log(`${e.target.id} 验证成功，设置为 yes`);
      }
      break;
    case "accountNumber":
      if (pixType === '0') {
        // CNPJ验证逻辑 - 14位数字，格式：XX.XXX.XXX/XXXX-XX
        curValue = curValue.replace(/\D/g, "");
        cnpjFormatted = curValue;
        
        if (curValue.length > 14) {
          cnpjFormatted = curValue.slice(0, 14);
        }
        
        // 格式化CNPJ
        if (cnpjFormatted.length > 2) cnpjFormatted = cnpjFormatted.slice(0, 2) + '.' + cnpjFormatted.slice(2);
        if (cnpjFormatted.length > 6) cnpjFormatted = cnpjFormatted.slice(0, 6) + '.' + cnpjFormatted.slice(6);
        if (cnpjFormatted.length > 10) cnpjFormatted = cnpjFormatted.slice(0, 10) + '/' + cnpjFormatted.slice(10);
        if (cnpjFormatted.length > 15) cnpjFormatted = cnpjFormatted.slice(0, 15) + '-' + cnpjFormatted.slice(15);
        
        e.target.value = cnpjFormatted;
        
        if (curValue.length < 14 || !cnpjFormatted.match(/^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/)) {
          modelProps.value.verifyData[e.target.id] = "error";
          console.log(`${e.target.id} CNPJ验证失败，设置为 error`);
        } else {
          modelProps.value.verifyData[e.target.id] = "yes";
          console.log(`${e.target.id} CNPJ验证成功，设置为 yes`);
        }
      } else if (pixType === '1') {
        // CPF验证逻辑 - 11位数字，格式：XXX.XXX.XXX-XX
        curValue = curValue.replace(/\D/g, "");

        strArr[0] = curValue.slice(0, 3);
        newStr = strArr[0];
        strArr[1] = curValue.slice(3, 6);
        strArr[2] = curValue.slice(6, 9);
        strArr[3] = curValue.slice(9, 11);
        
        if (strArr[1] != "") {
          newStr += "." + strArr[1];
        }
        if (strArr[2] != "") {
          newStr += "." + strArr[2];
        }
        if (strArr[3] != "") {
          newStr += "-" + strArr[3];
        }
        e.target.value = newStr;

        console.log(`CPF 处理后: "${newStr}", 原始长度: ${curValue.length}`);

        if (curValue.length < 11 || !newStr.match(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/)) {
          modelProps.value.verifyData[e.target.id] = "error";
          showNameInput.value = false;
          console.log(`${e.target.id} CPF验证失败，设置为 error`);
        } else {
          modelProps.value.verifyData[e.target.id] = "yes";
          // 当CPF验证通过时，显示姓名输入框
          showNameInput.value = true;
          console.log(`${e.target.id} CPF验证成功，设置为 yes`);
        }
      }
      break;
    case "accountPhone":
      if (curValue.match(/^[0-9_-]{4,16}$/) == null) {
        modelProps.value.verifyData[e.target.id] = "error";
        console.log(`${e.target.id} 电话验证失败，设置为 error`);
      } else {
        modelProps.value.verifyData[e.target.id] = "yes";
        console.log(`${e.target.id} 电话验证成功，设置为 yes`);
      }
      break;
    case "accountEmail":
      if (curValue.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/) == null) {
        modelProps.value.verifyData[e.target.id] = "error";
        console.log(`${e.target.id} 邮箱验证失败，设置为 error`);
      } else {
        modelProps.value.verifyData[e.target.id] = "yes";
        console.log(`${e.target.id} 邮箱验证成功，设置为 yes`);
      }
      break;
  }

  modelProps.value.cardInfo[e.target.id] = e.target.value;
  console.log(`当前验证状态:`, modelProps.value.verifyData);
};

const changePixType = (key, name) => {
  modelProps.value.cardInfo.pixType = key;

  // 重置验证状态
  modelProps.value.verifyData = {
    accountName: "none",
    accountNumber: "none",
    accountPhone: "none",
    accountEmail: "none"
  };

  // 清空相关输入
  modelProps.value.cardInfo.accountName = null;
  modelProps.value.cardInfo.accountNumber = null;
  modelProps.value.cardInfo.accountPhone = null;
  modelProps.value.cardInfo.accountEmail = null;

  // 根据不同类型设置显示逻辑
  if (key === '1') {
    // CPF类型：先隐藏姓名输入框，只在输入了有效的CPF后显示
    showNameInput.value = false;
  } else {
    // 其他类型不需要姓名输入框
    showNameInput.value = true;
  }
};

const tipMsg = () => {
  showTipModel({
    type: 1,
    icon: "fail",
    title: t("107045")
  });
};

const submit = async () => {
  const pixType = Number(modelProps.value.cardInfo.pixType);
  
  let params: any = {
    pixType: pixType
  };

  // 根据不同PIX类型添加相应的字段
  switch (pixType) {
    case 0: // CNPJ
      params.cardId = modelProps.value.cardInfo.accountNumber.replace(/\D/g, "");
      break;
    case 1: // CPF
      params.cardId = modelProps.value.cardInfo.accountNumber.replace(/\D/g, "");
      // params.cardName = modelProps.value.cardInfo.accountName;
      break;
    case 2: // PHONE
      params.cardId = modelProps.value.cardInfo.accountPhone;
      break;
    case 3: // EMAIL
      params.cardId = modelProps.value.cardInfo.accountEmail;
      break;
  }

  params.jyPassword = modelProps.value.pinInputs;

  let { code, data }: any = await saveCashoutAccountApi(params);
  if (code == 200) {
    showTipModel({
      type: 1,
      icon: "success",
      title: t("102018")
    });
    close();
    emit("updateAccountInfo");
  } else {
    showTipModel({
      type: 1,
      icon: "fail",
      title: t(code)
    });
  }
};

const show = (len: any,pixTypeList:[],pinInputs:string) => {
  modelProps.value.bindCardMaxCount = len
  modelProps.value.pixTypeList = pixTypeList
  modelProps.value.bindCardBoxShow = true;
  // pixTypeList=[0,1,1,1];

  //cardType根据pixTypeList的值来决定是否显示
  modelProps.value.cardType = modelProps.value.cardType.filter((item,index) => {
    return pixTypeList[index] == 1
  })
  modelProps.value.pinInputs = pinInputs;
};

const close = () => {
  modelProps.value.bindCardBoxShow = false;
};

const handleClose = () => {
  close();
};

onMounted(() => { });

defineExpose({
  show,
});
</script>

<style lang="scss" scoped>
@import "./bindCard.scss";
</style>
