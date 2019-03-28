## 项目结构

#### 文件结构
```bash
|---assets  资源 
        |---image   图片
|---components 组件
|---config 配置
        |---base 基础配置
        |---env     环境配置
        |---config.js 配置入口
        |---userConfig.js 用户配置
        |---version.json 版本信息
|---lib 第三方库
        |---wxParse
|---pages   页面文件夹
        |---article 模块
                |---index   单页面
                        |---index.js
                        |---index.json
                        |---index.wxml
                        |---index.wxss
                        |---index.less
        |---logs
|---plugins 插件
|---service 服务
        |---api.js
        |---service.js
|---templates   模板
|---utils   工具
        |---utils.js
|---wxs 脚本
|---app.js
|---app.json
|---app.wxss
```

* Tips: **less转wxss**
vscode编辑器安装插件Easy WXLESS

#### 路由使用规则
  > 为了更好的维护页面路由，支持无限级别的路由规则
  * 由wx.navigate2() 方法代替 wx.navigateTo()方法，参数一致
  * 由wx.navigateBack2() 方法代替 wx.navigateBack()方法，参数一致