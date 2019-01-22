<template>
    <div class="animated fadeIn">
        <b-card header="会员信息">
            <b-row class="mb-3">
                <b-col sm="6" lg="6" >用户账号：{{ user.username }}</b-col>
                <b-col sm="6" lg="6" >会员类型：
                  <b-badge :variant="getBadge(user.level_id)">{{ getVipName(user)}}</b-badge>
                  <b-btn variant="primary" v-if="user.level_id==='-1'" class="ml-2" @click="myModal=true">成为会员</b-btn>
                  <b-btn variant="primary" v-if="user.level_id==='vip_2'" class="ml-2" @click="myModal=true">续费新悟道会员</b-btn>
                </b-col>
            </b-row>
            <b-row class="mb-3">
                <b-col sm="6" lg="6" >注册时间：{{ user.gmt_create | dateformat() }}</b-col>
                <b-col sm="6" lg="6" >到期时间：{{ expireDate(user.gmt_vip_expire) }}</b-col>
            </b-row>
            <b-row class="mb-3">
                <b-col sm="4" lg="4" >账户余额：{{ user.balance }}</b-col>
                <b-col sm="4" lg="4" >消费次数：{{ user.order_count }}</b-col>
                <b-col sm="4" lg="4" >预约/违约次数：{{ user.sub_count }}/{{ user.wy_count }}</b-col>
            </b-row>
        </b-card>
        <b-card header="资金信息">
          <b-row>
            <b-col sm="6" lg="2" >
              <b-card no-body class="bg-info" @click="jumpRecord('money')">
                <b-card-body class="pb-0">
                  <h4 class="mb-0">账户余额</h4>
                  <p>{{user.balance}}</p>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col sm="6" lg="2" >
              <b-card no-body class="bg-info" @click="jumpRecord('point')">
                <b-card-body class="pb-0">
                  <h4 class="mb-0">积分</h4>
                  <p>{{user.remain_point}}</p>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col sm="6" lg="2" >
              <b-card no-body class="bg-info" @click="jumpRecord('vip')">
                <b-card-body class="pb-0">
                  <h4 class="mb-0">权益剩余(天)</h4>
                  <p>{{expDay}}</p>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col sm="6" lg="2" >
              <b-card no-body class="bg-info" @click="jumpRecord('order')">
                <b-card-body class="pb-0">
                  <h4 class="mb-0">消费次数</h4>
                  <p>{{user.order_count}}</p>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col sm="6" lg="2" >
              <b-card no-body class="bg-info" @click="jumpRecord('punish')">
                <b-card-body class="pb-0">
                  <h4 class="mb-0">惩罚记录</h4>
                  <p>{{user.wy_count}}</p>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </b-card>

        <b-card header="余额操作">
          <b-row>
            <b-col sm="12" lg="12">
              <b-btn variant="primary" class="mr-3" @click="rechargeModal=true">充值</b-btn>
              <b-btn variant="primary">提现</b-btn>
            </b-col>
          </b-row>
        </b-card>

      <b-modal :title="modal_title" v-model="myModal" @ok="PayVip">
        <b-row class="mb-3">
          <b-col sm="6" lg="6">
            用户名：{{user.phone}}
          </b-col>
          <b-col sm="6" lg="6" >用户类型：{{user.levelname}}</b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col sm="6" lg="6">
            余额：{{user.balance}}
          </b-col>
          <b-col sm="6" lg="6" ></b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col sm="6" lg="6">
            消费金额：￥298
          </b-col>
          <b-col sm="6" lg="6" ></b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col sm="12" lg="12">
            支付方式
            <div role="group" class="btn-group">
              <button type="button" :class="pay_type === 4 ? 'btn btn-primary' : 'btn btn-secondary'" @click="pay_type = 4">世胄账户</button>
              <button type="button" :class="pay_type === 1 ? 'btn btn-primary' : 'btn btn-secondary'" @click="pay_type = 1">微信</button>
              <button type="button" :class="pay_type === 2 ? 'btn btn-primary' : 'btn btn-secondary'" @click="pay_type = 2">支付宝</button>
              <button type="button" :class="pay_type === 3 ? 'btn btn-primary' : 'btn btn-secondary'" @click="pay_type = 3">现金</button>
            </div>
          </b-col>
        </b-row>
      </b-modal>

      <b-modal title="充值" v-model="rechargeModal" @ok="recharge">
        <b-row class="mb-3">
          <b-col sm="12" lg="12">
            <b-input-group class="mb-3">
              <b-input-group-prepend><b-input-group-text>充值金额</b-input-group-text></b-input-group-prepend>
              <input type="text" class="form-control" placeholder="充值金额"  v-model="rechargeNumber" />
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col sm="12" lg="12">
            支付方式
            <div role="group" class="btn-group">
              <button type="button" :class="rechargePayType === 1 ? 'btn btn-primary' : 'btn btn-secondary'" @click="rechargePayType = 1">微信</button>
              <button type="button" :class="rechargePayType === 2 ? 'btn btn-primary' : 'btn btn-secondary'" @click="rechargePayType = 2">支付宝</button>
              <button type="button" :class="rechargePayType === 3 ? 'btn btn-primary' : 'btn btn-secondary'" @click="rechargePayType = 3">现金</button>
            </div>
          </b-col>
        </b-row>
      </b-modal>
    </div>
    
