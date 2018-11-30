import Vue from 'vue'
import Router from 'vue-router'


// 消费管理
const ConsumptionHome = () => import('@/views/consumption/Home')
const Subscribe = () => import('@/views/consumption/Subscribe')
const Order = () => import('@/views/consumption/Order')

// 会员管理
const Vip = () => import('@/views/vip/Home')
const VipList = () => import('@/views/vip/Viplist')
const VipDetail = () => import('@/views/vip/VipDetail')

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')

// // Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')

//系统管理路由
const Config = () => import('@/views/system/Config')
const Admin = () => import('@/views/system/Admin')
const Charging = () => import('@/views/system/Charging')
const Room = () => import('@/views/system/Room')

//门店管理路由
const Shop = () => import('@/views/shop/Shop')


//交班管理
const Change = () => import('@/views/workers/Change')
const ChangeHis = () => import('@/views/workers/ChangeHis')

Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/consumption/home',
      name: '消费管理',
      component: DefaultContainer
    },
    {
      path: '/consumption',
      redirect: '/consumption/home',
      name: '消费管理',
      component: DefaultContainer,
      children: [
        {
          path: 'home',
          name: '消费管理',
          component: ConsumptionHome
        },
        {
          path: 'subscribe',
          name: '预约管理',
          component: Subscribe
        },
        {
          path: 'order',
          name: '订单管理',
          component: Order
        }
      ]
    },
    {
      path: '/worker',
      redirect: '/worker/change',
      name: '交班管理',
      component: DefaultContainer,
      children: [
        {
          path: 'change',
          name: '交班',
          component: Change
        },
        {
          path: 'his',
          name: '交班记录',
          component: ChangeHis
        }
      ]
    },
    {
      path: '/vip',
      redirect: '/vip/home',
      name: '会员管理',
      component: DefaultContainer,
      children: [
        {
          path: 'home',
          name: '会员类型',
          component: Vip
        },
        {
          path: 'list',
          name: '会员列表',
          component: VipList
        },
        {
          path: 'detail',
          name: '会员详情',
          component: VipDetail
        }
      ]
    },

    {
      path: '/account',
      redirect: '/pages/404',
      name: 'Account',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login
        }
      ]
    },
    {
      path: '/shop',
      redirect: '/shop/shops',
      name: '门店管理',
      component: DefaultContainer,
      children: [
        {
          path: 'shops',
          name: '门店列表',
          component: Shop
        }
      ]
    },
    {
      path: '/system',
      redirect: '/system/config',
      name: '系统管理',
      component: DefaultContainer,
      children: [
        {
          path: 'charging',
          name: '计费规则',
          component: Charging
        },
        {
          path: 'room',
          name: '房间设置',
          component: Room
        },
        {
          path: 'config',
          name: '配置管理',
          component: Config
        },
        {
          path: 'admin',
          name: '管理员',
          component: Admin
        }
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
      ]
    }
  ]
})
