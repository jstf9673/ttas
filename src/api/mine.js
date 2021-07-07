import request from "@/request/http";

export function getUserInfo(param) {
  return request({
    url: "/userInfo/getUserInfo",
    method: "post",
    data: param
  });
}
export function codeBinding(param) {
  return request({
    url: "/platform/codeBinding",
    method: "post",
    data: param
  });
}
export function logisticsStatus(params) {
  return request({
    url: "/userInfo/logisticsStatus",
    method: "post",
    data: params
  });
}
export function codeCheck(params) {
  return request({
    url: "/platform/codeCheck",
    method: "post",
    data: params
  });
}
