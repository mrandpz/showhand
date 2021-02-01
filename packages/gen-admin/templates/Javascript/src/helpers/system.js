import store from 'store'
import { tryExecute } from 'utils/base'
import { setStoragedData } from 'helpers/storage'

export const setSystemLocale = locale => {
  setStoragedData('lz-app-locale', locale)
  location.reload()
  // store.dispatch.system.setSystemLocale({ payload: locale, preventLoading: true })
}

export const setBreadcrumb = breadcrumb => {
  store.dispatch.system.setBreadcrumb({ payload: breadcrumb, preventLoading: true })
  document.title = breadcrumb
    ? `scrm-${breadcrumb.map(item => tryExecute(item).title).join('-')}`
    : 'scrm'
}

export const toggleSidebar = () => {
  store.dispatch.system.toggleSidebar()
}
