<template>
    <div class="animated fadeIn">
        <b-row v-for="(item, index) in seats" :key="index">
            <b-col sm="12" lg="12">
                <h1>{{ item.name }}</h1>
            </b-col>
            <b-col sm="6" lg="3" v-for="(seat, idx) in item.list" :key="idx">
                <b-card no-body :class="randBg(seat.sub_status, seat.con_status)" style="min-height:190px" @click="showModal(seat)">
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
        <b-modal ref='SeatStatus' hide-footer :title="modal_title" v-model="seat_status_modal">
            <div style="border-bottom:#999 1px solid; padding-bottom:20px" class="mb-3">
                <div v-if="modal_status_order === '1'">
                    <b-row>
                        <b-col sm="2" lg="2">
                        </b-col>
                        <b-col sm="8" lg="8">
                            <b-btn class="mt-3 btn-lg" variant="primary" block @click="modal_status_order='2'">点单</b-btn>
                        </b-col>
                        <b-col sm="2" lg="2">
                        </b-col>
                    </b-row>
                </div>
                <div v-if="modal_status_order === '2'">
                    <b-row>
                        <b-col sm="12" lg="12">
                            <p class="text-muted">用户(选填)</p>
                            <b-input-group class="mb-3">
                                <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                                <input type="text" class="form-control" placeholder="用户手机号/扫码" autocomplete="用户手机号/扫码" v-model="username" />
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
                            <b-btn class="mt-3 btn-lg" variant="primary" block @click="modal_status_sub='2'">预约</b-btn>
                        </b-col>
                        <b-col sm="2" lg="2">
                        </b-col>
                    </b-row>
                </div>
                <div v-if="modal_status_sub === '2'">
                    <b-row>
                        <b-col sm="12" lg="12">
                            <p class="text-muted">用户</p>
                            <b-input-group class="mb-3">
                                <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                                <input type="text" class="form-control" placeholder="用户手机号/扫码" autocomplete="用户手机号/扫码" v-model="username" />
                            </b-input-group>
                            <p class="text-muted">时间</p>
                            <b-input-group class="mb-3">
                                <date-picker v-model="date" :config="options"></date-picker>
                            </b-input-group>
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
                    <b-row class="mb-3">
                        <b-col sm="2" lg="2"></b-col>
                        <b-col sm="4" lg="4" >状态：</b-col>
                        <b-col sm="4" lg="4" >已预约</b-col>
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
                        <b-col sm="4" lg="4" >预约时间：</b-col>
                        <b-col sm="4" lg="4" >xxx</b-col>
                        <b-col sm="2" lg="2"></b-col>
                    </b-row>
                    <b-row class="mb-5">
                        <b-col sm="2" lg="2"></b-col>
                        <b-col sm="4" lg="4" >预约编号</b-col>
                        <b-col sm="4" lg="4" >xxx</b-col>
                        <b-col sm="2" lg="2"></b-col>
                    </b-row>
                    <b-row class="mb-3">
                        <b-col sm="4" lg="4" >
                            <b-btn variant="secondary" class="btn-block" @click="seat_status_modal = false">取消</b-btn>
                        </b-col>
                        <b-col sm="4" lg="4" >
                            <b-btn variant="primary" class="btn-block">预约生效</b-btn>
                        </b-col>
                        <b-col sm="4" lg="4" >
                            <b-btn variant="primary" class="btn-block">取消预约</b-btn>
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
                result1: null,
                seat: null,
                date: new Date(),
                options: {
                    format: 'HH:mm:ss',
                    useCurrent: true,
                    locale: 'zh'
                }    
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
                let shop_id = localStorage.getItem('shop_id');
                if ('shop_id' in self.$route.query) {
                    shop_id = self.$route.query.shop_id;
                }
                self.$http.get(`/api/admin/shop/seats/list?shop_id=${shop_id}`).then((response) => {
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
                    return 'bg-default';
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
                else if (sub_status === -1 && con_status === 1) {
                    return '消费中';
                }
                else if (sub_status === 1 && con_status === 1) {
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

            showModal: function (seat) {
                this.modal_title = seat.seatname;

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

            postOrder: function (){
                alert(111);
            }
        }
    }
</script>