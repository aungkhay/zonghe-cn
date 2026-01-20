import { defineStore } from "pinia";
import { store } from "@/store";
import router from "@/router/index";
import { useUserStoreHook } from "@/store/modules/user";
import { globalActivityApi } from "@/api/promo/index";
import { breakthroughApi, getFloatingIconList, getPupupList, secondRechargeApi } from "@/api/activityPopup/index";
import Common from "@/utils/common/common";
import { copyFileSync } from "fs";

const actPopupKey = "__act_popup_store__";

export const useActPopupStore = defineStore({
  id: "act-popup",
  state: () => ({
    globalRedDot: {
      tabbarPromo: 0,
      tabbarProfile: 0,
      tabbarTaurus: 0,
      tabbarVip: 0,
      tabbarMail: 0
    },
    // 各种弹窗控制 参数 isOpen 是否需要弹出  isShow 控制组件弹出状态 icon 右下角图标 为空不展示
    // autoShow 自动弹出次数  redDot 红点数量
    currentPopup: null,
    popBoxShow: {
      //破产礼包东山再起
      preferenceGiftBag: {
        isOpen: false,
        isShow: false,
        icon: "icon_Desconto",
        order: 1,
      },
      // 复充
      buyAgain: {
        isOpen: false,
        isShow: false,
        icon: "icon_buyagain",
        order: 2,
      },
      // 三推荐礼包
      thirdRecharge: {
        isOpen: false,
        isShow: false,
        icon: "icon_thirdRecharge",
        order: 4,
      },
      // 免费转盘
      marquee: {
        isOpen: false,
        isShow: false,
        icon: "icon_marquee",
        order: 3,
      },
      // 公告
      facePic: {
        isOpen: false,
        isShow: false,
        icon: "",
        order: 5
      },

      // 新活动
      newActivity: {
        isOpen: false,
        isShow: false,
        icon: "",
        order: 1
      }
    },
    // 场景礼包
    globalActivity: [
      {
        key: 'thirdRecharge',
        icon: "icon_thirdRecharge",
      },
      {
        key: 'marquee',
        icon: "icon_marquee",
      }
    ],
    // 首页活动固定展示
    swipeIcon: [
      // {
      //   key: 'thirdRecharge',
      //   icon: "icon_thirdRecharge",
      // },
      // {
      //   key: 'marquee',
      //   icon: "icon_marquee",
      // }
    ]
  }),
  actions: {
    popupBoxRefresh() {
      for (let i in this.popBoxShow) {
        this.popBoxShow[i].isOpen = false;
      }
    },
    popupBoxShow(boxKey: string) {
      // 检查是否已经有弹框正在显示
      if (this.currentPopup !== null) {
        // 如果有，不显示新的弹框
        return;
      }

      // 显示新的弹框
      this.currentPopup = boxKey;

      this.popBoxShow[boxKey].isShow = true;

      // 监听弹框关闭事件，一旦关闭，调用showNextPopup
      this.showNextPopup();
    },
    loadPopupPreferencesFromLocalStorage() {
      // 初始化查看本地弹框状态
      Object.keys(this.popBoxShow).forEach((boxKey) => {
        const isClosed = localStorage.getItem(`${useUserStoreHook().playerInfo.userId}_popupClosed_${boxKey}`);
        if (isClosed === 'true') {
          this.popBoxShow[boxKey].isOpen = false;
        }
        const lastShownTime = Common.getStorage(`${useUserStoreHook().playerInfo.userId}_lastShownTime_${boxKey}`);
        if (lastShownTime) {
          this.popBoxShow[boxKey].lastShownTime = parseInt(lastShownTime, 10);
        }
      });
    },
    popupBoxAutoShow() {
      if (this.currentPopup !== null) {
        return; // 如果当前有弹框正在显示，不进行任何操作
      }

      let orderArr = [];
      Object.keys(this.popBoxShow).forEach((boxKey) => {
        orderArr.push({
          ...this.popBoxShow[boxKey],
          boxKey,
        });
      });

      orderArr.sort((a, b) => a.order - b.order);
      const now = Date.now();
      const eligibleBox = orderArr.find(box =>
        box.isOpen === true &&
        (!box.lastShownTime || now - box.lastShownTime >= 24 * 60 * 60 * 1000)
      );
      if (eligibleBox) {
        this.popupBoxShow(eligibleBox.boxKey);
        Common.setStorage(`${useUserStoreHook().playerInfo.userId}_lastShownTime_${eligibleBox.boxKey}`, now.toString());
      }
    },
    // 弹窗关闭方法 isAuto 根据业务判断是否暂时阻断自动弹窗
    popupBoxClose(boxKey) {
      this.popBoxShow[boxKey].isShow = false;
      this.popBoxShow[boxKey].isOpen = false;
      Common.setStorage(`${useUserStoreHook().playerInfo.userId}_popupClosed_${boxKey}`, 'true');
      if (this.currentPopup === boxKey) {
        this.currentPopup = null;
        this.showNextPopup();
      }
    },
    showNextPopup() {
      this.popupBoxAutoShow();
    },
    // 改变参数值
    changeValue(boxKey: string, parKey: string, value: any) {
      this.popBoxShow[boxKey][parKey] = value;
    },
    addIfNotExists(key: string, icon: string): void {
      // 查找是否有相同的 key 已经存在于数组中
      const exists = this.globalActivity.some((activity) => activity.key === key);

      // 如果不存在，则添加新的对象
      if (!exists) {
        this.globalActivity.push({ key, icon });
      }
    },
    removeObjIfExists(array, key, value: any): void {
      const index = array.findIndex((item) => item[key] === value);
      if (index !== -1) {
        array.splice(index, 1);
      }
    },
    //是否破产 
    async getbreakthrough() {
      let localbreakthrough = Common.getStorage(`${useUserStoreHook().playerInfo.userId}_breakthrough`)
      if (!localbreakthrough) {
        const { code, data }: any = await breakthroughApi()
        if (code == 200 && (data.data != '' || data.data != null)) {
          const { status } = data.data
          // 状态0不用请求接口
          switch (status) {
            case 0:
              Common.setStorage(`${useUserStoreHook().playerInfo.userId}_breakthrough`, 'true')
              this.removeObjIfExists(this.globalActivity, 'key', 'preferenceGiftBag')
              break;
            case 1:
              this.popBoxShow.preferenceGiftBag.isOpen = true;
              this.addIfNotExists('preferenceGiftBag', "icon_Desconto");
              break;
            case 2:
              this.removeObjIfExists(this.globalActivity, 'key', 'preferenceGiftBag')
              break;
          }


        }
      }
    },
    // 是否复冲
    async getsecondRechargeApi() {
      let localSecond = Common.getStorage(`${useUserStoreHook().playerInfo.userId}_secondRecharge`)
      if (!localSecond) {
        const { code, data }: any = await secondRechargeApi()
        if (code == 200) {
          const { status } = data.data
          switch (status) {
            case 0:
              Common.setStorage(`${useUserStoreHook().playerInfo.userId}_secondRecharge`, 'true')
              this.removeObjIfExists(this.globalActivity, 'key', 'buyAgain')
              break;
            case 1:
              if(this.popBoxShow.buyAgain.isOpen == false) this.popBoxShow.buyAgain.isOpen = true;
              this.addIfNotExists('buyAgain', "icon_buyagain");
              break;
            case 2:
              this.removeObjIfExists(this.globalActivity, 'key', 'buyAgain')
              break;
          }
        }
      }
    },

    async getFloatingIconListApi(){
      const { code, data }: any = await getFloatingIconList()
      if(code == 200){
         console.log("data",data.data);
      }
    },

    async getPopupListApi(){
       const { code, data } = await getPupupList()
       if(code == 200){
          console.log("data",data.data);
       }
    },


    async popupBoxData() {
      // if (useUserStoreHook().isLogin !== true) {
      //    return false;
      // }
 

      // 默认每日弹出  TOOD 暂时都先取消
      // this.popBoxShow.marquee.isOpen = true;
      // this.popBoxShow.thirdRecharge.isOpen = true;
      // this.popBoxShow.facePic.isOpen = true;
       
      await this.getPopupListApi();
      // await this.getFloatingIconListApi();
     


      // 特定礼包
      //TODO 破产礼包没有用了 先放下呀
      // await this.getbreakthrough()
      await this.getsecondRechargeApi()
      // 本地存储
      await this.loadPopupPreferencesFromLocalStorage()
      await this.popupBoxAutoShow();
    }
  }
});

export function useActPopupStoreHook() {
  return useActPopupStore(store);
}
