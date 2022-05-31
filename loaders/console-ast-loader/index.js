const { parse } = require('@babel/parser')
const traverse = require("@babel/traverse");
const generate = require('@babel/generator')
// const schema = require('./schema.json')
const types = require('@babel/types')
const path = require('path')

module.exports = function (content, map, meta) {
  const { needRemovedConsoleArray, consolePrefix } = this.getOptions() || {
    needRemovedConsoleArray: [],
    consolePrefix: {}
  };
  const resourceFileName = path.basename(this.resource);
  const ast = parse(content, {
    sourceType: 'module'
  })
  traverse.default(ast, {
    CallExpression: function (path, state) {

      const consoleName = path.container.expression.callee && path.container.expression.callee.property && path.container.expression.callee.property.name
      const consoleLocation = path.container.expression.loc && path.container.expression.loc.start

      // 如果在需要移除的console中，则移除
      if (needRemovedConsoleArray.includes(consoleName)) {
        return path.remove()
      }
      for (const consoleType in consolePrefix) {
        if (Object.hasOwnProperty.call(consolePrefix, consoleType) && consoleName === consoleType) {
          const prefix = consolePrefix[consoleType];
          if (typeof prefix === 'string') {
            path.node.arguments.unshift(types.stringLiteral(prefix))
          }
          if (prefix instanceof Object) {
            path.node.arguments.unshift(types.stringLiteral(`${resourceFileName} \nline:${consoleLocation.line};column：${consoleLocation.column} \n`))
          }
        }
      }
    }
  })
  const { code } = generate.default(ast)
  this.callback(null, code, map, meta)
  // return content
}