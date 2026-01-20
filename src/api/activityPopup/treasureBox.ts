import { http } from "@/utils/http";

export async function boxRewardRedDotInfoApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/boxRewardRedDotInfo",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// 一键领取全部奖励
export async function boxRewardRedDotDrawApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/boxRewardRedDotDraw",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// 领取押注返利
export async function drawRebateGoldApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/drawRebateGold",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// 领取金猪
export async function taurusDrawIncomeApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/taurusDrawIncome",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// 领取新手任务奖励
export async function fuxingTaskModuleDrawApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/fuxingTaskModuleDraw",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}
