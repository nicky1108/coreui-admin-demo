<template>
  <div class="animated fadeIn">
    <b-row class="mb-3">
      <b-col sm="3" lg="3">
        <b-input-group>
          <b-form-select id="employees"
                         :plain="true"
                         :options="['当班员工', 'XXX']"
                         value="当班员工">
          </b-form-select>
        </b-input-group>
      </b-col>
      <b-col sm="6" lg="6">
        <b-input-group>
          <b-input-group-prepend><b-input-group-text>交班时间：</b-input-group-text></b-input-group-prepend>
          <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" />
          <b-input-group-append><b-input-group-text>到</b-input-group-text></b-input-group-append>
          <input type="text" class="form-control" placeholder="0" autocomplete="job name" v-model="config_keyname" />
        </b-input-group>
      </b-col>
      <b-col sm="3" lg="3">
        <b-button variant="primary" class="px-4">搜索</b-button>
      </b-col>
    </b-row>
    <b-card header="交班记录">
      <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
        <template slot="setting" slot-scope="data">
          <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item)">{{btn}}</b-button>
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
        name: "ChangeHis",
        data: () => {
          return {
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
                "employees": "当班员工"
              },
              {
                "gmt_change": "交班时间"
              },
              {
                "total_money": "本班总收入"
              },
              {
                "rec_money": "实收金额"
              },
              {
                "keep_money": "留存金额"
              },
              {
                "status": "状态"
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
                  list[i]['setting'] = ['查看'];
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
