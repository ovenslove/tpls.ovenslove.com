import {
  requestFn
} from '../utils/utils.request.js';
import config from "../config/config";
import utils from '../utils/utils.js';
const serverKey = config.SERVER_KEY;

// 获取文章信息-不限制
export const testRequest = (data = {}) => {
  return requestFn({
    url: serverKey + "/testpath/" + data.id,
    method: 'GET/POST',
    showLoading: true,
    showModal:false
  })
}