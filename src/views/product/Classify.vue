<template>
  <div class="animated fadeIn">
    <b-row class="mb-3">
      <b-col sm="7" lg="7">

      </b-col>
      <b-col sm="3" lg="3">
      </b-col>
      <b-col sm="2" lg="2">
        <b-button variant="primary" class="px-4" @click="doSetting('new')">{{$t('commen.add') + ' ' + $t('product.classify.title')}}</b-button>
      </b-col>
    </b-row>
    <b-card :header="$t('product.classify.title') + $t('commen.list')">
      <b-row>
        <b-col sm="12" lg="12">
          <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" >
            <template slot="imgurl" slot-scope="data">
              <img :src="data.item.imgurl" alt="" width="346" height="150">
            </template>
            <template slot="gmt_create" slot-scope="data">
              {{ data.item.gmt_create | dateformat()}}
            </template>
            <template slot="setting" slot-scope="data">
              <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item)">{{btn}}</b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>

    </b-card>

    <b-modal :title="$t('product.classify.title')" v-model="myModal" @ok="postBusiness" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('product.brand.modal.classify_name')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('product.brand.modal.classify_name')" autocomplete="job name" v-model="selectBanner.classify_name" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('product.brand.modal.classify_name_en')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('product.brand.modal.classify_name_en')" autocomplete="job name" v-model="selectBanner.classify_name_en" />
          </b-input-group>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal ref='confirmModal' class="modal-warning" :title="$t('commen.delete') + ' '+ $t('product.classify.title')" v-model="confirmModal" @ok="deleteBusiness" ok-variant="warning" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      {{$t('product.classify.modal.comfirm_text')}}
    </b-modal>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: "Classify",
    data () {
      return {
        myModal: false,
        selectBanner:{},
        confirmModalTitle: "删除分类",
        confirmModal: false,
        confirmModalText: "是否删除这个分类？",
        modal_title: '分类',
        items: [
        ],
        fields: [
          {classify_name: "分类名(中文)"},
          {classify_name_en: "分类名(英文)"},
          {count: "跳转地址"},
          {setting: "操作(Setting)"},
        ]
      }
    },
    created () {
      this.fields = [
        {classify_name: this.$i18n.messages[this.$i18n.locale].product.classify.tables.classify_name},
        {classify_name_en: this.$i18n.messages[this.$i18n.locale].product.classify.tables.classify_name_en},
        {count: this.$i18n.messages[this.$i18n.locale].product.classify.tables.count},
        {setting: this.$i18n.messages[this.$i18n.locale].product.classify.tables.setting},
      ];
      this.fetchData();
    },
    watch : {
      '$route': 'fetchData'
    },
    methods : {
      getBadge(status) {
        return status === 'completed' ? 'success'
          : status === 'success' ? 'success'
            : status === 'queued' ? 'secondary'
              : status === 'running' ? 'warning'
                : status === 'pending' ? 'secondary'
                  : status === 'fail' ? 'danger'
                    : status === -1 ? 'danger'
                      : status === 'failed' ? 'danger' : 'primary'
      },
      getStatus(status) {
        return status === -1 ? '未生效' : '已生效';
      },
      getButtons(setting) {

        return setting === this.$i18n.messages[this.$i18n.locale].commen.edit ? 'primary'
          : setting === this.$i18n.messages[this.$i18n.locale].commen.delete ? 'danger' : 'primary'
      },
      getRowCount(items) {
        return items.length
      },
      doSetting(btn, item) {
        if (btn === this.$i18n.messages[this.$i18n.locale].commen.edit) {
          this.selectBanner = item;
          this.image = item.imgurl;
          this.myModal = true;
        }
        else if (btn === 'new') {
          this.selectBanner = {};
          this.myModal = true;
        }
        else if (btn === this.$i18n.messages[this.$i18n.locale].commen.delete) {
          this.selectBanner = item;
          this.confirmModal = true;
        }
      },
      fetchData () {
        let self = this;

        self.getData();
      },
      getData() {
        let self = this;

        self.$http.get(`/api/admin/classify/list`).then(response => {
          if (response.body.code === 0) {
            let list = response.body.data;
            for (let i = 0; i < list.length; i++) {
              list[i]['setting'] = [self.$i18n.messages[self.$i18n.locale].commen.edit, self.$i18n.messages[self.$i18n.locale].commen.delete];
            }
            self.items = [];
            self.items = self.items.concat(list);
          }
        })
      },

      postBusiness() {
        let self = this;

        self.$http.post(`/api/admin/classify/post`, self.selectBanner).then(response => {
          if (response.body.code === 0)
          {
            window.toast.success({title:self.$i18n.messages[self.$i18n.locale].commen.success});
            self.getData();
          }
          else {
            window.toast.error({title:response.body.errMsg});
          }
        }).catch(() => {
          window.toast.error({title:self.$i18n.messages[self.$i18n.locale].commen.fail});
        })
      },

      deleteBusiness() {
        let self = this;

        self.$http.post(`/api/admin/classify/delete/${self.selectBanner.id}`).then(response => {
          if (response.body.code === 0)
          {
            window.toast.success({title:self.$i18n.messages[self.$i18n.locale].commen.success});
            self.getData();
          }
          else {
            window.toast.error({title:response.body.errMsg});
          }
        }).catch(() => {
          window.toast.error({title:self.$i18n.messages[self.$i18n.locale].commen.fail});
        })
      }
    }
  }
</script>

<style scoped>

</style>
