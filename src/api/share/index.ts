import { http } from "@/utils/http";

export async function shareInvitePageApi(params?: object) {
  return await http.spRequest({
    url: "rateRecord/invite-info",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

// 返佣配置
export async function getCommissionApi(params?: object) {
  // return await http.spRequest({
  //   url: "app-user/get-commission",
  //   handlingError: false,
  //   method: "GET",
  //   lodingMsg: "loading",
  //   data: params
  // });   
  // 不用了 
  return Promise.resolve({
    code: 400,
    data: null
  })

}

export async function shareDrawBonusApi(params?: object) {
  return await http.spRequest({
    url: "rateRecord/receive",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

export async function shareReferPageApi(params?: object) {
  return await http.spRequest({
    url: "rateRecord/refer",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function shareValidPaidMemberPageApi(params?: object) {
  return await http.spRequest({
    url: "recommend/list",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

export async function sharePayPageApi(params?: object) {
  return await http.spRequest({
    url: "recommend/recommendList",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

// 新版邀请页面
export async function getInviteInfo() {
  return await http.spRequest({
    url: "/betRebate/getInviteInfo",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
  });
}

// 新版领取佣金


export async function receive() {
  return await http.spRequest({
    url: "/betRebate/receive",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
  });
}

// 返佣配置
export async function receiveCommissionApi() {
  return await http.spRequest({
    url: "/betRebate/get-commission",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
  });
}


// 新版refer

export async function newReferApi() {
  return await http.spRequest({
    url: "/betRebate/refer",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
  });
}

// 下注返佣列表
export async function betCommissionListApi(data) {
  return await http.spRequest({
    url: "/betRebate/bet-commission-list",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data
  });
}


