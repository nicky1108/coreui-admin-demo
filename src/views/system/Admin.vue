<template>
    <div class="animated fadeIn">
        <b-row class="mb-3">
            <b-col sm="7" lg="7">
            <b-input-group>
                <input type="text" class="form-control" placeholder="搜索用户账号" autocomplete="搜索用户账号" v-model="search" />
            </b-input-group>
            </b-col>
            <b-col sm="3" lg="3">
            <b-button variant="primary" class="px-4" @click="searchData">搜索</b-button>
            </b-col>
          <b-col sm="2" lg="2">
            <b-button variant="primary" class="px-4" @click="doSetting('new')">新增管理员</b-button>
          </b-col>
        </b-row>
        <b-card header="管理员列表">
            <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
                <template slot="gmt_create" slot-scope="data">
                    {{ data.item.gmt_create | dateformat()}}
                </template>
                
                <template slot="gmt_login" slot-scope="data">
                    {{data.item.gmt_login | dateformat()}}
                </template>
                <template slot="status" slot-scope="data">
                    <b-badge :variant="getBadge(data.item.status)">{{ getStatus(data.item.status)}}</b-badge>
                </template>
                <template slot="setting" slot-scope="data">
                    <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item)">{{btn}}</b-button>
                </template>
            </b-table>
            <nav>
            <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" prev-text="上一页" next-text="下一页" hide-goto-end-buttons :change="getData(currentPage)"/>
            </nav>
        </b-card>
      <b-modal :title="modal_title" v-model="myModal" @ok="postAdmin">
        <b-row class="mb-3">
          <b-col sm="12" lg="12" class="mb-2">
            <b-input-group>
              <b-input-group-prepend><b-input-group-text>管理名称：</b-input-group-text></b-input-group-prepend>
              <input type="text" class="form-control" placeholder="管理名称" autocomplete="job name" v-model="selectAdmin.nickname" />
            </b-input-group>
          </b-col>
          <b-col sm="12" lg="12" class="mb-2">
            <b-input-group>
              <b-input-group-prepend><b-input-group-text>手机号码：</b-input-group-text></b-input-group-prepend>
              <input type="text" class="form-control" placeholder="手机号码" autocomplete="job name" v-model="selectAdmin.username" />
            </b-input-group>
          </b-col>
          <b-col sm="12" lg="12" class="mb-2">
            <b-input-group>
              <b-input-group-prepend><b-input-group-text>初始密码：</b-input-group-text></b-input-group-prepend>
              <input type="text" class="form-control" placeholder="初始密码" autocomplete="job name" v-model="selectAdmin.password" />
            </b-input-group>
          </b-col>
          <b-col sm="12" lg="12" class="mb-2">
            <b-input-group>
              <b-input-group-prepend><b-input-group-text>所属店铺：</b-input-group-text></b-input-group-prepend>
              <b-form-select id="type"
                             :plain="true"
                             :options="shopOptions" v-model="selectAdmin.shop_id">
              </b-form-select>
            </b-input-group>
          </b-col>
          <b-col sm="12" lg="12" class="mb-2">
            <b-input-group>
              <b-input-group-prepend><b-input-group-text>角色：</b-input-group-text></b-input-group-prepend>
              <b-form-select id="type"
                             :plain="true"
                             :options="roleOptions" v-model="selectAdmin.role">
              </b-form-select>
            </b-input-group>
          </b-col>
        </b-row>
      </b-modal>
      <b-modal ref='confirmModal' class="modal-warning" :title="confirmModalTitle" v-model="confirmModal" @ok="" ok-variant="warning">
        {{confirmModalText}}
      </b-modal>
    </div>
</template>
<script>
export default {
  name: 'admin',
  
  data: () => {
    return {
        confirmModalTitle: '禁用管理用户',
        confirmModalText: '是否禁用这个管理用户？',
        confirmModal: false,
        selectAdmin: {},
        myModal: false,
        modal_title: '管理员编辑',
        search: '',
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        deleteModal : false,
        detailContent : false,
        content : '',
        ajaxPage: 0,
        roles_list: [],
        shopOptions:[],
        roleOptions: [],
        items: [
        ],
        fields: [
            {id: "编号"},
            {username: "用户账号"},
            {nickname: "管理员名称"},
            {email: "邮箱"},
            {shopname: "所属店面"},
            {role: "角色"},
            {gmt_create: "注册时间"},
            {gmt_login: "最后登录时间"},
            {setting: "操作"},
        ]
    }
  },
  methods: {
    getBadge (status) {
      return status === 'completed' ? 'success'
        : status === 'success' ? 'success'
        : status === 'queued' ? 'secondary'
          : status === 'running' ? 'warning'
          : status === 'pending' ? 'secondary'
          : status === 'fail' ? 'danger'
          : status === -1 ? 'danger'
            : status === 'failed' ? 'danger' : 'primary'
    },
    getStatus (status) {
        return status === -1 ? '未生效': '已生效';
    },
    getButtons (setting) {

      return setting === '修改' ? 'primary'
        : setting === '禁用' ? 'danger' : 'primary'
    },
    getRowCount (items) {
      return items.length
    },
    getData (page) {
        let self = this;
        if (page <= this.ajaxPage) {
            return;
        }
        page = page ? page : self.currentPage;
        self.$http.get(`/api/admin/adminuser/list?page=${page}&prePage=${self.perPage}`).then(response => {
            if (response.body.code === 0)
            {
                self.totalRows = response.body.data.totalCount;
                self.ajaxPage = page;
                let list = response.body.data.list;
                for(let i = 0; i < list.length; i ++){
                  list[i]['setting'] = ['修改'];

                  if (list[i].can_block) {
                    list[i]['setting'].push('禁用');
                  }
                }
                if (page === 1) {
                  self.items = [];
                }
                self.items = self.items.concat(list);
                self.roleOptions = response.body.data.roles;
                self.shopOptions = response.body.data.shops;
            }
        })
    },
    searchData() {
        let self = this;
        self.items = [];
        self.$http.get(`/api/admin/adminuser/list?page=1&prePage=${self.perPage}&search=${self.search}`).then(response => {
            if (response.body.code === 0)
            {
                self.totalRows = response.body.data.totalCount;
                self.ajaxPage = 1;
                self.currentPage = 1;
                self.items = self.items.concat(response.body.data.list);
            }
        })
    },

    doSetting (btn, item) {
      if (btn === '修改') {
        this.selectAdmin = item;
        this.myModal = true;
      }
      else if (btn === 'new') {
        this.selectAdmin = {};
        this.myModal = true;
      }
      else if (btn === '查看') {
        this.$router.push(`/vip/detail?id=${item.id}`);
      }
      else if (btn === '删除') {
        this.selectAdmin = item;
        this.confirmModal = true;
      }
    },

    postAdmin() {
      let self = this;

      self.$http.post(`/api/admin/adminuser/post`, self.selectAdmin).then(response => {
        if (response.body.code === 0)
        {
          window.toast.success({title:"操作成功"});
          self.getData();
        }
        else {
          window.toast.error({title:response.body.errMsg});
        }
      }).catch(() => {
        window.toast.error({title:"网络错误"});
      })
    }
  }
}    
</script>
