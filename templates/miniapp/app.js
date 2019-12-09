//app.js
import Router from "./plugins/plugin.router";
import utils from "./utils/utils";
import config from "./config/config";
import {} from "./plugins/plugin.console";
import Auth from "./utils/utils.auth";
import API from "./service/api";
App({
  onLaunch: function (options) {
    Router.install(this, {});
    // 检查本地缓存数据是否与当前环境一致
    let yatsenUserInfoData =
      wx.getStorageSync(config.USERINFO_YATSEN_CACHE) || {};
    if (yatsenUserInfoData.id && config.ENV !== yatsenUserInfoData.env) {
      wx.clearStorageSync();
    }
  },
  onShow(options) {
    // 将app传入的数据写入全局属性
  },
  onHide() {
  },
  onError(err) {},
  onPageNotFound() {},
  /**
   * @function 设置appjs内部全局对象
   *
   * @param {*} [data={}]
   * @param {string} [value='']
   */
  setGlobal(data = {}, value = '') {
    let that = this;
    if (utils.isObject(data)) {
      for (let key in data) {
        if (data[key] === undefined || data[key] === null || data[key] === 'undefined' || isNaN(data[key])) {
          delete that.globalData[key];
        } else {
          that.globalData[key] = data[key];
        }
      }
    } else if (typeof data === 'string') {
      if (value === undefined || value === null || value === 'undefined' || isNaN(value)) {
        delete that.globalData[key];
      } else {
        that.globalData[key] = data[key];
      }
    } else {
      // 其他类型不作处理
    }
  },
  // 路由信息
  router: [],
  globalData: {
    navigateBackStatus: false,
    userInfo: {}
  }
})