import { useUserStoreHook } from "@/store/modules/user";
import { useActPopupStoreHook } from "@/store/modules/actPopup";
import { telDddrApi } from "@/api/common/index";
import router from "@/router/index";
import Base64 from "base-64";
import { SActivitySwithVo } from "@/model/home";
import { ActivityType, getActivityType } from "@/model/activityEnum";
import { useNewActPopupStoreHook } from "@/store/modules/newActPopus";

export default {
  /**
   * @param {string} key
   * @param {string} value
   */
  setStorage(key: string, value: string) {
    window.localStorage.setItem(key, value);
  },

  /**
   * @param {string} key
   * @param {string} value
   */
  getStorage(key: string) {
    return window.localStorage.getItem(key);
  },

  /**
   * @param {string} key
   */
  removeStorage(key: string) {
    return window.localStorage.removeItem(key);
  },

  /**
   * @param {string} key
   * @param {string} value
   */
  getDeviceInfo(key: string = "") {
    return {
      deviceId: "",
      deviceType: "",
      deviceModel: "",
      appVersion: 1.0
    };
  },

  /**
   * @param {string} str
   */
  // 国际化名称枚举 Internationalized Name Enumeration
  getParamsLangName(str: String) {
    let langObj: any = [
      { id: 'en', key: "en" },
      { id: 'pt', key: "portugal" },
      { id: 'zh', key: "zh" } // 中文
    ];

    for (let index in langObj) {
      if (langObj[index].id == str) return langObj[index].key;
    }

    return langObj[0].key;
  },
  /**
   * 获取当前语言
   */
  getCurLang() {
    return useUserStoreHook().lang;
  },

  getParamsLang() {
    const lang = useUserStoreHook().playerInfo.language;
    if(!lang) return 'zh';
    if(lang == 'zh' || lang === 'undefined') {
      return "zh"
    }
    return lang;
  },
  /**
   * 通用页面跳转
   */
  jumpUrl(url: string) {
    if (url == "vip") {
      let isNewVip = import.meta.env.VITE_IS_NEW_VIP;
      url = isNewVip == "true" ? "vipPlus" : url;
    }
    router.push(`/${url}`);
  },
  // 活动页跳转
  eventJump(type, url?: string) {
    if (useUserStoreHook().isLogin) {
      switch (type) {
        case 'defult':
          this.jumpUrl(url);
          break;
        case 'pop_10004':
          useActPopupStoreHook().popupBoxShow("thirdRecharge");
          break;
        case 'pop_10005':
          useActPopupStoreHook().popupBoxShow("marquee");
          break;
        case 'openWD':
          window.openWin(url);
          break;
        default:
          break;
      }
    }
  },

  //新的暂时先不做别的跳转
  activityJump(data: SActivitySwithVo) {
     //TOOD 不知道还有啥判断 先这么写！
     if(useUserStoreHook().isLogin) {
        if(data.jumpUrl && data.jumpUrl.length > 0) {
          if(data.linkType == 0) {
            this.jumpUrl(data.jumpUrl);
          } else {
            window.openWin(data.jumpUrl);
          }
        }else{
           const activityType = getActivityType(data.enumStr);
           if(activityType){
              switch(activityType){
                case ActivityType.ACTIVE_FIRST_RECHARGE:
                  router.push({
                    path: "/activity/firstRecharge",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break;
                case ActivityType.ACTIVE_SECOND_RECHARGE:
                  router.push({
                    path: "/activity/secondRecharge",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break;
                case ActivityType.ACTIVE_BOX:
                  router.push({
                    path: "/activity/chestReward",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break;
                case ActivityType.ACTIVE_TOTAL_RECHARGE:
                  router.push({
                    path: "/activity/totalRecharge",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break;
                case ActivityType.ACTIVE_DAY_BET:
                  router.push({
                    path: "/activity/dayBet",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break;
                case ActivityType.ACTIVE_WEEK_BET:
                  router.push({
                    path: "/activity/weekBet",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break;
                case ActivityType.ACTIVE_WEEK_LOOSE:
                  router.push({
                    path: "/activity/weekLoose",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break;
                case ActivityType.ACTIVE_WEEK_REBATE:
                  router.push({
                    path: "/activity/weekRebate",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break;
                case ActivityType.ACTIVE_WEEK_RECHARGE:
                  router.push({
                    path: "/activity/weekRecharge",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break;
                case ActivityType.ACTIVE_WEEK_RECHARGE:
                  router.push({
                    path: "/activity/weekRecharge",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break;
                case ActivityType.ACTIVE_WEEK_RECHARGE:
                  router.push({
                    path: "/activity/weekRecharge",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break; 
                case ActivityType.ACTIVE_WEEK_RECHARGE:
                  router.push({
                    path: "/activity/weekRecharge",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break;
                case ActivityType.ACTIVE_AGENT_SON_FLOW_REBATE:
                  router.push({
                    path: "/activity/agentSonFlowRebate",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break;
                case ActivityType.ACTIVE_SUB_RECHARGE_SHARE:
                  router.push({
                    path: "/activity/subRechargeShare",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                  break;
                case ActivityType.ACTIVE_TURN_TABLE:
                  useNewActPopupStoreHook().openPopup("marquee");
                  break;
                case ActivityType.ACTIVE_DOWN_LOAD_APP:
                  useNewActPopupStoreHook().openPopup("downloadActivity");
                  break;
                case ActivityType.ACTIVE_REGISTER:
                  useNewActPopupStoreHook().openPopup("registerActivity");
                  break;
                case ActivityType.ACTIVE_DAY_RECHARGE:
                  router.push({
                    path: "/activity/dayRecharge",
                    query: { id: data.id, enumStr: data.enumStr }
                  });
                default:
                  break;
             }
          }
        }
      }else{
        useUserStoreHook().openLogin();
      }
    },

  /**
   * 客服跳转
   */
  async contactCustomer() {
    const telegramUrl = this.getStorage("telegram")
    window.openWin(telegramUrl, '_blank')
    // if (useUserStoreHook().isLogin) {
    //   const telegramUrl = this.getStorage("telegram")
    //   window.openWin(telegramUrl, '_blank')
    // }
  },

  // 非登录跳转
  async nologinService() {
    const telegramUrl = this.getStorage("telegram")
    window.openWin(telegramUrl, '_blank')
  },
  /**
   * App下载
   */
  downloadApp() {
    let appUrl = import.meta.env.VITE_APP_URL;
    window.openWin(appUrl);
  },
  generateRandomThreeDigits() {
    return Math.floor(Math.random() * 900) + 100; // 生成100到999之间的随机数
  },
  // 转base64
  encodeValue(value) {
    let base64 = btoa(value);
    base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const randomSuffix = 'PDD';//this.generateRandomThreeDigits().toString();
    return base64 + randomSuffix;
  },
  // 解码base64
  decodeValue(encoded) {
    const base64 = encoded.slice(0, -3); // 去除最后三位随机数
    let decoded = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return decoded;
  },

  /**
   * 获取分享链接
   */
  getShareLink() {
    let currentUrl = window.location.origin;
    let hash = window.location.hash;
    let playerInfo = useUserStoreHook().playerInfo;
    if (playerInfo) {
      return `${currentUrl.replace(hash, "")}/h5/?uId=${playerInfo.userId}`;
    } else {
      return "";
    }
  },

  /**
   * @param {any} gameItem
   */
  setGameStar(gameItem: any) {
    let reGameStar: any = this.getStorage("reGameStar");
    if (!reGameStar) {
      reGameStar = [];
    } else {
      reGameStar = JSON.parse(reGameStar as string);
    }

    let exists = reGameStar.some(item => item.id === gameItem.id);

    if (exists) {
      // 移除匹配的对象
      reGameStar = reGameStar.filter(item => item.id !== gameItem.id);
    } else {
      // 添加对象到数组
      reGameStar.push(gameItem);
    }
    this.setStorage("reGameStar", JSON.stringify(reGameStar));
  },
  getGameStar() {
    let reGameStar: any[] = this.getStorage("reGameStar");
    if (!reGameStar) {
      reGameStar = [];
    } else {
      reGameStar = JSON.parse(reGameStar as any);
    }
    return reGameStar;
  },
  /**
   * @param 横向滚动
   * @param {Element} el 滚动父元素
   * @param {string} direction  滚动方向，right
   * @param {number} speed  滚动速度(ms), 300
   * @param {number} end  滚动距离(px), 300
   */
  horizontalScrolling(props: {
    el: Element;
    direction?: "left" | "right";
    speed?: number;
    end?: number;
  }) {
    // 缓动函数
    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const start = props.el.scrollLeft;
    const direction = props.direction || "right";
    const speed = props.speed || 300;
    const end =
      direction == "right"
        ? start + (props.end || 300)
        : start - (props.end || 300);
    const startTime = performance.now();

    const animateScroll = () => {
      const currentTime = performance.now();
      const elapsedTime = currentTime - startTime;
      const scrollPosition = easeInOutQuad(
        elapsedTime,
        start,
        end - start,
        speed
      );
      props.el.scrollLeft = scrollPosition;
      if (elapsedTime < speed) {
        requestAnimationFrame(animateScroll);
      }
    };
    animateScroll();
  },
  /**
   * 时间格式化
   * @param {number} timestamp
   * @param {string} type
   */
  formatTime(timestamp: number, type?: string) {
    // 补0
    const padZero = num => {
      return num < 10 ? "0" + num : num;
    };

    let datetime = new Date(timestamp);
    let year = datetime.getFullYear();
    let month = padZero(datetime.getMonth() + 1);
    let day = padZero(datetime.getDate());
    let hour = padZero(datetime.getHours());
    let minute = padZero(datetime.getMinutes());
    let second = padZero(datetime.getSeconds());

    switch (type) {
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      case "HH:mm:ss":
        return `${hour}:${minute}:${second}`;
      default:
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
  },

  /**
   * 数值处理
   * @param {number} gold
   * @param {boolean} ShowNo2
   */
  formatNewSlotGold(gold, ShowNo2 = false) {
    let leave = Math.abs(gold % 100);
    if (ShowNo2) {
      return `${Math.floor(gold / 100)}.${Math.floor(leave / 10)}${leave % 10}`;
    } else {
      let one = leave % 10;
      let showPoint =
        one > 0
          ? `${Math.floor(leave / 10)}${one}`
          : `${Math.floor(leave / 10)}`;
      let strShow = "";
      if (gold >= 0) {
        if (leave > 0) strShow = `${Math.floor(gold / 100)}.${showPoint}`;
        else strShow = `${Math.floor(gold / 100)}`;
      } else {
        if (leave > 0)
          strShow = `-${Math.floor(Math.abs(gold) / 100)}.${showPoint}`;
        else strShow = `-${Math.floor(Math.abs(gold) / 100)}`;
      }
      return strShow;
    }
  },

/**
 * 有小数时显示两位小数，没小数时不显示小数，为0时显示0,00
 * @param {number} num
 * @returns {string}
 */
 formatNum2Data(num,isShowZero = false) {
  const parsedNum = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(parsedNum)) return '';
  if (parsedNum === 0) return '0,00';
  
  // 如果isShowZero为true，强制显示两位小数
  if (isShowZero) {
    return parsedNum.toFixed(2).replace('.', ',');
  }
  
  // 判断是否有小数
  if (parsedNum % 1 === 0) {
      return parsedNum.toString();
  } else {
      return parsedNum.toFixed(2).replace('.', ',');
  }
},
  /**
   * 获取时间区间
   * @param {string} type
   */
  getTimestamp(type: string) {
    let timestamp = 0;

    let nowtime = new Date();
    var zeroDate = new Date(nowtime);
    zeroDate.setHours(0, 0, 0, 0);
    let startTime = zeroDate.getTime();

    let dayTimestamp = 3600 * 24 * 1000;
    switch (type) {
      case "today":
        timestamp = startTime;
        break;
      case "yesterday":
        timestamp = startTime - dayTimestamp * 1;
        break;
      case "day7":
        timestamp = startTime - dayTimestamp * 7;
        break;
      case "day15":
        timestamp = startTime - dayTimestamp * 15;
        break;
      case "day30":
        timestamp = startTime - dayTimestamp * 30;
        break;
    }

    return timestamp;
  },
  /**
   * 获取对应时间戳
   * @param {string} type
   */
  getTimeRange(type: string) {
    let now = new Date();
    let start = new Date(now);
    let end = new Date(now);

    switch (type) {
      case "all":
        return [946684800000, 4102272000000];
      case "today":
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return [start.getTime(), end.getTime()];
      case "yesterday":
        start.setDate(now.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(now.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        return [start.getTime(), end.getTime()];
      case "thisWeek":
        start.setDate(start.getDate() - start.getDay());
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() + (6 - end.getDay()));
        end.setHours(23, 59, 59, 999);
        return [start.getTime(), end.getTime()];
      case "lastWeek":
        start.setDate(start.getDate() - start.getDay() - 7);
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() - end.getDay() - 1);
        end.setHours(23, 59, 59, 999);
        return [start.getTime(), end.getTime()];
      case "lastMonth":
        start.setDate(1);
        start.setMonth(start.getMonth() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        return [start.getTime(), end.getTime()];
      case "day7":
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return [start.getTime(), end.getTime()];
      case "day15":
        start.setDate(now.getDate() - 14);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return [start.getTime(), end.getTime()];
      case "day30":
        start.setDate(now.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return [start.getTime(), end.getTime()];
      default:
        return [946684800000, 4102272000000];
    }
  },
  /**
   * 数组求和
   * @param {object} item
   * @param {string} key
   */
  arraySumVal(item: any, key: string) {
    if (typeof item == "object" && Array.isArray(item)) {
      return item.reduce(function (prev: number, curItem: any) {
        return prev + curItem[key];
      }, 0);
    } else {
      return 0;
    }
  },
  /**
   * 区间随机数
   * @param {number} min
   * @param {number} max
   */
  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  /**
   * 检测是否为app环境
   */
  isDLAppEnvironment() {
    const userAgent =
      navigator?.userAgent || navigator?.vendor || (window as any).opera;

    // 检测 iOS WebView
    const isiOSApp =
      /iPhone|iPod|iPad/i.test(userAgent) && !/Safari/i.test(userAgent);

    // 检测 Android WebView
    const isAndroidApp = /Android/i.test(userAgent) && /wv/.test(userAgent);

    return isiOSApp || isAndroidApp;
  },
  /**
   * sleep进程
   * @param {number} ms
   */
  setSleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  // 处理金额小数点
  formatStringToNumber(str: any): number {
    const num = parseFloat(str);
    if (isNaN(num)) {
      throw new Error('Invalid number');
    }

    if (num % 1 === 0) {
      // 如果是整数，直接返回
      return num;
    } else {
      // 如果是浮点数，找到小数点后第一个非零数字的位置，然后使用数学运算去掉尾随的0
      const parts = num.toString().split('.');
      if (parts.length === 1 || parts[1].replace(/0+$/, '') === '') {
        // 如果没有小数部分或全是0，返回整数
        return Math.trunc(num);
      } else {
        // 否则，使用数学运算去掉尾随的0
        const precision = parts[1].length - parts[1].replace(/0+$/, '').length;
        return parseFloat(num.toFixed(precision));
      }
    }
  },
  formatNum(input){
  // 如果是数字，保留两位小数并去掉多余的0；如果是字符串且能转成数字，按数字处理；其他情况返回0
    if (typeof input === 'number') {
      let num = Number(input.toFixed(2));
      // 去掉多余的0
      return parseFloat(num.toString());
    } else if (typeof input === 'string') {
      let num = parseFloat(input);
      if (!isNaN(num)) {
        num = Number(num.toFixed(2));
        return parseFloat(num.toString());
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  },

  // 保留数字后两位
  toFixed2(input: string | number): string {
    let num: number;
    // 将输入转换为 number 类型
    if (typeof input === 'string') {
      num = parseFloat(input);
      if (isNaN(num)) {
        throw new Error('Invalid number');
      }
    } else if (typeof input === 'number') {
      num = input;
    } else {
      throw new Error('Input must be a number or a numeric string');
    }
    
    // 修复浮点精度问题
    num = Math.round(num * 1e10) / 1e10;
    
    // 格式化数字
    if (Math.abs(num) < 1e-4) { // 如果接近0，直接返回"0"
      return '0';
    } else if (Math.abs(num) < 1e3) { // 小于1000，直接返回数字
      return num % 1 === 0 ? num.toString() : parseFloat(num.toFixed(2)).toString();
    } else if (Math.abs(num) < 1e6) { // 1000 - 999,999，使用 K 作为单位
      return num.toFixed(2);
      const formatted = num / 1e3;
      const rounded = Math.round(formatted * 10) / 10;
      return rounded % 1 === 0 ? `${rounded}K` : `${rounded.toFixed(1)}K`;
    } else { // 大于或等于 1,000,000，使用 M 作为单位
      return num.toFixed(2);
      const formatted = num / 1e6;
      const rounded = Math.round(formatted * 10) / 10;
      return rounded % 1 === 0 ? `${rounded}M` : `${rounded.toFixed(1)}M`;
    }
  },

  // 处理银行卡
  formatBankCard(cardNumber: string): string {
    if (cardNumber.length <= 8) {
      return cardNumber;
    }
    const prefix = cardNumber.substring(0, 4);
    const suffix = cardNumber.substring(cardNumber.length - 4);
    const maskedPart = '*'.repeat(cardNumber.length - 8);

    return `${prefix}${maskedPart}${suffix}`;
  },
  formatUSDTAddress(address: string): string {
    const prefix = address.substring(0, 8);
    const suffix = address.substring(address.length - 8);
    const maskedPart = '**********';

    return `${prefix}${maskedPart}${suffix}`;
  },
  // 支付页面时间特别处理
  formatDateTime(time) {
    const day = String(time.getDate()).padStart(2, '0');
    const month = String(time.getMonth() + 1).padStart(2, '0'); // 注意月份是从0开始的
    const year = time.getFullYear();
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  },
  // 节流  
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  // 防抖
  debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    };
  },
  
   /**
   * 处理图片路径，如果是中文路径则重定向到英文路径
   * @param {string} path 原始图片路径
   * @returns {string} 处理后的图片路径
   */
   handleImagePath(path: string) {
    // 如果路径中包含 /zh/ 则替换为 /en/
    return path.replace(/\/zh\//g, '/en/');
  }

};
