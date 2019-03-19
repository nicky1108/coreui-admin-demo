<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <img
        src="img/avatars/6.jpg"
        class="img-avatar"
        alt="admin@bootstrapmaster.com" />
      <span class="span_lang" :class="lang === 'zh' ? 'active': ''" @click.stop="changeLang('zh')">中文</span>
      <span class="span_lang" :class="lang === 'en' ? 'active': ''" @click.stop="changeLang('en')">EN</span>
    </template>
    <template slot="dropdown">
      <b-dropdown-header
        tag="div"
        class="text-center">
        <strong>设置</strong>
      </b-dropdown-header>
      <b-dropdown-item @click="jumpSetPassword"><i class="fa fa-shield" /> 设置密码</b-dropdown-item>
      <b-dropdown-item @click="logOut"><i class="fa fa-lock" /> 登出</b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'
export default {
  name: 'DefaultHeaderDropdownAccnt',
  components: {
    AppHeaderDropdown
  },
  data: () => {
    return {
      lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'zh'
    }
  },
  created () {
    let self = this;
    // this.fetchData();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    // '$route': 'fetchData'
  },
  methods: {
    logOut() {
      window.localStorage.removeItem('adminToken');
      this.$router.push('/account/login');
    },

    changeLang (type) {
      // this.$i18n.locale = this.lang
      this.$i18n.locale = type;
      window.localStorage.setItem('lang', type);
      location.reload();
    },

    jumpSetPassword () {
      this.$router.push('/system/password')
    }
  }
}
</script>
<style>
  .span_lang {
    margin-right: 10px;
    margin-left: 10px;
    cursor: pointer;
  }

  .span_lang.active {
    color: #20a8d8;
    font-weight: bold;
  }
</style>

