/*
 * @Author: Gavin.Wu
 * @Date: 2019-08-09 10:47:09
 * @Last Modified by: silin.yuan
 * @Last Modified time: 2019-10-17 10:59:56
 * @Description: 商品模块
 */

export default {
  name: 'commodity',
  text: '商品',
  path: '/delivery/commodity',
  icon: 'commodity',
  children: [
    {
      name: 'sale',
      text: '线上销售分类',
      path: '/delivery/commodity/sale',
    },
    {
      name: 'shopCommodity',
      text: '门店商品',
      path: '/delivery/commodity/shop',
    },
    {
      name: 'priceManage',
      text: '价格管理',
      path: '/delivery/commodity/price',
    },
    {
      name: 'stockManage',
      text: '库存管理',
      path: '/delivery/commodity/inventory-manage',
    },
    {
      name: 'shopCorner',
      text: '商品角标',
      path: '/delivery/commodity/corner',
    },
  ],
}
