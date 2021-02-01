import React, { useState, useCallback } from 'react'
import { Icon } from 'antd'
import { NavLink, Link } from 'react-router-dom'
import { isPathMatch } from 'utils/route'
import { withStore } from 'store'
import adminMenu from './menu/admin'
import deliveryMenu from './menu/delivery'
import './styles.scss'

const basename = '/admin'

const sites = [
  {
    name: 'admin',
    title: '业务中台',
    path: '/welcome',
    rootPath: '/admin',
    menu: adminMenu,
  },
  {
    name: 'delivery',
    title: '到家',
    path: '/delivery/welcome',
    rootPath: '/delivery',
    menu: deliveryMenu,
  },
]

// 侧边栏菜单项组件
const MenuItem = props => {
  const [expanded, setExpanded] = useState(true)
  const toggleExpanded = () => setExpanded(!expanded)

  return (
    <>
      {props.path && !props.children ? (
        <NavLink
          to={props.path}
          className="menu-item"
          data-depth={props.depth}
          data-index={props.index}>
          <span>{props.text}</span>
        </NavLink>
      ) : (
        <a
          className="menu-item"
          data-depth={props.depth}
          data-index={props.index}
          data-active={isPathMatch(props.activePath, props.strict)}
          data-expanded={expanded}
          onClick={toggleExpanded}>
          <span className="menu-title">
            <span>{props.text}</span>
            <Icon type={expanded ? 'up' : 'down'} />
          </span>
        </a>
      )}
      {props.children ? (
        <Menu parentNenuName={props.name} menu={props.children} depth={props.depth + 1} />
      ) : null}
    </>
  )
}

// 侧边栏菜单组件
const Menu = props => {
  if (!props.menu || !props.menu.length) {
    return null
  }

  return (
    <div
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      className={`lz-component-menu ${props.className} depth-${props.depth}`}>
      {props.parentMenuText ? (
        <span className="parent-menu-text">{props.parentMenuText}</span>
      ) : null}
      {props.menu.map((item, index) => (
        <MenuItem
          key={item.name}
          index={index}
          name={item.name}
          path={item.path}
          activePath={item.activePath}
          strict={item.strict}
          text={item.text}
          depth={props.depth}
          children={props.noChildren ? null : item.children}
        />
      ))}
    </div>
  )
}

Menu.defaultProps = {
  depth: 1,
  className: '',
}

let hoverOutTimeout = null

// 侧边栏组件，由Logo区域和侧边栏菜单自组件构成
const SideBar = React.memo(props => {
  if (props.system.fullscreen) {
    return null
  }

  const [hoverMenuIndex, setHoverMenuIndex] = useState(null)

  const getCurrentSite = useCallback(() => {
    return (
      [...sites].reverse().find(item => {
        return isPathMatch(`${basename}${item.rootPath}`)
      }) || sites[0]
    )
  }, [location.pathname])

  const currentSite = getCurrentSite()
  const currentMenu = currentSite.menu

  const getCurrentRootMenuIndex = useCallback(() => {
    return currentMenu.findIndex(item => {
      return isPathMatch(`${basename}${item.path}`)
    })
  }, [location.pathname])

  const hoverMenu = currentMenu[hoverMenuIndex]?.children || null
  const slideMenuIndex = getCurrentRootMenuIndex()
  const slideMenu = currentMenu[slideMenuIndex]?.children || null
  const sidebarCollapsed = props.system.sidebarCollapsed || !slideMenu

  const handleRootMenuMouseEnter = useCallback(event => {
    clearTimeout(hoverOutTimeout)
    setHoverMenuIndex(+event.currentTarget.dataset.index)
  }, [])

  const handleRootMenuMouseLeave = useCallback(event => {
    hoverOutTimeout = setTimeout(() => {
      setHoverMenuIndex(null)
    }, 50)
  }, [])

  const handleSlideMenuMouseEnter = useCallback(
    event => {
      clearTimeout(hoverOutTimeout)
      setHoverMenuIndex(hoverMenuIndex)
    },
    [hoverMenuIndex]
  )

  const handleSlideMenuMouseLeave = useCallback(event => {
    setHoverMenuIndex(null)
  }, [])

  return (
    <aside
      className="component-sidebar"
      data-hovering={hoverMenuIndex !== null}
      data-collapsed={sidebarCollapsed}
      data-no-slip-menu={!slideMenu}>
      <div className="body">
        <div className="logo">
          <img className="logo-image" />
          <div className="site-switcher">
            <div className="entries">
              {sites.map((item, index) => (
                <Link
                  data-active={currentSite.name === item.name}
                  to={item.path}
                  className="item"
                  key={index}>
                  <img className="icon" />
                  <span className="title">{item.title}</span>
                </Link>
              ))}
            </div>
            <span className="footer-title">永旺数字化运营平台</span>
          </div>
        </div>
        <div className="root-menu">
          {currentMenu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className="menu-item"
              data-index={index}
              onMouseEnter={handleRootMenuMouseEnter}
              onMouseLeave={handleRootMenuMouseLeave}>
              <img
                className="menu-icon"
                src={`/static/images/sidemenu/icon_menu_${item.icon}_normal.svg`}
                alt={item.text}
              />
              <img
                className="menu-icon active"
                src={`/static/images/sidemenu/icon_menu_${item.icon}_selected.svg`}
                alt={item.text}
              />
              <span className="menu-text">{item.text}</span>
            </NavLink>
          ))}
        </div>
      </div>
      {hoverMenu && hoverMenuIndex !== slideMenuIndex ? (
        <Menu
          depth={2}
          className="hover-menu"
          menu={hoverMenu}
          parentMenuText={currentMenu[hoverMenuIndex].text}
          onMouseEnter={handleSlideMenuMouseEnter}
          onMouseLeave={handleRootMenuMouseLeave}
        />
      ) : null}
      {slideMenu ? (
        <Menu
          depth={2}
          className="slide-menu"
          menu={slideMenu}
          parentMenuText={currentMenu[slideMenuIndex]?.text}
        />
      ) : null}
    </aside>
  )
})

export default withStore(['system'])(SideBar)
