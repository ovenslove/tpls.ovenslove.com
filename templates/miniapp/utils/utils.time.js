// 最大计算时间为年-月-日-时-分-秒-毫秒
const perYear = 365 * 24 * 60 * 60 * 1000 // 一年的毫秒数
const perMonth = 30 * 24 * 60 * 60 * 1000 // 一月的毫秒数(按30天计算)
const perDay = 1 * 24 * 60 * 60 * 1000 // 一天的毫秒数
const perHour = 1 * 60 * 60 * 1000 // 一小时的毫秒数
const perMinute = 1 * 60 * 1000 // 一分钟的毫秒数
const perSecond = 1 * 1000 // 一秒的毫秒数

function Time() {
  this.version = '1.0.1'
}
/***
 * @function 解析时间节点
 * @param {String|Number|Object} time 标准的时间数据
 * @returns {Object} 解析完成的时间数据
 */
Time.prototype.parseTime = function parseTime(time) {
  let d = {};
  let n = new Date();
  let dayZh = ["日", "一", "二", "三", "四", "五", "六"];
  let t;
  try {
    if (typeof time === 'number') {
      // 数字
      if (/[\d]+/ig.test(time) && time.length === 10) {
        // 服务器时间，精确到秒
        time *= 1000;
      } else {
        time *= 1;
      }
      t = new Date(time);
    } else if (typeof time === 'string') {
      // 字符串
      t = new Date(time);
    } else if (time instanceof Date) {
      // 时间对象
      t = time;
    } else {
      // 啥也不是就等于当前时间
      t = n;
    }
    if (t.toString() === 'Invalid Date') {
      throw new Error('时间格式化失败-->' + time)
    }
  } catch (error) {
    throw new Error(error);
  }
  // 基础属性
  d.year = t.getFullYear(); // 完整年2018
  d.month = t.getMonth(); // 月份0-11
  d.date = t.getDate(); // 日期1-31
  d.weekDay = t.getDay(); // 星期几0-6
  d.weekDay_zh = dayZh[d.weekDay]; // 日一二三四五六
  d.hours = t.getHours(); // 时钟 0-23
  d.minutes = t.getMinutes(); // 分钟 0-59
  d.seconds = t.getSeconds(); // 秒钟 0-59
  d.timeStamp = t.getTime(); // 到1970年0时的时间戳
  d.miniSeconds = t.getMilliseconds(); // 毫秒数 0-999
  // 附加属性
  d.distanceTimeStamp = d.timeStamp - n.getTime(); // 距离当前时间戳差值
  d.startTimeStampForToday = new Date(new Date(t.toLocaleDateString()).getTime()).getTime(); // 当天第一秒
  d.endTimeStampForToday = d.startTimeStampForToday + (24 * 60 * 60 * 1000); // 当天最后一秒
  d.endTimeStampForYesterday = d.startTimeStampForToday - 1; // 前一天最后一秒
  d.startTimeStampForYear = new Date(d.year + '/1/1').getTime(); // 当年的第一秒
  d.weeks = Math.ceil((n.getTime() - d.startTimeStampForYear) / (7 * 24 * 60 * 60 * 1000)); // 当年的第几周(需要进一位)

  // 判断上午下午晚上
  let harfDay = '';
  if (d.hours <= 12) {
    harfDay = 'AM';
  } else {
    harfDay = 'PM';
  }
  let harfDayZh = '';
  if (d.hours < 0) {
    harfDayZh = '见鬼了'
  } else if (d.hours <= 3) {
    harfDayZh = '深夜'
  } else if (d.hours <= 5) {
    harfDayZh = '凌晨'
  } else if (d.hours <= 6) {
    harfDayZh = '黎明'
  } else if (d.hours <= 9) {
    harfDayZh = '早晨'
  } else if (d.hours <= 12) {
    harfDayZh = '上午'
  } else if (d.hours <= 14) {
    harfDayZh = '中午'
  } else if (d.hours <= 18) {
    harfDayZh = '下午'
  } else if (d.hours <= 19) {
    harfDayZh = '黄昏'
  } else if (d.hours < 24) {
    harfDayZh = '晚上'
  } else {}
  d.harf_day = harfDay;
  d.harfdayZh = harfDayZh;
  // 自动计算相对时间
  let autoFormatedTime = '';
  let absDistanceTimeStamp = Math.abs(d.distanceTimeStamp);
  if (absDistanceTimeStamp <= (0.5 * 60 * 1000)) {
    // console.log('半分钟以内，显示刚刚');
    let _s = Math.floor((absDistanceTimeStamp / 1000) % 60);
    autoFormatedTime = '刚刚';
  } else if (absDistanceTimeStamp <= (1 * 60 * 1000)) {
    // console.log('一分钟以内，以秒数计算');
    let _s = Math.floor((absDistanceTimeStamp / 1000) % 60);
    autoFormatedTime = _s + '秒前';
  } else if (absDistanceTimeStamp <= (1 * 3600 * 1000)) {
    // console.log('一小时以内,以分钟计算');
    let _m = Math.floor((absDistanceTimeStamp / (60 * 1000)) % 60);
    autoFormatedTime = _m + '分钟前';
  } else if (absDistanceTimeStamp <= (24 * 3600 * 1000)) {
    // console.log('一天以内，以小时计算');
    let _h = Math.floor((absDistanceTimeStamp / (60 * 60 * 1000)) % 24);
    autoFormatedTime = _h + '小时前';
  } else if (absDistanceTimeStamp <= (30 * 24 * 3600 * 1000)) {
    // console.log('30天以内,以天数计算');
    let _d = Math.floor((absDistanceTimeStamp / (24 * 60 * 60 * 1000)) % 30);
    autoFormatedTime = _d + '天前';
  } else {
    // 30天以外只显示年月日
    autoFormatedTime = (new Date(d.year + '/' + d.month + '/' + d.date)).toLocaleDateString();
  }
  d.autoFormatedTime = autoFormatedTime;
  // 格式化数据
  d.localString = t.toLocaleString();
  // 返回数据
  return d;
}

