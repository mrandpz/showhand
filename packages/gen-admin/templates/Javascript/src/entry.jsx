/**
 * 入口页面
 */

import { hot } from 'react-hot-loader/root'
import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { I18nWrapper } from 'helpers/i18n'
import Loading from 'components/Loading'
import history from 'helpers/history'
import { fmt } from 'helpers/i18n'

// 使用less覆盖antd样式
import 'assets/less/theme.less'
import 'assets/scss/_base.scss'

window.fmt = fmt
const App = () => {
  return (
    <Router history={history}>
      <I18nWrapper>
        <React.Suspense fallback={<Loading className="page-loading" text="加载中，请稍候" />}>
          <Switch>
            {/* pages/index 中对当前index的子路由进行处理 */}
            <Route path="/" component={React.lazy(() => import('pages/index'))} />
          </Switch>
        </React.Suspense>
      </I18nWrapper>
    </Router>
  )
}

export default hot(App)
