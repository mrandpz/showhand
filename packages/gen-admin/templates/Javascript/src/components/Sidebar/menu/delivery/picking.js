export default {
  name: 'picking',
  text: '拣货',
  path: '/delivery/picking',
  icon: 'pick',
  children: [
    {
      name: 'pickingOrder',
      text: '拣货订单',
      path: '/delivery/order/picking/pick-order',
    },
    {
      name: 'pickingArea',
      text: '拣货区域',
      path: '/delivery/picking/area',
    },
    {
      name: 'pickingWarehouse',
      text: '拣货仓配置',
      path: '/delivery/picking/warehouse',
    },
  ],
}
