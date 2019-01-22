<template>
  <div class="animated fadeIn">
    <b-card header="交班">
      <b-row class="mb-3">
        <b-col sm="6" lg="6" >开始时间：{{changeData.beginTime}}</b-col>
        <b-col sm="6" lg="6" >本班总额：{{changeData.total}}</b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="6" lg="6" >当班员工：{{changeData.adminUser}}</b-col>
        <b-col sm="6" lg="6" >上班留存：{{changeData.lastMoney}}元</b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="12" lg="12">
          <b-tabs>
            <b-tab :title="'营业额('+changeData.ordersMoneySum+')'" active>
              <b-col sm="12" lg="12">
                <b-table :hover="true" :striped="true" responsive="sm" :items="orderItems" :fields="orderFields">

                </b-table>
              </b-col>
            </b-tab>
            <b-tab :title="'会员充值('+changeData.vipMoneySum+')'">
              <b-col sm="12" lg="12">
                <b-table :hover="true" :striped="true" responsive="sm" :items="vipItems" :fields="vipFields">

                </b-table>
              </b-col>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="6" lg="6" >
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>上缴现金：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="up_money" />
            <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col sm="6" lg="6" >
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>留存现金：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="remain_money" />
            <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="6" lg="6" >
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>其他收入：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="other_in" />
            <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col sm="6" lg="6" >
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>其他支出：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="other_out" />
            <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="12" lg="12" >
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>备注：</b-input-group-text></b-input-group-prepend>
            <textarea style="height: 400px;" class="form-control" placeholder="" autocomplete="job name" v-model="remark" ></textarea>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="4" lg="4"></b-col>
        <b-col sm="4" lg="4"></b-col>
        <b-col sm="4" lg="4">
          <b-button size="lg" class="btn-block" variant="primary" @click="postChange">确认交班</b-button>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
    export default {
        name: "change",
        data : () => {
          return {
            changeData:"",
            up_money:0,
            remain_money:0,
            other_in:0,
            other_out:0,
            remark:'',
            orderItems: [
            ],
            vipItems: [
            ],
            orderFields: [
              {
                "xz_total": "现金"
              },
              {
                "wx_total": "微信"
              },
              {
                "alipay_total": "支付宝"
              },
              {
                "sz_total": "世胄账户"
              }
            ],
            vipFields: [
              {
                "xz_total": "现金"
              },
              {
                "wx_total": "微信"
              },
              {
                "alipay_total": "支付宝"
              },
              {
                "sz_total": "世胄账户"
              }
            ]
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
        fetchData () {
          let self = this;
          let shop_id = localStorage.getItem('default_shop_id');
          if ('shop_id' in self.$route.query) {
            shop_id = self.$route.query.shop_id;
          }
          self.shop_id = parseInt(shop_id);
          self.$http.get(`/api/admin/workers/changeInfo?shopid=${shop_id}`).then(response => {
            if (response.body.code === 0)
            {
              self.changeData = response.body.data;
              self.orderItems = [{
                xz_total: self.changeData.ordersMoneyxj,
                wx_total: self.changeData.ordersMoneyWechat,
                alipay_total: self.changeData.ordersMoneyAlipay,
                sz_total: self.changeData.ordersMoneySz,
              }];
              self.vipItems = [{
                xz_total: self.changeData.vipMoneyxj,
                wx_total: self.changeData.vipMoneyWechat,
                alipay_total: self.changeData.vipMoneyAlipay,
                sz_total: self.changeData.vipMoneySz,
              }];
            }
          })
        },

        postChange () {
          let self = this;

          let shop_id = localStorage.getItem('default_shop_id');
          if ('shop_id' in self.$route.query) {
            shop_id = self.$route.query.shop_id;
          }
          self.shop_id = parseInt(shop_id);

          self.$http.post(`/api/admin/workers/postChange`, {
            shop_id: self.shop_id,
            admin_name: self.changeData.adminUser,
            up_money: self.up_money,
            remain_money: self.remain_money,
            other_in: self.other_in,
            other_out: self.other_out,
            order_money_xj: self.changeData.ordersMoneyxj,
            order_money_wechat: self.changeData.ordersMoneyWechat,
            order_money_alipay: self.changeData.ordersMoneyAlipay,
            order_money_sz: self.changeData.ordersMoneySz,
            vip_money_xj: self.changeData.vipMoneyxj,
            vip_money_wechat: self.changeData.vipMoneyWechat,
            vip_money_alipay: self.changeData.vipMoneyAlipay,
            vip_money_sz: self.changeData.vipMoneySz,
            remark: self.remark,
            gmt_begin: self.changeData.beginTime,
          }).then(response => {
            if (response.body.code === 0)
            {
              window.toast.success({title:"交班成功,退出登录"});
              window.localStorage.removeItem('adminToken');
              window.localStorage.removeItem('shop_id');
              window.localStorage.removeItem('default_shop_id');
              window.localStorage.removeItem('nickname');
              window.location.href='/#/account/login';
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

<style scoped>

</style>
