import { http } from "@/utils/http";

export async function roomEnterInfosApi(params?: object) {
  return await http.spRequest({
    url: "tapout-api/roomEnterInfos",
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: {}
  });
}

// 大厅热门游戏
export async function gameListApi() {
  return await http.spRequest({
    url: "game-list/lobby-list",
    handlingError: false,
    method: "GET"
  });
}

// 类型游戏
export async function gameTypeListApi(pageObj?:any , params?: any) {
  return await http.spRequest({
    url: `game-list/list?pageSize=${pageObj.pageSize}&pageNum=${pageObj.pageNum}`,
    handlingError: false,
    method: "POST",
    data: params,
  });
}

// slot筛选游戏
export async function slotGameListApi(pageObj?:any ,params?: object) {
  return await http.spRequest({
    url: `game-list/list?pageSize=${pageObj.pageSize}&pageNum=${pageObj.pageNum}`,
    handlingError: false,
    method: "POST",
    data:params,
  });
}

// 是否可以加入游戏
export async function checkJoinGame(id: any) {
  return await http.spRequest({
    url: `app-user/check-join-game/${id}`,
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
  });
}
// 进入游戏
export async function joinGame(id: any) {
  return await http.spRequest({
    url: `app-user/join-game/${id}`,
    handlingError: true,
    method: "GET",
    // lodingMsg: "loading",
  });
}
// 自动加入上次的游戏
export async function autoJoinGameApi(params?: object) {
  return await http.spRequest({
    url: "app-user/auto-join-game",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}
// 获取玩过游戏列表
export async function playedGame() {
  return await http.spRequest({
    url: `/app-user/get-played-games`,
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
  });
}
// 退出游戏
export async function userLeaveRoomApi(params?: object) {
  return await http.spRequest({
    url: "app-user/exit-game",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

export async function playRebateInfoApi(params?: object) {
  return await http.spRequest({
    url: "app-user/get-game-rebate",
    handlingError: false,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}

export async function playRebateConfigApi(params?: object) {
  // return await http.spRequest({
  //   url: "app-user/get-game-rebate-config",
  //   handlingError: false,
  //   method: "GET",
  //   lodingMsg: "loading",
  //   data: params
  // });
  // 这个请求不需要了
  return Promise.resolve({
    code: 204,
    data:null,
  })
}

export async function playRebateDrawApi(params?: object) {
  return await http.spRequest({
    url: "app-user/receive-game-rebate",
    handlingError: true,
    method: "GET",
    lodingMsg: "loading",
    data: params
  });
}
