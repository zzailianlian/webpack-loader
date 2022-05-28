const loaderUtils = require('loader-utils');
const validate = require('schema-utils');

const schema = require('./schema.json')

module.exports = function (content, map, meta) {
  console.log('loader-index3', content)
  console.log('laoder-options', loaderUtils.getOptions(this))
  const options = loaderUtils.getOptions(this) || {}
  // 校验传入参数是否符合你的规范
  validate(schema, options)

  this.callback(null, content.replace(/入口文件/, options.name), map, meta)
  // return content
}

module.exports.pitch = function (content, map, meta) {
  console.log("loader-index3-pitch")
}