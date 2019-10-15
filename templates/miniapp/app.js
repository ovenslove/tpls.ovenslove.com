//app.js
import Router from "./plugins/plugin.router";
import Log from "./plugins/plugin.log";
import utils from "./utils/utils";
import config from "./config/config";
App({
  onLaunch: function (options) {
    Router.install(this, {});
    Log.install(this, {})
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 检查本地缓存数据是否与当前环境一致
    let yatsenUserInfoData =
      wx.getStorageSync(config.USERINFO_YATSEN_CACHE) || {};
    if (yatsenUserInfoData.id && config.ENV !== yatsenUserInfoData.env) {
      wx.clearStorageSync();
    }
  },
  onShow(options) {
    // 将app传入的数据写入全局属性
    this.globalData['appOptions'] = options;
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