/***
 * @function 解析时间差
 * @param {String|Number|Object} stamp 标准的时间数据
 * @returns {Object} 解析完成的时间数据
 */
Time.prototype.parseStamp = function parseStamp(stamp) {
  let _distanceTime = parseInt(stamp);
  let _date = {};
  if (typeof _distanceTime !== 'number') {
    throw new Error('时间戳差值格式错误');
  }

  _date.year = Math.floor(_distanceTime / perYear);
  _distanceTime = _distanceTime - _date.year * perYear;

  _date.month = Math.floor(_distanceTime / perMonth);
  _distanceTime = _distanceTime - _date.month * perMonth;

  _date.day = Math.floor(_distanceTime / perDay);
  _distanceTime = _distanceTime - _date.day * perDay;

  _date.hours = Math.floor(_distanceTime / perHour);
  _distanceTime = _distanceTime - _date.hours * perHour;

  _date.minutes = Math.floor(_distanceTime / perMinute);
  _distanceTime = _distanceTime - _date.minutes * perMinute;

  _date.seconds = Math.floor(_distanceTime / perSecond);
  _distanceTime = _distanceTime - _date.seconds * perSecond;

  _date.miniSeconds = _distanceTime;
  return _date;
}
/***
 * @function 格式化时间
 * @param {String|Number|Object} time 标准的时间数据
 * @param {String} type 时间格式化的模板
 * @returns {String} 解析完成的时间字符串
 */
Time.prototype.format = function format(time = Date.now(), type = 'Y-M-D H:I:S O W') {
  let t;
  let formatedTime = type;
  try {
    if (/[\d]+/ig.test(time) && time.length === 10) {
      // 服务器时间，精确到秒
      time *= 1000;
    }
    t = new Date(Number(time));
  } catch (error) {
    throw new Error('时间数据错误');
  }
  let d = this.parseTime(t);
  // 格式化数据
  d.month += 1;
  d.month = d.month < 10 ? '0' + d.month : d.month;
  d.date = d.date < 10 ? '0' + d.date : d.date;
  d.hours = d.hours < 10 ? '0' + d.hours : d.hours;
  d.minutes = d.minutes < 10 ? '0' + d.minutes : d.minutes;
  d.seconds = d.seconds < 10 ? '0' + d.seconds : d.seconds;
  if (d.miniSeconds < 10) {
    d.miniSeconds = '00' + d.miniSeconds;
  } else if (d.miniSeconds < 100) {
    d.miniSeconds = '0' + d.miniSeconds;
  }
  // 匹配替换格式化字符串
  d.formatedTime = formatedTime
    .replace(/[Yy]/ig, d.year)
    .replace(/[Mm]/ig, d.month)
    .replace(/[Dd]/ig, d.date)
    .replace(/[Ww]/ig, d.weekDay)
    .replace(/[Hh]/ig, d.hours)
    .replace(/[Ii]/ig, d.minutes)
    .replace(/[Ss]/ig, d.seconds)
    .replace(/[Oo]/ig, d.miniSeconds);
  return d.formatedTime;
}
/***
 * @function 获取时间节点的详细数据
 * @param {String|Number|Object} time 标准的时间数据
 * @returns {Object} 解析完成的时间数据
 */
