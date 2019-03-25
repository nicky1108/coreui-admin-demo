<template>
  <div class="animated fadeIn">
    <b-row class="mb-3">
      <b-col sm="7" lg="7">

      </b-col>
      <b-col sm="3" lg="3">
      </b-col>
      <b-col sm="2" lg="2">
        <b-button variant="primary" class="px-4" @click="doSetting('new')">{{$t('commen.add') + ' ' + $t('talents.title')}}</b-button>
      </b-col>
    </b-row>
    <b-card :header="$t('talents.title') + $t('commen.list')">
      <b-row>
        <b-col sm="12" lg="12">
          <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" >

            <template slot="gmt_end" slot-scope="data">
              {{ data.item.gmt_end | dateformat()}}
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

    <b-modal :title="$t('talents.title')" size="lg" v-model="myModal" @ok="postBusiness" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('talents.modal.jobs')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('talents.modal.jobs')" autocomplete="job name" v-model="selectBanner.jobs" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('talents.modal.jobs_en')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('talents.modal.jobs_en')" autocomplete="job name" v-model="selectBanner.jobs_en" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('talents.modal.number')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('talents.modal.number')" autocomplete="job name" v-model="selectBanner.number" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('talents.modal.job_exp')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('talents.modal.job_exp')" autocomplete="job name" v-model="selectBanner.job_exp" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('talents.modal.address')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('talents.modal.address')" autocomplete="job name" v-model="selectBanner.address" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('talents.modal.address_en')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('talents.modal.address_en')" autocomplete="job name" v-model="selectBanner.address_en" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('talents.modal.gmt_end')}}：</b-input-group-text></b-input-group-prepend>
            <date-picker v-model="selectBanner.gmt_end" :config="options"></date-picker>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-tabs>
            <b-tab :title="$t('talents.modal.content')">
              <b-col sm="12" lg="12" class="mb-2 pb-3">
                <vue-ueditor-wrap style="height: 500px" ref="ueditor" v-model="selectBanner.content" :destroy="false" :config="config"></vue-ueditor-wrap>
              </b-col>
            </b-tab>
            <b-tab :title="$t('talents.modal.content_en')">
              <b-col sm="12" lg="12" class="mb-2 pb-3">
                <vue-ueditor-wrap style="height: 500px" ref="ueditor" v-model="selectBanner.content_en" :destroy="false" :config="config"></vue-ueditor-wrap>
              </b-col>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal ref='confirmModal' class="modal-warning" :title="$t('commen.delete') + ' '+ $t('talents.title')" v-model="confirmModal" @ok="deleteBusiness" ok-variant="warning" :cancel-title="$t('commen.modal.btn_cancel')" :ok-title="$t('commen.modal.btn_ok')">
      {{$t('talents.modal.comfirm_text')}}
    </b-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import datePicker from 'vue-bootstrap-datetimepicker';

  // Import date picker css
  import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';

  import VueUeditorWrap from 'vue-ueditor-wrap'

  export default {
    name: "Talents",
    components: {
      datePicker,
      VueUeditorWrap
    },
    data () {
      return {
        myModal: false,
        selectBanner:{},
        confirmModalTitle: "",
        confirmModal: false,
        confirmModalText: "",
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        ajaxPage: 0,
        modal_title: '招聘信息',
        items: [
        ],
        fields: [
          {jobs: "招聘标题(中文)"},
          {jobs_en: "招聘标题(英文)"},
          {number: "招聘人数"},
          {job_exp: "工作经验"},
          {address: "工作地址"},
          {address_en: "工作地址(英文)"},
          {gmt_end: "截止时间"},
          {setting: "操作(Setting)"},
        ],
        imgHost: 'https://hzql.oss-cn-hangzhou.aliyuncs.com',
        Region:'oss-cn-hangzhou',
        bucket: 'hzql',
        options: {
          format: 'YYYY-MM-DD HH:mm:ss',
          useCurrent: true,
          locale: 'zh'
        },
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
        {jobs: this.$i18n.messages[this.$i18n.locale].talents.tables.jobs},
        {jobs_en: this.$i18n.messages[this.$i18n.locale].talents.tables.jobs_en},
        {number: this.$i18n.messages[this.$i18n.locale].talents.tables.number},
        {job_exp: this.$i18n.messages[this.$i18n.locale].talents.tables.job_exp},
        {address: this.$i18n.messages[this.$i18n.locale].talents.tables.address},
        {address_en: this.$i18n.messages[this.$i18n.locale].talents.tables.address_en},
        {gmt_end: this.$i18n.messages[this.$i18n.locale].talents.tables.gmt_end},
        {setting: this.$i18n.messages[this.$i18n.locale].talents.tables.setting},
      ];
      // this.fetchData();
    },
    watch : {
      // '$route': 'fetchData'
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
      getData(page) {
        let self = this;
        if (page <= this.ajaxPage) {
          return;
        }
        self.$http.get(`/api/admin/talents/list`).then(response => {
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

      postBusiness() {
        let self = this;

        self.$http.post(`/api/admin/talents/post`, self.selectBanner).then(response => {
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

        self.$http.post(`/api/admin/talents/delete/${self.selectBanner.id}`).then(response => {
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
