/**
 * **基础AJAX请求函数**
 * @author 王刚(Margox Wang)
 * @date 2019-05-08
 */

import qs from 'query-string'
import { message } from 'antd'
import { getStoragedData } from 'helpers/storage'
import history from 'helpers/history'
import { downloadBlob, isEmptyValue } from 'utils/base'

// 需要跳转到登陆页的code
const redirectLoginPageCode = [11005, 301040001]

// 默认的响应数据解析器
const defaultResponseParser = (xhr, param) => {
  let responseData = null

  try {
    responseData = JSON.parse(xhr.responseText)
  } catch {
    return {
      code: -1,
      message: '无法解析接口返回结果',
    }
  }

  if (responseData === null) {
    return {
      code: -1,
      message: '无法解析接口返回结果',
    }
  }

  const code = Number(responseData.code)

  if (code === 200) {
    return responseData
  }

  if (code !== 200 && !param.noErrorToast) {
    message.error(responseData.message)
  }

  if (redirectLoginPageCode.indexOf(responseData.code) !== -1) {
    // 存储登录前的path
    const location = window.location
    localStorage.setItem('before', location.pathname.replace(/\/admin/, '') + location.search)
    history.push('/authorize')
  }

  responseData = responseData || {
    code: -2,
    message: '接口返回数据无效',
  }

  return responseData
}

const downloadResponseParser = xhr => {
  const disposition = xhr.getResponseHeader('Content-Disposition')
  const filename = disposition
    ? disposition.slice(disposition.toLowerCase().indexOf('filename=') + 9)
    : `文件_${new Date().getTime()}`

  if (xhr.response.type === 'application/json') {
    return xhr.response.text().then(JSON.parse)
  }

  return {
    code: 200,
    data: {
      blob: xhr.response,
      filename: filename,
    },
  }
}

/**
 * **发起一个AJAX请求**
 * @param {IRequestParameters} param 请求参数
 * @returns {Promise} 返回一个Promise实例
 */
const request = async param => {
  let {
    url,
    data = {},
    headers,
    timeout,
    isFormData,
    ignoreEmptyParams,
    ingoreCodeError,
    method,
    responseType,
    responseParser,
  } = param

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const j_token = getStoragedData('token', false)

    // 相对路径自动加/api/前缀
    !/^https?:\/\//.test(url) && (url = `/api${url}`)

    // 参数和默认参数处理
    method = method || request.defaultParameters.method
    method = method.toUpperCase()
    timeout = timeout || request.defaultParameters.timeout
    responseType = responseType || request.defaultParameters.responseType
    responseParser = responseParser || request.defaultParameters.responseParser
    headers = { ...request.defaultParameters.headers, j_token, ...headers }

    if (method === 'POST' && (data instanceof FormData || isFormData)) {
      isFormData = true
      Object.keys(request.defaultParameters.data).forEach(key => {
        data.append(key, request.defaultParameters[key])
      })
      /**
       * **formData类型的请求，由xhr自行控制Content-Type，为此需要删除headers中指定的Content-Type**
       */
      delete headers['Content-Type']
      headers['Accept'] = 'application/json'
    } else {
      // FIXME: 当data 为数组时，会被转化成object ，不适宜
      // data = { ...request.defaultParameters.data, ...data }
    }

    // get请求需要重新处理data和url
    if (method === 'GET') {
      if (Object.keys(data).length > 0) {
        url = `${url}?${qs.stringify(data)}`
      }
      data = null
    }

    // 开启请求连接
    xhr.open(method, url, true)
    xhr.responseType = responseType
    xhr.timeout = timeout

    // 设置请求头
    Object.keys(headers).forEach(name => {
      xhr.setRequestHeader(name, headers[name])
    })

    // 监听请求状态变更
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          try {
            let response = responseParser(xhr, param)
            if (response && response.then) {
              response
                .then(nestedResponse => {
                  if (`${nestedResponse.code}` === '200') {
                    resolve(nestedResponse)
                  } else {
                    ingoreCodeError ? resolve(nestedResponse) : reject(nestedResponse)
                  }
                })
                .catch(error => {
                  reject(error)
                })
            } else if (`${response.code}` === '200') {
              resolve(response)
            } else {
              ingoreCodeError ? resolve(response) : reject(response)
            }
          } catch (error) {
            reject(error)
          }
        } else {
          reject({
            code: xhr.status,
            message: '接口请求失败',
          })
        }
      }
    }

    // 监听接口请求超时
    xhr.ontimeout = () => {
      reject({
        code: 408,
        message: '接口请求超时',
      })
    }

    if (ignoreEmptyParams) {
      Object.keys(data).forEach(key => {
        if (isEmptyValue(data[key])) {
          delete data[key]
        }
      })
    }

    // 发送请求
    xhr.send(isFormData ? data : JSON.stringify(data))
  })
}

// 默认的请求参数，可通过request.setDefaultParameters来进行更改
request.defaultParameters = {
  method: 'GET',
  timeout: 15000,
  data: {},
  isFormData: false,
  ingoreCodeError: false, // 是否忽略code不为200的情况，而将所有status为200的响应视为成功
  noErrorToast: false, // 是否隐藏信息toast提示
  ignoreEmptyParams: false,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  responseType: '',
  responseParser: defaultResponseParser,
}

/**
 * **设置默认请求参数，这个影响是全局的，会对之后发起的所有请求生效**
 * @params {object} parameters
 */
request.setDefaultParameters = (parameters = {}) => {
  request.defaultParameters = {
    ...request.defaultParameters,
    ...parameters,
  }
}

/**
 * **get和post请求的简化用法**
 */
request.get = (url, data, options) => request({ url, data, method: 'GET', ...options })
request.post = (url, data, options) => request({ url, data, method: 'POST', ...options })
request.download = (url, data, options = {}) => {
  let requestOptions = {
    method: 'POST',
  }

  if (typeof options === 'string') {
    requestOptions.method = options.toUpperCase()
  } else {
    requestOptions = {
      ...requestOptions,
      ...options,
    }
  }

  return new Promise((resolve, reject) => {
    return request({
      url,
      data,
      responseType: 'blob',
      responseParser: downloadResponseParser,
      ...requestOptions,
    })
      .then(responseData => {
        downloadBlob(
          responseData.data.blob,
          requestOptions.fileName || decodeURIComponent(responseData.data.filename)
        )
        resolve(responseData)
      })
      .catch(reject)
  })
}

/**
 * 兼容写法
 *
 * @param {*} url
 * @param {*} {method,body}
 * @returns
 */
export const requestV1 = (url, args = {}) => {
  const { method = 'GET', body } = args

  if (method === 'GET') {
    return request.get(url, body, { ingoreCodeError: true })
  } else if (method === 'POST') {
    return request.post(url, body, { ingoreCodeError: true })
  }
}

export default request
