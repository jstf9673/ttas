import request from "@/request/http";
import store from "@/store";
export function getBannerList() {
  return request({
    url: "/banner/getBannerList",
    method: "post",
    data: { source: 1 }
  });
}
export function vipApply(params) {
  return request({
    headers: {
      // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      "Content-Type": "application/json;charset=utf-8"
    },
    url: `/userOrder/vipApply?token=${store.state.userInfo.token}`,
    method: "post",
    data: JSON.stringify(params),
    isJson: true
  });
}
export function oilList(params) {
  return request({
    url: "/oil/oilList",
    method: "post",
    data: params
  });
}
export function getChargingList(params) {
  return request({
    url: "/oil/chargingList",
    method: "post",
    data: params
  });
}
export function payment(params) {
  return request({
    url: "/userOrder/payment",
    method: "post",
    data: params
  });
}
export function oilNumPriceList(params) {
  return request({
    url: "/oil/oilNumPriceList",
    method: "post",
    data: params
  });
}
export function gunNumList(params) {
  return request({
    url: "/oil/gunNumList",
    method: "post",
    data: params
  });
}
export function oilPayment(params) {
  return request({
    url: `/userOrder/oilPayment?token=${store.state.userInfo.token}`,
    method: "post",
    data: JSON.stringify(params),
    isJson: true
  });
}
export function historyRecord(params) {
  return request({
    url: "/oil/historyRecord",
    method: "post",
    data: params
  });
}
export function distanceCheck(params) {
  return request({
    url: "/oil/distanceCheck",
    method: "post",
    data: params
  });
}
export function chargingInfo(params) {
  return request({
    url: "/oil/chargingInfo",
    method: "post",
    data: params
  });
}
export function yjyParam(params) {
  return request({
    url: "/platform/yjyParam",
    method: "post",
    data: params
  });
}

