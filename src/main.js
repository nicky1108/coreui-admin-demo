// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './polyfill'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router/index'
import moment from 'moment'
import VueResource from 'vue-resource'
import VueNotifications from 'vue-notifications'
import miniToastr from 'mini-toastr'// https://github.com/se-panfilov/mini-toastr
import VueI18n from 'vue-i18n'

const toastTypes = {
  success: 'success',
  error: 'error',
  info: 'info',
  warn: 'warn'
}

miniToastr.init({types: toastTypes})

function toast ({title, message, type, timeout, cb}) {
  return miniToastr[type](message, title, timeout, cb)
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
};
//  VueNotifications.setPluginOptions(options)

Vue.use(VueNotifications, options);

// todo
// cssVars()

Vue.use(VueI18n);

Vue.use(BootstrapVue);

Vue.use(VueResource);

const i18n = new VueI18n({
  locale: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'zh',  // 语言标识
  messages: {
    'zh': require('./lang/zh'),
    'en': require('./lang/en')
  }
});



window.moment = moment;
moment.locale('zh-cn');
// window.api_url = 'http://hzqltz.com.cn';
window.api_url = 'http://127.0.0.1:7001';
Vue.filter('dateformat', function(dataStr) {
  if (!dataStr){
    return '';
  }
  else {
    return moment(dataStr).format('YYYY-MM-DD HH:mm:ss');

  }

});

router.beforeEach(function (to, form, next) {
  const adminToken = window.localStorage.getItem('adminToken');
  if(!adminToken && to.name !=='Login') {
    next( {
      path : '/account/login'
    })
  }
  else {
    next();
  }
});

Vue.http.interceptors.push((request) => {
    request.url = window.api_url + request.url;
  　let TOKEN = localStorage.getItem('adminToken');
    let lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'zh';
    request.headers.set('lang',lang);
    if(TOKEN){
      //如果请求时TOKEN存在,就为每次请求的headers中设置好TOKEN,后台根据headers中的TOKEN判断是否放行
      request.headers.set('authorization',TOKEN);
    }
    return function(response) {
      if (response.status === 401) {
          window.location.href = '/#/account/login';
      }
      else if (response.status === 403) {
          VueNotifications.error({title:"权限不足"});
      }
      else if (response.status === 500 && response.data.errMsg) {
        VueNotifications.error({title:response.data.errMsg});
      }
    };
  });

window.toast = {};
window.toast.success = VueNotifications.success;
window.toast.error = VueNotifications.error;
window.toast.info = VueNotifications.info;
window.toast.warn = VueNotifications.warn;
/* eslint-disable no-new */
let app = new Vue({
  el: '#app',
  router,
  i18n,
  template: '<App/>',
  components: {
    App
  }
});



