<template>
    <div class="animated fadeIn">
        <b-row class="mb-3">
            <b-col sm="9" lg="9">
            <b-input-group>
                <input type="text" class="form-control" placeholder="搜索预约编号、用户账号" autocomplete="搜索预约编号、用户账号" v-model="search" />
            </b-input-group>
            </b-col>
            <b-col sm="3" lg="3">
            <b-button variant="primary" class="px-4" @click="searchData">搜索</b-button>
            </b-col>
        </b-row>
        <b-card header="预约列表">
            <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
                <template slot="id" slot-scope="data">
                  {{  data.index + 1}}
                </template>
                <template slot="gmt_create" slot-scope="data">
                    {{  data.item.gmt_create | dateformat()}}
                </template>
                <template slot="gmt_sub_con" slot-scope="data">
                    {{data.item.gmt_sub_con | dateformat()}}
                </template>
                <template slot="gmt_con" slot-scope="data">
                    {{data.item.gmt_con | dateformat()}}
                </template>
                <template slot="gmt_expire" slot-scope="data">
                    {{data.item.gmt_expire | dateformat()}}
                </template>
                <template slot="status" slot-scope="data">
                    <b-badge :variant="getBadge(data.item.status)">{{ getStatus(data.item.status)}}</b-badge>
                </template>
                <template slot="date" slot-scope="data">
                  <span style="display: block" v-for="(dateitem, index) in getDate(data.item)">{{dateitem}}</span>
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
  name: 'subscribe',
  
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
            {sub_code: "预约码"},
            {sun_from: "预约方式"},
            {contact: "预约人"},
            {gmt_sub_con: "预约到店时间"},
          // {gmt_create: "预约下单时间"},
          //   {gmt_con: "消费时间"},
          //   {gmt_expire: "失效时间"},
            {p_number: "人数"},
            {status: "状态"},
            {phone: "用户账号"},
            {shopname: "预约门店"},
            {positionname: "桌位类型"},
            {roomname: "房间"},
            {seatname: "桌位"},
            {remark: "备注"},
            {date: "时间流水"},
        ]
    }
  },
  methods: {
    getBadge (status) {
      return status === 1 ? 'success'
          : status === -8 ? 'warning'
          : status === -1 ? 'secondary'
          : status === -9 ? 'danger': 'primary';
    },
    getStatus (status) {
        return status === -1 ? '未生效'
          : status === 1 ? '已生效'
          : status === -8 ? '已取消'
          : status === -9 ? '已作废' : '';
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
        let shop_id = localStorage.getItem('default_shop_id');
        if (page <= this.ajaxPage) {
            return;
        }
        self.$http.get(`/api/admin/sub/list?shopid=${shop_id}&page=${page}&prePage=${self.perPage}`).then(response => {
            if (response.body.code === 0)
            {
                self.totalRows = response.body.data.totalCount;
                self.ajaxPage = page;
                self.items = self.items.concat(response.body.data.list);
            }
        })
    },
    getDate (item) {
      let self = this;
      let str = [];
      str.push('下单时间：' + moment(item.gmt_create).format('YYYY-MM-DD HH:mm:ss'));
      if (item.status === 1) {
        str.push('生效时间：' + moment(item.gmt_confirm).format('YYYY-MM-DD HH:mm:ss'));
      }
      else if (item.status === -8) {
        str.push('取消时间：' + moment(item.gmt_cancel).format('YYYY-MM-DD HH:mm:ss'));
      }
      else if (item.status === -9) {
        str.push('作废时间：' + moment(item.gmt_block).format('YYYY-MM-DD HH:mm:ss'));
      }
      return str;
    },
    searchData() {
        let self = this;
      let shop_id = localStorage.getItem('default_shop_id');
      self.items = [];
        self.$http.get(`/api/admin/sub/list?shopid=${shop_id}&page=1&prePage=${self.perPage}&search=${self.search}`).then(response => {
            if (response.body.code === 0)
            {
                self.totalRows = response.body.data.totalCount;
                self.ajaxPage = 1;
                self.currentPage = 1;
                self.items = self.items.concat(response.body.data.list);
            }
        })
    }
  }
}    
</script>
