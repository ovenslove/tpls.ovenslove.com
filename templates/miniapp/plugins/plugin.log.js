const Log = {};
/**
 * @function 路由拦截器
 *
 * @param {*} App
 * @param {*} config
 */

Log.install = function install(App, config) {
  console.log('Log-Plugin installed');
  let logger = wx.getLogManager({
    level: 1
  })
  wx.$log = (type = 'log', message = '', data = {}) => {
    switch (type) {
      case 'log':
        log(logger, message, data);
        break;
      case 'warn':
        warn(logger, message, data);
        break;
      case 'error':
        error(logger, message, data);
        break;
      case 'debug':
        debug(logger, message, data);
        break;
      case 'info':
        info(logger, message, data);
        break;
      default:
        break;
    }
  }
}

function log(logger, message, data) {
  logger.log(`[log]->${message}->${JSON.stringify(data)}`);
}

function error(logger, message, data) {
  logger.log(`[error]->${message}->${JSON.stringify(data)}`);
}

function debug(logger, message, data) {
  logger.debug(`[debug]->${message}->${JSON.stringify(data)}`);
}

function warn(logger, message, data) {
  logger.warn(`[warn]->${message}->${JSON.stringify(data)}`);
}

function info(logger, message, data) {
  logger.info(`[info]->${message}->${JSON.stringify(data)}`);
}

export default Log;
