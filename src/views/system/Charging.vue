<template>
  <div class="animated fadeIn">
    <div class="row mb-2">
      <div class="mb-10 mb-xl-0 col-sm-10 col-md-10 col-xl col-10"></div>
      <div class="col-2"><button type="button" class="btn btn-primary btn-block" @click="doSetting('new')">新增计费方式</button></div>
    </div>
    <b-card header="计费规则">
      <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
        <template slot="setting" slot-scope="data">
          <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item)">{{btn}}</b-button>
        </template>
      </b-table>
      <nav>
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" prev-text="上一页" next-text="下一页" hide-goto-end-buttons :change="getData(currentPage)"/>
      </nav>
    </b-card>

    <b-modal :title="modal_title" size="lg" v-model="myModal" @ok="postConfig">
      <b-row class="mb-3">
        <b-col sm="6" lg="6">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>计费方式名称：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="计费方式名称" autocomplete="job name" v-model="config_keyname" />
          </b-input-group>
        </b-col>
        <b-col sm="6" lg="6">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text><b-form-checkbox :plain="true" value="1">费用封顶：</b-form-checkbox> </b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="费用封顶" autocomplete="job name" v-model="config_keyname" />
            <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col sm="12" lg="12">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>开单后：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" />
            <b-input-group-text>分钟之内，按</b-input-group-text>
            <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" />
            <b-input-group-append><b-input-group-text>元计费；</b-input-group-text></b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col xs="12" lg="12">
          <b-tabs>
            <b-tab title="按小时计费" active>
              <b-col sm="8" lg="8" class="mb-3">
                <b-input-group>
                  <b-input-group-prepend><b-input-group-text>每小时：</b-input-group-text></b-input-group-prepend>
                  <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" />
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
                  <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" />
                  <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
                </b-input-group>
              </b-col>
            </b-tab>


            <b-tab title="按包段计费" >
              <b-col sm="8" lg="8" class="mb-3">
                <b-input-group>
                  <b-input-group-prepend><b-input-group-text>每5小时：</b-input-group-text></b-input-group-prepend>
                  <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" />
                  <b-input-group-append><b-input-group-text>元</b-input-group-text></b-input-group-append>
                </b-input-group>
              </b-col>
              <b-col sm="8" lg="8" class="mb-3">
                <h4>超出时段</h4>
                <b-input-group>
                  <b-input-group-prepend><b-input-group-text>消费超出5小时，按每小时</b-input-group-text></b-input-group-prepend>
                  <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" />
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
                  <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" />
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
            modal_title: '计费方式设置',
            config_keyname: '',
            config_json: '',
            edit_id: null,
            myModal: false,
            currentPage: 1,
            perPage: 10,
            totalRows: 0,
            ajaxPage: 0,
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
                "is_min_cost": "参与最低消费"
              },
              {
                "is_point": "参与会员积分"
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
        created () {
          let self = this;
          this.getData();
        },
        watch: {
          // 如果路由有变化，会再次执行该方法
          '$route': 'getData'
        },
        methods: {

          getData (page) {
            let self = this;
            if (page <= this.ajaxPage) {
              return;
            }
            self.$http.get(`/api/admin/charging/list`).then(response => {
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

          postConfig() {
            let self = this;
            self.$http.post(`/api/admin/config/post`, {
              id: self.edit_id,
              keyname: self.config_keyname,
              json_value: self.config_json
            }).then(response => {
              if (response.body.code === 0)
              {
                window.toast.success({title:"操作成功"});
                self.getData();
              }
              else {
                window.toast.error({title:"网络错误"});
              }
            })
          },

          doSetting (btn, item) {
            if (btn === '修改') {
              this.config_keyname = item.keyname;
              this.config_json = item.json_value;
              this.edit_id = item.id;
              this.myModal = true;
            }
            else if (btn === 'new') {
              this.config_keyname = '';
              this.config_json = '{}';
              this.edit_id = null;
              this.myModal = true;
            }
          }
        }
    }
</script>

<style scoped>

</style>
