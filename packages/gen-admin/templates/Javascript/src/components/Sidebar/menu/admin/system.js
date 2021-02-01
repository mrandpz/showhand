export default {
  name: 'system',
  text: '系统',
  path: '/system',
  icon: 'system',
  children: [
    {
      name: 'account-authority',
      text: '账号权限',
      path: '/system/account-authority',
      children: [
        {
          name: 'account',
          text: '账号管理',
          path: '/system/account-authority/account-manage',
        },
        {
          name: 'roles',
          text: '角色管理',
          path: '/system/account-authority/roles-manage',
        },
      ],
    },
    {
      name: 'operation-logs',
      text: '操作日志',
      path: '/system/operation-logs',
    },
  ],
}
