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
              <template slot="id" slot-scope="data">
                {{  data.index + 1}}
              </template>
              <template slot="gmt_create" slot-scope="data">
                    {{data.item.gmt_create | dateformat()}}
                </template>
                <template slot="gmt_pay" slot-scope="data">
                    {{data.item.gmt_pay | dateformat()}}
                </template>
                <template slot="status" slot-scope="data">
                    <b-badge :variant="getBadge(data.item.pay_type)">{{ getStatus(data.item.pay_type)}}</b-badge>
                </template>
              <template slot="pay_type" slot-scope="data">
                    <b-badge :variant="getPayTypeBadge(data.item.pay_type)">{{ getPayType(data.item.pay_type)}}</b-badge>
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
          {gmt_create: "开单时间"},
          {order_code: "订单编号"},
          {order_time: "消费时长"},
            {phone: "用户账号"},
            {seatname: "桌号"},
            {status: "状态"},
            {roomname: "房间名称"},
            {bx_price: "包间消费"},
            {con_price: "商品消费"},
            {service_price: "服务费"},
            {o_price: "折后金额"},
            {discounts: "手动优惠"},
            {price: "实付金额"},
            {point: "买单积分"},
            {gmt_pay: "支付时间"},
            {point: "买单积分"},
            {pay_type: "支付渠道"},
          {setting: '操作'}
        ]
    }
  },
  methods: {
    getBadge (pay_type) {
      return !pay_type || pay_type === '' ? 'secondary': 'success';
    },
    getStatus (pay_type) {
        return !pay_type || pay_type === '' ? '未支付': '已结算';
    },
    getPayType(pay_type) {
      let ret = '';
      switch (pay_type) {
        case 1:
          ret = '微信';
          break;
        case 2:
          ret = '支付宝';
          break;
        case 3:
          ret = '现金';
          break;
        case 4:
          ret = '世胄账户';
          break;
        case 9:
          ret = '免单';
          break;
      }

      return ret;
    },
    getPayTypeBadge(pay_type) {
      let ret = '';
      switch (pay_type) {
        case 1:
          ret = 'success';
          break;
        case 2:
          ret = 'primary';
          break;
        case 3:
          ret = 'warning';
          break;
        case 4:
          ret = 'info';
          break;
        case 9:
          ret = 'danger';
          break;
      }
      return ret;
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
    },
    getDetail(id) {
      this.$router.push(`/consumption/orderDetail?id=${id}`);
    }
  }
}    
</script>
