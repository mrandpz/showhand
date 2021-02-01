/**
 * 启动入口页面
 */

import 'react-hot-loader'
import 'helpers/antInit'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from 'store'

// import CRContext from 'helpers/lingzhiCRC' // 提供给组件的帮助函数 可先不要
import AppEntry from './entry'

render(
  <Provider store={store}>
    <AppEntry />
  </Provider>,
  document.querySelector('#root')
)
