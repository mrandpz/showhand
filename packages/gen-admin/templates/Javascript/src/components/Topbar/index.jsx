import React from 'react'
import { Menu, Dropdown, Button, Icon, Avatar, Spin } from 'antd'
import { withStore } from 'store'
import history from 'helpers/history'
import { Link } from 'react-router-dom'
import createRequest from 'utils/createRequest'
import { setSystemLocale, toggleSidebar } from 'helpers/system'
import { tryExecute } from 'utils/base'
import UpdatePWD from './components/updatePassword'
import './styles.scss'

const localeNames = {
  'en-us': 'English',
  'zh-cn': '简体中文',
}

const handleMenuClick = event => {
  setSystemLocale(event.key)
}

const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="zh-cn">简体中文</Menu.Item>
    <Menu.Item key="en-us">English</Menu.Item>
  </Menu>
)

const TopBar = props => {
  // 暂不做登录处理
  if (!props.user) {
    return <div className="lz-component-topbar"></div>
  }
  const {
    user: { currentUser },
  } = props

  const { sidebarCollapsed, fullscreen, locale } = props.system
  let { breadcrumb } = props.system

  if (fullscreen) {
    return null
  }

  if (typeof breadcrumb === 'function') {
    breadcrumb = breadcrumb(locale)
  }

  const onMenuClick = () => {}

  const onLogout = async () => {
    const { code } = await createRequest('common.logout')
    if (code === 200) {
      localStorage.setItem('before', location.pathname.replace(/\/admin/, '') + location.search)
      history.push('/authorize')
    }
  }

  const changePWD = () => {}

  const infoMenu = (
    <Menu selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="personInfo">
        <Link to="/welcome/single-info">
          <Icon type="setting" className="mr10" />
          个人资料
        </Link>
      </Menu.Item>
      <Menu.Item key="changePwd">
        <UpdatePWD currentUser={currentUser} />
      </Menu.Item>
      <Menu.Item key="logout" onClick={onLogout}>
        <Icon type="logout" className="mr10" />
        退出登录
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="lz-component-topbar">
      <button onClick={toggleSidebar} className="button-toggle-sidebar">
        <Icon type={sidebarCollapsed ? 'menu-unfold' : 'menu-fold'} />
      </button>
      {breadcrumb && breadcrumb.length ? (
        <div className="breadcrumb">
          {breadcrumb.map(item => {
            const { path, title } = tryExecute(item)
            return path ? (
              <Link key={title} to={path}>
                {title}
              </Link>
            ) : (
              <span key={title}>{title}</span>
            )
          })}
        </div>
      ) : null}

      <div className="locale-switcher right">
        {currentUser ? (
          <Dropdown placement="bottomRight" overlay={infoMenu}>
            <span className="action account">
              <Avatar size="small" className="avatar" src={currentUser.avatar} />
              <span className="name">{currentUser.account}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8 }} />
        )}
        <Dropdown overlay={menu}>
          <Button>
            {localeNames[locale] || locale} <Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}

export default withStore(['system', 'user'])(TopBar)
