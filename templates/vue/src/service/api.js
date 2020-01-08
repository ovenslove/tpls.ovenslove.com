"use strict";
import Vue from 'vue'
import axios from 'axios'
let http = axios.create({
    baseURL: process.env.VUE_APP_BASIC_API_URL
});

// 请求发出拦截器
http.interceptors.request.use(config => {
    // Vue.$cookies.set(process.env.VUE_APP_AUTH_TOKEN_PREFIX, 'rjXT0MisfaFZz4x3Wc8tVb2eKh6kEUG9', 60 * 60 * 2)
    let token = Vue.$cookies.get(process.env.VUE_APP_AUTH_TOKEN_PREFIX)
    if (token) {
        if (!/^\/fet\/test\/testApi/g.test(config.url)) config['headers']['token'] = token
    } else {
        // TODO: token过期，重新登录
    }
    return config;
}, error => Promise.reject(error))

// 请求返回拦截器
http.interceptors.response.use(response => {
    return response.data;
}, (error) => {
    // 请求返回2xx以外的状态时处理
    return Promise.reject(error)
})
//=======================以上为请求配置=========================

//=======================以下为API列表=========================
/**
 * @function 测试GET-API
 * @description 测试get接口是否可行
 * @param {*} [data={}]
 * @returns
 */
function testApi(data = {}) {
    return http.get("/fet/test/testApi", data)
}

/**
 * @function 测试POST-API
 * @description 测试post接口是否可行
 * @param {*} [data={}]
 * @returns
 */
function testApiPost(data = {}) {
    return http.post("/fet/test/testPost", data)
}
//=======================以上为API列表=========================
// 聚合API
let API = {
    testApi,
    testApiPost
}
Vue.prototype.$http = http;
// 暴露出API
export default API;