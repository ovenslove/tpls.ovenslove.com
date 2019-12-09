// const config = require("../config/config");
import config from "../config/config";
import utils from "./utils";
const error = {};
const serverKey = config.SERVER_KEY;
// 需要页面特殊操作错误码
const PAGE_HANDLE_ERROR_CODE = [500, 9999404, 156600017];

/**
 * @function 微信请求方法封装
 * @param {string} method 请求类型
 * @param {string} host 域名地址
 * @param {string||array} url 接口地址
 * @param {object||array} data 参数数据
 * @param {boolean} showModal 是否显示错误弹窗
 * @return {object} 请求回来的数据
 */
export const requestFn = ({
  method = 'GET',
  host = config.API_URL,
  url = '',
  data = {},
  token = true,
  header = {
    'content-type': 'application/json'
  },
  showLoading = false, // 是否菊花
  showModal = false // 是否弹窗
}) => {
  return new Promise((resolve, reject) => {
    // 展示loading动画
    if (showLoading) wx.showLoading();
    // token校验
    if (token) {
      let _token = wx.$USER.getToken();
      if (_token) {
        header[wx.$CONFIG.TOKEN_PREFIX] = _token
      } else {
        return;
      }
    }
    // 开始请求
    wx.request({
      method: method.toUpperCase(),
      url: host + url,
      header,
      data,
      success: function (res) {
        resolve(res.data);
      },
      fail: function (err) {
        if (showModal) {
          // 可以弹窗
          let content = '未知错误';
          if (typeof err['errMsg'] === 'string') {
            content = err.errMsg.substr(0, 100)
          } else {
            content = JSON.stringify(err);
          }
          wx.showModal({
            title: '温馨提示',
            showCancel: false,
            content: content,
            success: function (data) {
              if (data.confirm) reject(err);
            }
          })
        } else {
          reject(err);
        }
      },
      complete: function (res) {
        if (showLoading) wx.hideLoading();
        console.log('请求完毕-->', url + utils.json2Url(data), res.data || res.errMsg);
      }
    })
  });
}