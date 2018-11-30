<template>
  <div class="animated fadeIn">
    <div class="row mb-2">
      <div class="mb-10 mb-xl-0 col-sm-10 col-md-10 col-xl col-10"></div>
      <div class="col-2"><button type="button" class="btn btn-primary btn-block" @click="doSetting('new')">新增门店</button></div>
    </div>
    <b-card header="门店列表">
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
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>门店名称：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="门店名称" autocomplete="job name" v-model="config_keyname" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>营业时间：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="开始时间" autocomplete="job name" v-model="config_keyname" />
            <b-input-group-append><b-input-group-text>--</b-input-group-text></b-input-group-append>
            <input type="text" class="form-control" placeholder="结束时间" autocomplete="job name" v-model="config_keyname" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>区域：</b-input-group-text></b-input-group-prepend>
            <b-form-select id="prov"
                           :plain="true"
                           :options="['浙江省', '上海市']">
            </b-form-select>
            <b-form-select id="city"
                           :plain="true"
                           :options="['杭州市', '温州市']">
            </b-form-select>
            <b-form-select id="dist"
                           :plain="true"
                           :options="['江干区', '滨江区']">
            </b-form-select>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>详细地址：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="详细地址" autocomplete="job name" v-model="config_keyname" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>位置-经度：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="位置-经度" autocomplete="job name" v-model="config_keyname" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>位置-纬度：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="位置-纬度" autocomplete="job name" v-model="config_keyname" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>联系电话：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="联系电话" autocomplete="job name" v-model="config_keyname" />
          </b-input-group>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: "Room",
    data: () => {
      return {
        modal_title: '门店编辑',
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
            "id": "序号"
          },
          {
            "shop_name": "门店名称"
          },
          {
            "open_time": "营业时间"
          },
          {
            "seats_dt": "大厅桌数"
          },
          {
            "seats_bj": "包间桌数"
          },
          {
            "address": "地址"
          },
          {
            "positions": "位置"
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
