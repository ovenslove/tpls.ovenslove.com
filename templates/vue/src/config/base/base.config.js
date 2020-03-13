// 定义配置项
const config = {
  USERINFO_WX_CACHE: 'wxUserInfo',
  USERINFO_YATSEN_CACHE: 'yatsenUserInfo',
  SEARCH_HISTORY_CACHE: 'searchhistorycache',
  ARTICLE_LIST_CACHE: 'yatsenArticleList',
  MENU_BUTTON_CACHE:'yatsenMenuButtonClientRect',
  USER_GUIDE_CACHE: 'yatsenGuideCache',
  PUBLICNUMBERIMAGE_CACHE:'publicNumberImageUrl',
  ANNOUNCEMENT__CACHE:'announcement__cache',
  USER_SETTING:[{
    type:1,
    label:'用户是否订阅评论回复'
  }]
}

// 导出配置项
module.exports = config;
