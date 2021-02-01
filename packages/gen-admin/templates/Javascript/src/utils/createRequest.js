import request from './request'

// 当文件不存在的时候放置
let apiMap
try {
  apiMap = require('../.api')
} catch (error) {
  console.warn(error)
}

/**
 * 生成请求方法
 *
 * @param {*} type 请求类型
 * @param {*} body 请求参数，get会将请求参数拼接在URL中
 * @param {*} urlParameter  URL中的参数，
 */
const createRequest = (type, data, urlParameter, options = {}) => {
  let apiInfo = apiMap[type]
  const { isDownload, ...restOptions } = options

  if (!apiInfo) {
    throw Error(`无法匹配类型为${type} 的API配置`)
  }

  // 去掉多余的空格
  apiInfo = apiInfo.trim().replace(/\s+/g, ' ')

  // 默认mthod 为 post
  let apiInfoArry = apiInfo.split(' ')
  if (apiInfoArry.length === 1) {
    apiInfoArry.unshift('post')
  }

  let [method = '', url = ''] = apiInfoArry

  // 替换url的参数
  if (urlParameter) {
    for (const key in urlParameter) {
      const val = urlParameter[key]
      url = url.replace(`:${key}`, val)
    }
  }

  restOptions.method = method

  if (isDownload) {
    return request.download(url, data, restOptions)
  } else {
    return request({ url, data, ...restOptions })
  }
}

/**
 * 根据type创建service 
 *
 * @param {*} type
 * @returns
 */
export const createService = type => {
  return body => {
    return createRequest(type, body)
  }
}

createRequest.download = (type, data, urlParameter, options) =>
  createRequest(type, data, urlParameter, {
    ...options,
    isDownload: true,
  })

export default createRequest
