<template>
  <div class="animated fadeIn">
    <div class="row mb-2">
      <b-col sm="2" lg="2">
        <a href="http://www.gpsspg.com/maps.htm" target="_blank">经纬度查询</a>
      </b-col>
      <div class="mb-10 mb-xl-0 col-sm-8 col-md-8 col-xl col-8"></div>
      <div class="col-2"><button type="button" class="btn btn-primary btn-block" @click="doSetting('new')">新增门店</button></div>
    </div>
    <b-card header="门店列表">
      <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields">
        <template slot="open_time" slot-scope="data">
          {{getOpenTime(data.item)}}
        </template>
        <template slot="positions" slot-scope="data">
          {{getPosition(data.item)}}
        </template>
        <template slot="setting" slot-scope="data">
          <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item)">{{btn}}</b-button>
        </template>
      </b-table>
    </b-card>

    <b-modal :title="modal_title" size="lg" v-model="myModal" @ok="postShop">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>门店名称：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="门店名称" autocomplete="job name" v-model="selectShop.shopname" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>营业时间：</b-input-group-text></b-input-group-prepend>
            <date-picker v-model="selectShop.business_begin" :config="options" ></date-picker>
            <b-input-group-append><b-input-group-text>--</b-input-group-text></b-input-group-append>
            <date-picker v-model="selectShop.business_end" :config="options" ></date-picker>
          </b-input-group>
        </b-col>
        <!--<b-col sm="12" lg="12" class="mb-2">-->
          <!--<b-input-group>-->
            <!--<b-input-group-prepend><b-input-group-text>区域：</b-input-group-text></b-input-group-prepend>-->
            <!--<b-form-select id="prov"-->
                           <!--:plain="true"-->
                           <!--:options="['浙江省', '上海市']">-->
            <!--</b-form-select>-->
            <!--<b-form-select id="city"-->
                           <!--:plain="true"-->
                           <!--:options="['杭州市', '温州市']">-->
            <!--</b-form-select>-->
            <!--<b-form-select id="dist"-->
                           <!--:plain="true"-->
                           <!--:options="['江干区', '滨江区']">-->
            <!--</b-form-select>-->
          <!--</b-input-group>-->
        <!--</b-col>-->
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>详细地址：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="详细地址" autocomplete="job name" v-model="selectShop.address" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>位置-经度：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="位置-经度" autocomplete="job name" v-model="selectShop.lon" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>位置-纬度：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="位置-纬度" autocomplete="job name" v-model="selectShop.lat" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>联系电话：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="联系电话" autocomplete="job name" v-model="selectShop.tel" />
          </b-input-group>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
  // Import this component
  import datePicker from 'vue-bootstrap-datetimepicker';

  // Import date picker css
  import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
  export default {
    name: "Room",
    components: {
      datePicker
    },
    data: () => {
      return {
        selectShop: {},
        modal_title: '门店编辑',
        config_keyname: '',
        config_json: '',
        edit_id: null,
        myModal: false,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        ajaxPage: 0,
        options: {
          format: 'HH:mm:ss',
          useCurrent: true,
          locale: 'zh'
        },
        items: [
        ],
        fields: [
          {
            "id": "序号"
          },
          {
            "shopname": "门店名称"
          },
          {
            "open_time": "营业时间"
          },
          {
            "dt_count": "大厅桌数"
          },
          {
            "bx_count": "包间桌数"
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
      getOpenTime (item) {
        return item.business_begin + '-' + item.business_end;
      },
      getPosition (item) {
        return '(' + item.lat + ',' + item.lon + ')';
      },
      getData (page) {
        let self = this;
        if (page <= this.ajaxPage) {
          return;
        }
        self.$http.get(`/api/admin/shop/list`).then(response => {
          if (response.body.code === 0)
          {
            let list = response.body.data;

            for(let i = 0; i < list.length; i ++){
              list[i]['setting'] = ['修改', '查看房间'];
            }

            self.items = list;
          }
        })
      },

      getButtons (setting) {

        return setting === '修改' ? 'primary'
          : setting === '删除' ? 'danger' : 'primary'
      },

      postShop() {
        let self = this;
        self.$http.post(`/api/admin/shop/post`, self.selectShop).then(response => {
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
          this.selectShop = item;
          this.myModal = true;
        }
        else if (btn === 'new') {
          this.selectShop = {};
          this.myModal = true;
        }
        else if (btn === '查看房间') {
          this.$router.push(`/system/room?shop_id=${item.id}`);

        }
      }
    }
  }
</script>

<style scoped>

</style>
