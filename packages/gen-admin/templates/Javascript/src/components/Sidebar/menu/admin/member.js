/*
 * @description: 会员
 * @Author: chenzilin
 * @Date: 2019-08-22 18:53:21
 */
export default {
  name: 'member',
  text: '会员',
  path: '/member',
  icon: 'member',
  children: [
    {
      name: 'member-portrait',
      text: '会员画像',
      path: '/member/portrait',
      children: [
        {
          name: 'overview',
          text: '会员概况',
          path: '/member/member-portrait/overview',
        },
        {
          name: 'customer-portrait',
          text: '客群画像',
          path: '/member/member-portrait/customer-portrait',
        },
        {
          name: 'customer-preference',
          text: '客群偏好',
          path: '/member/member-portrait/customer-preference',
        },
        {
          name: 'member-list',
          text: '会员列表',
          path: '/member/member-portrait/member-list',
        },
      ],
    },
    {
      name: 'member-tag',
      text: '会员标签',
      path: '/member/tag',
      children: [
        {
          name: 'collect',
          text: '标签汇总',
          path: '/member/member-tag/collect',
        },
        {
          name: 'patch',
          text: '会员补充标签',
          path: '/member/member-tag/patch',
        },
      ],
    },
    {
      name: 'member-group',
      text: '会员群组',
      path: '/member/group',
      children: [
        {
          name: 'collect',
          text: '会员群组',
          path: '/member/member-group/index',
        },
      ],
    },
    {
      name: 'member-life-cycle',
      text: '会员生命周期',
      path: '/member/life-cycle',
      children: [
        {
          name: 'member-life-cycle',
          text: '会员生命周期',
          path: '/member/member-life-cycle',
        },
      ],
    },
    // 好多，补充
  ],
}
