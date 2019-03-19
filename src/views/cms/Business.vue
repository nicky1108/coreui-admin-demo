<template>
  <div class="animated fadeIn">
    <b-row class="mb-3">
      <b-col sm="7" lg="7">

      </b-col>
      <b-col sm="3" lg="3">
      </b-col>
      <b-col sm="2" lg="2">
        <b-button variant="primary" class="px-4" @click="doSetting('new')">{{$t('commen.add') + ' ' + $t('cms.business.title')}}</b-button>
      </b-col>
    </b-row>
    <b-card :header="$t('cms.business.title')">
      <b-row>
        <b-col sm="12" lg="12">
          <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" >
            <template slot="imgurl" slot-scope="data">
              <img :src="data.item.imgurl" alt="" width="346" height="150">
            </template>
            <template slot="gmt_create" slot-scope="data">
              {{ data.item.gmt_create | dateformat()}}
            </template>
            <template slot="url" slot-scope="data">
              <a v-if="data.item.url && data.item.url.indexOf('http') === 0" :href="data.item.url" target="_blank">{{$t('cms.business.tables.preview')}}</a>
              <span v-if="data.item.url && data.item.url.indexOf('http') !== 0">{{data.item.url}}</span>
            </template>
            <template slot="setting" slot-scope="data">
              <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item)">{{btn}}</b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>

    </b-card>

    <b-modal :title="$t('cms.business.title')"  v-model="myModal" @ok="postBusiness" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.business.modal.title')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('cms.business.modal.title')" autocomplete="job name" v-model="selectBanner.title" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.business.modal.title_en')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('cms.business.modal.title_en')" autocomplete="job name" v-model="selectBanner.title_en" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.business.modal.weight')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('cms.business.modal.weight')" autocomplete="job name" v-model="selectBanner.weight" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.business.modal.url')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('cms.business.modal.url')" autocomplete="job name" v-model="selectBanner.url" />
          </b-input-group>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal ref='confirmModal' class="modal-warning" :title="$t('commen.delete') + ' '+ $t('cms.business.title')" :cancel-title="$t('commen.btn_cancel')" :ok-title="$t('commen.btn_ok')" v-model="confirmModal" @ok="deleteBusiness" ok-variant="warning">
      {{$t('cms.business.modal.comfirm_text')}}
    </b-modal>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: "Business",
    data () {
      return {
        myModal: false,
        selectBanner:{},
        confirmModalTitle: "",
        confirmModal: false,
        confirmModalText: "",
        modal_title: '所属领域',
        items: [
        ],
        fields: [
          {title: "标题(中文)"},
          {title_en: "标题(英文)"},
          {url: "跳转地址"},
          {weight: "权重"},
          {setting: "操作(Setting)"},
        ]
      }
    },
    created () {
      this.fields = [
        {title: this.$i18n.messages[this.$i18n.locale].cms.business.tables.title},
        {title_en: this.$i18n.messages[this.$i18n.locale].cms.business.tables.title_en},
        {url: this.$i18n.messages[this.$i18n.locale].cms.business.tables.url},
        {weight: this.$i18n.messages[this.$i18n.locale].cms.business.tables.weight},
        {setting: this.$i18n.messages[this.$i18n.locale].cms.business.tables.setting},
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

        self.$http.get(`/api/admin/business/list`).then(response => {
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

        self.$http.post(`/api/admin/business/post`, self.selectBanner).then(response => {
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

        self.$http.post(`/api/admin/business/delete/${self.selectBanner.id}`).then(response => {
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
