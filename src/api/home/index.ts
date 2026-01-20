import { BaseResponse, http } from "@/utils/http";
import { useUserStoreHook } from "@/store/modules/user";
import { SActivitySwithVo, SNoticeConfigVo } from "@/model/home";

// 弃用
// export async function loopPictureApi() {
//   let apiUrl = "home-page/banner-list";
//   return await http.spRequest({
//     url: apiUrl,
//     handlingError: false,
//     method: "GET"
//   });
// }

export async function loopPictureApi() {
   let apiUrl = "home-page/activity-swith-list"
   return await http.spRequest<SActivitySwithVo[]>({
    url: apiUrl,
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
   })
}


export async function wideInfoApi() {
  return await http.spRequest<SNoticeConfigVo[]>({
    url: `home-page/notice-list`,
    handlingError: false,
    method: "GET",
  });
}

export async function getService(host: String) {
  return await http.spRequest({
    url: `/home-page/customer-service-link?host=${host}`,
    handlingError: false,
    method: "GET",
  });
}

export async function getGlobalSettings() {
  return await http.spRequest({
    url: `/home-page/global-setting-all`,
    handlingError: false,
    method: "GET",
  });
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

export async function floatingIconList<T>(params?: object){
   return await http.spRequest<T>({
      url: "/home-page/floating-icon-list",
      handlingError: true,
      method: "GET",
      lodingMsg: "loading",
      data: params
   })
}


