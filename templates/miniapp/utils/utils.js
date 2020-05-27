'use strict';
/**
 * @function 计算字符串的字节数
 * @param {string} str  需要计算的字符串
 * @returns {number} 字符串字节数
 */
function getBytesLength(str) {
  // 在GBK编码里，除了ASCII字符,其它都占两个字符宽
  return str.replace(/[^\x00-\xff]/g, 'xx').length;
}
/** 获取url中的参数
 * @param {any} url
 * @param {any} name
 * @returns {any}
 */
function getQueryString(url, name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var urlSearch = '';
  if (typeof url === 'string' && url.indexOf("?") !== -1) {
    urlSearch = url.substr(url.indexOf("?") + 1);
  }
  var r = urlSearch.match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}
/**
 * url解析成对象
 * @param {string} url
 * @returns {object} 解析出来的对象
 */
function parseUrl(url) {
  var arr1 = url.split("?");
  var params = arr1[1].split("&");
  var obj = {}; // 声明对象
  for (var i = 0; i < params.length; i++) {
    var param = params[i].split("=");
    obj[param[0]] = param[1]; // 为对象赋值
  }
  return obj;
}

/**
 * 判断是手机类型
 * @param {*} modle
 */
function isPhone(modle) {
  try {
    var phoneData = wx.getSystemInfoSync()
    console.log(phoneData);
    let _model = phoneData.model || '';
    let regx = new RegExp('^' + modle + '.*', 'ig');
    if (regx.test(_model)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

/**
 * randomString 获取指定长度的随机字符串
 * @param {*} len
 */
function randomString(len = 16, type = 'string') {
  let chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"; // 全部合法字符串
  let numberChars = '0123456789'; // 全部数字
  let preChars = '';
  if (type === 'number') {
    preChars = numberChars;
  } else {
    preChars = chars;
  }
  var maxPos = preChars.length;
  var randomStr = '';
  for (let i = 0; i < len; i++) {
    randomStr += preChars.charAt(Math.floor(Math.random() * maxPos));
  }
  return randomStr;
}

/**
 * 对比微信小程序版本号
 * @param {*} v1
 * @param {*} v2
 */
function compareVersion(v1 = '0.0.0', v2 = '0.0.0') {
  v1 = v1.split('.')
  v2 = v2.split('.')
  var len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i])
    var num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

/**
 *@function 判断是否是url
 * @param {*} url
 * @returns
 */
function isUrl(url) {
  return /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*((\/\w+)+(\.\w+|(\/))?)?([\?&]\w+=\w*)*(#\w*)?$/ig.test(url);
}

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

function isEmpty(val) {
  return val === undefined || val === null || (typeof val === 'number' && isNaN(val))
}

/**
 * @function 遍历对象返回 get请求url的参数拼接
 * @param {data}  Object 参数对象
 */
function getDataUrl(data) {
  let url = '';
  for (let item in data) {
    if (typeof data[item] === 'boolean' || !isEmpty(data[item]) && data[item] != '') {
      if (url == '') {
        url += `?${item}=${data[item]}`;
      } else {
        url += `&${item}=${data[item]}`;
      }
    }
  }
  return url;
};

/**
 * @function Object转Url字符串
 *
 * @param {*} data
 * @returns {string}
 */
function json2Url(data) {
  let urlStr = '';
  if (typeof data === 'string') {
    console.error('data is required an object');
    return urlStr;
  }
  for (let key in data) {
    if (urlStr === '') {
      urlStr = '?' + key + '=' + data[key];
    } else {
      urlStr += ('&' + key + '=' + data[key]);
    }
  }
  return urlStr;
}
/**
 * @function getCustomBar
 * @description 获取自定义菜单栏的高度属性
 * @returns
 */
function getCustomBar() {
  let sys = wx.getSystemInfoSync();
  let statusBarHeight = sys.statusBarHeight || sys.safeArea.top || 20;
  let distinctHight = sys.platform === 'ios' ? 6 : sys.platform === 'android' ? 8 : 6;
  let customBar = {
    statusBarHeight,
    customBarHeight: statusBarHeight + distinctHight * 2 + 32,
    platform: sys.platform,
    distinctHight
  }
  return customBar;
}

let utils = {
  getBytesLength: getBytesLength,
  getQueryString: getQueryString,
  parseUrl: parseUrl,
  isPhone: isPhone,
  randomString: randomString,
  compareVersion: compareVersion,
  isUrl: isUrl,
  isObject: isObject,
  getDataUrl: getDataUrl,
  json2Url: json2Url,
  getCustomBar: getCustomBar
};
// 注入wx对象
wx.$UTILS = utils;

export default utils;