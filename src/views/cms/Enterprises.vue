<template>
  <div class="animated fadeIn">
    <b-row class="mb-3">
      <b-col sm="7" lg="7">
        <select name="" id="" class="form-control" v-model="selectBusiness" @change="changeGroup">
          <option value="-1">--{{$t('cms.enterprises.select_business')}}--</option>
          <option v-for="(item, index) in business" :key="index" :value="item.id">{{$i18n.locale === 'zh' ? item.title : item.title_en}}</option>
        </select>
      </b-col>
      <b-col sm="3" lg="3">
      </b-col>
      <b-col sm="2" lg="2">
        <b-button variant="primary" class="px-4" @click="doSetting('new')">{{$t('commen.add') + ' ' + $t('cms.enterprises.title')}}</b-button>
      </b-col>
    </b-row>
    <b-card :header="$t('cms.enterprises.title')">
      <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
        <template slot="business_id" slot-scope="data">
          {{ getBusinessName(data.item.business_id)}}
        </template>
        <template slot="gmt_create" slot-scope="data">
          {{ data.item.gmt_create | dateformat()}}
        </template>
        <template slot="url" slot-scope="data">
          <a v-if="data.item.url && data.item.url.indexOf('http') === 0" :href="data.item.url" target="_blank">{{$t('cms.enterprises.tables.preview')}}</a>
          <span v-if="data.item.url && data.item.url.indexOf('http') !== 0">{{data.item.url}}</span>
          <b-button v-if="!data.item.url" variant="primary"  @click="doSetting('jump', data.item)">{{$t('cms.enterprises.tables.edit_content')}}</b-button>
        </template>
        <template slot="setting" slot-scope="data">
          <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item)">{{btn}}</b-button>
        </template>
      </b-table>
      <nav>
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" :prev-text="$t('commen.prev')" :next-text="$t('commen.next')" hide-goto-end-buttons :change="getData(currentPage)"/>
      </nav>
    </b-card>
    <b-modal :title="$t('cms.enterprises.title')" size="lg" v-model="myModal" @ok="postCompany" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.enterprises.modal.name')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('cms.enterprises.modal.name')" autocomplete="job name" v-model="selectBanner.name" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.enterprises.modal.name_en')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('cms.enterprises.modal.name_en')" autocomplete="job name" v-model="selectBanner.name_en" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.enterprises.modal.business_id')}}：</b-input-group-text></b-input-group-prepend>
            <select class="form-control" :placeholder="$t('cms.enterprises.modal.business_id')" autocomplete="job name" v-model="selectBanner.business_id" >
              <option v-for="(item, index) in business" :key="index" :value="item.id">{{$i18n.locale === 'zh' ? item.title : item.title_en}}</option>
            </select>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.enterprises.modal.url')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('cms.enterprises.modal.url')" autocomplete="job name" v-model="selectBanner.url" />
          </b-input-group>
        </b-col>

      </b-row>
    </b-modal>
    <b-modal ref='confirmModal' class="modal-warning" :title="$t('commen.delete') + ' '+ $t('cms.enterprises.title')" v-model="confirmModal" @ok="deleteCompany" ok-variant="warning" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      {{$t('cms.enterprises.modal.comfirm_text')}}
    </b-modal>
  </div>
</template>
<script>
  import Select from "vue-select/src/components/Select";
  export default {
    name: 'cmsEnterprises',
    components: {Select},
    data: () => {
      return {
        selectBusiness:-1,
        confirmModalTitle: '删除企业',
        confirmModalText: '是否删除这个企业？',
        confirmModal: false,
        selectBanner: {},
        myModal: false,
        modal_title: '企业编辑',
        search: '',
        image:'',
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        deleteModal : false,
        detailContent : false,
        content : '',
        ajaxPage: 0,
        roles_list: [],
        shopOptions:[],
        roleOptions: [],
        options: {
          format: 'YYYY-MM-DD HH:mm:ss',
          useCurrent: true,
          locale: 'zh'
        },
        business: [],
        items: [
        ],
        fields: [
          {name: "企业名称(中文)"},
          {name_en: "企业名称(EN)"},
          {business_id: "所属领域"},
          {url: "跳转地址(URL)"},
          {setting: "操作(Setting)"},
        ]
      }
    },
    created () {
      this.fields = [
        {name: this.$i18n.messages[this.$i18n.locale].cms.enterprises.tables.name},
        {name_en: this.$i18n.messages[this.$i18n.locale].cms.enterprises.tables.name_en},
        {business_id: this.$i18n.messages[this.$i18n.locale].cms.enterprises.tables.business_id},
        {url: this.$i18n.messages[this.$i18n.locale].cms.enterprises.tables.url},
        {setting: this.$i18n.messages[this.$i18n.locale].cms.enterprises.tables.setting},
      ];
      this.getBusiness();
    },
    watch : {
      '$route': 'getBusiness'
    },
    methods: {
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
      getBusinessName(id) {
        let name = '';
        for (let i = 0; i < this.business.length; i ++) {
          let item = this.business[i];
          if (item.id === id) {
            name =  item.title;
          }
        }
        return name;
      },
      getBusiness() {
        let self = this;

        self.$http.get(`/api/admin/business/list`).then(response => {
          if (response.body.code === 0) {
            self.business = response.body.data;
          }
        })
      },
      changeGroup(e) {
        this.ajaxPage = 0;
        this.getData(1);
      },
      getData(page) {
        let self = this;
        if (page <= this.ajaxPage) {
          return;
        }
        page = page ? page : self.currentPage;
        self.$http.get(`/api/admin/company/list?page=${page}&prePage=${self.perPage}&business=${self.selectBusiness}`).then(response => {
          if (response.body.code === 0) {
            self.totalRows = response.body.data.totalCount;
            self.ajaxPage = page;
            let list = response.body.data.list;
            for (let i = 0; i < list.length; i++) {
              list[i]['setting'] = [self.$i18n.messages[self.$i18n.locale].commen.edit, self.$i18n.messages[self.$i18n.locale].commen.delete];
            }
            if (page === 1) {
              self.items = [];
            }
            self.items = self.items.concat(list);
          }
        })
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
        else if (btn === 'jump') {
          this.$router.push(`/cms/enterprisesdetail?id=${item.id}`);
        }
      },


      postCompany() {
        let self = this;

        self.$http.post(`/api/admin/company/post`, self.selectBanner).then(response => {
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

      deleteCompany() {
        let self = this;

        self.$http.post(`/api/admin/company/delete/${self.selectBanner.id}`).then(response => {
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
