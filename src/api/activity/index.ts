import { SPopManageConfigVo } from "@/model/activity";
import { BaseResponse, http } from "@/utils/http";

// 幸运转盘
export async function luckyWheelInfoApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/lucky-wheel-info",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function luckyWheelHistoryApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/lucky-wheel-history",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function luckyWheelDrawApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/lucky-wheel-Draw",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// PDD转盘
export async function signInWheelInfoPDDApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/signInWheelInfoPDD",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function signInWheelBonusDrawApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/signInWheelBonusDraw",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function signInWheelSpinPDDApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/signInWheelSpinPDD",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function signInWheelBonusRecordApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/signInWheelBonusRecord",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function signInWheelSpinRecordApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/signInWheelSpinRecord",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// 三日礼包
export async function threeDayGiftInfoApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/three-day-gift-info",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function threeDayGiftDrawApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/three-day-gift-draw",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// 赏金活动
export async function bountyTaskRecordsApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/bountyTaskRecords",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// 首冲活动
export async function firstPaymentPageApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/first-payment/page",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function firstPaymentDrawApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/first-payment/draw",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// 7日签到
export async function signIn7InfoApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/sign-in7-info",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

export async function signIn7CollectApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/sign-in7-collect",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function signIn7DrawApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/sign-in7-draw",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// 赏金
export async function bountyInfoApi() {
  return await http.spRequest({
    url: "app-bounty/list",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
  });
}
export async function bountyReceiveApi() {
  return await http.spRequest({
    url: "/app-bounty/receive",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
  });
}


export async function popupWindow () {
   return await http.spRequest<SPopManageConfigVo[]>({
    url: "home-page/pop-up-list",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
   })
}

export async function popupWindowDetail (params?: object) {
   return await http.spRequest({
     url:"home-page/global-setting",
     handlingError: false,
     method: "GET",
     lodingMsg: "loading",
     data: params
   })
}




  

