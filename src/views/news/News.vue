<template>
  <div class="animated fadeIn">
    <b-row class="mb-3">
      <b-col sm="7" lg="7">
        <select name="" id="" class="form-control" v-model="group_type" @change="changeGroup">
          <option value="news">{{$t('news.typeArray.news')}}</option>
          <option value="notice">{{$t('news.typeArray.notice')}}</option>
          <option value="community">{{$t('news.typeArray.community')}}</option>
        </select>
      </b-col>
      <b-col sm="3" lg="3">

      </b-col>
      <b-col sm="2" lg="2">
        <b-button variant="primary" class="px-4" @click="doSetting('new')">{{$t('commen.add') + ' ' + $t('news.title')}}</b-button>
      </b-col>
    </b-row>
    <b-card :header="$t('news.title')">
      <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
        <template slot="imgurl" slot-scope="data">
          <img :src="data.item.imgurl" alt="" width="100" height="75">
        </template>
        <template slot="gmt_create" slot-scope="data">
          {{ data.item.gmt_create | dateformat()}}
        </template>

        <template slot="group_type" slot-scope="data">
          {{$t(`news.typeArray.${data.item.group_type}`)}}
        </template>
        <template slot="url" slot-scope="data">
          <a v-if="data.item.url && data.item.url.indexOf('http') === 0" :href="data.item.url" target="_blank">{{$t('news.tables.preview')}}</a>
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
    <b-modal :title="$t('news.title')" size="lg" v-model="myModal" @ok="postNews" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('news.modal.title')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('news.modal.title')" autocomplete="job name" v-model="selectBanner.title" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('news.modal.title_en')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('news.modal.title_en')" autocomplete="job name" v-model="selectBanner.title_en" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('news.modal.group_type')}}：</b-input-group-text></b-input-group-prepend>
            <select name="" id="Brand" class="form-control" v-model="selectBanner.group_type">
              <option value="-1">--{{$t('news.modal.chooseGroup')}}--</option>
              <option value="news">{{$t('news.typeArray.news')}}</option>
              <option value="notice">{{$t('news.typeArray.notice')}}</option>
              <option value="community">{{$t('news.typeArray.community')}}</option>
            </select>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('news.modal.desc')}}：</b-input-group-text></b-input-group-prepend>
            <textarea type="text" class="form-control" :placeholder="$t('news.modal.desc')" autocomplete="job name" v-model="selectBanner.desc" ></textarea>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('news.modal.desc_en')}}：</b-input-group-text></b-input-group-prepend>
            <textarea type="text" class="form-control" :placeholder="$t('news.modal.desc_en')" autocomplete="job name" v-model="selectBanner.desc_en" ></textarea>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('news.modal.url')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('news.modal.url')" autocomplete="job name" v-model="selectBanner.url" />
          </b-input-group>
        </b-col>

        <b-col sm="12" lg="12" class="mb-2">
          {{$t('news.modal.imgurl')}}
          <img :src="image" alt="" width="200" height="150">
        </b-col>
        <form ref="ImgForm" @submit="uploadImg">
          <b-col sm="12" lg="12" class="mb-2">
            <b-form-group
              :label="$t('news.modal.upload_label')"
              label-for="fileInput"
              :label-cols="3"
              :horizontal="true">
              <b-form-file id="fileInput" :plain="true" @change="onFileChange"></b-form-file>
            </b-form-group>
            <b-button variant="primary" type="submit">{{$t('news.modal.btn_upload')}}</b-button>
          </b-col>
        </form>
        <b-col sm="12" lg="12" class="mb-2">
          <b-tabs>
            <b-tab :title="$t('news.modal.content')">
              <b-col sm="12" lg="12" class="mb-2 pb-3">
                <quill-editor v-model="selectBanner.content" style="height: 500px"></quill-editor>
              </b-col>
            </b-tab>
            <b-tab :title="$t('news.modal.content_en')">
              <b-col sm="12" lg="12" class="mb-2 pb-3">
                <quill-editor v-model="selectBanner.content_en" style="height: 500px"></quill-editor>
              </b-col>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal ref='confirmModal' class="modal-warning" :title="$t('commen.delete') + ' '+ $t('news.title')" v-model="confirmModal" @ok="deleteNews" ok-variant="warning" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      {{$t('news.modal.comfirm_text')}}
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
    name: "News",
    data () {
      return {
        group_type: 'news',
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        ajaxPage: 0,
        image: "",
        myModal: false,
        selectBanner:{},
        confirmModalTitle: "",
        confirmModal: false,
        confirmModalText: "",
        modal_title: '编辑文章',
        items: [
        ],
        fields: [
          {title: "标题(中文)"},
          {title_en: "标题(英文)"},
          {imgurl: "封面图"},
          {url: "预览内容"},
          {group_type: "所属分类"},
          {gmt_create: "创建时间"},
          {setting: "操作"},
        ],
        imgHost: 'https://hzql.oss-cn-hangzhou.aliyuncs.com',
        Region:'oss-cn-hangzhou',
        bucket: 'hzql'
      }
    },
    created () {
      this.fields = [
        {title: this.$i18n.messages[this.$i18n.locale].news.tables.title},
        {title_en: this.$i18n.messages[this.$i18n.locale].news.tables.title_en},
        {imgurl: this.$i18n.messages[this.$i18n.locale].news.tables.imgurl},
        {url: this.$i18n.messages[this.$i18n.locale].news.tables.url},
        {group_type: this.$i18n.messages[this.$i18n.locale].news.tables.group_type},
        {gmt_create: this.$i18n.messages[this.$i18n.locale].news.tables.gmt_create},
        {setting: this.$i18n.messages[this.$i18n.locale].news.tables.setting},
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
            group_type: this.group_type
          };
          this.myModal = true;
        }
        else if (btn === this.$i18n.messages[this.$i18n.locale].commen.delete) {
          this.selectBanner = item;
          this.confirmModal = true;
        }
      },
      changeGroup(e) {
        this.ajaxPage = 0;
        this.getData(1);
      },
      fetchData () {
        let self = this;

        self.getData();
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
              self.selectBanner.imgurl = self.imgHost + '/' + storeAs;
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
      getData(page) {
        let self = this;
        if (page <= this.ajaxPage) {
          return;
        }
        page = page ? page : self.currentPage;
        self.$http.get(`/api/admin/news/list?page=${page}&prePage=${self.perPage}&group_type=${self.group_type}`).then(response => {
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

      postNews() {
        let self = this;

        self.$http.post(`/api/admin/news/post`, self.selectBanner).then(response => {
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

      deleteNews() {
        let self = this;

        self.$http.post(`/api/admin/news/delete/${self.selectBanner.id}`).then(response => {
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
