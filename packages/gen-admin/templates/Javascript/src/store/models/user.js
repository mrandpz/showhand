import { setStoragedData } from 'helpers/storage'
import createRequest from 'utils/createRequest'

export default {
  state: {
    currentUser: undefined,
  },
  reducers: {
    setCurrentUser(state, { payload: currentUser }) {
      return { ...state, currentUser }
    },
  },
  effects: dispatch => ({
    async getCurrentUser({ forceUpdate = true }, rootState) {
      if (!forceUpdate && rootState.user.currentUser) {
        return rootState.user.currentUser
      }

      const token = localStorage.getItem('token')

      if (!token) {
        throw {
          message: 'token无效',
        }
      }

      const response = await createRequest('common.getCurrentUserInfo', { j_token: token })
      const { code, data } = response

      if (code === 200) {
        dispatch.user.setCurrentUser(data)
        return data
      } else {
        throw response
      }
    },
    async login({ payload }) {
      const response = await createRequest('common.login', payload)
      const { code, data } = response

      if (code === 200) {
        const { token, userDomain } = data
        setStoragedData('token', token, false)
        dispatch.user.setCurrentUser(userDomain)
        return data
      } else {
        throw response
      }
    },
  }),
}
