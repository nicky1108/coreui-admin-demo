<template>
  <div class="animated fadeIn">
    <b-card header="交班">
      <b-row class="mb-3">
        <b-col sm="6" lg="6" >开始时间：2018-11-19 23:34:00</b-col>
        <b-col sm="6" lg="6" ></b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="6" lg="6" >当班员工：XXX</b-col>
        <b-col sm="6" lg="6" >上班留存：2000元</b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="12" lg="12">
          <b-tabs>
            <b-tab title="营业额(150.0)" active>
              <b-col sm="12" lg="12">
                <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
                  <template slot="setting" slot-scope="data">
                    <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item)">{{btn}}</b-button>
                  </template>
                </b-table>
              </b-col>
            </b-tab>
            <b-tab title="会员充值(150.0)">
              <b-col sm="12" lg="12">
                <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
                  <template slot="setting" slot-scope="data">
                    <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item)">{{btn}}</b-button>
                  </template>
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
            <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" />
            <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col sm="6" lg="6" >
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>留存现金：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" />
            <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="6" lg="6" >
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>其他收入：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" />
            <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col sm="6" lg="6" >
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>其他支出：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" />
            <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="12" lg="12" >
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>备注：</b-input-group-text></b-input-group-prepend>
            <textarea style="height: 400px;" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" ></textarea>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="4" lg="4"></b-col>
        <b-col sm="4" lg="4"></b-col>
        <b-col sm="4" lg="4">
          <b-button size="lg" class="btn-block" variant="primary">确认交班</b-button>
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
            config_keyname:"",
            items: [
            ],
            fields: [
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
        }
    }
</script>

<style scoped>

</style>
