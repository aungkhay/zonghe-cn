import { AppBuyGoodsVo, AppGoodsListVo, AppGoodsVo } from "@/model/vip";
import { http } from "@/utils/http";

export async function depositConfigApi(params?: object) {
  return await http.spRequest<AppGoodsVo>({
    url: "/app-user/goods-list",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

export async function depositApi(params?: object) {
  return await http.spRequest<AppBuyGoodsVo>({
    url: "app-user/buy-goods",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function depositLogApi(pageObj: any, params?: object) {
  return await http.spRequest({
    url: `order/recharge-history?pageSize=${pageObj.pageSize}&pageNum=${pageObj.pageNum}`,
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function rechargeChannel(params?: object) {
  return await http.spRequest({
    url: `/app-user/get-recharge-channel-list`,
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}