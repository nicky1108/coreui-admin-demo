<template>
  <div class="animated fadeIn">
    <b-row class="mb-3">
      <b-col sm="7" lg="7">

      </b-col>
      <b-col sm="3" lg="3">
      </b-col>
      <b-col sm="2" lg="2">
        <b-button variant="primary" class="px-4" @click="doSetting('new')">{{$t('commen.add') + ' ' + $t('cms.nav.title')}}</b-button>
      </b-col>
    </b-row>
    <b-card :header="$t('cms.nav.title') + $t('commen.list')">
      <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
        <template slot="imgurl" slot-scope="data">
          <img :src="data.item.imgurl" alt="" width="346" height="150">
        </template>
        <template slot="gmt_create" slot-scope="data">
          {{ data.item.gmt_create | dateformat()}}
        </template>
        <template slot="url" slot-scope="data">
          <a v-if="data.item.url && data.item.url.indexOf('http') === 0" :href="data.item.url" target="_blank">{{$t('cms.nav.tables.preview')}}</a>
          <span v-if="data.item.url && data.item.url.indexOf('http') !== 0">{{data.item.url}}</span>
        </template>
        <template slot="setting" slot-scope="data">
          <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item)">{{btn}}</b-button>
        </template>
      </b-table>
      <nav>
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" :prev-text="$t('commen.prev')" :next-text="$t('commen.next')" hide-goto-end-buttons :change="getData(currentPage)"/>
      </nav>
    </b-card>
    <b-modal :title="$t('cms.nav.title')" v-model="myModal" @ok="postBanner" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.nav.modal.title')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('cms.nav.modal.title')" autocomplete="job name" v-model="selectBanner.title" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.nav.modal.title_en')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('cms.nav.modal.title_en')" autocomplete="job name" v-model="selectBanner.title_en" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.nav.modal.des_title')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('cms.nav.modal.des_title')" autocomplete="job name" v-model="selectBanner.des_title" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.nav.modal.des_title_en')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('cms.nav.modal.des_title_en')" autocomplete="job name" v-model="selectBanner.des_title_en" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.nav.modal.weight')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('cms.nav.modal.weight')" autocomplete="job name" v-model="selectBanner.weight" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('cms.nav.modal.url')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('cms.nav.modal.url')" autocomplete="job name" v-model="selectBanner.url" />
          </b-input-group>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal ref='confirmModal' class="modal-warning" :title="$t('commen.delete') + ' '+ $t('cms.nav.title')" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')" v-model="confirmModal" @ok="deleteBanner" ok-variant="warning">
      {{$t('cms.nav.modal.comfirm_text')}}
    </b-modal>
  </div>
</template>
<script>
  export default {
    name: 'cmsMenu',
    data: () => {
      return {
        confirmModalTitle: '删除导航',
        confirmModalText: '是否删除这个导航？',
        confirmModal: false,
        selectBanner: {},
        myModal: false,
        modal_title: '导航编辑',
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
        items: [
        ],
        fields: [
          {title: "导航标题(中文)"},
          {title_en: "Title(english)"},
          {des_title: "副标题(中文)"},
          {des_title_en: "Subtitle(english)"},
          {gmt_create: "创建时间(Created Date)"},
          {url: "跳转地址(URL)"},
          {weight: "权重(Weight)"},
          {setting: "操作(Setting)"},
        ],
        imgHost: 'https://shizou-image.oss-cn-hangzhou.aliyuncs.com',
        files:[],
        Region:'oss-cn-hangzhou',
        bucket: 'shizou-image'
      }
    },
    created () {
      this.fields = [
        {title: this.$i18n.messages[this.$i18n.locale].cms.nav.tables.title},
        {title_en: this.$i18n.messages[this.$i18n.locale].cms.nav.tables.title_en},
        {des_title: this.$i18n.messages[this.$i18n.locale].cms.nav.tables.des_title},
        {des_title_en: this.$i18n.messages[this.$i18n.locale].cms.nav.tables.des_title_en},
        {gmt_create: this.$i18n.messages[this.$i18n.locale].cms.nav.tables.gmt_create},
        {url: this.$i18n.messages[this.$i18n.locale].cms.nav.tables.url},
        {weight: this.$i18n.messages[this.$i18n.locale].cms.nav.tables.weight},
        {setting: this.$i18n.messages[this.$i18n.locale].cms.nav.tables.setting},
      ];
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
      getData(page) {
        let self = this;
        if (page <= this.ajaxPage) {
          return;
        }
        page = page ? page : self.currentPage;
        self.$http.get(`/api/admin/nav/list?page=${page}&prePage=${self.perPage}`).then(response => {
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
      },

      onFileChange(e) {
        this.files = e.target.files || e.dataTransfer.files;
        if (!this.files.length) return;
        this.createImage(this.files[0]);
      },
      createImage(file) {
        let image = new Image();
        let reader = new FileReader();
        let vm = this;

        reader.onload = (e) => {
          vm.image = e.target.result;
        };
        reader.readAsDataURL(file);
      },


      postBanner() {
        let self = this;

        self.$http.post(`/api/admin/nav/post`, self.selectBanner).then(response => {
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

      deleteBanner() {
        let self = this;

        self.$http.post(`/api/admin/nav/delete/${self.selectBanner.id}`).then(response => {
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
