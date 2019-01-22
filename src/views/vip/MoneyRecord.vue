<template>
  <div class="animated fadeIn">

    <b-card header="资金流水">
      <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
        <template slot="id" slot-scope="data">
          {{  data.index + 1}}
        </template>
        <template slot="gmt_create" slot-scope="data">
          {{data.item.gmt_create | dateformat()}}
        </template>
        <template slot="number" slot-scope="data">
          {{data.item.type === 1 ? '+' + data.item.number : '-' + data.item.number}}
        </template>
        <template slot="type" slot-scope="data">
          {{getTypeStr(data.item.type)}}
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
    name: 'moneyRecord',

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
          {gmt_create: "时间"},
          {admin_name: "操作人员"},
          {number: "流水"},
          {type: "性质"},
          {order_code: "订单号"},
        ]
      }
    },
    methods: {
      getTypeStr(type) {
        if (type === 1) {
          return '充值';
        }
        else if (type === 2) {
          return '提现';
        }
        else if (type === 3) {
          return '消费';
        }
      },
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
        let user_id = null;
        if (page <= this.ajaxPage) {
          return;
        }
        if ('user_id' in self.$route.query) {
          user_id = self.$route.query.user_id;
        }
        if (!user_id) {
          return;
        }
        self.$http.get(`/api/admin/users/moneyRecord?user_id=${user_id}&page=${page}&prePage=${self.perPage}`).then(response => {
          if (response.body.code === 0)
          {
            self.totalRows = response.body.data.totalCount;
            self.ajaxPage = page;
            self.items = self.items.concat(response.body.data.list);
          }
        })
      },
    }
  }
</script>
