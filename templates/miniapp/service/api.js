import {
  requestFn
} from '../utils/utils.request.js';
import config from "../config/config";
import utils from '../utils/utils.js';
const serverKey = config.SERVER_KEY;
// 获取文章信息-不限制
function testRequest(data = {}) {
  return requestFn({
    host: 'http://127.0.0.1:7001',
    url: '/address',
    method: 'GET',
    data,
    showLoading: false,
    showModal: false
  })
}

function decodeUserInfo(data = {}) {
  return requestFn({
    url: '/wechat/wxApi/getDecryptUserInfo',
    method: 'POST',
    data,
    showLoading: false,
    showModal: false
  });
}

let API = {
  testRequest,
  decodeUserInfo
}
wx.$API = API;
export default API;