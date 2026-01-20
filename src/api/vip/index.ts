import { AppVipInfoVo, AppVipListVo } from "@/model/vip";
import { BaseResponse, http } from "@/utils/http";
import { head } from "node_modules/axios/index.cjs";

export async function vipDrawApi(params?: object) {
  return await http.spRequest({
    url: "vip/receive",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

export async function vipLogApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/vip-log",
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

export async function vipInfoApi(params?: object) {
  return await http.spRequest<AppVipInfoVo>({
    url: "vip/info",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}


export async function vipListApi(params?: object) {
  return await http.spRequest<AppVipListVo[]>({
    url: "vip/list",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}


export async function vipHistoryApi(params?: object) {
  return await http.spRequest({
    url: "vip/receiveRecord",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params,

  });
}

export interface Response {
  /**
   * 消息状态码
   */
  code?: number;
  /**
   * 消息内容
   */
  msg?: string;
  /**
   * 列表数据
   */
  rows?: TVipRecordVo[];
  /**
   * 总记录数
   */
  total?: number;
  [property: string]: any;
}

/**
* TVipRecordVo，vip领取记录视图对象 t_vip_record
*/
export interface TVipRecordVo {
  /**
   * 领取金额
   */
  amount?: number;
  /**
   * 域名id
   */
  domainId?: number;
  /**
   * 主键id
   */
  id?: number;
  /**
   * vip等级
   */
  level?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 领取类型0周1月
   */
  type?: number;
  /**
   * 用户id
   */
  userId?: number;
  [property: string]: any;
}




