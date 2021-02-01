import React from 'react'
// 引入自动生成的 /src/routes,
// 因为配置了别名modules: [path.resolve(__dirname, '../src'), 'node_modules'],
// 所以src下的模块可以跟module一样引入的方法
import SubRoutes from 'routes'
import Loading from 'components/Loading'
import SideBar from 'components/Sidebar'
import TopBar from 'components/Topbar'

// models
import { withStore } from 'store'
import './styles.scss'

class PageIndex extends React.Component {
  componentDidMount() {
    // this.props.dispatch.user.getCurrentUser()
  }

  render() {
    return (
      <div className="page page-index">
        <SideBar history={this.props.history} location={this.props.location} />
        <div className="page-content">
          <TopBar />
          <React.Suspense fallback={<Loading className="page-loading" text="加载中，请稍候" />}>
            <SubRoutes match={this.props.match} />
          </React.Suspense>
        </div>
      </div>
    )
  }
}

export default withStore()(PageIndex)
