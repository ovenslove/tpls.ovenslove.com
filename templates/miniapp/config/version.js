// 定义版本对象
let v = [];

// 1.1.8版本更新
v.push({
  version: '1.1.0',
  list: [{
      "type": "rebuild",
      "content": "重构"
    }, {
      "type": "update",
      "content": "更新"
    },
    {
      "type": "add",
      "content": "新增"
    }
  ]
})

export default {
  lastVersion: v[v.length - 1].version,
  version: v
};