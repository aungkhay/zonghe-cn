import Axios, { type AxiosInstance, type AxiosError } from "axios";
import NProgress from "../progress";
import { useUserStoreHook } from "@/store/modules/user";
import i18n from "@/lang/index/index";
import Base64 from "base-64";
import Common from "@/utils/common/common";
import { encryptBase64, encryptWithAes, generateAesKey, decryptWithAes, decryptBase64 } from '@/utils/crypto';
import { encrypt, decrypt } from '@/utils/jsencrypt';
import {
  showTipModel,
  showLoadingModel,
  hideLoadingModel
} from "@/components/TipModel/index.js";
import router from "@/router";
const encryptHeader = 'encrypt-key';

export interface BaseResponse<T = any> {
  code: number;
  data: {
    total: number;
    rows: any[];
    code: number;
    data: T;
    msg: string;
  };
}



class Http {
  private static axiosInstance: AxiosInstance;
  private static baseUrl = "";

  constructor() {
    Http.baseUrl = import.meta.env.VITE_BASE_URL;
    Http.axiosInstance = Axios.create({
      baseURL: Http.baseUrl,
      timeout: 15000,
      headers: {
        "content-type": "application/json; charset=gtb",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer ",
        // java给的固定配置参数
        clientid: import.meta.env.VITE_CLIENT_ID,
        referer2: `${window.location.protocol}//${window.location.host}`
      }
    });

    this.httpInterceptorsRequest();
  }

  // 请求拦截
  private httpInterceptorsRequest(): void {
    Http.axiosInstance.interceptors.request.use(
      config => {
        // NProgress.start();
        const token = useUserStoreHook().token;
        // 是否需要加密
        const isEncrypt = config.headers?.isEncrypt === 'true';
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        if(window["flutter_inappwebview"] != null){
          config.headers["x-app"] = "flutter";
        }
        return config;
      },
      (error: AxiosError) => {
        this.errorTip(`Http Interceptors Request Fail: ${error.message}`);
        return Promise.reject(error);
      }
    );
  }

  private requestPromise<T>(
    option: any,
    lodingMsg: string,
    handlingError: boolean,
    handlingCache: number,
    isEncrypt: boolean
  ) {
    if (useUserStoreHook().isBozhu) {
      option.baseURL = import.meta.env.VITE_BASE_URL_BOZHU;
    }

    if (lodingMsg != "") {
      showLoadingModel({
        message: lodingMsg == 'loading' ? '加载中...' : lodingMsg
      });
    }

    const cacheKey = "CACHEURI_" + Base64.encode(option.url);
    if (handlingCache == 2) {
              const cachedDataStr: any = Common.getStorage(cacheKey);

        if (cachedDataStr != null) {
          const cachedData = JSON.parse(cachedDataStr);
        // return {
        //   code: cachedData.data.code,
        //   data: cachedData.data
        // };
        return Promise.resolve({
          code: cachedData.data.code,
          data: cachedData.data
        } as BaseResponse<T>);
      }
    }

    let startTime = Date.now();
    return new Promise<BaseResponse<T>>((resolve, reject) => {
      Http.axiosInstance
        .request(option)
        .then((response: any) => {
          // 模拟一个网速
          let endTime = Date.now();
          let duration = 200 - (endTime - startTime) / 10;
          duration = duration < 1 ? 50 : duration;
          useUserStoreHook().updatePlayerInfo("network", Math.ceil(duration));

          if (lodingMsg != "") {
              hideLoadingModel();
          }
          // let newData = new Date();
          // console.log(common.formatDateTime(newData), '----请求时间', option.url)
          if (response.status == 201 || response.status == 200) {
            // 验证一天，超时重新登录
            if (response.data.code == 401) {
              //从网页url中获取token，如果没有，则重新登录
              const urlParams = new URLSearchParams(window.location.search);
              if (!urlParams.has('token')) {
                this.errorTip(i18n.global.t("401"));
                useUserStoreHook().outLogin();
              }
            }
            if(response.data.code == 101001){
              router.push('/maintain');
              return;
            }

            if (response.data.code == 200 || handlingError == true) {
              let result = {
                code: response.data.code,
                data: response.data,
              };

              // 记录缓存
              if (handlingCache == 3) {
                Common.setStorage(cacheKey, JSON.stringify(result));
              }

              resolve(result);
            } else {
              //业务错误码异常
              if(i18n.global.te(response.data.code)){
                this.errorTip(i18n.global.t(response.data.code));
              }else{
                if (Common.getCurLang() === 'zh') {
                  this.errorTip(response.data.msg);
                }else{
                  this.errorTip('error '+i18n.global.t(response.data.code));
                }
              }
              reject(response);
            }
          } else {
            //通用响应异常
            if (handlingError != true)
              this.errorTip(`Req Fail: ${i18n.global.t("100999")}`);
          }
        })
        .catch(error => {
          useUserStoreHook().updatePlayerInfo("network", 0);
          if (lodingMsg != "") {
            hideLoadingModel();
          }
          // 未知异常
          if (handlingError != true)
            // 只在用户为中文时输出error.message
            if (Common.getCurLang() === 'zh') {
              this.errorTip(`${option.url} Req Fail: ${error.message}`);
            } else {
              this.errorTip(`${option.url} Req Fail: ${i18n.global.t("f_network_error")}`);
            }
        });
    });
  }

