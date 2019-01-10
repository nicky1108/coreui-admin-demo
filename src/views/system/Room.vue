<template>
  <div class="animated fadeIn">
    <div class="row mb-2">
      <b-col sm="2" lg="2">
        <a href="javascript:;" @click="jumpCharging">计费规则管理</a>
      </b-col>
      <div class="mb-10 mb-xl-0 col-sm-2 col-md-2 col-xl col-2"></div>
      <div class="col-2"><button type="button" class="btn btn-primary btn-block" @click="doSetting('new')">新增房间</button></div>
    </div>
    <b-card header="房间列表">
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

    <b-modal :title="modal_title" v-model="myModal" @ok="postRooms">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>房间名称：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="房间名称" autocomplete="job name" v-model="selectRoom.roomname" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>大厅/包厢类型：</b-input-group-text></b-input-group-prepend>
            <b-form-select id="type"
                           :plain="true"
                           :options="typeOptions" v-model="selectRoom.type">
            </b-form-select>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>桌位位置：</b-input-group-text></b-input-group-prepend>
            <b-form-select id="positions"
                           :plain="true"
                           :options="['大厅', '包厢']" v-model="selectRoom.room_type">
            </b-form-select>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>计费方式：</b-input-group-text></b-input-group-prepend>
            <b-form-select id="charging"
                           :plain="true"
                           :options="rules_list" v-model="selectRoom.rules_id">
            </b-form-select>
          </b-input-group>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal ref='confirmModal' class="modal-warning" :title="confirmModalTitle" v-model="confirmModal" @ok="deleteRoom" ok-variant="warning">
      {{confirmModalText}}
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: "Room",
    data: () => {
      return {
        confirmModalTitle: '删除房间',
        confirmModalText: '是否删除这个房间？',
        confirmModal: false,
        selectRoom: {},
        modal_title: '房间编辑',
        config_keyname: '',
        config_json: '',
        edit_id: null,
        myModal: false,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        ajaxPage: 0,
        rules_list : [
          {
            text: '计费方式1',
            value: '1'
          }
        ],
        typeOptions: [
          {
            text: '大厅',
            value: 'dt'
          },
          {
            text: '大包',
            value: 'db',
          },
          {
            text: '中包',
            value: 'zb'
          },
          {
            text: '小包',
            value: 'xb'
          }
        ],
        items: [
        ],
        fields: [
          {
            "roomname": "房间名称"
          },
          {
            "type": "大厅/散座"
          },
          {
            "room_type": "桌位位置"
          },
          {
            "rulesname": "计费方式"
          },
          {
            "seat_count": "桌台数量"
          },
          {
            "setting": "操作"
          }
        ]
      }
    },
    // created () {
    //   let self = this;
    //   this.getData();
    // },
    // watch: {
    //   // 如果路由有变化，会再次执行该方法
    //   '$route': 'getData'
    // },
    methods: {
      getType(type) {
        let str = '';
        for (let i = 0; i < this.typeOptions.length; i ++) {
          if (this.typeOptions[i].value === type) {
            str = this.typeOptions[i].text;
          }
        }
        return str;
      },
      getData (page) {
        let self = this;
        if (page && page <= self.ajaxPage) {
          return;
        }
        page = page ? page : self.currentPage;
        let shop_id = localStorage.getItem('default_shop_id');
        if ('shop_id' in self.$route.query) {
          shop_id = self.$route.query.shop_id;
        }
        self.rules_list = [];

        self.$http.get(`/api/admin/rooms/list?shopid=${shop_id}&page=${page}&prePage=${self.perPage}`).then(response => {
          if (response.body.code === 0)
          {
            let list = response.body.data.list;
            self.ajaxPage = page;
            self.totalRows = response.body.data.totalCount;
            //
            for(let i = 0; i < list.length; i ++){
              list[i]['setting'] = ['修改', '查看桌台', '删除'];
            }

            let rules = response.body.data.rules;
            rules.forEach((item) => {
              self.rules_list.push({
                text: item.type_name,
                value: item.id
              })
            });

            if (page === 1) {
              self.items = [];
            }
            self.items = self.items.concat(list);
          }
        })
      },

      getButtons (setting) {

        return setting === '修改' ? 'primary'
          : setting === '删除' ? 'danger' : 'primary'
      },

      postRooms() {
        let self = this;
        let shop_id = localStorage.getItem('default_shop_id');

        if ('shop_id' in self.$route.query) {
          shop_id = self.$route.query.shop_id;
        }

        self.selectRoom.shop_id = shop_id;

        if (!self.selectRoom.rules_id || !self.selectRoom.roomname || !self.selectRoom.type || !self.selectRoom.room_type) {
          window.toast.error({title:"参数不完整，请填写完成"});
          return;
        }

        self.$http.post(`/api/admin/rooms/post`, self.selectRoom).then(response => {
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

      deleteRoom () {
        let self = this;

        self.$http.post(`/api/admin/rooms/delete/${this.selectRoom.id}`).then(response => {
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
          this.selectRoom = item;
          this.myModal = true;
        }
        else if (btn === 'new') {
          this.selectRoom = {};
          this.myModal = true;
        }
        else if (btn === '查看桌台') {
          this.$router.push(`/system/seats?room_id=${item.id}`);
        }
        else if (btn === '删除') {
          this.selectRoom = item;
          this.confirmModal = true;
        }
      },

      jumpCharging () {
        let shop_id = localStorage.getItem('default_shop_id');

        if ('shop_id' in this.$route.query) {
          shop_id = this.$route.query.shop_id;
        }

        this.$router.push(`/system/charging?shop_id=${shop_id}`);
      }
    }
  }
</script>

<style scoped>

</style>
