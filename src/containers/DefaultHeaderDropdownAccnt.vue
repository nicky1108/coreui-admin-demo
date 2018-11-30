<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <img
        src="img/avatars/6.jpg"
        class="img-avatar"
        alt="admin@bootstrapmaster.com" />
      <span>{{nickname}}</span>
    </template>
    <template slot="dropdown">
      <b-dropdown-header tag="div" class="text-center"><strong>门店列表</strong></b-dropdown-header>
      <b-dropdown-item v-for="(item, index) in shopList" :key="index">
        <router-link :to="'/consumption/home?shop_id='+item.id">{{ item.shopname }}</router-link>
      </b-dropdown-item>

      <b-dropdown-header
        tag="div"
        class="text-center">
        <strong>设置</strong>
      </b-dropdown-header>
      <b-dropdown-item><i class="fa fa-shield" /> 设置密码</b-dropdown-item>
      <b-dropdown-item><i class="fa fa-lock" /> 登出</b-dropdown-item>
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
      shopList: [],
      nickname: ''
    }
  },
  created () {
    let self = this;
    this.fetchData();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData'
  },
  methods: {
    fetchData: function () {
      let self = this;
      self.nickname = localStorage.getItem('nickname', '超级管理员');
      self.$http.get('/api/admin/shop/list').then((response) => {
        if (response.body.code === 0){
          self.shopList = response.body.data;
          localStorage.setItem('default_shop_id', self.shopList[0].id);
        }
      })
    }
  }
}
</script>

