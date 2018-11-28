<template>
    <div class="animated fadeIn">
        <b-row class="mb-3">
            <b-col sm="9" lg="9">
            <b-input-group>
                <input type="text" class="form-control" placeholder="搜索订单编号、用户账号" autocomplete="搜索订单编号、用户账号" v-model="search" />
            </b-input-group>
            </b-col>
            <b-col sm="3" lg="3">
            <b-button variant="primary" class="px-4" @click="searchData">搜索</b-button>
            </b-col>
        </b-row>
        <b-card header="订单列表">
            <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
                <template slot="gmt_create" slot-scope="data">
                    {{data.item.gmt_create | dateformat()}}
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
            </b-table>
            <nav>
            <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" prev-text="上一页" next-text="下一页" hide-goto-end-buttons :change="getData(currentPage)"/>
            </nav>
        </b-card>
    </div>
</template>
<script>
export default {
  name: 'order',
  
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
            {order_code: "订单编号"},
            {gmt_create: "生成时间"},
            {phone: "用户账号"},
            {seatname: "桌号"},
            {status: "状态"},
            {price: "订单金额"},
            {gmt_pay: "支付时间"},
            {point: "买单积分"},
            {pay_type: "支付渠道"},
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
        self.$http.get(`/api/admin/order/list?page=${page}&prePage=${self.perPage}`).then(response => {
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
        self.$http.get(`/api/admin/order/list?page=1&prePage=${self.perPage}&search=${self.search}`).then(response => {
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