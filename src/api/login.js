import request from "@/request/http";

export function login(param) {
  return request({
    url: "/userInfo/phoneCodeLogin",
    method: "post",
    data: param
  });
}
export function getPhoneCode(phone, type) {
  return request({
    url: `/sms/sendPhoneSms?phone=${phone}&type=${type}`,
    method: "get"
  });
}
export function quitLogin(param) {
  return request({
    url: "/userInfo/quitLogin",
    method: "post",
    data: param
  });
}
