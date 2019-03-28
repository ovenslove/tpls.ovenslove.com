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
  relativePath = true,
  mock = false,
  url = '',
  data = {},
  showLoading = false, // 是否菊花
  showModal = true // 是否弹窗
}) => {
  if (typeof url === 'string' && url) {
    let _opts = arguments[0] || {};
    if (!relativePath) {
      host = ''
    }
    if (config.ENV !== 'prod' && mock) {
      host = config.MOCK_URL
    }
    // 单接口请求，返回一个数据
    return new Promise((resolve, reject) => {
      // 展示loading动画
      if (showLoading) {
        wx.showLoading({
          title: '',
          mask: true,
          success() {},
          fail() {},
          complete() {}
        });
      }
      // 认证成功，开始请求数据并返回结果
      wx.request({
        method: method.toUpperCase(),
        url: host + url,
        header: {
          'content-type': 'application/json'
        },
        data: data,
        success: function (res) {
          if (res.data.code === 200) {
            resolve(res.data);
          } else if ([401, 403, 404].includes(parseInt(res.data.code))) {
            // 授权相关错误，需要重新授权
            // 重新登录并请求
            // requestFn(_opts);
          } else if (res.data && res.data.code && PAGE_HANDLE_ERROR_CODE.includes(parseInt(res.data.code))) {
            // 需要页面对错误码进行特殊操作
            reject(res.data);
          } else {
            wx.hideLoading();
            // 其他错误状态，需要处理
            if (showModal) {
              // 可以弹窗
              if (typeof res['data'] === 'string') {
                res.data = res.data.substr(0, 100)
                wx.showModal({
                  title: '温馨提示',
                  showCancel: false,
                  content: res.data,
                  success: function (data) {
                    if (data.confirm) {
                      reject(res.data);
                    } else if (data.cancel) {
                      // nothing to do
                    }
                  }
                })
              } else {
                wx.showModal({
                  title: '温馨提示',
                  showCancel: false,
                  content: error[res.data.code] || res.data.message || '未知错误',
                  success: function (data) {
                    if (data.confirm) {
                      console.log('错误返回数据', res);
                      reject(res.data);
                    } else if (data.cancel) {}
                  }
                })
              }
            } else {
              // 不需要弹窗
              reject(res);
            }
          }
        },
        fail: function (err) {
          reject(err);
          wx.hideLoading();
        },
        complete: function (res) {
          if (showLoading) {
            wx.hideLoading();
          }
          if (config.env === 'dev') {
            console.log('请求完毕-->', url + utils.json2Url(data), res.data || res.errMsg);
          } else {
            console.log('请求完毕-->', url + utils.json2Url(data), res.data || res.errMsg)
          }
          // 写入日志
          wx.$log('log', 'Request:' + url + utils.json2Url(data), res.data || res.errMsg)
        }
      })
    });
  } else if (url instanceof Array && url.length > 0) {
    // 如果url为数组，则属于多接口请求，开始递归
    return Promise.all(
      url.map((val, index, arr) => {
        return requestFn({
          method,
          host,
          url: val,
          data: data[index]
        })
      }));
  } else {
    console.log('url为空')
  }
}
