<template>
  <div class="animated fadeIn">
    <div class="row mb-2">
      <div class="mb-10 mb-xl-0 col-sm-10 col-md-10 col-xl col-10"></div>
      <div class="col-2"><button type="button" class="btn btn-primary btn-block" @click="doSetting('new')">新增计费方式</button></div>
    </div>
    <b-card header="计费规则">
      <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
        <template slot="type" slot-scope="data">{{getType(data.item.type)}}</template>
        <template slot="setting" slot-scope="data">
          <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item)">{{btn}}</b-button>
        </template>
      </b-table>
      <nav>
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" prev-text="上一页" next-text="下一页" hide-goto-end-buttons :change="getData(currentPage)"/>
      </nav>
    </b-card>

    <b-modal :title="modal_title" size="lg" v-model="myModal" @ok="postRules">
      <b-row class="mb-3">
        <b-col sm="6" lg="6">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>计费方式名称：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="计费方式名称" autocomplete="job name" v-model="selectRule.type_name" />
          </b-input-group>
        </b-col>
        <b-col sm="6" lg="6">
          <b-input-group>
            <b-input-group-prepend>
              <b-input-group-text>
                <b-form-checkbox-group :checked="[selectRule.is_max_price]">
                  <b-form-checkbox value="1" @change="selectChange">费用封顶：</b-form-checkbox>
                </b-form-checkbox-group>
              </b-input-group-text>
            </b-input-group-prepend>
            <input type="text" class="form-control" placeholder="费用封顶" autocomplete="job name" v-model="selectRule.max_price" />
            <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="12" lg="12">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>开单后：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="selectRule.first_minutes" />
            <b-input-group-text>分钟之内，按</b-input-group-text>
            <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="selectRule.first_price" />
            <b-input-group-append><b-input-group-text>元计费；</b-input-group-text></b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col xs="12" lg="12">
          <b-tabs v-model="tabIndex">
            <b-tab title="按小时计费">
              <b-col sm="8" lg="8" class="mb-3">
                <b-input-group>
                  <b-input-group-prepend><b-input-group-text>每小时：</b-input-group-text></b-input-group-prepend>
                  <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="selectRule.every_h_price" />
                  <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
                </b-input-group>
              </b-col>
              <b-col sm="8" lg="8" class="mb-3">
                <h4>超出时段</h4>
                <p>消费超出1小时，按超出分钟数区间计费。</p>
                <p>5分钟之内免费；  超过5分钟至60分钟，按60分钟计费；</p>
              </b-col>
              <b-col sm="8" lg="8">
                <h4>加收服务费</h4>
                <b-input-group>
                  <b-input-group-prepend><b-input-group-text>00:00至06:00，每满60分钟</b-input-group-text></b-input-group-prepend>
                  <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="selectRule.plus_h_price" />
                  <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
                </b-input-group>
              </b-col>
            </b-tab>


            <b-tab title="按包段计费">
              <b-col sm="8" lg="8" class="mb-3">
                <b-input-group>
                  <b-input-group-prepend><b-input-group-text>每5小时：</b-input-group-text></b-input-group-prepend>
                  <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="selectRule.every_5h_price" />
                  <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
                </b-input-group>
              </b-col>
              <b-col sm="8" lg="8" class="mb-3">
                <h4>超出时段</h4>
                <b-input-group>
                  <b-input-group-prepend><b-input-group-text>消费超出5小时，按每小时</b-input-group-text></b-input-group-prepend>
                  <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="selectRule.every_h_price" />
                  <b-input-group-append><b-input-group-text>元计费</b-input-group-text></b-input-group-append>
                </b-input-group>
                <p></p>
                <p>
                  超出的分钟数按区间计费
                  <br/>
                  5分钟之内免费；  超过5分钟至60分钟，按60分钟计费；
                </p>
              </b-col>
              <b-col sm="8" lg="8">
                <h4>加收服务费</h4>
                <b-input-group>
                  <b-input-group-prepend><b-input-group-text>00:00至09:00，每小时</b-input-group-text></b-input-group-prepend>
                  <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="selectRule.plus_h_price" />
                  <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
                </b-input-group>
                <p></p>
                <p>
                  25分钟内免费
                  <br/>
                  超过25分钟至45分钟，按30分钟计费；  超过45分钟，按60分钟计算；
                </p>
              </b-col>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
    export default {
        name: "Chargin",
        data: () => {
          return {
            tabIndex: 0,
            modal_title: '计费方式设置',
            config_keyname: '',
            config_json: '',
            edit_id: null,
            myModal: false,
            currentPage: 1,
            perPage: 10,
            totalRows: 0,
            ajaxPage: 0,
            selectRule: {},
            items: [
            ],
            fields: [
              {
                "id": "计费编号"
              },
              {
                "type_name": "计费方式名称"
              },
              {
                "max_price": "费用封顶"
              },
              {
                "type": "计费方式"
              },
              {
                "setting": "操作"
              }
            ]
          }
        },
        // created () {
        //   let self = this;
        //   // this.getData();
        // },
        // watch: {
        //   // 如果路由有变化，会再次执行该方法
        //   '$route': 'getData'
        // },
        methods: {

          getType (type) {
            if (type === '1') {
              return '按小时计费'
            }

            if (type === '2') {
              return '按包段计费'
            }
          },

          selectChange(e) {
              if (e && e === '1') {
                this.selectRule.is_max_price = 1;
              }
              else {
                this.selectRule.is_max_price = -1;
              }
          },

          getData (page) {
            let self = this;
            if (page <= this.ajaxPage) {
              return;
            }
            let shop_id = localStorage.getItem('default_shop_id');
            if ('shop_id' in self.$route.query) {
              shop_id = self.$route.query.shop_id;
            }
            page = page ? page : self.currentPage;
            self.$http.get(`/api/admin/charging/list?shopid=${shop_id}&page=${page}&prePage=${self.perPage}`).then(response => {
              if (response.body.code === 0)
              {
                let list = response.body.data.list;
                self.totalRows = response.body.data.totalCount;
                self.ajaxPage = page;

                for(let i = 0; i < list.length; i ++){
                  list[i]['setting'] = ['修改'];
                }

                self.items = list;
              }
            })
          },

          getButtons (setting) {

            return setting === '修改' ? 'primary'
              : setting === '删除' ? 'danger' : 'primary'
          },

          postRules() {
            let self = this;

            if (self.tabIndex === 0){
              self.selectRule.type = '1';
            }
            else if (self.tabIndex === 1){
              self.selectRule.type = '2';
            }

            let shop_id = localStorage.getItem('default_shop_id');

            if ('shop_id' in self.$route.query) {
              shop_id = self.$route.query.shop_id;
            }

            self.selectRule.shop_id = shop_id;
            self.$http.post(`/api/admin/rules/post`, self.selectRule).then(response => {
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
          },

          doSetting (btn, item) {
            if (btn === '修改') {
              this.selectRule = item;
              if (this.selectRule.type === '1') {
                this.tabIndex = 0;
              }
              if (this.selectRule.type === '2') {
                this.tabIndex = 1;
              }
              this.myModal = true;
            }
            else if (btn === 'new') {
              this.selectRule = {};
              this.myModal = true;
            }
          }
        }
    }
</script>

<style scoped>

</style>
