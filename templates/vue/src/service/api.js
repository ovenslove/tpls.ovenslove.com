"use strict";
import Vue from 'vue'
import axios from 'axios'
let http = axios.create({
    baseURL: process.env.VUE_APP_BASIC_API_URL
});

/**
 * @function 测试API
 * @description 测试接口是否可行
 * @param {*} [data={}]
 * @returns
 */
function testApi(data = {}) {
    return http.get("/fet/test/testApi", data);
}

function testApiPost(data = {}) {
    return http.post("/fet/test/testPost", data);
}

// 聚合API接口
let API = {
    testApi,
    testApiPost
}
Vue.prototype.$http = http;
export default API;