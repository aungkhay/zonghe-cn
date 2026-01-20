/**
 * SPopManageConfigVo，弹窗管理配置视图对象 s_pop_manage_config
 */
export interface SPopManageConfigVo {
    /**
     * 文字内容
     */
    content?: string;
    /**
     * 域名id
     */
    domainId?: number;
    /**
     * 主键id
     */
    id?: number;
    /**
     * 大图地址
     */
    imgBig?: string;
    /**
     * 小图地址
     */
    imgSmall?: string;
    /**
     * 是否开启
     */
    isOpen?: number;
    /**
     * 跳转地址
     */
    jumpUrl?: string;
    /**
     * 链接类型(0内部1外部)
     */
    linkType?: number;
    /**
     * 备注
     */
    remark?: string;
    /**
     * 排序id
     */
    sortId?: number;
    /**
     * 标题
     */
    title?: string;
    /**
     * 公告类型(0图片1文字)
     */
    type?: number;
    [property: string]: any;
}

/**
 * AppReceiveTotalRechargeVo，领取累计充值奖励
 */
export interface AppReceiveTotalRechargeVo {
    /**
     * 领取金额
     */
    amount?: number;
    infoVo?: AppReceiveInfoVo;
    [property: string]: any;
}

/**
 * AppReceiveInfoVo，领取信息
 */
export interface AppReceiveInfoVo {
    /**
     * 值
     */
    amount?: number;
    /**
     * 领取记录
     */
    receiveList?: number[];
    /**
     * 领取金额
     */
    receiveAmount?: number;
    [property: string]: any;
}

/**
 * AppReceiveInfoVo，领取信息
 */
export interface AppReceiveBoxInfoVo {
    /**
     * 值
     */
    amount?: number;
    /**
     * 领取记录
     */
    receiveList?: number[];
    [property: string]: any;
}

/**
 * AppGetBetRewardVo
 */
export interface AppGetBetRewardVo {
    /**
     * 可领取金额
     */
    amount?: number;
    /**
     * 今日进度
     */
    todayAmount?: number;
    [property: string]: any;
}


/**
 * AppTunrnTableVo，转盘返回
 */
export interface AppTunrnTableVo {
    /**
     * 中奖金额
     */
    amount?: number;
    /**
     * 格子id
     */
    grid?: number;
    /**
     * 格子类型1金钱 2未知 3空白
     */
    gridType?: number;
    /**
     * 上把转盘时间
     */
    lastTableTime?: Date;
    [property: string]: any;
}


/**
 * AppTunrnTableListVo，转盘列表
 */
export interface AppTunrnTableListVo {
    /**
     * 格子
     */
    grid?: number;
    /**
     * 格子类型1金钱 2未知 3空白
     */
    gridType?: number;
    /**
     * 金额
     */
    money?: number;
    [property: string]: any;
}

/**
 * AppRegisterDownLoadVo
 */
export interface AppRegisterDownLoadVo {
    /**
     * 下载可领取金额
     */
    downloadAmount?: number;
    /**
     * 注册可领取金额
     */
    registerAmount?: number;
    [property: string]: any;
}





