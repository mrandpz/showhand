import moment from 'moment'
import localeMessages from 'i18n'
import { getStoragedData } from 'helpers/storage'

const defaultLocale = getStoragedData('lz-app-locale') || 'zh-cn'

export default {
  state: {
    locale: defaultLocale,
    localeMessages: localeMessages,
    breadcrumb: null,
    sidebarCollapsed: false,
    fullscreen: false,
  },
  reducers: {
    // 设置语言
    setSystemLocaleMessages(prev, { payload: localeMessages }) {
      return { ...prev, localeMessages }
    },
    // 时间语言的设置
    setSystemLocale(prev, { payload: locale }) {
      moment.locale(locale)
      return { ...prev, locale }
    },
    setSystemState(prev, { payload: data }) {
      return { ...prev, ...data }
    },
    setBreadcrumb(prev, { payload: breadcrumb }) {
      return { ...prev, breadcrumb }
    },
    collapseSidebar(prev) {
      return { ...prev, sidebarCollapsed: true }
    },
    expandSidebar(prev) {
      return { ...prev, sidebarCollapsed: false }
    },
    toggleSidebar(prev) {
      return { ...prev, sidebarCollapsed: !prev.sidebarCollapsed }
    },
    toggleFullscreen(prev, { payload }) {
      const { fullscreen } = payload
      if (typeof fullscreen === 'boolean') {
        return { ...prev, fullscreen }
      }
      return { ...prev, fullscreen: !prev.fullscreen }
    },
  },
  effects: disptach => ({}),
}
