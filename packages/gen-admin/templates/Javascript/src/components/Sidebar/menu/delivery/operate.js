/*
 * @description: 
 * @Author: chenzilin
 * @Date: 2019-09-25 15:02:03
 */
export default {
  name: 'deliveryOperate',
  text: '运营',
  path: '/delivery/operate',
  icon: 'operation',
  children: [
    {
      name: 'daojiaStoreConfig',
      text: '门店配置',
      path: '/delivery/operate/daojia-store-config',
    },
    {
      name: 'addressKey',
      text: '地址关键字',
      path: '/delivery/operate/address-key',
    },
    {
      name: 'searchLabel',
      text: '热门搜索标签',
      path: '/delivery/operate/hot-searchTags',
    },
    {
      name: 'searchKeywords',
      text: '搜索关键词',
      path: '/delivery/operate/search-keywords',
    },
  ],
}
