const Router = {};
/**
 * @function 路由拦截器
 *
 * @param {*} App
 * @param {*} config
 */
Router.install = function install(App, config) {
  wx.navigate2 = function navigate2(route) {
    let pages = getCurrentPages();
    if (pages.length >= 9) {
      wx.redirectTo({
        url: route.url,
        success: (result)=>{
          App.router.push(route);
          route.success(result);
        },
        fail: route.fail,
        complete: route.complete
      });
    } else {
      wx.navigateTo({
        url: route.url,
        success: (result)=>{
          App.router.push(route);
          route.success(result);
        },
        fail: route.fail,
        complete: route.complete
      });
    }
  }
  wx.navigateBack2 = function navigateBack2(route) {
    let pages = getCurrentPages();
    App.router.pop();
    let router = App.router;
    if (router.length >= 9) {
      wx.redirectTo(router[router.length-1]);
    } else {
      wx.navigateBack(route);
    }
  }
  wx.routerUpdate = function routerUpdate() {
    let pages = getCurrentPages();
    if(pages.length < 9 && App.router.length > 9){
      App.router = App.router.slice(0,pages.length);
    }
  }
}
export default Router;