Time.prototype.getData = function getData(time = new Date()) {
  return this.parseTime(time);
}

/***
 * @function 计算两个时间节点的时间差
 * @param {String|Number|Object} start 标准的时间数据（必须）
 * @param {String|Number|Object} end 标准的时间数据（非必须，默认当前时间）
 * @returns {Object} 解析完成的时间数据
 */
Time.prototype.distance = function distance(start, end) {
  let d = {
    type: 'default'
  };
  if (!start) {
    throw new Error('开始时间为空');
  }
  let _start = this.parseTime(start);
  let _end = this.parseTime(end);
  let _distance = _start.timeStamp - _end.timeStamp;
  if (!end) {
    d.type = _distance < 0 ? 'pass' : 'future';
  }
  _distance = Math.abs(_distance);
  d.data = this.parseStamp(_distance);
  return d;
}
/***
 * @function 计算某一年的天数
 * @param {String|Number} year 4位的年份
 * @returns {Number} 当年的天数
 */
Time.prototype.getFullYearDays = function getFullYearDays(year) {
  year = parseInt(year);
  let curYear = new Date(year + "/1/1");
  let ts1 = curYear.getTime();
  curYear.setYear(year + 1);
  return (curYear.getTime() - ts1) / (3600000 * 24);
};
/***
 * @function 计算某一个月的天数(0开始)
 * @param {String|Number} month 月份
 * @returns {Number} 当月的天数
 */
Time.prototype.getFullMonthDays = function getFullMonthDays(month) {
  let year = (new Date()).getFullYear();
  month = parseInt(month);
  month = month < 12 ? month : (new Date()).getMonth();
  let curYear = new Date(year + "/" + (month + 1) + "/1");
  let ts1 = curYear.getTime();
  curYear.setMonth(month + 1);
  return (curYear.getTime() - ts1) / (3600000 * 24);
};
/***
 * @function 根据年数获得距离当前的天数
 * @param {String|Number} years 年数
 * @returns {Number} 天数
 */
Time.prototype.getDaysForYears = function getDaysForYears(years) {
  let n = new Date();
  years = parseInt(years);
  let ts1 = n.getTime();
  n.setYear(n.getFullYear() + years);
  return (n.getTime() - ts1) / (3600000 * 24);
};
/***
 * @function 根据月数获得距离当前的天数
 * @param {String|Number} months 月数
 * @returns {Number} 天数
 */
Time.prototype.getDaysForMonths = function getDaysForMonths(months) {
  let n = new Date();
  let years;
  months = parseInt(months);
  if (months >= 0) {
    years = Math.floor(months / 12);
  } else {
    years = Math.ceil(months / 12)
  }
  months = months % 12;
  let ts1 = n.getTime();
  n.setYear(n.getFullYear() + years);
  n.setMonth(n.getMonth() + months);
  let ts2 = n.getTime();
  return (n.getTime() - ts1) / (3600000 * 24);
};

/***
 * @function 计算多少多少年/月或者日后的时间节点
 * @param {String} type 时间类型，支持年月日时分秒
 * @returns {Object} 时间数据
 */
Time.prototype.getTimeByCount = function getTimeByCount(type, num) {
  let _distance = 0;
  let d = {};
  let n = new Date();
  num = parseInt(num);
  if (typeof type !== 'string') {
    throw new Error('类型错误');
  }
  if (isNaN(num)) {
    throw new Error('数值错误');
  }
  // 判断数值
  switch (type) {
    case 'year':
    case 'y':
    case 'Y':
      _distance = this.getDaysForYears(num) * perDay;
      break;
    case 'month':
    case 'm':
    case 'M':
      _distance = this.getDaysForMonths(num) * perDay;
      break;
    case 'day':
    case 'd':
    case 'D':
      _distance = num * perDay;
      break;
    case 'hour':
    case 'h':
    case 'H':
      _distance = num * perHour;
      break;
    case 'minute':
    case 'i':
    case 'I':
      _distance = num * perMinute;
      break;
    case 'second':
    case 's':
    case 'S':
      _distance = num * perSecond;
      break;
    default:
      break;
  }
  d = this.parseTime(n.getTime() + _distance);
  return d;
}
let time = new Time();
export default time;
