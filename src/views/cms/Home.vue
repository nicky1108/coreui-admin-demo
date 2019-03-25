<template>
  <div class="animated fadeIn">
    <b-card :header="$t('cms.about.title')">
      <b-row class="mb-3">
        <b-col sm="12" lg="12">
          <b-tabs>
            <b-tab :title="$t('cms.about.introduction')" active @click="changeType(1)">
              <b-row>
                <b-col sm="12" lg="12">
                  <b-tabs>
                    <b-tab :title="$t('cms.about.content')" active>
                      <b-row class="mb-4">
                        <vue-ueditor-wrap ref="ueditor" v-model="cmsData.about_content" :destroy="false" :config="config"></vue-ueditor-wrap>

                      </b-row>
                    </b-tab>
                    <b-tab :title="$t('cms.about.content_en')">
                      <b-row class="mb-4">
                        <vue-ueditor-wrap ref="ueditor" v-model="cmsData.about_content_en" :destroy="false" :config="config"></vue-ueditor-wrap>
                      </b-row>
                    </b-tab>
                  </b-tabs>

                </b-col>

              </b-row>
              <b-row class="mt-3">
                <b-col sm="12" lg="12">
                  <button class="btn btn-primary float-right" @click="doSave">{{$t('cms.about.btn_save')}}</button>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :title="$t('cms.about.goals')" active @click="changeType(2)">
              <b-row>
                <b-col sm="12" lg="12">
                  <b-tabs>
                    <b-tab :title="$t('cms.about.content')" active>
                      <b-row class="mb-4">
                        <vue-ueditor-wrap ref="ueditor" v-model="cmsData.goals_content" :destroy="false" :config="config"></vue-ueditor-wrap>
                      </b-row>
                    </b-tab>
                    <b-tab :title="$t('cms.about.content_en')">
                      <b-row class="mb-4">
                        <vue-ueditor-wrap ref="ueditor" v-model="cmsData.goals_content_en" :destroy="false" :config="config"></vue-ueditor-wrap>
                      </b-row>
                    </b-tab>
                  </b-tabs>

                </b-col>

              </b-row>
              <b-row class="mt-3">
                <b-col sm="12" lg="12">
                  <button class="btn btn-primary float-right" @click="doSave">{{$t('cms.about.btn_save')}}</button>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :title="$t('cms.about.culture')" active @click="changeType(3)">
              <b-row>
                <b-col sm="12" lg="12">
                  <b-tabs>
                    <b-tab :title="$t('cms.about.content')" active>
                      <b-row class="mb-4">
                        <vue-ueditor-wrap ref="ueditor" v-model="cmsData.culture_content" :destroy="false" :config="config"></vue-ueditor-wrap>
                      </b-row>
                    </b-tab>
                    <b-tab :title="$t('cms.about.content_en')">
                      <b-row class="mb-4">
                        <vue-ueditor-wrap ref="ueditor" v-model="cmsData.culture_content_en" :destroy="false" :config="config"></vue-ueditor-wrap>
                      </b-row>
                    </b-tab>
                  </b-tabs>

                </b-col>

              </b-row>
              <b-row class="mt-3">
                <b-col sm="12" lg="12">
                  <button class="btn btn-primary float-right" @click="doSave">{{$t('cms.about.btn_save')}}</button>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :title="$t('cms.about.product_title')" @click="changeType(4)">
              <b-row class="mb-3">
                <b-col sm="7" lg="7">

                </b-col>
                <b-col sm="3" lg="3">
                </b-col>
                <b-col sm="2" lg="2">
                  <b-button variant="primary" class="px-4" @click="doSetting('new')">{{$t('commen.add') + ' ' + $t('cms.about.image_title')}}</b-button>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="12" lg="12">
                  <b-table :hover="true" :striped="true" responsive="sm" :items="cmsData.imgList" :fields="fields" >
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
            <b-tab :title="$t('cms.about.contact_title')" @click="changeType(5)">
              <b-row class="mb-3">
                <b-col sm="12" lg="12" class="mb-2">
                  <b-input-group>
                    <b-input-group-prepend><b-input-group-text>{{$t('cms.about.tel')}}：</b-input-group-text></b-input-group-prepend>
                    <input type="text" class="form-control" :placeholder="$t('cms.about.tel')" autocomplete="job name" v-model="cmsData.tel" />
                  </b-input-group>
                </b-col>
                <b-col sm="12" lg="12" class="mb-2">
                  <b-input-group>
                    <b-input-group-prepend><b-input-group-text>{{$t('cms.about.email')}}：</b-input-group-text></b-input-group-prepend>
                    <input type="text" class="form-control" :placeholder="$t('cms.about.email')" autocomplete="job name" v-model="cmsData.email" />
                  </b-input-group>
                </b-col>
                <b-col sm="12" lg="12" class="mb-2">
                  <b-input-group>
                    <b-input-group-prepend><b-input-group-text>{{$t('cms.about.oa')}}：</b-input-group-text></b-input-group-prepend>
                    <input type="text" class="form-control" :placeholder="$t('cms.about.oa')" autocomplete="job name" v-model="cmsData.oa_url" />
                  </b-input-group>
                </b-col>
                <b-col sm="12" lg="12" class="mb-2">
                  <b-input-group>
                    <b-input-group-prepend><b-input-group-text>{{$t('cms.about.address')}}：</b-input-group-text></b-input-group-prepend>
                    <input type="text" class="form-control" :placeholder="$t('cms.about.address')" autocomplete="job name" v-model="cmsData.address" />
                  </b-input-group>
                </b-col>
                <b-col sm="12" lg="12" class="mb-2">
                  <b-input-group>
                    <b-input-group-prepend><b-input-group-text>{{$t('cms.about.address_en')}}：</b-input-group-text></b-input-group-prepend>
                    <input type="text" class="form-control" :placeholder="$t('cms.about.address_en')" autocomplete="job name" v-model="cmsData.address_en" />
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row class="mt-3">
                <b-col sm="12" lg="12">
                  <button class="btn btn-primary float-right" @click="doSave">{{$t('cms.about.btn_save')}}</button>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :title="$t('cms.about.talents_content')" active @click="changeType(6)">
              <b-row>
                <b-col sm="12" lg="12">
                  <b-tabs>
                    <b-tab :title="$t('cms.about.content')" active>
                      <b-row class="mb-4">
                        <vue-ueditor-wrap ref="ueditor" v-model="cmsData.talents_content" :destroy="false" :config="config"></vue-ueditor-wrap>
                      </b-row>
                    </b-tab>
                    <b-tab :title="$t('cms.about.content_en')">
                      <b-row class="mb-4">
                        <vue-ueditor-wrap ref="ueditor" v-model="cmsData.talents_content_en" :destroy="false" :config="config"></vue-ueditor-wrap>
                      </b-row>
                    </b-tab>
                  </b-tabs>

                </b-col>

              </b-row>
              <b-row class="mt-3">
                <b-col sm="12" lg="12">
                  <button class="btn btn-primary float-right" @click="doSave">{{$t('cms.about.btn_save')}}</button>
                </b-col>
              </b-row>
            </b-tab>

          </b-tabs>
        </b-col>
      </b-row>

    </b-card>

    <b-modal :title="$t('cms.about.title')" size="lg" v-model="myModal" @ok="postImg" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <img :src="image" alt="" width="500" height="375">
        </b-col>
        <form ref="ImgForm" @submit.stop="uploadImg">
          <b-col sm="12" lg="12" class="mb-2">
            <b-form-group
              :label="$t('cms.about.modal.upload_label')"
              label-for="fileInput"
              :label-cols="3"
              :horizontal="true">
              <b-form-file id="fileInput" :plain="true" @change="onFileChange"></b-form-file>
            </b-form-group>
            <b-button variant="primary" type="submit">{{$t('cms.about.modal.btn_upload')}}</b-button>
          </b-col>
        </form>
      </b-row>
    </b-modal>
    <b-modal ref='confirmModal' class="modal-warning" :title="$t('commen.delete') + ' '+ $t('cms.about.title')" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')"  v-model="confirmModal" @ok="deleteImg" ok-variant="warning">
      {{$t('cms.about.modal.comfirm_text')}}
    </b-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueUeditorWrap from 'vue-ueditor-wrap'

  export default {
    name: "About",
    components: {
      VueUeditorWrap
    },
    data () {
      return {
        id:"",
        image: "",
        entItem:{},
        bucket:"hzql",
        type: "about",
        cmsData: {},
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
        ],
        config: {
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 240,
          // 初始容器宽度
          initialFrameWidth: '100%',
          // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
          serverUrl: 'http://admin.hzqltz.com.cn/api/admin/ueditor',
          // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
          UEDITOR_HOME_URL: '/static/UEditor/'
          // 配合最新编译的资源文件，你可以实现添加自定义Request Headers,详情https://github.com/HaoChuan9421/ueditor/commits/dev-1.4.3.3
          // headers: {
          //   access_token: '37e7c9e3fda54cca94b8c88a4b5ddbf3'
          // }
        },
      }
    },
    created () {
      this.fields = [
        {imgUrl: this.$i18n.messages[this.$i18n.locale].cms.about.tables.imgUrl},
        {setting: this.$i18n.messages[this.$i18n.locale].cms.about.tables.setting},
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
        self.$http.get(`/api/admin/cms/getHome`).then(res => {
          let data = res.body.data;
          self.cmsData = data;
          for (let i = 0 ; i < self.cmsData.imgList.length; i ++ ) {
            self.cmsData.imgList[i] = {
              imgUrl : self.cmsData.imgList[i].imgUrl,
              setting: [self.$i18n.messages[self.$i18n.locale].commen.delete]
            }
          }
        });

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
        self.$http.post('/api/admin/cms/postHome', self.cmsData).then(res => {
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

        self.$http.post(`/api/admin/cms/postImg`, {
          imgUrl: self.image
        }).then(response => {
          if (response.body.code === 0)
          {
            window.toast.success({title:self.$i18n.messages[self.$i18n.locale].commen.success});
            self.cmsData.imgList.push({
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

        self.$http.post(`/api/admin/cms/deleteImg`, {
          imgUrl: self.image
        }).then(response => {
          if (response.body.code === 0)
          {
            window.toast.success({title:self.$i18n.messages[self.$i18n.locale].commen.success});
            self.cmsData.imgList = response.body.data;
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
