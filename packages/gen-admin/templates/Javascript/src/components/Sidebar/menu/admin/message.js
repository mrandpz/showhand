/*
 * @Author: zengrui
 * @Date: 2019-09-06 14:53:36
 * @LastEditors: zengrui
 * @LastEditTime: 2019-09-06 15:28:50
 * @Description:消息模块
 */

export default {
  name: 'message',
  text: '消息',
  path: '/message',
  icon: 'message',
  children: [
    {
      name: 'APP',
      text: 'APP消息管理',
      path: '/message-manage/message-app',
    },
    {
      name: 'wechat',
      text: '微信消息模板',
      path: '/message-manage/message-wechat',
    },
    {
      name: 'short',
      text: '短信管理',
      path: '/message-manage/message-short',
    },
  ],
}
