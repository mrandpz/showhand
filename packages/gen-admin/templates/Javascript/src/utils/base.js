/**
 * 判断一个函数是否是一个生成器函数
 * @param {Function} fn
 * @returns {Boolean}
 */
export const isGeneratorFunction = fn => {
  return fn && Object.prototype.toString.call(fn) === '[object GeneratorFunction]'
}
