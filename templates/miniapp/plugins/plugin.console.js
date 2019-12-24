'use strict';
const logger = wx.getLogManager ? wx.getLogManager() : null;
const realLogger = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null;
const appLaunchOptions = wx.getLaunchOptionsSync();
const debugOnline = Boolean(appLaunchOptions.query.debugOnline) || false;
console = (function (origConsole) {
  if (!console) console = {};
  let vConsole = {};
  for (let key in console) {
    vConsole[key] = function () {
      if (['log', 'info', 'warn', 'error'].findIndex(k => k === key) >= 0) {
        if (logger && typeof logger[key] === 'function') logger[key](...arguments);
        if (realLogger && debugOnline) realLogger[key === 'log' ? 'info' : key](`[${key}] : ${JSON.stringify(arguments)}`);
      }
      if (wx.$CONFIG && wx.$CONFIG.DEBUG) origConsole[key](...arguments)
    }
  }
  return vConsole;
}(console));
export default null;