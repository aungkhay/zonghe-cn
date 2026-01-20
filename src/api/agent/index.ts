import { BaseResponse, http } from "@/utils/http";

// export async function agentInfoApi(params?: string) {
//   return await http.spRequest({
//     url: "agent/info",
//     handlingError: false,
//     method: "GET",
//     lodingMsg: "loading",
//     data: params
//   });
// }

// 搜索时间枚举
// 可选
// 枚举值:
// YESTERDAY
// TODAY
// WEEK
// LAST_WEEK
// MONTH
export enum SearchTimeEnum {
  ALL = null,
  YESTERDAY = "YESTERDAY",
  TODAY = "TODAY",
  WEEK = "WEEK",
  LAST_WEEK = "LAST_WEEK",
  MONTH = "MONTH",
  LAST_MONTH = "LAST_MONTH",
}



// 获取代理周返佣
export async function getAgentWeekRebateApi():Promise<BaseResponse<number>> {
  return await http.spRequest({
    url: `receive-reward/getAgentWeekRebate`,
    method: "GET",
    lodingMsg: "loading",
  });
}

// 领取代理周返佣
export async function receiveAgentWeekRebateApi():Promise<BaseResponse<number>> {
  return await http.spRequest({
    url: `receive-reward/receiveAgentWeekRebate`,
    method: "POST",
    lodingMsg: "loading",
  });
}


// 获取代理周返佣列表
export async function getAgentWeekRebateListApi(params?: {pageSize: number, pageNum: number}):Promise<BaseResponse<AppAgentWeekRebateVo[]>> {
  return await http.spRequest({
    url: `/history/agent-week-rebate`,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

/**
 * AppAgentWeekRebateVo
 */
export interface AppAgentWeekRebateVo {
    /**
     * 金额
     */
    amount?: number;
    /**
     * 时间
     */
    createTime?: Date;
    [property: string]: any;
}



export async function agentInfoApi(params?: {
    day: SearchTimeEnum;
  }): Promise<BaseResponse<AppAgentInfoVo>> {
    return await http.spRequest({
      url: `agent-info/get-info`,
      handlingError: true,
      method: "GET",
      lodingMsg: "loading",
      data: params
    });
  }
export interface AppAgentInfoVo {
    damaRebateInfo?: RebateInfo;
    data?: DataInfo;
    rechargeRebateInfo?: RebateInfo;
    team?: TeamInfo;
    [property: string]: any;
}

/**
 * RebateInfo，返佣
 */
export interface RebateInfo {
    /**
     * 直属收益
     */
    directRebate?: number;
    /**
     * 间接收益
     */
    indirectRebate?: number;
    /**
     * 总收益
     */
    totalRebate?: number;
    [property: string]: any;
}

/**
 * DataInfo，时间段信息
 */
export interface DataInfo {
    /**
     * 添加成员数
     */
    addMemberCount?: number;
    /**
     * 获得佣金金额(充值+下注)
     */
    commission?: number;
    /**
     * 存款总额
     */
    depositAmount?: number;
    /**
     * 存款次数
     */
    depositCount?: number;
    /**
     * 首次存款人数
     */
    firstDepositCount?: number;
    /**
     * 有效业绩(流水)
     */
    validDama?: number;
    [property: string]: any;
}

/**
 * TeamInfo，团队结构
 */
export interface TeamInfo {
    /**
     * 直属成员
     */
    directMemberCount?: number;
    /**
     * 间接成员
     */
    indirectMemberCount?: number;
    /**
     * 团队人数
     */
    teamCount?: number;
    [property: string]: any;
}

/**
 * 获取所有会员数据
 * @param timeType 时间类型
 * @param memberId 会员ID（可选）
 */
export interface AgentAllDataParams {
  // timeType: SearchTimeEnum;
  level?:string;
  searchUserId?:string;
  pageSize?:number;
  pageNum?:number;
  day?: SearchTimeEnum;
  startTime?: string;
  endTime?: string;
}

/**
 * AppRecommendList2Vo，下级列表
 */
export interface AppRecommendList2Vo {
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 等级
   */
  level?: number;
  /**
   * 总充值
   */
  rechargeAmount?: number;
  /**
   * 有效打码
   */
  totalDama?: number;
  /**
   * id
   */
  userId?: number;
  /**
   * 用户名
   */
  userName?: string;
  [property: string]: any;
}
/**
 * 获取所有会员数据
 */
export function agentAllDataApi(params: AgentAllDataParams) {
  return http.spRequest({
    url: "agent-info/list",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

export function agentSummaryDataApi(params: AgentAllDataParams) {
  return http.spRequest({
    url: "agent-info/summary",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}


export interface AgentFirstHistoryParams {
  // timeType: SearchTimeEnum;
  userId?:number;
  valid?:number;
  pageSize?:number;
  pageNum?:number;
}

export function agentFirstHistoryApi(params: AgentFirstHistoryParams){
  return http.spRequest({
    url: "agent-info/get-box-detail",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}


