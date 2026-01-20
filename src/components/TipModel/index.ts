import { createApp } from "vue";
import TipModelVue from "./index.vue";
import i18n from "@/lang/index/index";

let tipDom = null;
let app = null;
const TipModel = () => {
  const dom = document.body.querySelector(".tip-model");
  // 元素是否存在
  if (!dom) {
    // 创建元素节点
    tipDom = document.createElement("div");
    // 给元素设置class
    tipDom.className = "tip-model";
    // 在body标签内部插入此元素
    document.body.appendChild(tipDom);
  } else {
    if (app) {
      app.unmount();
    }
  }

  // 创建应用实例
  app = createApp(TipModelVue);
  app.use(i18n);
  // 将实例挂载到创建的 DOM 元素上
  return app.mount(tipDom);
};

const showTipModel = (options: {
  type: 1 | 2 | 3 | 4;
  icon?: "success" | "fail";
  showXX?: Boolean;
  title?: String;
  subTitle?: String;
  yesBtnText?: String;
  cancelBtnText?: String;
  success?: Function;
  cancel?: Function;
  mBLandscape?: Boolean;
}) => {
  if (options.type) {
    TipModel().showModel(options);
  }
};

const showLoadingModel = (options?: { message?: string; color?: string,loadType?:number }) => {
  //判空
  const tipModel = TipModel();
  if (tipModel && tipModel.changeLoading) {
    tipModel.changeLoading({
      state: true,
      message: options?.message,
      color: options?.color,
      loadType: options?.loadType
    });
  }
};

const hideLoadingModel = () => {
  try {
    TipModel().changeLoading({
      state: false,
      message: "",
      color: "#fff"
    });
  } catch (error) {
    
  }
  
};

export { showTipModel, showLoadingModel, hideLoadingModel };
