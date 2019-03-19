import Vue from 'vue'
import Router from 'vue-router'



const Banner = () => import('@/views/active/Banner')

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')

// // Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')

//系统管理路由
const Config = () => import('@/views/system/Config')
const Password = () => import('@/views/system/Password')

// 内容管理
const Nav = () => import('@/views/cms/Menu');
const CmsHome = () => import('@/views/cms/Home');
const Business = () => import('@/views/cms/Business');
const CmsEnterprises = () => import('@/views/cms/Enterprises');
const EnterprisesDetail = () => import('@/views/cms/EnterprisesDetail');

const Product = () => import('@/views/product/Product');
const Brand = () => import('@/views/product/Brand');
const Classify = () => import('@/views/product/Classify');


const Talents = () => import('@/views/talents/Talents');


const News = () => import('@/views/news/News');

Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/cms/nav',
    },
    {
      path: '/act',
      redirect: '/act/banner',
      name: 'Activity',
      component: DefaultContainer,
      children: [
        {
          path: 'banner',
          name: 'Banner',
          component: Banner
        }
      ]
    },

    {
      path: '/cms',
      redirect: '/cms/nav',
      name: 'CMS',
      component: DefaultContainer,
      children: [
        {
          path: 'nav',
          name: 'Navigation',
          component: Nav
        },
        {
          path: 'home',
          name:'Home',
          component: CmsHome
        },
        {
          path: 'business',
          name: 'Business',
          component: Business
        },
        {
          path: 'enterprises',
          name: 'Enterprises',
          component: CmsEnterprises
        },
        {
          path: 'enterprisesdetail',
          name: 'Enterprises Detail',
          component: EnterprisesDetail
        }
      ]
    },

    {
      path: '/article',
      redirect: '/article/news',
      name: 'Article',
      component: DefaultContainer,
      children: [
        {
          path: 'news',
          name: 'News',
          component: News
        },
      ]
    },

    {
      path: '/product',
      redirect: '/product/list',
      name: 'Product',
      component: DefaultContainer,
      children: [
        {
          path: 'list',
          name: 'Product list',
          component: Product
        },
        {
          path: 'brand',
          name: 'Product brand',
          component: Brand
        },
        {
          path: 'classify',
          name: 'Product classify',
          component: Classify
        },
      ]
    },

    {
      path: '/talents',
      redirect: '/talents/list',
      name: 'Talents',
      component: DefaultContainer,
      children: [
        {
          path: 'list',
          name: 'Talents list',
          component: Talents
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
      path: '/system',
      redirect: '/system/config',
      name: 'System',
      component: DefaultContainer,
      children: [
        {
          path: 'config',
          name: 'Config',
          component: Config
        },
        {
          path: 'password',
          name: 'Password',
          component: Password
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
