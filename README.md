## 注意事项

### 1、loader的本质

loader的本质就是一个`module.exports`暴露出去的一个函数方法

> 注意`module.exports`暴露出去的一定不要是箭头函数，因为异步loader的使用是需要用到`this`的，而箭头函数不存在`this`


### 2、在webpack中实现简单的loader

```javascript
module.exports = function (content, map, meta) {
  // 其中content就是通过loader的test规则匹配到的文件资源内容
  // map 和 meta 暂时不用了解
  console.log('loader', content)
  return content
}
```

### 3、在webpack中如何引入你的loader

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  module:{
    rules:[
      {
        test:/\.js$/,
        loader: path.resolve(__dirname,'loaders/index.js')
      }
    ]
  }
}

```
可以通过配置`resolveLoader`来让你的loader引入更加优雅
```javascript
module.exports = {
  module:{
    rules:[
      {
        test:/\.js$/,
        loader: 'index'
      }
    ]
  },
  resolveLoader: {
    modules: [resolve(__dirname, 'loaders')]
  },
}
```

### 4、loader加载顺序

我们都知道，当想要多个loader作用时，需要想`loader`属性用`use`来代替，通过`use:['loader1','loader2']`的方式来实现。

基本的loader执行顺序也是从后向前执行的。

但是loader并不是整体都是从后向前的，loader中注册的pitch是从前向后执行的。我们来看一下
```javascript
// loader中pitch的注册写法
module.exports.pitch = function () {
  console.log("index1-pitch")
}
```
我们可以通过注册多个loader的pitch来看下打印

![loader打印顺序](https://note.youdao.com/yws/public/resource/a8003179d02ce39b6b77f5c5d8c4756b/xmlnote/WEBRESOURCEa51cc901efd7fa552402ec81515d743a/587)


### 3、同步loader和异步loader

#### 同步loader
```javascript
// 写法一
module.exports = function (content, map, meta) {
  console.log('loader-index3', content, map, meta)
  // console.log('options', getOptions(this))
  return content
}

// 写法二
module.exports = function (content, map, meta) {
  this.callback(null, content, map, meta)
}
```

#### 异步loader
```javascript
module.exports = function (content, map, meta) {
  const callback = this.async();
  setTimeout(() => {
    // 不能直接将同步的this.callback放到settimeout里面，否则会报错
    callback(null, content, map, meta)
  }, 2000);
}
```
> 注意，不可将this.callback直接放到异步操作中，否则会报错

### 3、接收loader传入的options

loader可能需要传入一些自定义的配置，那怎样在loader内部接收到这写参数？

可以通过`loader-utils`这个库来接收，注意库的版本和使用方法

```javascript
//webpack.config.js
module.exports = {
  ///...
  module:{
    rules:[
      {
        test:/\.js$/,
        loader:'index',
        options:{
          name: 'zzz',
          age: 21
        }
      }
    ]
  }
}

// loader
// loader-utils v2.0.0
const {getOptions} = require('loader-utils');

module.exports = function(content,map,meta){
  // 只需要调用暴露出来的getOptions，传入this即可
  const options = getOptions(this) || {};
  console.log('loader-options',options)
  this.callback(content,map,meta)
}
```
![打印loader传入的options](https://note.youdao.com/yws/public/resource/a8003179d02ce39b6b77f5c5d8c4756b/xmlnote/WEBRESOURCEebf7d3273ed53daf7a0917a9eefdcfe7/590)

可以看到用法很简单，只需要用暴露出的`getOptions`传入`this`就会返回在`webpack.config.js`中定义的`options`字段


### 4、对loader传入的options进行校验

借助`schema-utils`的库，同样需要注意库的版本和用法
定义一个`schema.json`的文件来做一些字段的约束

```json
{
  // 整体options传入的类型一般都是object
  "type": "object",
  // 对传入的属性进行约束
  "properties": {
    // key值为options传入的key，value是一个对象，对传入的value进行约束
    "name": {
      // 表述传入的options的类型
      "type": "string",
      // 如果未按照要求传的话，会抛出description中定义的信息
      "description": "输入的name必须是string类型"
    },
    // 同上
    "age": {
      "type": "number",
      "description": "输入的age必须是number类型"
    }
  },
  // 是否允许options中存在以上属性之外的属性，为true允许，false为不允许
  "additionalProperties": true
}
```

然后在loader中通过`schema-utils`暴露的方法来约束下用户输入的`options`
```javascript
  // loader
  const loaderUtils = require('loader-utils');
  // schema-utils v2.7.1
  const validate = require('schema-utils');

  const schema = require('./schema.json')

  module.exports = function (content, map, meta) {
    console.log('loader-index3', content)
    console.log('laoder-options', loaderUtils.getOptions(this))
    const options = loaderUtils.getOptions(this) || {}
    // 校验传入参数是否符合你的规范
    validate(schema, options)

    this.callback(null, content, map, meta)
    // return content
  }

```
