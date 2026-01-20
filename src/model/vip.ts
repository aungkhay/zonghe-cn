/**
 * AppVipListVo，vip配置列表
 */
export interface AppVipListVo {
    /**
     * 月奖励
     */
    monthReward?: number;
    /**
     * 升级需要的打码流水
     */
    upNeedBet?: number;
    /**
     * vip等级
     */
    vipLevel?: number;
    /**
     * 周奖励
     */
    weekReward?: number;
    [property: string]: any;
}


/**
 * AppVipInfoVo，当前vip信息
 */
export interface AppVipInfoVo {
    /**
     * 可领取月奖励
     */
    canReceiveMonth?: number;
    /**
     * 可领取总和
     */
    canReceiveTotal?: number;
    /**
     * 可领取周奖励
     */
    canReceiveWeek?: number;
    /**
     * 当前打码金额
     */
    currentBet?: number;
    /**
     * 月奖励
     */
    monthReward?: number;
    /**
     * 目标打码量
     */
    rewardBet?: number;
    /**
     * vip等级
     */
    vipLevel?: number;
    /**
     * 周奖奖励
     */
    weekReward?: number;
    [property: string]: any;
}


/**
 * AppGoodsVo，app商品展示
 */
export interface AppGoodsVo {
    /**
     * 商品列表
     */
    list?: AppGoodsListVo[];
    /**
     * 自定义最大充值金额
     */
    maxRecharge?: number;
    /**
     * 自定义最小充值金额
     */
    minRecharge?: number;
    [property: string]: any;
}

/**
 * AppGoodsListVo，app商品展示
 */
export interface AppGoodsListVo {
    /**
     * 赠送金额
     */
    giftAmount?: number;
    /**
     * 奖金百分比
     */
    giftPercentage?: number;
    /**
     * 商品名称多语言id
     */
    goodsName?: number;
    /**
     * 商品id
     */
    id?: number;
    /**
     * 金额
     */
    money?: number;
    /**
     * 价格
     */
    price?: number;
    [property: string]: any;
}


/**
 * AppBuyGoodsVo
 */
export interface AppBuyGoodsVo {
    /**
     * 订单id
     */
    orderId?: number;
    /**
     * 需要支付的数额
     */
    payAmount?: number;
    /**
     * 支付渠道
     */
    payChannel?: string;
    /**
     * 支付地址
     */
    payUrl?: string;
    [property: string]: any;
}

/**
 * AppRechargeOrderHistoryVo，充值历史订单展示
 */
export interface AppRechargeOrderHistoryVo {
    /**
     * 充值金额
     */
    amount?: number;
    /**
     * 时间
     */
    createTime?: Date;
    /**
     * 赠送金额
     */
    giveAmount?: number;
    /**
     * 状态；0 等待支付，1支付完成 2支付失败
     */
    status?: number;
    [property: string]: any;
}

