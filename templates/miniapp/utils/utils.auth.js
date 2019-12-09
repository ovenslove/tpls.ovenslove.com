import config from "../config/config";
let authRequest = false;

/**
 * @class User 用户类
 *
 */
function User() {
  this.token = '';
  this.userId = '';
  this.userInfo = {};
  this.loginIn = loginIn;
  this.loginOut = loginOut;
  this.getToken = getToken;
  this.decodeUserInfo = decodeUserInfo;
  this.init = init;
}

/**
 * @function 初始化用户数据
 *
 */
function init() {
  let userInfo = wx.getStorageSync(wx.$CONFIG.USERINFO_CACHE);
  this.token = userInfo.wxtoken;
  this.userId = userInfo.userId;
  this.tokenExpire = userInfo.tokenExpire;
  this.userInfo = userInfo.userInfo || {};
  if (!(userInfo && Date.now() <= userInfo.tokenExpire - 10 * 60 * 1000)) this.loginIn();
}

/**
 * @function 获取本地token
 * @description 获取本地有效的token信息
 * @returns
 */
function getToken() {
  let userInfo = wx.getStorageSync(wx.$CONFIG.USERINFO_CACHE);
  if (userInfo && userInfo.tokenExpire - 10 * 60 * 1000 >= Date.now()) {
    return userInfo.wxtoken; // token有效
  } else {
    this.loginIn();
    return ''; // token即将或已经失效
  }
}
/**
 * @function 获取远程token
 * @description 登录后获取服务端token
 * @param {*} [data={}]
 * @returns
 */
function getWxToken(data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: wx.$CONFIG.API_URL + '/wechat/login',
      data: data,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (res) => {
        resolve(res.data.result);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {}
    });
  })
}

/**
 * @function 用户登录
 * @description 用户登录接口
 * @param {boolean} [refresh=true]
 * @returns
 */
function loginIn(refresh = true) {
  let _this = this;
  if (authRequest) return;
  authRequest = true;
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        // 获取用户code成功
        // 从后台获取token
        getWxToken({
          applicationId: config.APP_ID,
          code: res.code,
          type: 2 // 微信小程序
        }).then(data => {
          data.tokenExpire = Date.now() + 7200 * 1000;
          // 格式化数据
          data.userInfo = {
            nickName: data.nickname || '',
            avatarUrl: data.avatarUrl || '',
            language: '',
            gender: data.gender,
            country: '',
            province: '',
            city: ''
          };
          delete data.nickname;
          delete data.avatarUrl;
          delete data.gender;
          _this.wxtoken = data.wxtoken;
          _this.userId = data.userId
          _this.tokenExpire = data.tokenExpire;
          // 写入本地缓存
          wx.setStorageSync(wx.$CONFIG.USERINFO_CACHE, data);
          resolve(data);
          if (refresh) {
            let _pages = getCurrentPages();
            if (_pages.length > 0) {
              let currentPage = _pages[_pages.length - 1];
              // 刷新当前页的onload
              currentPage.onLoad(currentPage.options);
            }
          }
        }).catch(err => {
          authRequest = false;
          reject(err);
        }); // getWxToken
      },
      fail: function (res) {
        reject(res);
      },
      complete: function () {
        authRequest = false;
      }
    }); // wx.login
  });
}

/**
 * @function 用户登出
 * @description 删除用户信息
 * @param {*} [cb=() => {}]
 */
function loginOut(cb = () => {}) {
  wx.removeStorageSync(wx.$CONFIG.USERINFO_CACHE);
  cb();
}

/**
 * @function 解密用户信息
 * @description 请求wechat-service解密用户信息
 * @param {*} {
 *   encryptedData,
 *   iv,
 *   userInfo
 * }
 * @returns
 */
function decodeUserInfo({
  encryptedData,
  iv,
  userInfo
}) {
  this.userInfo = Object.assign(this.userInfo, userInfo);
  let userInfoCache = wx.getStorageSync(wx.$CONFIG.USERINFO_CACHE) || {};
  userInfoCache.userInfo = Object.assign(userInfoCache.userInfo || {}, userInfo);
  wx.setStorageSync(wx.$CONFIG.USERINFO_CACHE, userInfoCache);
  return wx.$API.decodeUserInfo({
    appid: wx.$CONFIG.APP_ID,
    encryptedData,
    iv
  });
}

wx.$USER = new User();
wx.$USER.init();
export default wx.$USER;