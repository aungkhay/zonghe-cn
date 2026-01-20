import { http } from "@/utils/http";

export async function telDddrApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/tel-addr",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}


export async function getRechargeInfo(id?: object) {
  return await http.spRequest({
    url: `app-user/get-recharge-info/${id}`,
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
  });
}

