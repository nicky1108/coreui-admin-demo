export default {
  items: [
    {
      name: '消费管理',
      url: '/consumption',
      icon: 'icon-speedometer',
      children: [
        {
          name: '消费管理',
          url: '/consumption/home',
          // icon: 'cui-speedometer'
        },
        {
          name: '预约管理',
          url: '/consumption/subscribe',
          // icon: 'icon-notebook'
        },
        {
          name: '订单管理',
          url: '/consumption/order',
          // icon: 'icon-wallet'
        }
      ]
    },
    {
      name: '会员管理',
      url: '/vip',
      icon: 'icon-people',
      children: [
        {
          name: '会员类型',
          url: '/vip/home',
          // icon: 'icon-bell'
        },
        {
          name: '会员列表',
          url: '/vip/list',
          // icon: 'icon-bell'
        },
      ]
    },
    
    {
      name: '系统管理',
      url: '/system',
      icon: 'icon-speedometer',
      children: [
        {
          name: '配置管理',
          url: '/system/config',
        },
      ]
    },
  ]
}
