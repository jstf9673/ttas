import request from "@/request/http";
// import store from "@/store";

export function getConfig() {
    return request({
        url: '/crowdFunding/getConfig',
        method: 'get'
    });
}

export function getAirDrop(params) {
    return request({
        url: '/users/getAirDrop',
        method: 'post',
        data: params
    });
}

export function getInvitationInfo(params) {
    return request({
        url: '/users/getInvitationInfo',
        method: 'get',
        params: params
    });
}

export function getInvitationRecord(params) {
    return request({
        url: '/users/getInvitationRecord',
        method: 'get',
        params: {...params, pageNo: 1, pageSize: 100}
    });
}

export function getEmailValiCode(params) {
    return request({
        url: '/users/verify-code',
        method: 'post',
        data: params
    });
}

export function handleWithdr(params) {
    return request({
        url: '/users/withdr',
        method: 'post',
        data: params
    });
}