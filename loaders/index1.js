module.exports = function (content, map, meta) {
  console.log('loader-index1', content)
  this.callback(null, content, map, meta)
  // return content
}

module.exports.pitch = function (content, map, meta) {
  console.log("loader-index1-pitch")
}