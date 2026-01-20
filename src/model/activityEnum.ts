export enum ActivityType {
    /** 首充 */
    ACTIVE_FIRST_RECHARGE = "ACTIVE_FIRST_RECHARGE",
  
    /** 复充 */
    ACTIVE_SECOND_RECHARGE = "ACTIVE_SECOND_RECHARGE",
  
    /** 人数邀请梯度(宝箱奖励) */
    ACTIVE_BOX = "ACTIVE_BOX",
  
    /** 首充邀请梯度 */
    ACTIVE_FIRST_RECHARGE_GRADIENT = "ACTIVE_FIRST_RECHARGE_GRADIENT",
  
    /** 累充 */
    ACTIVE_TOTAL_RECHARGE = "ACTIVE_TOTAL_RECHARGE",
  
    /** 日投注 */
    ACTIVE_DAY_BET = "ACTIVE_DAY_BET",
  
    /** 周投注 */
    ACTIVE_WEEK_BET = "ACTIVE_WEEK_BET",
  
    /** 周亏损 */
    ACTIVE_WEEK_LOOSE = "ACTIVE_WEEK_LOOSE",
  
    /** 周返佣 */
    ACTIVE_WEEK_REBATE = "ACTIVE_WEEK_REBATE",
  
    /** 周存款 */
    ACTIVE_WEEK_RECHARGE = "ACTIVE_WEEK_RECHARGE",
  
    /** 代理下级流水返利 */
    ACTIVE_AGENT_SON_FLOW_REBATE = "ACTIVE_AGENT_SON_FLOW_REBATE",
  
    /** 下级充值分成 */
    ACTIVE_SUB_RECHARGE_SHARE = "ACTIVE_SUB_RECHARGE_SHARE",
  
    /** 储蓄罐功能 */
    ACTIVE_PIGGY_BANK = "ACTIVE_PIGGY_BANK",

    /** 转盘 */
    ACTIVE_TURN_TABLE = "ACTIVE_TURN_TABLE",

   
    /** 下载app */
    ACTIVE_DOWN_LOAD_APP = "ACTIVE_DOWN_LOAD_APP",

     /** 注册 */
     ACTIVE_REGISTER = "ACTIVE_REGISTER",

     /** 日充值 */
     ACTIVE_DAY_RECHARGE = "ACTIVE_DAY_RECHARGE",

  }
  

  export function getActivityType(value: string): ActivityType | undefined {
    if (Object.values(ActivityType).includes(value as ActivityType)) {
      return value as ActivityType;
    }
    return undefined;
  }

  // 1. 首充配置
export interface ActiveFirstRechargeConfigVo {
  /**
   * 数据列表
   */
  data?: ActiveFirstRechargeDataVo[];
  [property: string]: any;
}

export interface ActiveFirstRechargeDataVo {
  /**
   * 排序
   */
  sortId?: number;
  /**
   * 起始金额
   */
  startAmount?: number;
  /**
   * 赠送比例
   */
  giveRatio?: number;
  /**
   * 封顶赠送
   */
  topGive?: number;
  /**
   * 本金打码
   */
  dama?: number;
  /**
   * 奖励打码
   */
  rewardDama?: number;
  [property: string]: any;
}

// 2. 复充配置
export interface ActiveSecondRechargeConfigVo {
  /**
   * 数据列表
   */
  data?: ActiveSecondRechargeDataVo[];
  [property: string]: any;
}

export interface ActiveSecondRechargeDataVo {
  /**
   * 排序id
   */
  sortId?: number;
  /**
   * 起始金额
   */
  startAmount?: number;
  /**
   * 赠送比例
   */
  giveRatio?: number;
  /**
   * 封顶赠送
   */
  topGive?: number;
  /**
   * 本金打码
   */
  dama?: number;
  /**
   * 奖励打码
   */
  rewardDama?: number;
  [property: string]: any;
}

// 3. 人数邀请梯度(宝箱奖励)
export interface ActiveBoxConfigVo {
  /**
   * 数据
   */
  data?: ActiveBoxDataVo[];
  /**
   * 条件类型
   */
  conditionType?: number;
  /**
   * 条件值
   */
  conditionValue?: number;
  [property: string]: any;
}

