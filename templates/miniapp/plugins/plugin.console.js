'use strict';
const logger = wx.getLogManager();
const realLogger = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null;
let appLaunchOptions = wx.getLaunchOptionsSync();
let debugOnline = Boolean(appLaunchOptions.query.debugOnline) || false;
let loggerFunArr = ((l) => {
  let fun = [];
  for (let key in l) {
    if (typeof l[key] === 'function') {
      fun.push(key);
    }
  }
  return fun;
})(logger);
console = (function (origConsole) {
  if (!console) console = {};
  let vConsole = {};
  for (let key in console) {
    vConsole[key] = function () {
      if (['log', 'info', 'warn', 'error'].findIndex(k => k === key) >= 0) {
        logger[key](...arguments);
        if (debugOnline) realLogger[key === 'log' ? 'info' : key](`[${key}] : ${JSON.stringify(arguments)}`);
      }
      if (wx.$CONFIG && wx.$CONFIG.DEBUG) {
        origConsole[key](...arguments);
      }
    }
  }
  return vConsole;
}(console));
export default null;