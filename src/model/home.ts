

/**
 * SActivitySwithVo，活动开关列视图对象 s_activity_swith
 */
export interface SActivitySwithVo {
    /**
     * 域名id
     */
    domainId?: number;
    /**
     * 全局配置枚举key
     */
    enumStr?: string;
    /**
     * 主键id
     */
    id?: number;
    /**
     * 大图
     */
    imgBig?: string;
    /**
     * 小图
     */
    imgSmall?: string;
    /**
     * 0关1开
     */
    isOpen?: number;
    /**
     * 是否弹窗
     */
    isPop?: number;
    /**
     * 跳转地址
     */
    jumpUrl?: string;
    /**
     * 链接类型0站内 1站外
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
     * 活动类型
     */
    type?: number;
    [property: string]: any;
}

/**
 * SNoticeConfigVo，公告配置视图对象 s_notice_config
 */
export interface SNoticeConfigVo {
    /**
     * 域名
     */
    domainId?: number;
    /**
     * 英文
     */
    en?: string;
    /**
     * 主键id
     */
    id?: number;
    /**
     * 葡萄牙语
     */
    pt?: string;
    /**
     * 0开启 1关闭
     */
    switchOpen?: number;
    [property: string]: any;
}

/**
 * SFloatingIconConfigVo，悬浮图管理配置视图对象 s_floating_icon_config
 */
export interface SFloatingIconConfigVo {
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
     * 0独立1合并
     */
    type?: number;
    [property: string]: any;
}

