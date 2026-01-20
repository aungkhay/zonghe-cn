import { AppGetBetRewardVo, AppReceiveBoxInfoVo, AppReceiveInfoVo, AppReceiveTotalRechargeVo, AppRegisterDownLoadVo, AppTunrnTableListVo, AppTunrnTableVo, SPopManageConfigVo } from "@/model/activity";
import { getActivityType } from "@/model/activityEnum";
import { SFloatingIconConfigVo} from "@/model/home";
import { useUserStoreHook } from "@/store/modules/user";
import { http } from "@/utils/http";

// 超级折扣
export async function superDiscountApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/super-discount",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function superSaleApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/super-sale",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// 免费转盘
export async function signInWheelInfoApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/signInWheelInfo",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function signInWheelSpinApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/signInWheelSpin",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// 三礼包
export async function secondPaymentInfoApi(params?: object) {
  return await http.spRequest({
    url: "app-user/packs-list",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

// 礼包领取
export async function PaymentDrawApi(params?: object) {
  return await http.spRequest({
    url: "/app-user/buy-packs",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// 频道群
export async function groupLinksApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/groupLinks",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// 老虎机
export async function marqueeApi(params?: object) {
  return await http.spRequest<AppTunrnTableListVo[]>({
    url: "app-user/get-tunrn-table-list",
    handlingError: true,
    method: "GET",
    // lodingMsg: "loading",
    data: params
  });
}
export async function marqueeReturnApi(params?: object) {
  return await http.spRequest<AppTunrnTableVo>({
    url: "app-user/tunrn-table",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}
// 破产礼包
export async function breakthroughApi(params?: object) {
  return await http.spRequest({
    url: "app-user/get-breakthrough",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

// 是否复冲
export async function secondRechargeApi(params?: object) {
  return await http.spRequest({
    url: "app-user/second-recharge",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}


// --- NEW 
//悬浮图标列表
export async function getFloatingIconList() {
   return await http.spRequest<SFloatingIconConfigVo[]>({
    url: "home-page/floating-icon-list",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
   })
}
// 新的弹窗列表
export async function getPupupList(){
   return await http.spRequest<SPopManageConfigVo[]>({
      url: "/home-page/pop-up-list",
      handlingError: true,
      method: "GET",
      lodingMsg: "loading",
   })
}

export async function getGlobalSetting<T>(params?: object){
   return await http.spRequest<T>({
      url: "home-page/global-setting",
      handlingError: true,
      method: "GET",
      lodingMsg: "loading",
      data: params
   })
}

// 累计充值记录
export async function getTotalRechargeRecord(){
    return await http.spRequest<AppReceiveInfoVo>({
       url: "receive-reward/getTotalRechargeRecord",
       handlingError: true,
       method: "GET",
       lodingMsg: "loading",
    });
}

// 领取累计充值奖励
export async function receiveTotalRecharge(params?: object){
   return await http.spRequest<AppReceiveTotalRechargeVo>({
      url: "receive-reward/receiveTotalRecharge",
      handlingError: true,
      method: "POST",
      lodingMsg: "loading",
      data: params
   })
}

export async function getInviteGraduateList() {
   return await http.spRequest<AppReceiveInfoVo>({
      url: "receive-reward/getInviteGraduateList",
      handlingError: true,
      method: "GET",
      lodingMsg: "loading",
   });
}

export async function receiveInviteGraduateReward(params?:object){
    return await http.spRequest<AppReceiveInfoVo>({
      url: "receive-reward/receiveInviteGraduateReward",
      handlingError: true,
      method: "POST",
      lodingMsg: "loading",
      data: params
    });
   
}

export async function getBetReward(params?:object) {  //type 0日 1周 2周亏损。
   return await http.spRequest<AppGetBetRewardVo>({
      url: "receive-reward/getBetReward",
      handlingError: true,
      method: "GET",
      lodingMsg: "loading",
      data: params
   });
}

export async function receiveBetReward(params?:object){  //type 0日 1周 2周亏损。
   return await http.spRequest<AppGetBetRewardVo>({
      url: "receive-reward/receiveBetReward?type=" + params["type"],
      handlingError: true,
      method: "POST",
      lodingMsg: "loading",
      // data: params
   });
}

export async function getAgentWeekRebate(){
   return await http.spRequest({
      url:"receive-reward/getAgentWeekRebate",
      handlingError: true,
      method: "GET",
      lodingMsg: "loading",
   })
}

export async function receiveAgentWeekRebate(){
   return await http.spRequest<AppReceiveInfoVo>({
      url:"receive-reward/receiveAgentWeekRebate",
      handlingError: true,
      method: "POST",
      lodingMsg: "loading",
   })
}

export async function getRechargeReward(params?:object){
   return await http.spRequest<AppGetBetRewardVo>({
      url:"receive-reward/getRechargeReward?type=" + params["type"],
      handlingError: true,
      method: "GET",
      lodingMsg: "loading"
   })
}

export async function receiveRechargeReward(params?:object){
   return await http.spRequest<AppGetBetRewardVo>({
      url:"receive-reward/receiveRechargeReward?type=" + params["type"],
      handlingError: true,
      method: "POST",
      lodingMsg: "loading",
   })
}

export async function getRegisterAndDownloadReward() {
  //判断是否登录
  if(!useUserStoreHook().isLogin){
    //返回一个结构防止报错！
    return {
      code: 400,
      data:null
    }
  }
  return await http.spRequest<AppRegisterDownLoadVo>({
    url:"receive-reward/getRegisterAndDownloadReward",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading"
  })
}

export async function receiveDownloadReward() {
  return await http.spRequest({
    url:"receive-reward/receiveDownloadReward",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading"
  })
}

export async function receiveRegisterReward() {
  return await http.spRequest({
    url:"receive-reward/receiveRegisterReward",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading"
  })
}

export async function getAppDownloadUrl(){
  return await http.spRequest({
     url:"home-page/app-download-url",
     handlingError: true,
     method: "GET",
     lodingMsg: "loading"
  })
}
