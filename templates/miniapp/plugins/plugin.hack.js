import {
  requestFn
} from '../utils/utils.request.js';
import config from "../config/config";
import utils from "../utils/utils";
import {
  putUploadShare,
  putUploadRuntime
} from "../service/api";
const serverKey = config.SERVER_KEY;
const TIME_TYPE = ['', 'appRuntime', 'articleRenderTime', 'articleStayTime'];
const Hack = {};
Hack.install = function install(config) {
  console.log('Hack-Plugin installed');
  wx.$hack = function hack(event, opts = {}) {
    switch (event) {
      case "articleShare":
        articleShareEvent(opts);
        break;
      case "appRuntime":
        appRuntimeEvent(opts);
        break;
      case "articleRenderTime":
        articleRenderEvent(opts);
        break;
      case "articleStayTime":
        articleStayEvent(opts);
        break;
      default:
        break;
    }
  }
}

/**
 * @function 文章停留时间事件
 *
 * @param {*} data
 */
function articleStayEvent(data) {
  var systemInfo = wx.getSystemInfoSync();
  let _data = {
    timeType: TIME_TYPE.findIndex(v => v === 'articleStayTime'),
    beginTime: data.start,
    endTime: data.end,
    duration: data.time,
    articleId: data.articleId,
    uid:data.uid,
    remark: JSON.stringify(systemInfo)
  }
  putUploadRuntime(_data);
}

/**
 * @function 运行时间统计事件
 *
 * @param {*} data
 */
function appRuntimeEvent(data) {
  var systemInfo = wx.getSystemInfoSync();
  let _data = {
    timeType: TIME_TYPE.findIndex(v => v === 'appRuntime'),
    articleId: 0,
    beginTime: data.start,
    endTime: data.end,
    duration: data.time,
    remark: JSON.stringify(systemInfo)
  }
  // 推送数据
  putUploadRuntime(_data);
}

/**
 * @function 文章渲染时间统计事件
 *
 * @param {*} data
 */
function articleRenderEvent(data) {
  let pages = getCurrentPages();
  if (pages.length > 0) {
    let curPage = pages[pages.length - 1];
    // let page = curPage.route + utils.json2Url(curPage.options);
    let systemInfo = wx.getSystemInfoSync();
    let yatsenUserInfoData =
      wx.getStorageSync(config.USERINFO_YATSEN_CACHE) || {};
    let _data = {
      timeType: TIME_TYPE.findIndex(v => v === 'articleRenderTime'),
      articleId: ~~curPage.data.articleId,
      uid: ~~yatsenUserInfoData.id || 0,
      beginTime: data.start,
      endTime: data.end,
      duration: data.time,
      remark: JSON.stringify(systemInfo)
    }
    // 推送数据
    putUploadRuntime(_data);
  }
}

/**
 * @function 分享事件
 *
 * @param {*} data
 */
function articleShareEvent(data) {
  let path = data.path;
  let _data = {
    event: 'articleShare',
    path: path
  }
  Object.assign(_data, data);
  // console.log(_data)
  // 推送数据
  putUploadShare(_data)
}

export default Hack;
