import React from 'react'
import moment from 'moment'

import { ConfigProvider } from 'antd'
import { addLocaleData, IntlProvider, injectIntl, FormattedMessage } from 'react-intl'
import { getStoragedData } from 'helpers/storage'
import store, { withStore } from 'store'

// 引入语言环境数据
import 'moment/locale/zh-cn' // 中文
import localeEN from 'react-intl/locale-data/en'
import localeZH from 'react-intl/locale-data/zh'
import antdZhCNLocale from 'antd/es/locale-provider/zh_CN'
import antdEnUSLocale from 'antd/es/locale-provider/en_US'

const getAntPopupContainer = trigger => (trigger ? trigger.parentNode : document.body)

const antdLocalesMap = {
  'zh-cn': antdZhCNLocale,
  'en-us': antdEnUSLocale,
}

/**
 * **初始化语言环境数据**
 * 这一步的目的是为了让诸如日期等数据可以自行适应当前所属语言环境
 */
addLocaleData(localeEN)
addLocaleData(localeZH)

export const getLocale = () => getStoragedData('lz-app-locale') || 'zh-cn'

// 初始化moment locale
moment.locale(getLocale())

// 缓存intl对象，这个对象在IntlProvider被渲染之后获取到
let __intl = null

/**
 * 注册业务语言包
 * 适用在异步加载的模块中注册模块所需要的语言包
 * @param {object} localeModule
 * @param {string} namespace
 */

export const registerLocale = (localeModule, namespace = '') => {
  // 放在system中
  const { localeMessages } = store.getState().system

  // 将新的语言包数据合并到当前语言包 ???
  Object.keys(localeModule).forEach(key => {
    Object.keys(localeModule[key]).forEach(subKey => {
      localeMessages[key] &&
        (localeMessages[key][`${namespace ? namespace + '.' : ''}${subKey}`] =
          localeModule[key][subKey])
    })
  })

  // 更新全局状态中的语言包数据
  store.dispatch.system.setSystemLocaleMessages({ payload: localeMessages })
}

/**
 * 格式化文本字符串返回组件
 * @param {ReactItntl.MessageDescriptorm|string} messageDescriptor
 * @param {object} value
 * @returns {string}
 */

export const FormatMessage = (messageDescriptor, value) => {
  return <FormattedMessage id={messageDescriptor} values={value} />
}

/**
 * **格式化文本字符串**
 * MessageDescriptorm类型请参见:[https://github.com/formatjs/react-intl/blob/master/docs/API.md#message-descriptor]
 * @param {ReactItntl.MessageDescriptorm|string} messageDescriptor
 * @param {object} value
 * @returns {string}
 */
export const formatMessage = (messageDescriptor, value) => {
  typeof messageDescriptor === 'string' && (messageDescriptor = { id: messageDescriptor })

  return __intl
    ? typeof value === 'string'
      ? `${__intl.formatMessage(messageDescriptor)}${value}`
      : __intl.formatMessage(messageDescriptor, value)
    : messageDescriptor.defaultMessage || messageDescriptor
}

export const fmt = formatMessage

/**
 * **格式化HTML字符串**
 * @param {ReactItntl.MessageDescriptorm|string} messageDescriptor
 * @param {object} value
 * @returns {string}
 */
export const formatHTMLMessage = (messageDescriptor, value) => {
  typeof messageDescriptor === 'string' && (messageDescriptor = { id: messageDescriptor })
  return __intl
    ? __intl.formatHTMLMessage(messageDescriptor, value)
    : messageDescriptor.defaultMessage || messageDescriptor
}

/**
 * **传入一个字符串，返回一个格式化函数，这个会自动在messageDescriptor拼接传入的字符串作为前缀**
 * @param {string} prefix
 * @returns {(messageDescriptor: ReactItntl.MessageDescriptorm|string, value: object) => string}
 */
export const formatWithNamespace = (namespace = '') => {
  return (messageDescriptor, value) =>
    formatMessage(`${namespace ? namespace + '.' : ''}${messageDescriptor}`, value)
}

/**
 * *一个中间层小组件，用于获取__intl对象*
 */
const IntlConsumer = injectIntl(props => {
  // 获取intl对象
  __intl = props.intl
  // 返回组件
  return props.children
})

/**
 * **封装IntelProvider组件**
 */
export const I18nWrapper = withStore(['system'])(props => {
  // 返回组件
  return (
    <IntlProvider
      locale={props.system.locale}
      messages={props.system.localeMessages[props.system.locale]}>
      <IntlConsumer>
        <>
          <ConfigProvider
            getPopupContainer={getAntPopupContainer}
            autoInsertSpaceInButton={false}
            locale={antdLocalesMap[props.system.locale]}>
            {props.children}
          </ConfigProvider>
        </>
      </IntlConsumer>
    </IntlProvider>
  )
})

export { FormattedMessage }
