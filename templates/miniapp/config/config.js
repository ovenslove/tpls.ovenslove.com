// 从用户定义文件中获取配置数据
import userConfig from './userConfig';
// 将用户数据赋值给config
let config = userConfig;
// 获取基础配置项
let commonConfig = require('./base/base.config');
// 获取开发环境配置
let envConfig = require(`./env/${userConfig.ENV || 'dev'}.config`);
// 合并配置项
Object.assign(config, commonConfig, envConfig);
if (config.ENV === 'dev') config.DEBUG = true;
if (config.DEBUG) console.log(config);
// 导出配置项
module.exports = config;