export default {
  namespace: 'global',
  isSagaModel: true,
  state: {
    collapsed: false,
    isFullScreen: false,
  },
  reducers: {
    setCurrentUserState(state, currentUser) {
      return { ...state, currentUser }
    },
  },
  effects: () => ({}),
}
