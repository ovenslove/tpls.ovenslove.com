// 从用户定义文件中获取配置数据
const ENV = process.env.NODE_ENV;
// 将用户数据赋值给config
let config = {};
// 获取基础配置项
let commonConfig = require('./base/base.config');
// 获取环境配置
let envConfig = require(`./env/${ENV}.config`);
// 合并配置项
Object.assign(config, commonConfig, envConfig);
// 导出配置项
module.exports = config;
