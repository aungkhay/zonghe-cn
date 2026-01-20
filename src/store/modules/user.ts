import { defineStore } from "pinia";
import { store } from "@/store";
import router from "@/router/index";
import Common from "@/utils/common/common";
import { useRoute } from "vue-router";
import { loginApi } from "@/api/user";

const PlayerInfoKey = "__user__info__";
const vipInfoKey = "__user__vip__";
const UserTokenKey = "__user__token__";
const BoZhuKey = "__user__bozhu__";
const UserLangKey = "__user__lang__";
const TeleGroupUrlKey = "_user_telegroupurl_";
const shareInfoKey = "_user_share_";

// 获取URL查询参数的辅助函数
const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result: { [key: string]: string } = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};


const getToken = () => {
  const token = window.localStorage.getItem(UserTokenKey);
  if (token) {
    return token;
  } else {
    return "";
  }
};

const isBozhu = () => {
  return window.localStorage.getItem(BoZhuKey) == "true";
};

const getPlayerInfo = () => {
  const PlayerInfo = window.localStorage.getItem(PlayerInfoKey);
  if (PlayerInfo) {
    return JSON.parse(PlayerInfo);
  } else {
    return {};
  }
};

const getVipInfo = () => {
  const vipInfo = window.localStorage.getItem(vipInfoKey);
  if (vipInfo) {
    return JSON.parse(vipInfo);
  } else {
    return {};
  }
};

const getShareInfo = () => {
  const shareInfo = window.localStorage.getItem(shareInfoKey);
  if (shareInfo) {
    return JSON.parse(shareInfo);
  } else {
    return {};
  }
};

const isLogin = () => {
  // 检查localStorage中是否有有效的token和用户信息
  const token = window.localStorage.getItem(UserTokenKey);
  const PlayerInfo = window.localStorage.getItem(PlayerInfoKey);
  if (token && PlayerInfo) {
    return true;
  } else {
    // 如果localStorage中没有，检查URL中是否有token正在处理
    //If not in localStorage, check if there is a token in the URL being processed
    const urlParams = getUrlParams();
    if (urlParams.token) {
      // URL中有token，但还未完成登录流程，返回false
      //There is a token in the URL, but the login process has not been completed yet, so it returns false.
      return false;
    }
    return false;
  }
};

const getLang = () => {
  const lang = Common.getStorage(UserLangKey);
  if (lang) {
    return String(lang);
  } else {
    return "zh";
  }
};

const getTeleGroupUrl = () => {
  const url = window.localStorage.getItem(TeleGroupUrlKey);
  if (url) {
    return url;
  } else {
    return "";
  }
};

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    isDLApp: false,
    token: getToken(),
    isBozhu: isBozhu(),
    playerInfo: getPlayerInfo(),
    isLogin: isLogin(),
    showLogin: false,
    isTokenLogined: false, //是否已经处理过URL中的token
    loginTabCurrent: "login",
    lang: getLang(),
    teleGroupUrl: getTeleGroupUrl(),
    vipInfo: getVipInfo(),
    shareInfo: getShareInfo(),
    isExiting:false,  //刚退出后不弹未登录提出框
    showForgetPwd:false, //显示忘记密码
    clearLoginForm: false, // 是否需要清空登录表单
  }),
  actions: {
    // 处理URL中的token参数并进行登录
    async handleUrlToken() {
      const urlParams = getUrlParams();
      if (urlParams.token) {
        console.log('处理URL中的token:', urlParams.token);
        
        try {
          const regData: any = {
            grantType: "token",
            clientId: import.meta.env.VITE_CLIENT_ID,
            host: window.location.origin,
            token: urlParams.token // 使用URL中的实际token
          };

          const { code, data }: any = await loginApi(regData);
          if (code == 200) {
            const { user_info, telegram, access_token, client_id } = data.data;
            
            console.log('Token登录API调用成功，开始更新状态');
            
            // 保存telegram信息
            Common.setStorage("telegram", telegram);
            if (regData.username) {
              Common.setStorage("lnUsername", regData.username);
            }
            
            // 调用login方法保存用户信息和更新状态
            this.login(access_token, user_info);
            
            // 确保登录状态更新
            this.isLogin = true;
            
            // 关闭登录弹窗
            this.closeLogin();
            
            // 清除URL中的token参数，避免重复处理
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('token');
            window.history.replaceState({}, '', newUrl.toString());
            
            console.log('Token登录成功，状态已更新');
            console.log('当前登录状态:', this.isLogin);
            console.log('当前用户信息:', this.playerInfo);
            
            return true;
          } else {
            console.error('Token登录失败:', data);
            return false;
          }
        } catch (error) {
          console.error('Token登录请求失败:', error);
          return false;
        }
      }
      return false;
    },
    login(token: string, playerInfo: any) {
      window.localStorage.setItem(UserTokenKey, token);
      window.localStorage.setItem(PlayerInfoKey, JSON.stringify(playerInfo));
      // Default to 'zh' if backend returns 'en', empty, or invalid value
      const backendLang = playerInfo.language;
      const defaultLang = (!backendLang || backendLang === 'en' || backendLang === 'null' || backendLang === 'undefined') ? 'zh' : backendLang;
      this.changeLang(defaultLang);
      this.update();
    },
    outLogin(isRouter:boolean = true) {
      if(isRouter){
        router.push("/");
      }
      window.localStorage.removeItem(UserTokenKey);
      window.localStorage.removeItem(PlayerInfoKey);
      window.localStorage.removeItem(BoZhuKey);
      this.isBozhu = isBozhu();
      this.clearLoginForm = true; // 触发清空登录表单
      this.update();
    },
    updatePlayerInfo(key: string, value: any) {
      let playerInfo = getPlayerInfo();
      playerInfo[key] = value;
      window.localStorage.setItem(PlayerInfoKey, JSON.stringify(playerInfo));
      this.playerInfo = playerInfo;
    },
    setShareInfo(shareInfo: any) {
      window.localStorage.setItem(shareInfoKey, JSON.stringify(shareInfo));
      this.shareInfo = shareInfo;
    },
    changePlayerInfo(playerInfo: any) {
      window.localStorage.setItem(PlayerInfoKey, JSON.stringify(playerInfo));
      this.playerInfo = playerInfo;
    },
    changeVipInfo(vipInfo: any) {
      window.localStorage.setItem(vipInfoKey, JSON.stringify(vipInfo));
      this.vipInfo = vipInfo;
    },
    changeBozhu(status = false) {
      window.localStorage.setItem(BoZhuKey, String(status));
      this.isBozhu = isBozhu();
    },
    changeLang(lang: string) {
      Common.setStorage(UserLangKey, Common.getParamsLangName(lang));
      this.lang = getLang();
    },
    changeTeleGroupUrl(url: string) {
      window.localStorage.setItem(TeleGroupUrlKey, url);
      this.teleGroupUrl = getTeleGroupUrl();
    },
    update() {
      this.token = getToken();
      this.playerInfo = getPlayerInfo();
      this.isLogin = isLogin();
    },
    openLogin(tabCurrent: "login" | "register" = "login") {
      this.showLogin = true;
      this.loginTabCurrent = tabCurrent;
    },
    closeLogin() {
      this.showLogin = false;
    },
    openForgetPwd(){
      this.closeLogin()
      this.showForgetPwd = true;
    },
    closeForgetPwd(){
      this.showForgetPwd = false;
    },
    resetClearLoginForm() {
      this.clearLoginForm = false;
    },
    setToken() {
      this.token = getToken();
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
