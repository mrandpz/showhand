export default {
  name: 'order',
  text: '交易',
  path: '/delivery/order',
  icon: 'order',
  children: [
    {
      name: 'salesOrder',
      text: '销售订单',
      path: '/delivery/order/sales-order',
    },
    {
      name: 'afterServiceOrder',
      text: '售后订单',
      path: '/delivery/order/afterservice-order',
    },
  ],
}
