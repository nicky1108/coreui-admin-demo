<template>
    <div class="animated fadeIn">
        <b-row class="mb-3">
            <b-col sm="9" lg="9">
            <b-input-group>
                <input type="text" class="form-control" placeholder="搜索用户账号" autocomplete="搜索用户账号" v-model="search" />
            </b-input-group>
            </b-col>
            <b-col sm="3" lg="3">
            <b-button variant="primary" class="px-4" @click="searchData">搜索</b-button>
            </b-col>
        </b-row>
        <b-card header="会员列表">
            <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
              <template slot="id" slot-scope="data">
                {{  data.index + 1}}
              </template>
              <template slot="level_id" slot-scope="data">
                  <b-badge :variant="getBadge(data.item.level_id)">{{ getVipName(data.item)}}</b-badge>
                </template>
                <template slot="gmt_create" slot-scope="data">
                    {{ data.item.gmt_create | dateformat()}}
                </template>

                <template slot="gmt_vip_expire" slot-scope="data">
                    {{data.item.gmt_vip_expire | dateformat()}}
                </template>
                <template slot="status" slot-scope="data">
                    <b-badge :variant="getBadge(data.item.status)">{{ getStatus(data.item.status)}}</b-badge>
                </template>
                <template slot="setting" slot-scope="data">
                    <b-button :variant="getButtons('查看')" class="px-4" @click="getDetail(data.item.id)">查看</b-button>
                </template>
            </b-table>
            <nav>
            <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" prev-text="上一页" next-text="下一页" hide-goto-end-buttons :change="getData(currentPage)"/>
            </nav>
        </b-card>
    </div>
</template>
<script>
export default {
  name: 'viplist',
  
  data: () => {
    return {
        search: '',
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        deleteModal : false,
        detailContent : false,
        content : '',
        ajaxPage: 0,
        items: [
        ],
        fields: [
            {id: "编号"},
            {username: "用户账号"},
            {level_id: "会员类型"},
            {gmt_create: "注册时间"},
            {gmt_vip_expire: "会员到期时间"},
            {balance: "账户余额"},
            {setting: "操作"},
        ]
    }
  },
  methods: {
    getVipName (item) {
      return item.levelname;

    },

    getBadge (level_id) {
      return !level_id || level_id === '-1' ? 'secondary': 'success';
    },
    getButtons (setting) {

      return setting === '复制' ? 'secondary'
        : setting === '删除' ? 'danger' : 'primary'
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
        self.$http.get(`/api/admin/user/list?page=${page}&prePage=${self.perPage}`).then(response => {
            if (response.body.code === 0)
            {
                self.totalRows = response.body.data.totalCount;
                self.ajaxPage = page;
                self.items = self.items.concat(response.body.data.list);
            }
        })
    },
    searchData() {
        let self = this;
        self.items = [];
        self.$http.get(`/api/admin/user/list?page=1&prePage=${self.perPage}&search=${self.search}`).then(response => {
            if (response.body.code === 0)
            {
                self.totalRows = response.body.data.totalCount;
                self.ajaxPage = 1;
                self.currentPage = 1;
                self.items = self.items.concat(response.body.data.list);
            }
        })
    },

    getDetail(id) {
        this.$router.push(`/vip/detail?id=${id}`);
    }
  }
}    
</script>
