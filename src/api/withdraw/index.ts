import { http } from "@/utils/http";

export async function withdrawInfoApi(params?: object) {
  return await http.spRequest({
    url: "app-user/get-withdraw-config",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

export async function withdrawApi(params?: object) {
  return await http.spRequest({
    url: "app-user/withdraw",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function withdrawLogApi(pageObj:any,params?: object) {
  return await http.spRequest({
    url: `order/withdraw-history?pageSiz=${pageObj.pageSize}&pageNum=${pageObj.pageNum}`,
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

/**
 * AppBankCardListVo，银行卡列表
 */
export interface AppBankCardListVo {
  /**
   * 收款账户编码
   */
  accountCode?: string;
  /**
   * 收款账户编码名称
   */
  accountCodeName?: string;
  /**
   * 银行卡id
   */
  cardId?: string;
  /**
   * 持卡人名字
   */
  cardName?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 主键id
   */
  id?: number;
  /**
   * 电话
   */
  phone?: string;
  /**
   * 卡类型
   */
  pixType?: number;
  [property: string]: any;
}

// 获取卡信息
export async function cashoutAccountApi() {
  return await http.spRequest<AppBankCardListVo[]>({
    url: "bank-card/list",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
  });
}

// 保存卡信息
export async function saveCashoutAccountApi(params?: object) {
  return await http.spRequest({
    url: "bank-card/bind",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}



export async function bindJyPasswordApi(params?: object) {
  return await http.spRequest({
    url: "app-user/bind-jyPassword",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function checkJyPassword() {
  return await http.spRequest({
    url: "app-user/check-jyPassword",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
  });
}

export async function compareJyPassword(params?: object) {
  return await http.spRequest({
    url: "app-user/compare-jyPassword",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function resetJyPassword(params?: object) {
  return await http.spRequest({
    url: "app-user/reset-jyPassword",
    handlingError: true,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}
