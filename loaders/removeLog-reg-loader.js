module.exports = function (content, map, meta) {
  console.log('content', content)
  this.callback(null, content, map, meta)
  // return content
}