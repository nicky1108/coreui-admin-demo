<template>
  <div class="animated fadeIn">
    <b-row class="mb-3">
      <b-col sm="7" lg="7">

      </b-col>
      <b-col sm="3" lg="3">
      </b-col>
      <b-col sm="2" lg="2">
        <b-button variant="primary" class="px-4" @click="doSetting('new')">新增Banner</b-button>
      </b-col>
    </b-row>
    <b-card header="Banner列表">
      <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
        <template slot="imgurl" slot-scope="data">
          <img :src="data.item.imgurl" alt="" width="346" height="150">
        </template>
        <template slot="gmt_create" slot-scope="data">
          {{ data.item.gmt_create | dateformat()}}
        </template>

        <template slot="gmt_begin" slot-scope="data">
          {{data.item.gmt_begin | dateformat()}}
        </template>
        <template slot="gmt_end" slot-scope="data">
          {{data.item.gmt_end | dateformat()}}
        </template>
        <template slot="setting" slot-scope="data">
          <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2" @click="doSetting(btn, data.item)">{{btn}}</b-button>
        </template>
      </b-table>
      <nav>
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" prev-text="上一页" next-text="下一页" hide-goto-end-buttons :change="getData(currentPage)"/>
      </nav>
    </b-card>
    <b-modal :title="modal_title" v-model="myModal" @ok="postBanner">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>主题：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="主题" autocomplete="job name" v-model="selectBanner.title" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>权重：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="权重" autocomplete="job name" v-model="selectBanner.weight" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>跳转地址：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="跳转地址" autocomplete="job name" v-model="selectBanner.url" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>开始时间：</b-input-group-text></b-input-group-prepend>
            <date-picker v-model="selectBanner.gmt_begin" :config="options"></date-picker>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>结束时间：</b-input-group-text></b-input-group-prepend>
            <date-picker v-model="selectBanner.gmt_end" :config="options"></date-picker>
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <img :src="image" alt="" width="346" height="150">
        </b-col>
        <form ref="ImgForm" @submit="uploadImg">
          <b-col sm="12" lg="12" class="mb-2">
            <b-form-group
              label="上传图片"
              label-for="fileInput"
              :label-cols="3"
              :horizontal="true">
              <b-form-file id="fileInput" :plain="true" @change="onFileChange"></b-form-file>
            </b-form-group>
            <b-button variant="primary" type="submit">上传</b-button>
          </b-col>
        </form>
      </b-row>
    </b-modal>
    <b-modal ref='confirmModal' class="modal-warning" :title="confirmModalTitle" v-model="confirmModal" @ok="deleteBanner" ok-variant="warning">
      {{confirmModalText}}
    </b-modal>
  </div>
</template>
<script>
  // Import this component
  import datePicker from 'vue-bootstrap-datetimepicker';

  // Import date picker css
  import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
  export default {
    name: 'banner',
    components: {
      datePicker
    },
    data: () => {
      return {
        confirmModalTitle: '删除banner',
        confirmModalText: '是否删除这个banner？',
        confirmModal: false,
        selectBanner: {},
        myModal: false,
        modal_title: 'banner编辑',
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
          {id: "编号"},
          {title: "主题"},
          {imgurl: "海报图片"},
          {gmt_create: "创建时间"},
          {gmt_begin: "开始时间"},
          {gmt_end: "结束时间"},
          {weight: "权重"},
          {setting: "操作"},
        ],
        imgHost: 'https://shizou-image.oss-cn-hangzhou.aliyuncs.com',
        files:[],
        Region:'oss-cn-hangzhou',
        bucket: 'shizou-image'
      }
    },
    created () {
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

        return setting === '修改' ? 'primary'
          : setting === '删除' ? 'danger' : 'primary'
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
        self.$http.get(`/api/admin/banner/list?page=${page}&prePage=${self.perPage}`).then(response => {
          if (response.body.code === 0) {
            self.totalRows = response.body.data.totalCount;
            self.ajaxPage = page;
            let list = response.body.data.list;
            for (let i = 0; i < list.length; i++) {
              list[i]['setting'] = ['修改', '删除'];
            }
            if (page === 1) {
              self.items = [];
            }
            self.items = self.items.concat(list);
          }
        })
      },


      doSetting(btn, item) {
        if (btn === '修改') {
          this.selectBanner = item;
          this.image = item.imgurl;
          this.selectBanner.gmt_begin = window.moment(this.selectBanner.gmt_begin).format('YYYY-MM-DD HH:mm:ss');
          this.selectBanner.gmt_end = window.moment(this.selectBanner.gmt_end).format('YYYY-MM-DD HH:mm:ss');
          this.myModal = true;
        }
        else if (btn === 'new') {
          this.selectBanner = {};
          this.myModal = true;
        }
        else if (btn === '查看') {
          this.$router.push(`/vip/detail?id=${item.id}`);
        }
        else if (btn === '删除') {
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

      uploadImg () {
        let self = this;

        self.$http.get('/api/admin/banner/getOssToken').then((response) => {
            console.log(response);
          const client = new OSS.Wrapper({
            region:self.region,
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
              window.toast.success({title:"上传成功！"});
            }).catch((err) => {
              console.log(err);
              window.toast.error({title:"上传失败"});
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

      postBanner() {
        let self = this;

        self.$http.post(`/api/admin/banner/post`, self.selectBanner).then(response => {
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

      deleteBanner() {
        let self = this;

        self.$http.post(`/api/admin/banner/delete/${self.selectBanner.id}`).then(response => {
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
      }
    }
  }
</script>
