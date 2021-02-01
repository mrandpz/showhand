export default {
  name: 'decoration',
  text: '装修',
  icon: 'page',
  path: '/delivery/decoration',
  children: [
    {
      name: 'storeDecoration',
      text: '装修门店',
      path: '/delivery/decoration/stores',
    },
    {
      name: 'decorationPages',
      text: '子页面',
      path: '/delivery/decoration/pages',
    },
  ],
}
