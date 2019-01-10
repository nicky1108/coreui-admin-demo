<template>
  <div class="animated fadeIn">
    <div class="row mb-2">
      <b-col sm="2" lg="2">
      </b-col>
      <div class="mb-10 mb-xl-0 col-sm-2 col-md-2 col-xl col-2"></div>
      <div class="col-2"><button type="button" class="btn btn-primary btn-block" @click="doSetting('new')">新增桌位</button></div>
    </div>
    <b-card header="桌位列表">
      <b-badge class="mr-2" v-for="(item, index) in items" :key="index" :variant="getBadge(item)" @click="deleteSeat(item)">{{item.seatname}} &times;</b-badge>
    </b-card>

    <b-modal :title="modal_title" v-model="myModal" @ok="postSeats">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>桌位名称(多个以逗号隔开)：</b-input-group-text></b-input-group-prepend>
            <textarea class="form-control" v-model="seats_names" placeholder="大厅1,大厅2"></textarea>
          </b-input-group>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal ref='confirmModal' class="modal-warning" :title="confirmModalTitle" v-model="confirmModal" @ok="postDelete" ok-variant="warning">
      {{confirmModalText}}
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: "Seats",
    data: () => {
      return {
        confirmModalTitle: '删除桌位',
        confirmModalText: '是否删除这个桌位？',
        confirmModal: false,
        seats_names:'',
        selectSeat: {},
        modal_title: '房间编辑',
        config_keyname: '',
        config_json: '',
        edit_id: null,
        myModal: false,
        items:[]
      }
    },
    created () {
      let self = this;
      this.getData();
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getData'
    },
    methods: {
      getBadge(item) {
        if (item.con_status === 1 || item.sub_status === 1) {
          return 'danger';
        }
        else {
          return 'success';
        }
      },
      getData () {
        let self = this;
        let room_id = null;
        if ('room_id' in this.$route.query) {
          room_id = this.$route.query.room_id;
        }
        if (!room_id) {
          return ;
        }
        self.$http.get(`/api/admin/seats/getSeatsFromRoom?room_id=${room_id}`).then(response => {
          if (response.body.code === 0)
          {

            self.items = response.body.data;
          }
        })
      },

      getButtons (setting) {

        return setting === '修改' ? 'primary'
          : setting === '删除' ? 'danger' : 'primary'
      },

      postDelete() {
        let self = this;
        if (self.selectSeat.sub_status === 1 || self.selectSeat.con_status === 1) {
          window.toast.error({title:"桌位上还有未结算的订单或者未处理的预约单，请先处理"});
          return;
        }

        self.$http.post(`/api/admin/seats/delete/${self.selectSeat.id}`,).then(response => {
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

      deleteSeat(item) {
        let self = this;
        self.selectSeat = item;
        self.confirmModal = true;
      },

      postSeats () {
        let self = this;
        if (self.seats_names === '') {
          window.toast.error({title:"桌位名不能为空"});
          return;
        }

        let room_id = null;
        if ('room_id' in this.$route.query) {
          room_id = this.$route.query.room_id;
        }
        if (!room_id) {
          return ;
        }

        self.$http.post(`/api/admin/seats/post`, {
          seats: self.seats_names,
          room_id: parseInt(room_id)
        }).then(response => {
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

      doSetting (btn, item) {
        if (btn === '修改') {
          this.selectRoom = item;
          this.myModal = true;
        }
        else if (btn === 'new') {
          this.selectRoom = {};
          this.myModal = true;
        }
      }
    }
  }
</script>

<style scoped>

</style>
