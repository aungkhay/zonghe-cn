import { http } from "@/utils/http";

export async function globalActivityApi(params?: object, handlingCache = 1) {
  return await http.spRequest({
    url: "home-page/activity-list",
    handlingError: false,
    handlingCache: handlingCache,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

export async function fuxingTaskListApi(params?: object) {
  return await http.spRequest({
    url: "task/list",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

export async function updateFuxingTaskApi(params?: object) {
  return await http.spRequest({
    url: `task/completeTask?taskId=${params}`,
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

export async function fuxingTaskDrawApi(params?: object) {
  return await http.spRequest({
    url: `task/receiveTaskReward?taskId=${params}`,
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}
