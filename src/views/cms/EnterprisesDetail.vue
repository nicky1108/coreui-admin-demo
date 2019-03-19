<template>
  <div class="animated fadeIn">
    <b-card :header="$t('cms.entDetail.title')">
      <b-row class="mb-3">
        <b-col sm="12" lg="12">
          <b-tabs>
            <b-tab :title="$t('cms.entDetail.introduction')" active @click="changeType(1)">
              <b-row>
                <b-col sm="12" lg="12">
                  <b-tabs>
                    <b-tab :title="$t('cms.entDetail.content')" active>
                      <b-row class="mb-4">
                        <quill-editor v-model="entItem.about"></quill-editor>
                      </b-row>
                    </b-tab>
                    <b-tab :title="$t('cms.entDetail.content_en')">
                      <b-row class="mb-4">
                        <quill-editor v-model="entItem.about_en"></quill-editor>
                      </b-row>
                    </b-tab>
                  </b-tabs>

                </b-col>

              </b-row>
              <b-row class="mt-3">
                <b-col sm="12" lg="12">
                  <button class="btn btn-primary float-right" @click="doSave">{{$t('cms.entDetail.btn_save')}}</button>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :title="$t('cms.entDetail.product_title')" @click="changeType(2)">
              <b-row class="mb-3">
                <b-col sm="7" lg="7">

                </b-col>
                <b-col sm="3" lg="3">
                </b-col>
                <b-col sm="2" lg="2">
                  <b-button variant="primary" class="px-4" @click="doSetting('new')">{{$t('commen.add') + ' ' + $t('cms.entDetail.image_title')}}</b-button>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="12" lg="12">
                  <b-table :hover="true" :striped="true" responsive="sm" :items="entItem.imgList" :fields="fields" >
                    <template slot="imgUrl" slot-scope="data">
                      <img :src="data.item.imgUrl" width="100" height="75" alt="">
                    </template>
                    <template slot="setting" slot-scope="data">
                      <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item.imgUrl)">{{btn}}</b-button>
                    </template>
                  </b-table>
                </b-col>
              </b-row>

            </b-tab>
            <b-tab :title="$t('cms.entDetail.contact_title')" @click="changeType(3)">
              <b-row class="mb-3">
                <b-col sm="12" lg="12" class="mb-2">
                  <b-input-group>
                    <b-input-group-prepend><b-input-group-text>{{$t('cms.entDetail.tel')}}：</b-input-group-text></b-input-group-prepend>
                    <input type="text" class="form-control" :placeholder="$t('cms.entDetail.tel')" autocomplete="job name" v-model="entItem.tel" />
                  </b-input-group>
                </b-col>
                <b-col sm="12" lg="12" class="mb-2">
                  <b-input-group>
                    <b-input-group-prepend><b-input-group-text>{{$t('cms.entDetail.email')}}：</b-input-group-text></b-input-group-prepend>
                    <input type="text" class="form-control" :placeholder="$t('cms.entDetail.email')" autocomplete="job name" v-model="entItem.email" />
                  </b-input-group>
                </b-col>
                <b-col sm="12" lg="12" class="mb-2">
                  <b-input-group>
                    <b-input-group-prepend><b-input-group-text>{{$t('cms.entDetail.address')}}：</b-input-group-text></b-input-group-prepend>
                    <input type="text" class="form-control" :placeholder="$t('cms.entDetail.address')" autocomplete="job name" v-model="entItem.address" />
                  </b-input-group>
                </b-col>
                <b-col sm="12" lg="12" class="mb-2">
                  <b-input-group>
                    <b-input-group-prepend><b-input-group-text>{{$t('cms.entDetail.address_en')}}：</b-input-group-text></b-input-group-prepend>
                    <input type="text" class="form-control" :placeholder="$t('cms.entDetail.address_en')" autocomplete="job name" v-model="entItem.address_en" />
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row class="mt-3">
                <b-col sm="12" lg="12">
                  <button class="btn btn-primary float-right" @click="doSave">{{$t('cms.entDetail.btn_save')}}</button>
                </b-col>
              </b-row>
            </b-tab>

          </b-tabs>
        </b-col>
      </b-row>

    </b-card>

    <b-modal :title="$t('cms.entDetail.title')" size="lg" v-model="myModal" @ok="postImg" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <img :src="image" alt="" width="500" height="375">
        </b-col>
        <form ref="ImgForm" @submit="uploadImg">
          <b-col sm="12" lg="12" class="mb-2">
            <b-form-group
              :label="$t('cms.entDetail.modal.upload_label')"
              label-for="fileInput"
              :label-cols="3"
              :horizontal="true">
              <b-form-file id="fileInput" :plain="true" @change="onFileChange"></b-form-file>
            </b-form-group>
            <b-button variant="primary" type="submit">{{$t('cms.entDetail.modal.btn_upload')}}</b-button>
          </b-col>
        </form>
      </b-row>
    </b-modal>
    <b-modal ref='confirmModal' class="modal-warning" :title="$t('commen.delete') + ' '+ $t('cms.entDetail.title')" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')"  v-model="confirmModal" @ok="deleteImg" ok-variant="warning">
      {{$t('cms.entDetail.modal.comfirm_text')}}
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
    name: "EnterprisesDetail",
    data () {
      return {
        id:"",
        image: "",
        entItem:{},
        bucket:"hzql",
        type: "about",
        aboutImg: '',
        aboutContent: '',
        aboutContentEn: '',
        businessImg: '',
        subordinateImg: '',
        productImg: '',
        newsImg: '',
        myModal: false,
        selectBanner:{},
        confirmModalTitle: "删除图片",
        confirmModal: false,
        confirmModalText: "是否删除这个图片",
        modal_title: '所属领域',
        imgHost: 'https://hzql.oss-cn-hangzhou.aliyuncs.com',
        items: [
        ],
        fields: [
          {imgUrl: "图片"},
          {setting: "操作"},
        ]
      }
    },
    created () {
      this.fields = [
        {imgUrl: this.$i18n.messages[this.$i18n.locale].cms.entDetail.tables.imgUrl},
        {setting: this.$i18n.messages[this.$i18n.locale].cms.entDetail.tables.setting},
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
          this.image = '';
          this.myModal = true;
        }
        else if (btn === this.$i18n.messages[this.$i18n.locale].commen.delete) {
          this.image = item;
          this.confirmModal = true;
        }
      },
      fetchData () {
        let self = this;
        if ('id' in self.$route.query) {
          self.id = self.$route.query.id;

          self.$http.get(`/api/admin/company/detail?id=${self.id}`).then(res => {
            let data = res.body.data;
            self.entItem = data;
            for (let i = 0 ; i < self.entItem.imgList.length; i ++ ) {
              self.entItem.imgList[i] = {
                imgUrl : self.entItem.imgList[i].imgUrl,
                setting: [self.$i18n.messages[self.$i18n.locale].commen.delete]
              }
            }
          });
        }
        else {
          window.toast.error({title:"404 not found"});
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
      uploadImg () {
        let self = this;

        self.$http.get('/api/admin/banner/getOssToken').then((response) => {
          console.log(response);
          const client = new OSS.Wrapper({
            accessKeyId: response.body.data.credentials.AccessKeyId,
            accessKeySecret: response.body.data.credentials.AccessKeySecret,
            stsToken: response.body.data.credentials.SecurityToken,
            bucket:self.bucket
          });
          if(self.files){
            const file = self.files[0];
            const storeAs = 'uploads/'+file.name;
            client.multipartUpload(storeAs, file, {

            }).then((results) => {
              self.image = self.imgHost + '/' + storeAs;
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
      changeType(type) {
        this.type = type;
      },
      doSave () {
        let self = this;
        self.$http.post('/api/admin/company/post', self.entItem).then(res => {
          if (res.body.code === 0)
          {
            window.toast.success({title:self.$i18n.messages[self.$i18n.locale].commen.success});
          }
          else {
            window.toast.error({title:res.body.errMsg});
          }
        }).catch(() => {
          window.toast.error({title:self.$i18n.messages[self.$i18n.locale].commen.fail});
        })
      },

      postImg() {
        let self = this;

        self.$http.post(`/api/admin/company/postImg`, {
          id: self.entItem.id,
          imgUrl: self.image
        }).then(response => {
          if (response.body.code === 0)
          {
            window.toast.success({title:self.$i18n.messages[self.$i18n.locale].commen.success});
            self.entItem.imgList.push({
              imgUrl: self.image,
              setting: [self.$i18n.messages[self.$i18n.locale].commen.delete]
            });
          }
          else {
            window.toast.error({title:response.body.errMsg});
          }
        }).catch(() => {
          window.toast.error({title:self.$i18n.messages[self.$i18n.locale].commen.fail});
        })
      },

      deleteImg() {
        let self = this;

        self.$http.post(`/api/admin/company/deleteImg`, {
          id: self.entItem.id,
          imgUrl: self.image
        }).then(response => {
          if (response.body.code === 0)
          {
            window.toast.success({title:self.$i18n.messages[self.$i18n.locale].commen.success});
            self.entItem.imgList = response.body.data;
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
