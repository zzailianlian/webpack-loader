module.exports = function (content, map, meta) {
  console.log('loader-index2', content)

  // 异步写法
  const async = this.async();
  // setTimeout(() => {
  //   async(null, content, map, meta)
  // }, 1000)
  //  setTimeout(() => {
  //   this.callback(null, content, map, meta)
  // }, 1000)
  // 同步写法一
  // this.callback(null, content, map, meta)
  // 同步写法二
  // return content
}

module.exports.pitch = function (content, map, meta) {
  console.log("loader-index2-pitch")
}