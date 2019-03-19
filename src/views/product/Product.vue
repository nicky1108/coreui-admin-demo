<template>
  <div class="animated fadeIn">
    <b-row class="mb-3">
      <b-col sm="5" lg="7">
        <select name="" id="BrandsSelect" class="form-control" v-model="selectBrand" @change="changeGroup">
          <option value="-1">--{{$t('product.product.modal.chooseBrand')}}--</option>
          <option v-for="(n, i) in brands" :key="i" :value="n.id">{{$i18n.locale === 'zh' ? n.brand_name : n.brand_name_en}}</option>
        </select>
      </b-col>
      <b-col sm="5" lg="3">
        <select name="" id="ClassifySelect" class="form-control" v-model="selectClassify" @change="changeGroup">
          <option value="-1">--{{$t('product.product.modal.chooseClassify')}}--</option>
          <option v-for="(n, i) in classifys" :key="i" :value="n.id">{{$i18n.locale === 'zh' ? n.classify_name : n.classify_name_en}}</option>
        </select>
      </b-col>
      <b-col sm="2" lg="2">
        <b-button variant="primary" class="px-4" @click="doSetting('new')">{{$t('commen.add') + ' ' + $t('product.product.title')}}</b-button>
      </b-col>
    </b-row>
    <b-card :header="$t('product.product.title') + $t('commen.list')">
      <b-row>
        <b-col sm="12" lg="12">
          <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" >
            <template slot="brand" slot-scope="data">
              {{$i18n.locale === 'zh' ? data.item.brand.brand_name : data.item.brand.brand_name_en}}
            </template>
            <template slot="classify" slot-scope="data">
              {{$i18n.locale === 'zh' ? data.item.classify.classify_name : data.item.classify.classify_name_en}}
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
      <nav>
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" :prev-text="$t('commen.prev')" :next-text="$t('commen.next')" hide-goto-end-buttons :change="getData(currentPage)"/>
      </nav>
    </b-card>

    <b-modal :title="modal_title" size="lg" v-model="myModal" @ok="postBusiness" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('product.product.modal.product_name')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('product.product.modal.product_name')" autocomplete="job name" v-model="selectBanner.product_name" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('product.product.modal.product_name_en')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('product.product.modal.product_name_en')" autocomplete="job name" v-model="selectBanner.product_name_en" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('product.product.modal.brand')}}：</b-input-group-text></b-input-group-prepend>
            <select name="" id="Brand" class="form-control" v-model="selectBanner.brand_id">
              <option value="-1">--{{$t('product.product.modal.chooseBrand')}}--</option>
              <option v-for="(n, i) in brands" :key="i" :value="n.id">{{n.brand_name}}</option>
            </select>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('product.product.modal.classify')}}：</b-input-group-text></b-input-group-prepend>
            <select name="" id="Classify" class="form-control" v-model="selectBanner.classify_id">
              <option value="-1">--{{$t('product.product.modal.chooseClassify')}}--</option>
              <option v-for="(n, i) in classifys" :key="i" :value="n.id">{{n.classify_name}}</option>
            </select>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          {{$t('product.product.modal.imgurl')}}
          <img :src="selectBanner.cover_img" alt="" width="200" height="150">
        </b-col>
        <form ref="ImgForm" @submit="uploadImg">
          <b-col sm="12" lg="12" class="mb-2">
            <b-form-group
              :label="$t('product.product.modal.upload_label')"
              label-for="fileInput"
              :label-cols="3"
              :horizontal="true">
              <b-form-file id="fileInput" :plain="true" @change="onFileChange"></b-form-file>
            </b-form-group>
            <b-button variant="primary" type="submit">{{$t('product.product.modal.btn_upload')}}</b-button>
          </b-col>
        </form>
        <b-col sm="12" lg="12" class="mb-2">
          <b-tabs>
            <b-tab :title="$t('product.product.modal.content')">
              <b-col sm="12" lg="12" class="mb-2 pb-3">
                <quill-editor v-model="selectBanner.content" style="height: 500px"></quill-editor>
              </b-col>
            </b-tab>
            <b-tab :title="$t('product.product.modal.content_en')">
              <b-col sm="12" lg="12" class="mb-2 pb-3">
                <quill-editor v-model="selectBanner.content_en" style="height: 500px"></quill-editor>
              </b-col>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal ref='confirmModal' class="modal-warning" :title="$t('commen.delete') + ' '+ $t('product.product.title')" v-model="confirmModal" @ok="deleteBusiness" ok-variant="warning" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      {{$t('product.product.modal.comfirm_text')}}
    </b-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueQuillEditor from 'vue-quill-editor'

  // require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  // mount with global
  Vue.use(VueQuillEditor);
  export default {
    name: "Product",
    data () {
      return {
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        ajaxPage: 0,
        image: "",
        selectBrand: -1,
        selectClassify: -1,
        brands: [],
        classifys: [],
        myModal: false,
        selectBanner:{},
        confirmModalTitle: "",
        confirmModal: false,
        confirmModalText: "",
        modal_title: '产品',
        items: [
        ],
        fields: [
          {product_name: "产品标题(中文)"},
          {product_name_en: "产品标题(英文)"},
          {brand: "品牌名"},
          {classify: "分类名"},
          {url: "预览地址"},
          {setting: "操作(Setting)"},
        ],
        imgHost: 'https://hzql.oss-cn-hangzhou.aliyuncs.com',
        Region:'oss-cn-hangzhou',
        bucket: 'hzql'
      }
    },
    created () {
      this.fields = [
        {product_name: this.$i18n.messages[this.$i18n.locale].product.product.tables.product_name},
        {product_name_en: this.$i18n.messages[this.$i18n.locale].product.product.tables.product_name_en},
        {brand: this.$i18n.messages[this.$i18n.locale].product.product.tables.brand},
        {classify: this.$i18n.messages[this.$i18n.locale].product.product.tables.classify},
        {url: this.$i18n.messages[this.$i18n.locale].product.product.tables.url},
        {setting: this.$i18n.messages[this.$i18n.locale].product.product.tables.setting},
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
          this.selectBanner = {
            brand_id: -1,
            classify_id: -1
          };
          this.myModal = true;
        }
        else if (btn === this.$i18n.messages[this.$i18n.locale].commen.delete) {
          this.selectBanner = item;
          this.confirmModal = true;
        }
      },
      fetchData () {
        let self = this;

        // self.getData();

        self.getBrand();
        self.getClassify();
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
        self.$http.get(`/api/admin/product/list?brand_id=${self.selectBrand}&classify_id=${self.selectClassify}`).then(response => {
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
            console.log(self.items);
          }
        })
      },


      getBrand() {
        let self = this;
        self.$http.get(`/api/admin/brand/list`).then(response => {
          if (response.body.code === 0) {
            let list = response.body.data;
            self.brands = list;
          }
        })
      },

      getClassify() {
        let self = this;
        self.$http.get(`/api/admin/classify/list`).then(response => {
          if (response.body.code === 0) {
            let list = response.body.data;
            self.classifys = list;
          }
        })
      },

      postBusiness() {
        let self = this;

        self.$http.post(`/api/admin/product/post`, self.selectBanner).then(response => {
          if (response.body.code === 0)
          {
            window.toast.success({title:self.$i18n.messages[self.$i18n.locale].commen.success});
            self.getData(1);
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

        self.$http.post(`/api/admin/product/delete/${self.selectBanner.id}`).then(response => {
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

      onFileChange(e) {
        this.files = e.target.files || e.dataTransfer.files;
        if (!this.files.length) return;
        // this.createImage(this.files[0]);
      },
      createImage(file) {
        let image = new Image();
        let reader = new FileReader();
        let vm = this;

        reader.onload = (e) => {
          vm.selectBanner.cover_img = e.target.result;
        };
        reader.readAsDataURL(file);
      },

      uploadImg () {
        let self = this;

        self.$http.get('/api/admin/banner/getOssToken').then((response) => {
          const client = new OSS.Wrapper({
            // region:self.region,
            accessKeyId: response.body.data.credentials.AccessKeyId,
            accessKeySecret: response.body.data.credentials.AccessKeySecret,
            stsToken: response.body.data.credentials.SecurityToken,
            bucket:self.bucket
          });
          if(self.files){
            const file = self.files[0];
            const storeAs = file.name;
            client.multipartUpload(storeAs, file, {

            }).then((results) => {
              self.selectBanner.cover_img = self.imgHost + '/' + storeAs;
              window.toast.success({title:self.$i18n.messages[self.$i18n.locale].commen.success});
            }).catch((err) => {
              console.log(err);
              window.toast.error({title:self.$i18n.messages[self.$i18n.locale].commen.fail});
            });
          }
        });

        // self.$http.post(`/api/admin/banner/upload`, {
        //   image: self.image
        // }).then(response => {
        //   if (response.body.code === 0)
        //   {
        //     window.toast.success({title:"操作成功"});
        //     self.getData();
        //   }
        //   else {
        //     window.toast.error({title:response.body.errMsg});
        //   }
        // }).catch(() => {
        //   window.toast.error({title:"网络错误"});
        // })
        return false;
      },
    }
  }
</script>

<style scoped>

</style>
