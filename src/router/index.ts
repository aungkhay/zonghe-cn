import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized
} from "vue-router";
import routes from "./routes";
import { useCachedViewStoreHook } from "@/store/modules/cachedView";
import NProgress from "@/utils/progress";
import setPageTitle from "@/utils/set-page-title";
import Common from "@/utils/common/common";
import { useUserStoreHook } from "@/store/modules/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    if(savedPosition){
      return savedPosition;
    }else{
      return { top: 0 }
    }
  }
});

export interface toRouteType extends RouteLocationNormalized {
  meta: {
    title?: string;
    noCache?: boolean;
  };
}

router.beforeEach((to: toRouteType, from, next) => {
  // NProgress.start();
  // 路由缓存
  useCachedViewStoreHook().addCachedView(to);
  // 页面 title
  setPageTitle(to.meta.title);

  // if(to.path === "/" || to.path === "/home"){
  //   //获取query并保存在变量中,非localstorage中
  //   const query = from.query;
  //   if(query && Object.keys(query).length > 0){
  //     useUserStoreHook().setQuery(query);
  //   }
  // }

  // home特殊重定向
  if (to.path === "/home") {
    // 从 /home 重定向到 /，保留查询参数
    next({ path: "/", query: to.query });
  } else {
    next();
  }
});


// 标记是否正在恢复参数，避免无限循环
let isRestoringParams = false;

router.afterEach((to) => {
  // NProgress.done();
  
  // 在首页且URL没有参数时，尝试从localStorage恢复参数
  if (to.path === "/" && Object.keys(to.query).length === 0 && !isRestoringParams) {
    // 先获取sId，没有的话获取uId
    const sId = Common.getStorage("sId");
    const uId = Common.getStorage("uId");
    
    let queryParams: any = {};
    
    if (sId) {
      // 去掉非数字
      const cleanSId = sId.replace(/\D/g, "");
      if (cleanSId) {
        queryParams.sId = cleanSId;
      }
    } else if (uId) {
      // 去掉非数字
      const cleanUId = uId.replace(/\D/g, "");
      if (cleanUId) {
        queryParams.uId = cleanUId;
      }
    }
    
    if (Object.keys(queryParams).length > 0) {
      try {
        // 设置标记，避免递归调用
        isRestoringParams = true;
        
        // 使用 replace 方法更新URL，避免在历史记录中添加新条目
        router.replace({ path: "/", query: queryParams }).finally(() => {
          // 重置标记
          isRestoringParams = false;
        });
      } catch (error) {
        console.error('从localStorage恢复参数失败:', error);
        isRestoringParams = false;
      }
    }
  }
});

export default router;
