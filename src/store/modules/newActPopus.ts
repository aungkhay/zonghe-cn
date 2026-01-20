import { defineStore } from "pinia";
import { store } from "@/store";
import { useUserStoreHook } from "@/store/modules/user";
import Common from "@/utils/common/common";
import { getPupupList } from "@/api/activityPopup";
import { loopPictureApi } from "@/api/home";

interface PopupConfig {
  isOpen: boolean;
  isShow: boolean;
  icon?: string;
  lastShownTime?: number;
  order: number;
  isShowData: boolean;
}

interface PopupState {
  [key: string]: PopupConfig;
}

export const useNewActPopupStore = defineStore({
  id: "new-act-popup",
  state: () => ({
    popups: {
      newActivity: {
        isOpen: false,
        isShow: false,
        icon: "",
        lastShownTime: null,
        order: 1,
        isShowData: false
      },
      activeTotalRecharge: {
        isOpen: false,
        isShow: false,
        icon: "",
        lastShownTime: null,
        order: 2,
        isShowData: false
      },
      marquee: {
        isOpen: false,
        isShow: false,
        icon: "",
        lastShownTime: null,
        order: 3,
        isShowData: false
      },
      downloadActivity: {
        isOpen: false,
        isShow: false,
        icon: "",
        lastShownTime: null,
        order: 4,
        isShowData: false
      },
      registerActivity: {
        isOpen: false,
        isShow: false,
        icon: "",
        lastShownTime: null,
        order: 5,
        isShowData: false
      }
      // 可以在这里添加更多弹窗配置
    } as PopupState,
    currentPopup: null as string | null
  }),

  actions: {
    // 显示指定弹窗
    showPopup(popupKey: string) {
      if (this.currentPopup) return;
      
      this.currentPopup = popupKey;
      this.popups[popupKey].isShow = true;
      this.popups[popupKey].isShowData = true;
    },

    // 关闭指定弹窗并尝试显示下一个
    closePopup(popupKey: string, isNeedOpenNextFresh:boolean = false) {
      this.popups[popupKey].isShow = false;
      this.popups[popupKey].isOpen = false;
      this.currentPopup = null;
      
      // 记录关闭状态
      // Common.setStorage(
      //   `${useUserStoreHook().playerInfo.userId}_popupClosed_${popupKey}`,
      //   'true'
      // );
      if(!isNeedOpenNextFresh){
         var now = Date.now();
         Common.setStorage(
          `${useUserStoreHook().playerInfo.userId}_lastShownTime_${popupKey}`,
          now.toString()
        );
      }
 // 尝试显示下一个弹窗
//  if(popupKey == "newActivity"){
  this.showNextPopup();
//  }
      
     
     
    },

    // 显示下一个可用的弹窗
    showNextPopup(mustPop:boolean = false) {
      // 获取所有可显示的弹窗并按顺序排序
      const availablePopups = Object.entries(this.popups)
        .filter(([_, popup]) => {
          const popupConfig = popup as PopupConfig;
          return popupConfig.isOpen && !popupConfig.isShow;
        })
        .sort((a, b) => (a[1] as PopupConfig).order - (b[1] as PopupConfig).order);

      // 找到第一个可以显示的弹窗
      for (const [popupKey, popup] of availablePopups) {
        const popupConfig = popup as PopupConfig;
        const now = Date.now();
        const lastShownTime = popupConfig.lastShownTime || 0;
        
        // 如果mustPop为true，直接显示弹窗，否则检查是否已经过了24小时
        if (mustPop || now - lastShownTime >= 24 * 60 * 60 * 1000) {
          this.showPopup(popupKey);
          popupConfig.lastShownTime = now;
          // Common.setStorage(
          //   `${useUserStoreHook().playerInfo.userId}_lastShownTime_${popupKey}`,
          //   now.toString()
          // );
          break;
        }
      }
    },

    // 检查并自动显示符合条件的弹窗
    checkAndShowPopup(popupKey: string) {
      const popup = this.popups[popupKey];
      if (!popup.isOpen || this.currentPopup) return;

      const now = Date.now();
      const lastShownTime = popup.lastShownTime || 0;
      
      // 检查是否已经过了24小时
      if (now - lastShownTime >= 24 * 60 * 60 * 1000) {
        this.showPopup(popupKey);
        popup.lastShownTime = now;
        // Common.setStorage(
        //   `${useUserStoreHook().playerInfo.userId}_lastShownTime_${popupKey}`,
        //   now.toString()
        // );
      }
    },

    // 从本地存储加载弹窗状态
    loadPopupState(popupKey: string) {
      // const isClosed = Common.getStorage(`${useUserStoreHook().playerInfo.userId}_popupClosed_${popupKey}`);
      // if (isClosed === 'true') {
      //   this.popups[popupKey].isOpen = false;
      // }

      const lastShownTime = Common.getStorage(`${useUserStoreHook().playerInfo.userId}_lastShownTime_${popupKey}`);
      const newActivityLastShownTime = Common.getStorage(`${useUserStoreHook().playerInfo.userId}_lastShownTime_newActivity`);
      
      let finalLastShownTime = 0;
      
      if (lastShownTime) {
        finalLastShownTime = parseInt(lastShownTime, 10);
      }
      
      if (newActivityLastShownTime) {
        const newActivityTime = parseInt(newActivityLastShownTime, 10);
        finalLastShownTime = Math.max(finalLastShownTime, newActivityTime);
      }
      
      if (finalLastShownTime > 0) {
        this.popups[popupKey].lastShownTime = finalLastShownTime;
      }
    },

    // 更新弹窗配置
    updatePopupConfig(popupKey: string, config: Partial<PopupConfig>) {
      this.popups[popupKey] = {
        ...this.popups[popupKey],
        ...config
      };
    },

    // 初始化所有弹窗
    async initPopups() {
      // if (useUserStoreHook().isLogin !== true) {
      //    return false;
      // }
      this.getPopupListApi();
      if (useUserStoreHook().isLogin == true){
         this.getActivePopupListApi();
      }
      Object.keys(this.popups).forEach(popupKey => {
        this.loadPopupState(popupKey);
      });
      // 初始化时显示第一个可用的弹窗
      this.showNextPopup();
    },

    async getPopupListApi(){
        const { code, data } = await getPupupList()
        if(code == 200){
            const list = data.data.filter((item) => item.isOpen == 1);
            this.popups.newActivity.isOpen = list.length > 0;
        
        }
     },

     async openPopup(popupKey: string){
        this.popups[popupKey].isShow = true;
        this.popups[popupKey].isShowData = true;
     },

     async getActivePopupListApi(){
        const { code, data } = await loopPictureApi()
        if(code == 200){
            const list = data.data.filter((item) => item.isOpen == 1 && item.isPop == 1);
            list.forEach((item) => {
                if(item.enumStr == "ACTIVE_TOTAL_RECHARGE"){
                   this.popups.activeTotalRecharge.isOpen = true;
                }


                if(item.enumStr == "ACTIVE_TURN_TABLE"){
                   this.popups.marquee.isOpen = true;
                }
                
                if(item.enumStr == "ACTIVE_DOWN_LOAD_APP"){
                   this.popups.downloadActivity.isOpen = true;
                }

                if(item.enumStr == "ACTIVE_REGISTER"){
                   this.popups.registerActivity.isOpen = true;
                }                
            });
        }
     }
  }


});

export function useNewActPopupStoreHook() {
  return useNewActPopupStore(store);
}
