<template>
  <div class="animated fadeIn">
    <div class="row mb-2">
      <div class="mb-10 mb-xl-0 col-sm-10 col-md-10 col-xl col-10"></div>
      <div class="col-2"><button type="button" class="btn btn-primary btn-block" @click="doSetting('new')">新增房间</button></div>
    </div>
    <b-card header="房间列表">
      <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
        <template slot="setting" slot-scope="data">
          <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item)">{{btn}}</b-button>
        </template>
      </b-table>
      <nav>
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" prev-text="上一页" next-text="下一页" hide-goto-end-buttons :change="getData(currentPage)"/>
      </nav>
    </b-card>

    <b-modal :title="modal_title" v-model="myModal" @ok="postConfig">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>房间名称：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="房间名称" autocomplete="job name" v-model="config_keyname" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>大厅/散座：</b-input-group-text></b-input-group-prepend>
            <b-form-select id="type"
                           :plain="true"
                           :options="['大厅', '散座']">
            </b-form-select>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>桌位位置：</b-input-group-text></b-input-group-prepend>
            <b-form-select id="positions"
                           :plain="true"
                           :options="['大厅', '包间']">
            </b-form-select>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>计费方式：</b-input-group-text></b-input-group-prepend>
            <b-form-select id="charging"
                           :plain="true"
                           :options="['方式一', '方式二']">
            </b-form-select>
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
        modal_title: '房间编辑',
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
            "room_name": "房间名称"
          },
          {
            "room_type": "大厅/散座"
          },
          {
            "positions": "桌位位置"
          },
          {
            "charging_name": "计费方式"
          },
          {
            "seats_count": "桌台数量"
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