</template>
<script>
export default {
    name: 'viphome',
    
    data: () => {
        return {
          myModal: false,
          withdrawalModal: false,
          rechargeModal: false,
          modal_title: '结账单',
          pay_type: 4,
          rechargePayType: 1,
          rechargeNumber: 0,
          expDay: 0,
            currentPage: 1,
            perPage: 10,
            totalRows: 0,
            user: {},
            ajaxPage: 0,
            items: [
            ],
            fields: [
            ]
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
        getVipName (item) {
          return item.levelname;

        },

        getBadge (level_id) {
          return !level_id || level_id === '-1' ? 'secondary': 'success';
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
            
            self.$http.get(`/api/admin/user/${id}`).then(response => {
                if (response.body.code === 0)
                {
                    self.user = response.body.data;
                }
            })
        },

        expireDate(date) {
          if (!date) {
            return '';
          }
            let expireDate = new Date(date);
            let nowDate = new Date();



            let day = Math.floor((expireDate.getTime() - nowDate.getTime()) / 1000 / 60 / 60 / 24);
            this.expDay = day;
            return window.moment(date).format('YYYY-MM-DD HH:mm:ss') + '（' + day + '天）';
        },

        PayVip() {
          let self = this;
          let shop_id = localStorage.getItem('default_shop_id');
          if ('shop_id' in self.$route.query) {
            shop_id = self.$route.query.shop_id;
          }
          self.shop_id = parseInt(shop_id);
          self.$http.post('/api/admin/user/payVip', {
            user_id: self.user.id,
            pay_type: self.pay_type,
            shop_id: self.shop_id
          }).then((response) => {
            if (response.body.code === 0){
              window.toast.success({title:"购买VIP成功"});
              self.myModal = false;
              self.getData();
            }
            else {
              window.toast.error({title:response.body.errMsg});
            }
          }).catch((res) => {
            window.toast.error({title:"网络错误"});
          });
        },

        withdrawal() {
            let self = this;

            self.$http.post('/api/admin/user/withdrawal', {

            }).then((response) => {
              if (response.body.code === 0){
                window.toast.success({title:"充值成功"});
                self.withdrawalModal = false;
                self.getData();
              }
              else {
                window.toast.error({title:response.body.errMsg});
              }
            }).catch((res) => {
              window.toast.error({title:"网络错误"});
            });
        },

        recharge () {
            let self = this;

            self.$http.post('/api/admin/user/recharge', {
              user_id: self.user.id,
              number: self.rechargeNumber,
              pay_type: self.rechargePayType
            }).then((response) => {
              if (response.body.code === 0){
                window.toast.success({title:"充值成功"});
                self.rechargeModal = false;
                self.getData();
              }
              else {
                window.toast.error({title:response.body.errMsg});
              }
            }).catch((res) => {
              window.toast.error({title:"网络错误"});
            });
        },

        jumpRecord(page) {
            let self = this;
            switch (page) {
              case 'money':
                this.$router.push(`/vip/moneyRecord?user_id=${self.user.id}`);
                break;
              case 'point':
                this.$router.push(`/vip/pointRecord?user_id=${self.user.id}`);
                break;
              case 'vip':
                this.$router.push(`/vip/vipRecord?user_id=${self.user.id}`);
                break;
              case 'order':
                this.$router.push(`/vip/orderRecord?user_id=${self.user.id}`);
                break;
              case 'punish':
                this.$router.push(`/vip/punishRecord?user_id=${self.user.id}`);
                break;
            }
        }
    }
}    
</script>
