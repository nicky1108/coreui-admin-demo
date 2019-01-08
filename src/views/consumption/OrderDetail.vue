<template>
  <div class="animated fadeIn">
    <b-card header="会员信息">
      <b-row class="mb-3">
        <b-col sm="4" lg="4" >订单编号：{{order.order_code}}</b-col>
        <b-col sm="4" lg="4" >是否免单：{{order.pay_type === 9 ? '是': '否'}}</b-col>
        <b-col sm="4" lg="4" ></b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="4" lg="4" >店铺：{{order.shopname}}</b-col>
        <b-col sm="4" lg="4" >房间：{{order.roomname}}</b-col>
        <b-col sm="4" lg="4" >桌号：{{order.seatname}}</b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="4" lg="4" >用户账号：{{order.phone}}</b-col>
        <b-col sm="4" lg="4" >用户类型：{{order.levelname}}</b-col>
        <b-col sm="4" lg="4" ></b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="4" lg="4" >结算时间：{{order.gmt_pay | dateformat()}}</b-col>
        <b-col sm="4" lg="4" >结算员工：{{order.close_admin_name}}</b-col>
        <b-col sm="4" lg="4" >累计时长：{{order.order_time}}</b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="4" lg="4" >开单时间：{{order.gmt_create | dateformat()}}</b-col>
        <b-col sm="4" lg="4" >开单员工：{{order.open_admin_name}}</b-col>
        <b-col sm="4" lg="4" >顾客人数：{{order.p_number}}</b-col>
      </b-row>
    </b-card>
    <b-card header="金额信息">
      <b-row  class="mb-3">
        <b-col sm="4" lg="4" >最终消费：{{order.price}}</b-col>
        <b-col sm="4" lg="4" >手动优惠：{{order.discounts}}</b-col>
        <b-col sm="4" lg="4" >支付方式：{{getPayType(order.pay_type)}}</b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="12" lg="12">
          <b-table :hover="true" :striped="true" responsive="sm" :items="priceItems" :fields="priceFields" >

          </b-table>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="12" lg="12">
          <b-table :hover="true" :striped="true" responsive="sm" :items="roomItems" :fields="roomFields" >

          </b-table>
        </b-col>
      </b-row>
    </b-card>
  </div>

</template>
<script>
  export default {
    name: 'orderDetail',

    data: () => {
      return {
        order: {},
        priceItems: [
        ],
        priceFields: [
          {
            price_type: '金额类型',
          },
          {
            price: '消费金额',
          },
          {
            zk: '会员折扣',
          },
          {
            ret_price: '实际消费'
          }
        ],
        roomFields: [
          {
            seatname : '桌位名',
          },
          {
            gmt_create: '开台时间',
          },
          {
            enter_time: '入座时长',
          },
          {
            rules_name: '计费规则',
          },
          {
            bx_price: '包间费'
          }
        ],
        roomItems: []
      }
    },
    created () {
      let self = this;
      this.getData();
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getData'
    },
    methods: {
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
      getData (page) {
        let self = this;

        let id = null;
        if ('id' in self.$route.query) {
          id = self.$route.query.id;
        }

        if (!id)
        {
          return;
        }

        self.$http.get(`/api/admin/order/${id}`).then(response => {
          if (response.body.code === 0)
          {
            self.order = response.body.data;

            self.roomItems = [
              {
                seatname: self.order.seatname,
                gmt_create: window.moment(self.order.gmt_create).format('YYYY-MM-DD HH:mm:ss'),
                enter_time: self.order.order_time,
                rules_name: self.order.rules.type_name,
                bx_price: self.order.bx_price
              }
            ];
            self.priceItems = [
              {
                price_type:'商品金额',
                price: self.order.o_con_price,
                zk: self.order.con_price_dis,
                ret_price: self.order.con_price
              },
              {
                price_type:'包间消费',
                price: self.order.o_bx_price,
                zk: self.order.bx_price_dis,
                ret_price: self.order.bx_price
              },
              {
                price_type:'服务费',
                price: self.order.service_price,
                zk: '无',
                ret_price: self.order.service_price
              },
              {
                price_type:'总额',
                price: self.order.o_total_price,
                zk: self.order.total_price_dis,
                ret_price: self.order.o_price
              }
            ];
          }
        })
      },
    }
  }
</script>
