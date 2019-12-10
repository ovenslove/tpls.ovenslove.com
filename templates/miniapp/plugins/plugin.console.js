'use strict';
const logger = wx.getLogManager();
const realLogger = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null;
const appLaunchOptions = wx.getLaunchOptionsSync();
const debugOnline = Boolean(appLaunchOptions.query.debugOnline) || false;
// 重写console
console = (function (origConsole) {
  if (!console) console = {};
  let vConsole = {};
  for (let key in console) {
    vConsole[key] = function () {
      if (['log', 'info', 'warn', 'error'].findIndex(k => k === key) >= 0) {
        logger[key](...arguments);
        if (realLogger && debugOnline) realLogger[key === 'log' ? 'info' : key](`[${key}] : ${JSON.stringify(arguments)}`);
      }
      if (wx.$CONFIG && wx.$CONFIG.DEBUG) origConsole[key](...arguments)
    }
  }
  return vConsole;
}(console));
export default null;