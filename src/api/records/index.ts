import { http } from "@/utils/http";

export async function statementApi(pageObj: any,params?: object) {
  return await http.spRequest({
    url: `history/money-record?pageSize=${pageObj.pageSize}&pageNum=${pageObj.pageNum}`,
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function playLogApi(pageObj: any,params?: object) {
  return await http.spRequest({
    url: `history/game-record?pageSize=${pageObj.pageSize}&pageNum=${pageObj.pageNum}`,
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}

export async function reportApi(params?: object) {
  return await http.spRequest({
    url: `/history/statistics-record`,
    handlingError: false,
    method: "POST",
    lodingMsg: "loading",
    data: params
  });
}