export interface ActiveBoxDataVo {
  /**
   * 邀请人数
   */
  count?: number;
  /**
   * 奖励
   */
  reward?: number;
  [property: string]: any;
}

// 4. 首充邀请梯度
export interface ActiveFirstRechargeGradientConfigVo {
  /**
   * 数据列表
   */
  data?: ActiveFirstRechargeGradientDataVo[];
  [property: string]: any;
}

export interface ActiveFirstRechargeGradientDataVo {
  /**
   * 首充金额
   */
  amount?: number;
  /**
   * 奖励
   */
  reward?: number;
  [property: string]: any;
}

// 5. 累充
export interface ActiveTotalRechargeConfigVo {
  /**
   * 数据列表
   */
  data?: ActiveTotalRechargeDataVo[];
  [property: string]: any;
}

export interface ActiveTotalRechargeDataVo {
  /**
   * 累计金额
   */
  amount?: number;
  /**
   * 奖励
   */
  reward?: number;
  /**
   * 本金打码
   */
  dama?: number;
  [property: string]: any;
}

// 6. 日投注
export interface ActiveDayBetConfigVo {
  /**
   * 数据列表
   */
  data?: ActiveDayBetDataVo[];
  /**
   * 封顶奖励金额
   */
  topReward?: number;
  /**
   * 奖励结算时间
   */
  settleTime?: number;
  [property: string]: any;
}

export interface ActiveDayBetDataVo {
  /**
   * 投注
   */
  amount?: number;
  /**
   * 返还比例
   */
  rate?: number;
  /**
   * 本金打码
   */
  dama?: number;
  [property: string]: any;
}

// 7. 周投注 (与日投注相同)
export interface ActiveWeekBetConfigVo extends ActiveDayBetConfigVo {
  [property: string]: any;
}

// 8. 周亏损 (与日投注相同)
export interface ActiveWeekLooseConfigVo extends ActiveDayBetConfigVo {
  [property: string]: any;
}

// 9. 周返佣 (与日投注相同)
export interface ActiveWeekRebateConfigVo extends ActiveDayBetConfigVo {
  [property: string]: any;
}

// 10. 周存款
export interface ActiveWeekRechargeConfigVo {
  /**
   * 数据列表
   */
  data?: ActiveWeekRechargeDataVo[];
  /**
   * 封顶奖励金额
   */
  topReward?: number;
  /**
   * 奖励结算时间
   */
  settleTime?: number;
  [property: string]: any;
}

export interface ActiveWeekRechargeDataVo {
  /**
   * 投注
   */
  bet?: number;
  /**
   * 返还比例
   */
  rate?: number;
  [property: string]: any;
}

// 11. 代理下级流水返利
export interface ActiveAgentSonFlowRebateConfigVo {
  /**
   * 数据列表
   */
  data?: ActiveAgentSonFlowRebateDataVo[];
  /**
   * 代理流水返还计算时间(几时)
   */
  settleTime?: number;
  [property: string]: any;
}

export interface ActiveAgentSonFlowRebateDataVo {
  /**
   * 级别
   */
  level?: number;
  /**
   * 返还比例
   */
  rate?: number;
  [property: string]: any;
}

// 12. 下级充值分成
export interface ActiveSubRechargeShareConfigVo {
  /**
   * 数据列表
   */
  data?: ActiveSubRechargeShareDataVo[];
  /**
   * 条件类型
   */
  conditionTypes?: number[];
  [property: string]: any;
}

export interface ActiveSubRechargeShareDataVo {
  /**
   * 层级
   */
  level?: number;
  /**
   * 返还比例
   */
  rate?: number;
  [property: string]: any;
}

// 13. 储蓄罐功能
export interface ActivePiggyBankConfigVo {
  /**
   * 最低储需金额
   */
  minSaveAmount?: number;
  /**
   * 回报率
   */
  rate?: number;
  [property: string]: any;
}

export interface AppReceiveInfoVo {
  /**
   * 值
   */
  amount?: number;
  /**
   * 领取金额
   */
  receiveAmount?: number;
  /**
   * 领取记录
   */
  receiveList?: number[];
  [property: string]: any;
}