<template>
    <div class="animated fadeIn">
        <b-row class="mb-3">
          <b-col sm="3" lg="3">
            <div role="group" class="btn-group">
              <button type="button" :class="this.room_type === 'all' ? 'btn btn-primary' : 'btn btn-secondary'" @click="changeRoomType('all')">全部</button>
              <button type="button" :class="this.room_type === '散座' ? 'btn btn-primary' : 'btn btn-secondary'" @click="changeRoomType('散座')">大厅</button>
              <button type="button" :class="this.room_type === '包厢' ? 'btn btn-primary' : 'btn btn-secondary'" @click="changeRoomType('包厢')">包厢</button>
            </div>
          </b-col>
          <b-col sm="3" lg="3"></b-col>
          <b-col sm="3" lg="3">
            <b-form-select @change="changeStatus" :value="status" id="status"
                           :plain="true"
                           :options="statusOptions">
            </b-form-select>
          </b-col>
          <b-col sm="3" lg="3">
            <button type="button" class="btn btn-primary mr-1" @click="refreshData">刷新桌台</button>
            <button type="button" class="btn btn-primary" >扫码预约</button>
          </b-col>
        </b-row>
        <b-card header="座位列表">
          <b-row v-for="(item, index) in seats" :key="index">
            <b-col sm="12" lg="12">
              <h1>{{ item.roomname }}</h1>
            </b-col>
            <b-col sm="6" lg="3" v-for="(seat, idx) in item.list" :key="idx">
              <b-card no-body :class="randBg(seat.sub_status, seat.con_status)" style="min-height:190px" @click="showModal(item,seat)">
                <b-card-body class="pb-0">
                  <h4 class="mb-0">{{ seat.seatname }}</h4>
                  <p>{{ seat.number }}</p>
                  <p>{{ randStatus(seat.sub_status, seat.con_status) }}</p>
                  <p style="color:black" v-if="seat.sub_data">{{ randSubDate(seat.sub_data.gmt_sub_con)}}</p>
                  <p style="color:red; height:16px" v-if="seat.sub_data">{{ randerSubDateIsPass(seat.sub_data.gmt_sub_con)}}</p>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </b-card>
        <b-modal size="lg" ref='SeatStatus' hide-footer :title="modal_title" v-model="seat_status_modal">
            <div style="border-bottom:#999 1px solid; padding-bottom:20px" class="mb-3">
                <div v-if="modal_status_order === '1'">
                    <b-row>
                        <b-col sm="2" lg="2">
                        </b-col>
                        <b-col sm="8" lg="8">
                            <b-btn class="mt-3 btn-lg" variant="warning" block @click="modal_status_order='2'">开单</b-btn>
                        </b-col>
                        <b-col sm="2" lg="2">
                        </b-col>
                    </b-row>
                </div>
                <div v-if="modal_status_order === '2'">
                    <b-row>
                        <b-col sm="6" lg="6" class="mb-3">
                          房间类型：
                        </b-col>
                        <b-col sm="6" lg="6" class="mb-3">
                          桌号：
                        </b-col>
                        <b-col sm="6" lg="6" class="mb-3">
                            <b-input-group class="mb-3">
                              <b-input-group-prepend><b-input-group-text>用户</b-input-group-text></b-input-group-prepend>
                              <input type="text" class="form-control" placeholder="用户手机号/扫码(选填)" autocomplete="用户手机号/扫码(选填)" v-model="username" />
                            </b-input-group>
                        </b-col>
                        <b-col sm="6" lg="6" class="mb-3">
                          <b-input-group class="mb-3">
                            <b-input-group-prepend><b-input-group-text>人数</b-input-group-text></b-input-group-prepend>
                            <input type="text" class="form-control" placeholder="输入人数"  v-model="username" />
                          </b-input-group>
                        </b-col>
                        <b-col sm="6" lg="6" class="mb-3">
                          <b-input-group class="mb-3">
                            <b-input-group-prepend><b-input-group-text>开单时间</b-input-group-text></b-input-group-prepend>
                            <date-picker v-model="date" :config="options"></date-picker>
                          </b-input-group>
                        </b-col>
                        <b-col sm="12" lg="12" class="mb-3">
                          <b-input-group class="mb-3">
                            <b-input-group-prepend><b-input-group-text>备注</b-input-group-text></b-input-group-prepend>
                            <textarea class="form-control"></textarea>
                          </b-input-group>
                        </b-col>
                    </b-row>
                    <b-row class="mb-3">
                        <b-col sm="4" lg="4" >
                            <b-btn variant="secondary" class="btn-block" @click="modal_status_order='1'">取消</b-btn>
                        </b-col>
                        <b-col sm="4" lg="4" >
                        </b-col>
                        <b-col sm="4" lg="4" >
                            <b-btn variant="primary" class="btn-block">确认下单</b-btn>
                        </b-col>
                    </b-row>
                </div>
                <div v-if="modal_status_order === '3'">
                    <b-row class="mb-3">
                        <b-col sm="2" lg="2"></b-col>
                        <b-col sm="4" lg="4" >状态：</b-col>
                        <b-col sm="4" lg="4" >正在消费</b-col>
                        <b-col sm="2" lg="2"></b-col>
                    </b-row>
                    <b-row class="mb-3">
                        <b-col sm="2" lg="2"></b-col>
                        <b-col sm="4" lg="4" >用户名：</b-col>
                        <b-col sm="4" lg="4" >xxx</b-col>
                        <b-col sm="2" lg="2"></b-col>
                    </b-row>
                    <b-row class="mb-3">
                        <b-col sm="2" lg="2"></b-col>
                        <b-col sm="4" lg="4" >点单时间</b-col>
                        <b-col sm="4" lg="4" >xxx</b-col>
                        <b-col sm="2" lg="2"></b-col>
                    </b-row>
                    <b-row class="mb-5">
                        <b-col sm="2" lg="2"></b-col>
                        <b-col sm="4" lg="4" >订单编号</b-col>
                        <b-col sm="4" lg="4" >xxx</b-col>
                        <b-col sm="2" lg="2"></b-col>
                    </b-row>
                    <b-row class="mb-3">
                        <b-col sm="4" lg="4" >
                            <b-btn variant="secondary" class="btn-block" @click="seat_status_modal = false">取消</b-btn>
                        </b-col>
                        <b-col sm="4" lg="4" >
                            <b-btn variant="primary" class="btn-block">买单</b-btn>
                        </b-col>
                        <b-col sm="4" lg="4" >
                            <b-btn variant="primary" class="btn-block">转移</b-btn>
                        </b-col>
                    </b-row>
                </div>
                <div v-if="modal_status_order === '4'">

                </div>
            </div>
            <div>
                <div v-if="modal_status_sub === '1'">
                    <b-row>
                        <b-col sm="2" lg="2">
                        </b-col>
                        <b-col sm="8" lg="8">
                            <b-btn class="mt-3 btn-lg" variant="success" block @click="modal_status_sub='2'">预约</b-btn>
                        </b-col>
                        <b-col sm="2" lg="2">
                        </b-col>
                    </b-row>
                </div>
                <div v-if="modal_status_sub === '2'">
                    <b-row>
                        <b-col sm="6" lg="6" class="mb-3">
                          房间类型：
                        </b-col>
                        <b-col sm="6" lg="6" class="mb-3">
                          桌号：
                        </b-col>
                        <b-col sm="12" lg="12">
                          <b-tabs class="mb-3">
                            <b-tab title="小程序预约" active>
                              <b-col sm="12" lg="12">
                                <b-input-group class="mb-3">
                                  <b-input-group-prepend><b-input-group-text>预约编号</b-input-group-text></b-input-group-prepend>
                                  <input type="text" class="form-control" placeholder="输入预约编号"  v-model="username" />
                                </b-input-group>
                              </b-col>
                            </b-tab>
                            <b-tab title="后台预约">
                              <b-row>
                                <b-col sm="6" lg="6" class="mb-3">
                                  <b-input-group class="mb-3">
                                    <b-input-group-prepend><b-input-group-text>用户</b-input-group-text></b-input-group-prepend>
                                    <input type="text" class="form-control" placeholder="用户手机号/扫码(选填)" autocomplete="用户手机号/扫码(选填)" v-model="username" />
                                  </b-input-group>
                                </b-col>
                                <b-col sm="6" lg="6" class="mb-3">
                                  <b-input-group class="mb-3">
                                    <b-input-group-prepend><b-input-group-text>人数</b-input-group-text></b-input-group-prepend>
                                    <input type="text" class="form-control" placeholder="输入人数"  v-model="username" />
                                  </b-input-group>
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col sm="6" lg="6" class="mb-3">
                                  <b-input-group class="mb-3">
                                    <b-input-group-prepend><b-input-group-text>预约时间</b-input-group-text></b-input-group-prepend>
                                    <date-picker v-model="date" :config="options"></date-picker>
                                  </b-input-group>
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col sm="12" lg="12" class="mb-3">
                                  <b-input-group class="mb-3">
                                    <b-input-group-prepend><b-input-group-text>备注</b-input-group-text></b-input-group-prepend>
                                    <textarea class="form-control"></textarea>
                                  </b-input-group>
                                </b-col>
                              </b-row>
                            </b-tab>
                          </b-tabs>
                        </b-col>

                    </b-row>
                    <b-row class="mb-3">
                        <b-col sm="4" lg="4" >
                            <b-btn variant="secondary" class="btn-block" @click="modal_status_sub='1'">取消</b-btn>
                        </b-col>
                        <b-col sm="4" lg="4" >
                        </b-col>
                        <b-col sm="4" lg="4" >
                            <b-btn variant="primary" class="btn-block">确认预约</b-btn>
                        </b-col>
                    </b-row>
                </div>
                <div v-if="modal_status_sub === '3'">
                    <div class="mb-3" style="border-bottom:#ccc 1px solid; padding-bottom:20px">
                      <b-row>
                        <b-col sm="3" lg="3" style="line-height: 35px">预约信息</b-col>
                        <b-col sm="5" lg="5"></b-col>
                        <b-col sm="3" lg="3">
                          <b-btn variant="primary" class="float-right">修改</b-btn>
                          <b-btn variant="primary" class="mr-2 float-right">转台</b-btn>
                        </b-col>
                      </b-row>
                    </div>
                    <b-row class="mb-3">
                        <b-col sm="6" lg="6">预约编号：</b-col>
                        <b-col sm="6" lg="6" >预约人：</b-col>
                    </b-row>
                    <b-row class="mb-3">
                      <b-col sm="6" lg="6">用户：</b-col>
                      <b-col sm="6" lg="6" >用户类型：</b-col>
                    </b-row>
                    <b-row class="mb-3">
                      <b-col sm="6" lg="6">人数：</b-col>
                      <b-col sm="6" lg="6" >预约时间：</b-col>
                    </b-row>
                    <b-row class="mb-5">
                      <b-col sm="12" lg="12">备注：</b-col>
                    </b-row>
                    <b-row class="mb-3">
                        <b-col sm="4" lg="4" >
                            <b-btn variant="primary" class="btn-block">预约开单</b-btn>
                        </b-col>
                        <b-col sm="4" lg="4" >
                            <b-btn variant="primary" class="btn-block">取消预约</b-btn>
                        </b-col>
                        <b-col sm="4" lg="4" >
                            <b-btn variant="primary" class="btn-block">预约作废</b-btn>
                        </b-col>
                    </b-row>
                </div>
                <div v-if="modal_status_sub === '4'">

                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
    // Import this component
    import datePicker from 'vue-bootstrap-datetimepicker';

    // Import date picker css
    import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
    export default {
        name: 'home',
        components: {
            datePicker
        },
        data: () => {
            return {
                seats: [],
                seat_status_modal: false,
                modal_status_order: '1',
                modal_status_sub: '1',
                modal_title: '',
                username: '',
                sub_date: '',
                status: -1,
                result1: null,
                seat: null,
                date: new Date(),
                room_type : 'all',
                options: {
                    format: 'HH:mm:ss',
                    useCurrent: true,
                    locale: 'zh'
                },
                statusOptions : [
                  {
                    text:'全部',
                    value: -1
                  },
                  {
                    text:'空闲',
                    value: 1
                  },
                  {
                    text:'已预约',
                    value: 2
                  },
                  {
                    text:'正在消费',
                    value: 3
                  },
                ]
            }
        },
        created () {
            let self = this;
            this.fetchData();
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData'
        },
        methods: {
            fetchData: function () {
                let self = this;
                let shop_id = localStorage.getItem('default_shop_id');
                if ('shop_id' in self.$route.query) {
                    shop_id = self.$route.query.shop_id;
                }
                self.$http.get(`/api/admin/shop/seats/list?shop_id=${shop_id}&room_type=${self.room_type}&status=${self.status}`).then((response) => {
                    if (response.body.code === 0){
                        let list = response.body.data;
                        self.seats = response.body.data;
                    }
                    else {
                        window.toast.error({title:"网络错误"});
                    }
                })
            },
            randBg: function (sub_status, con_status) {
                if (sub_status === -1 && con_status === -1) {
                    return 'bg-secondary';
                }
                else if (sub_status === 1 && con_status === -1) {
                    return 'bg-info';
                }
                else if (sub_status === -1 && con_status === 1) {
                    return 'bg-danger';
                }
                else if (sub_status === 1 && con_status === 1) {
                    return 'bg-danger';
                }
            },
            randStatus: function (sub_status, con_status) {
                if (sub_status === -1 && con_status === -1) {
                    return '空闲';
                }
                else if (sub_status === 1 && con_status === -1) {
                    return '已预约';
                }
                else if (con_status === 1) {
                    return '消费中';
                }
            },
            randSubDate: function (dataStr) {

                if (!dataStr){
                    return '无预约';
                }
                else {
                    let today = window.moment().format('YY-MM-DD');
                    let sub_day = window.moment(dataStr).format('YY-MM-DD');

                    let str = '';

                    str = '预约时间：'+window.moment(dataStr).format('HH:mm:ss');

                    return str;

                }
            },

            randerSubDateIsPass: function (dataStr) {
                let isPass = new Date(window.moment().format('YYYY-MM-DD HH:mm:ss')).getTime() - new Date(window.moment(dataStr).format('YYYY-MM-DD HH:mm:ss')).getTime();
                if (isPass >= 0) {
                    return "已到达预约时间";
                }
                else {
                    return ""
                }
            },

            showModal: function (room, seat) {
                this.modal_title = room.room_type +'-' + room.roomname + '-' + seat.seatname;

                if (seat.sub_status === -1 && seat.con_status === -1) {
                    this.ModalStatus(seat,'kx');
                }
                else if (seat.sub_status === 1 && seat.con_status === -1) {
                    this.ModalStatus(seat, 'subed');
                }
                else if (seat.sub_status === -1 && seat.con_status === 1) {
                    this.ModalStatus(seat, 'ordered');
                }
                else if (seat.sub_status === 1 && seat.con_status === 1) {
                    this.ModalStatus(seat, 'order_sub');
                }
            },

            ModalStatus: function (seat,status) {
                let self = this;

                if (typeof seat === 'string') {
                    status = seat;
                    seat = self.seat;
                }
                else {
                    self.seat = seat;
                }

                switch(status){
                    case 'kx':
                        self.modal_status_order = '1';
                        self.modal_status_sub = '1';
                        self.seat_status_modal = true;
                        break;
                    case 'ordered':
                        self.modal_status_order = '3';
                        self.modal_status_sub = '1';
                        self.seat_status_modal = true;
                        break;
                    case 'order_sub':
                        self.modal_status_order = '3';
                        self.modal_status_sub = '3';
                        self.seat_status_modal = true;
                        break;
                    case 'subed':
                        self.modal_status_order = '1';
                        self.modal_status_sub = '3';
                        self.seat_status_modal = true;
                }
            },

            changeRoomType (type) {
              this.room_type = type;
              this.fetchData();
            },

            refreshData () {
              this.fetchData();
            },

            changeStatus (e) {
              this.status = e;
              this.fetchData();
            },

            postOrder: function (){
                alert(111);
            }
        }
    }
</script>