  // @description GET请求参数拼接
  private formatUrl(params) {
    if (params) {
      let data = [];
      for (let key in params) {
        data.push(key + "=" + params[key]);
      }

      // let lang = useUserStoreHook().playerInfo.language;
      // data.push(`lang=${lang}`);

      return data.join("&");
    }
  }

  // @description POST请求参数处理
  private formatParams(params) {
    let data = {};
    for (let key in params) {
      data[key] = params[key];
    }
    // let lang = useUserStoreHook().playerInfo.language;
    // data["lang"] = lang;
    return data;
  }

  private errorTip(message: string) {
    showTipModel({
      type: 1,
      icon: "fail",
      title: message
    });
  }

  /*
    url: 'tapout-api/jackpot',    //必传 请求地址
    method: 'POST',     //非必传(默认GET)  请求方式 GET POST  DELETE  PUT
    data:{				//非必传 请求参数
        A:aaaa,
        B:bbbb
    },
    lodingMsg:'loading',   //非必传 请求加载提示
    handlingError: true,    //非必传 设置为true 业务代码自行处理code非200异常情况  非用户主动交互建议设置为ture
    timeout: 3,   //非必传  默认15秒
    isEncrypt: true // 非必传 是否加密
  */
  public async spRequest<T>(option) {
    let reData: any = {
      method: "POST",
      url: option.url,
      timeout: 15000,
      data: {}
    };

    let lodingMsg = "";
    if (typeof option.lodingMsg != "undefined" && option.lodingMsg != "") {
      lodingMsg = option.lodingMsg;
    }

    let handlingError = false;
    if (typeof option.handlingError != "undefined") {
      handlingError = option.handlingError;
    }

    let handlingCache = 1; //1 正常请求  2 获取缓存数据 3 请求成功对数据进行缓存
    if (typeof option.handlingCache != "undefined") {
      handlingCache = option.handlingCache;
    }

    if (typeof option.method != "undefined" && option.method != "") {
      reData.method = option.method;
    }

    if (typeof option.timeout != "undefined") {
      reData.timeout = option.timeout * 1000;
    }

    let params = {};
    if (typeof option.data != "undefined") {
      params = option.data;
    }

    const isEncrypt = option.isEncrypt === true;

    switch (option.method) {
      case "GET":
        params = this.formatUrl(params);
        reData.url = params ? reData.url + "?" + params : reData.url;
        break;
      default:
        params = this.formatParams(params);
        reData.data = params;
        // 添加加密逻辑
        if (isEncrypt && import.meta.env.VITE_APP_ENCRYPT === 'true') {
          const aesKey = generateAesKey();
          reData.headers = {
            ...reData.headers,
            [encryptHeader]: encrypt(encryptBase64(aesKey))
          };
          reData.data = typeof reData.data === 'object' ? encryptWithAes(JSON.stringify(reData.data), aesKey) : encryptWithAes(reData.data, aesKey);
        }
        break;
    }

    return await this.requestPromise<T>(
      reData,
      lodingMsg,
      handlingError,
      handlingCache,
      isEncrypt
    );
  }
}

export const http = new Http();
