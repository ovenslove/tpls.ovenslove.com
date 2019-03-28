import config from "../config/config";
import {
  userAuth
} from "../service/api";
export const isAuth = () => {
  let yatsenUserInfoData =
    wx.getStorageSync(config.USERINFO_YATSEN_CACHE) || {};
  if (yatsenUserInfoData.id) {
    return true;
  }
  return false;
}

export const authUpdate = (cb = () => {}) => {
  let yatsenUserInfoData = wx.getStorageSync(config.USERINFO_YATSEN_CACHE) || {};
  if (!yatsenUserInfoData.id) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          userAuth().then(data => {
            cb(data);
          }).catch(err => {
            console.log(err)
          })
        }
      },
      fail(err) {
        console.log(err);
      },
      complete() {}
    })
  }

}
