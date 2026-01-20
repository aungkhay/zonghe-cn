import { http } from "@/utils/http";

export async function loginApi(params?: object) {
  return await http.spRequest({
    url: "auth/login",
    handlingError: true,
    isEncrypt: true,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function registerApi(params?: object) {
  return await http.spRequest({
    url: "auth/register",
    handlingError: true,
    isEncrypt: true,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

// // 谷歌登录API
// export async function googleLoginApi(params?: object) {
//   return await http.spRequest({
//     url: "auth/google-login",
//     handlingError: true,
//     isEncrypt: false,
//     method: "POST",
//     lodingMsg: "loading",
//     data: params
//   });
// }

// // 谷歌注册API
// export async function googleRegisterApi(params?: object) {
//   return await http.spRequest({
//     url: "auth/google-register",
//     handlingError: true,
//     isEncrypt: false,
//     method: "POST",
//     lodingMsg: "loading",
//     data: params
//   });
// }

export async function logoutApi() {
  return await http.spRequest({
    url: "auth/logout",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
  });
}

export async function userInfoApi() {
  return await http.spRequest({
    url: "app-user/get-user-info",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
  });
}

export async function changleLang(str: String) {
  return await http.spRequest({
    url: `/app-user/change-language/${str}`,
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
  });
}

export async function getCode() {
  return await http.spRequest({
    url: `/auth/code`,
    handlingError: false,
    method: "GET",
    lodingMsg: "",
  });
}


export async function balanceApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/balance",
    handlingError: false,
    method: "POST",
    data: params
  });
}

export async function sendCodeApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/sendCode",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function checkAccountNameApi(params?: object) {
  return await http.spRequest({
    url: "security-center/verify-phone",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    isEncrypt: true,
    data: params
  });
}

export async function resetPasswordApi(params?: object) {
  return await http.spRequest({
    url: "security-center/reset-password",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    isEncrypt: true,
    data: params
  });
}

export async function resetJyPasswordApi(params?: object) {
  return await http.spRequest({
    url: "security-center/reset-jyPassword",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    isEncrypt: true,
    data: params
  });
}

export async function updateHeadIconIdApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/updateHeadIconId",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function updateLanguageApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/updateLanguage",
    handlingError: true,
    method: "POST",
    // lodingMsg: "loading",
    data: params
  });
}

export async function updateTGInfoApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/updateTGInfo",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function verifyLoginPasswordApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/verifyLoginPassword",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function changeLoginPasswordApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/changeLoginPassword",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function getNotifications(params?: object) {
  return await http.spRequest({
    url: "/user-msg/get-user-inter-msg",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
    isEncrypt: true,
    data: params
  });
}

export async function getNotificationCount(params?: object) {
  return await http.spRequest({
    url: "/user-msg/get-user-inter-msg-count",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
    isEncrypt: true,
    data: params
  });
}

export async function readNoti(params?: object) {
  return await http.spRequest({
    url: "/user-msg/read-user-inter-msg",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
    isEncrypt: true,
    data: params
  });
}

export async function myData(params?: object) {
  return await http.spRequest({
    url: "/agent-info/new-info",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
    isEncrypt: true,
    data: params
  });
}

export async function bindRealName(params?: object) {
  return await http.spRequest({
    url: "/security-center/bind-real-name",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    isEncrypt: true,
    data: params
  });
}

export async function bindPhone(params?: object) {
  return await http.spRequest({
    url: "/app-user/bind-phone",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    isEncrypt: true,
    data: params
  });
}