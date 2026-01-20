import Common from "@/utils/common/common";

// release 模式下，禁用调试
const disableRelInsp = async function () {
  while (true) {
    const isDebugEnable = !(
      -1 !== window.location.hostname.indexOf("localhost") ||
      -1 !== window.location.hostname.indexOf("192.168.")
    );
    if (isDebugEnable) {
      // eval("debugger");
      await Common.setSleep(250);
    } else {
      break;
    }
  }
};

disableRelInsp();

function getHashParams(url: string): { [key: string]: string } {
  const urlObj = new URL(url);
  const params = new Proxy(
    {},
    {
      get: (target, prop: string) =>
        urlObj.hash
          .split("?")[1]
          ?.split("&")
          .reduce((params, pair) => {
            const [key, value] = pair.split("=");
            return { ...params, [key]: decodeURIComponent(value || "") };
          }, {} as { [key: string]: string })[prop] || ""
    }
  );
  return params;
}

// 初始化浏览器数据
const initParams = () => {
  try {
    let options: any = {};

    if (window.location.search) {
      const urlSearchParams = new URLSearchParams(window.location.search);
      options = Object.fromEntries(urlSearchParams.entries());
    }

    let { fb } = options;
    if (fb) {
      Common.setStorage("fb", fb);
    }
    //改为获取query参数 
    let uId =  (new URLSearchParams(window.location.search)).get('uId');
    if (uId) {
      uId = uId.replace(/\D/g, '');
      Common.setStorage("uId", uId);
      Common.removeStorage("sId");
      Common.removeStorage("isB");
    }

    let sId = (new URLSearchParams(window.location.search)).get('sId');
    if (sId) {
      sId = sId.replace(/\D/g, '');
      Common.setStorage("sId", sId);
      let isB = getHashParams(window.location.href).isB;
      if (isB) {
        Common.setStorage("isB", isB);
      }
      Common.removeStorage("uId");
    }
  } catch (e) {}
};

initParams();
