# vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### 请求方式
* 创建请求API方法
```js
/**
 * @function 测试GET-API
 * @description 测试get接口是否可行
 * @param {*} [data={}]
 * @returns
 */
function testApi(data = {}) {
    return http.get("/fet/test/testApi", data)
}

/**
 * @function 测试POST-API
 * @description 测试post接口是否可行
 * @param {*} [data={}]
 * @returns
 */
function testApiPost(data = {}) {
    return http.post("/fet/test/testPost", data)
}
// 将新增的API函数名追加到API对象
let API = {
    testApi,
    testApiPost
}
```
* 调用API方法
```js
// Home.vue
export default {
  name: "home",
  created() {
    // 直接使用API对象调用
    this.$api.testApiPost({
      username:'ovenslove',
      password:'aaaa'
    }).then(data=>{
      console.log(data);
    })
     // 使用Async-await调用
    this.testAsync();
  },
  methods: {
    // 创建async函数
    async testAsync() {
      let result = await this.$api.testApi();
      console.log(result);
    }
  }
};
```

### 全局状态管理
> 参照vuex的官方文档   [https://vuex.vuejs.org/zh/](https://vuex.vuejs.org/zh/)


### 远程调试
> 项目内已集成vconsole工具，开启远程调试需要在url后面加入 **?vc=1** 参数即可