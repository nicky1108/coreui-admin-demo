<template>
    <div class="animated fadeIn">
        <b-row class="mb-3">
          <b-col sm="3" lg="3">
            <div role="group" class="btn-group">
              <button type="button" :class="room_type === 'all' ? 'btn btn-primary' : 'btn btn-secondary'" @click="changeRoomType('all')">全部</button>
              <button type="button" :class="room_type === '散座' ? 'btn btn-primary' : 'btn btn-secondary'" @click="changeRoomType('散座')">大厅</button>
              <button type="button" :class="room_type === '包厢' ? 'btn btn-primary' : 'btn btn-secondary'" @click="changeRoomType('包厢')">包厢</button>
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
                  <p style="color:black; height:42px" >{{ seat.sub_data ? randSubDate(seat.sub_data.gmt_sub_con) : ''}}</p>
                  <p style="color:red; height:16px">{{ seat.sub_data ? randerSubDateIsPass(seat.sub_data.gmt_sub_con) : ''}}</p>
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
                          房间类型：{{selectRoom.room_type}}
                        </b-col>
                        <b-col sm="6" lg="6" class="mb-3">
                          桌号：{{selectSeat.seatname}}
                        </b-col>
                        <b-col sm="6" lg="6" class="mb-3">
                            <b-input-group class="mb-3">
                              <b-input-group-prepend><b-input-group-text>用户</b-input-group-text></b-input-group-prepend>
                              <input type="text" class="form-control" placeholder="用户手机号/扫码(选填)" autocomplete="用户手机号/扫码(选填)" v-model="newOrder.phone" />
                            </b-input-group>
                        </b-col>
                        <b-col sm="6" lg="6" class="mb-3">
                          <b-input-group class="mb-3">
                            <b-input-group-prepend><b-input-group-text>人数</b-input-group-text></b-input-group-prepend>
                            <input type="text" class="form-control" placeholder="输入人数"  v-model="newOrder.p_number" />
                          </b-input-group>
                        </b-col>
                        <b-col sm="6" lg="6" class="mb-3">
                          <b-input-group class="mb-3">
                            <b-input-group-prepend><b-input-group-text>开单时间</b-input-group-text></b-input-group-prepend>
                            <date-picker v-model="newOrder.create" :config="options"></date-picker>
                          </b-input-group>
                        </b-col>
                        <b-col sm="12" lg="12" class="mb-3">
                          <b-input-group class="mb-3">
                            <b-input-group-prepend><b-input-group-text>备注</b-input-group-text></b-input-group-prepend>
                            <textarea class="form-control" v-model="newOrder.remark"></textarea>
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
                            <b-btn variant="primary" class="btn-block" @click="createOrder">确认下单</b-btn>
                        </b-col>
                    </b-row>
                </div>
                <div v-if="modal_status_order === '3'">
                  <div class="mb-3" style="border-bottom:#ccc 1px solid; padding-bottom:20px">
                    <b-row>
                      <b-col sm="3" lg="3" style="line-height: 35px">开单信息</b-col>
                      <b-col sm="5" lg="5"></b-col>
                      <b-col sm="3" lg="3">
                        <b-btn v-if="orderEdit === false" variant="primary" class="float-right" @click="orderEdit = true">修改</b-btn>
                        <b-btn v-if="orderEdit === true" variant="success" class="float-right" @click="saveOrder">保存</b-btn>
                        <b-btn variant="primary" class="mr-2 float-right" @click="modal_status_order = '4'">转台</b-btn>
                      </b-col>
                    </b-row>
                  </div>
                  <b-row class="mb-3">
                    <b-col sm="6" lg="6">
                      <b-input-group>
                        <b-input-group-prepend><b-input-group-text>用户名</b-input-group-text></b-input-group-prepend>
                        <input type="text" class="form-control" placeholder="用户名" :disabled="!orderEdit"  v-model="order_data.phone" />
                      </b-input-group>
                    </b-col>
                    <b-col sm="6" lg="6" >用户类型：{{order_data.levelname}}</b-col>
                  </b-row>
                  <b-row class="mb-3">
                    <b-col sm="6" lg="6">
                      <b-input-group>
                        <b-input-group-prepend><b-input-group-text>人数</b-input-group-text></b-input-group-prepend>
                        <input type="text" class="form-control" placeholder="人数" :disabled="!orderEdit"  v-model="order_data.p_number" />
                      </b-input-group>
                    </b-col>
                    <b-col sm="6" lg="6" >开单时间：{{order_data.gmt_create | dateformat()}}</b-col>
                  </b-row>
                  <b-row class="mb-3">
                    <b-col sm="12" lg="12">
                      <b-input-group>
                        <b-input-group-prepend><b-input-group-text>备注</b-input-group-text></b-input-group-prepend>
                        <textarea class="form-control" :disabled="!orderEdit" v-model="order_data.remark"></textarea>
                      </b-input-group>
                    </b-col>
                  </b-row>
                  <b-row class="mb-3">
                    <b-col sm="8" lg="8">
                      <b-input-group>
                        <b-input-group-prepend><b-input-group-text>商品消费</b-input-group-text></b-input-group-prepend>
                        <input type="text" class="form-control" placeholder="输入商品消费金额"  v-model="order_data.con_price" />
                      </b-input-group>
                    </b-col>
                  </b-row>
                  <b-row class="mb-3">
                    <b-col sm="6" lg="6">包间费用：{{mathRoomPrice().price}}</b-col>
                    <b-col sm="6" lg="6" >服务费用：{{mathServicePrice()}}</b-col>
                  </b-row>
                  <b-row class="mb-3">
                    <b-col sm="12" lg="12">
                      <b-table :hover="true" :striped="true" responsive="sm" :items="orderBxItems" :fields="orderBxFields">

                      </b-table>
                    </b-col>
                  </b-row>
                    <b-row class="mb-3">
                        <b-col sm="4" lg="4" >
                        </b-col>
                        <b-col sm="4" lg="4" >
                        </b-col>
                        <b-col sm="4" lg="4" >
                            <b-btn variant="primary" class="btn-block" @click="showPayOrderModal">结账</b-btn>
                        </b-col>
                    </b-row>
                </div>
                <div v-if="modal_status_order === '4'">
                    <b-row class="mb-5">
                      <b-col sm="12" lg="12">
                        <b-input-group>
                          <b-input-group-prepend><b-input-group-text>转移到</b-input-group-text></b-input-group-prepend>
                          <b-form-select @change="changeOrderSeat" :value="orderSeat" id="orderSeat"
                                         :plain="true"
                                         :options="orderSeatsOptions">
                          </b-form-select>
                        </b-input-group>
                      </b-col>
                    </b-row>
                  <b-row class="mb-3">
                    <b-col sm="4" lg="4" >
                      <b-btn variant="secondary" class="btn-block" @click="modal_status_order='3'">取消</b-btn>
                    </b-col>
                    <b-col sm="4" lg="4" >
                    </b-col>
                    <b-col sm="4" lg="4" >
                      <b-btn variant="primary" class="btn-block" @click="saveOrderSeat">确定</b-btn>
                    </b-col>
                  </b-row>
                </div>
                <div v-if="modal_status_order === '5'">
                  <b-row class="mb-3">
                    <b-col sm="6" lg="6">
                      用户名：{{order_data.phone}}
                    </b-col>
                    <b-col sm="6" lg="6" >用户类型：{{order_data.levelname}}</b-col>
                  </b-row>
                  <b-row class="mb-3">
                    <b-col sm="6" lg="6">
                      余额：{{order_data.balance}}
                    </b-col>
                    <b-col sm="6" lg="6" >开单时间：{{order_data.gmt_create | dateformat()}}</b-col>
                  </b-row>
                  <b-row class="mb-3">
                    <b-col sm="12" lg="12">
                      <b-table :hover="true" :striped="true" responsive="sm" :items="orderPayTableItems" :fields="orderPayTableFields">

                      </b-table>
                    </b-col>
                  </b-row>
                  <b-row class="mb-3">
                    <b-col sm="6" lg="6">
                    </b-col>
                    <b-col sm="6" lg="6" >
                      <b-input-group>
                        <b-input-group-prepend><b-input-group-text>手动优惠</b-input-group-text></b-input-group-prepend>
                        <input type="text" class="form-control" placeholder="输入手动优惠金额" v-model="order_data.discounts" @keyup="updateDiscounts" />
                      </b-input-group>
                    </b-col>
                  </b-row>
                  <b-row class="mb-3">
                    <b-col sm="6" lg="6">
                    </b-col>
                    <b-col sm="6" lg="6" style="text-align: right">
                      最终消费：{{total_price}}
                    </b-col>
                  </b-row>
                  <b-row class="mb-3">
                    <b-col sm="12" lg="12">
                      支付方式
                      <div role="group" class="btn-group">
                        <button type="button" :class="order_data.pay_type === 4 ? 'btn btn-primary' : 'btn btn-secondary'" @click="order_data.pay_type = 4">世胄账户</button>
                        <button type="button" :class="order_data.pay_type === 1 ? 'btn btn-primary' : 'btn btn-secondary'" @click="order_data.pay_type = 1">微信</button>
                        <button type="button" :class="order_data.pay_type === 2 ? 'btn btn-primary' : 'btn btn-secondary'" @click="order_data.pay_type = 2">支付宝</button>
                        <button type="button" :class="order_data.pay_type === 3 ? 'btn btn-primary' : 'btn btn-secondary'" @click="order_data.pay_type = 3">现金</button>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row class="mb-3">
                    <b-col sm="12" lg="12">
                      <b-input-group>
                        <b-input-group-prepend><b-input-group-text>备注</b-input-group-text></b-input-group-prepend>
                        <textarea class="form-control" v-model="order_data.remark"></textarea>
                      </b-input-group>
                    </b-col>
                  </b-row>
                  <b-row class="mb-5">
                    <b-col sm="12" lg="12">
                      <b-form-checkbox :plain="true" value="1" @change="orderFreeCheck">免单</b-form-checkbox>
                    </b-col>
                  </b-row>
                  <b-row class="mb-3">
                    <b-col sm="4" lg="4" >
                      <b-btn variant="secondary" class="btn-block" @click="modal_status_order='3'">取消</b-btn>
                    </b-col>
                    <b-col sm="4" lg="4" >
                    </b-col>
                    <b-col sm="4" lg="4" >
                      <b-btn variant="primary" class="btn-block" @click="payOrder">买单</b-btn>
                    </b-col>
                  </b-row>
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
                          房间类型：{{selectRoom.room_type}}
                        </b-col>
                        <b-col sm="6" lg="6" class="mb-3">
                          桌号：{{selectSeat.seatname}}
                        </b-col>
                        <b-col sm="12" lg="12">
                          <b-tabs class="mb-3">
                            <b-tab title="小程序预约" active>
                              <b-col sm="12" lg="12">
                                <b-input-group class="mb-3">
                                  <b-input-group-prepend><b-input-group-text>预约编号</b-input-group-text></b-input-group-prepend>
                                  <input type="text" class="form-control" placeholder="输入预约编号"  v-model="newSub.sub_code" />
                                </b-input-group>
                              </b-col>
                            </b-tab>
                            <b-tab title="后台预约">
                              <b-row>
                                <b-col sm="6" lg="6" class="mb-3">
                                  <b-input-group class="mb-3">
                                    <b-input-group-prepend><b-input-group-text>用户</b-input-group-text></b-input-group-prepend>
                                    <input type="text" class="form-control" placeholder="用户手机号/扫码(选填)" autocomplete="用户手机号/扫码(选填)" v-model="newSub.phone" />
                                  </b-input-group>
                                </b-col>
                                <b-col sm="6" lg="6" class="mb-3">
                                  <b-input-group class="mb-3">
                                    <b-input-group-prepend><b-input-group-text>人数</b-input-group-text></b-input-group-prepend>
                                    <input type="text" class="form-control" placeholder="输入人数"  v-model="newSub.p_number" />
                                  </b-input-group>
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col sm="6" lg="6" class="mb-3">
                                  <b-input-group class="mb-3">
                                    <b-input-group-prepend><b-input-group-text>预约时间</b-input-group-text></b-input-group-prepend>
                                    <date-picker v-model="newSub.create" :config="options"></date-picker>
                                  </b-input-group>
                                </b-col>
                              </b-row>
                              <b-row>
                                <b-col sm="12" lg="12" class="mb-3">
                                  <b-input-group class="mb-3">
                                    <b-input-group-prepend><b-input-group-text>备注</b-input-group-text></b-input-group-prepend>
                                    <textarea class="form-control" v-model="newSub.remark"></textarea>
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
                            <b-btn variant="primary" class="btn-block" @click="createSub">确认预约</b-btn>
                        </b-col>
                    </b-row>
                </div>
                <div v-if="modal_status_sub === '3'">
                    <div class="mb-3" style="border-bottom:#ccc 1px solid; padding-bottom:20px">
                      <b-row>
                        <b-col sm="3" lg="3" style="line-height: 35px">预约信息</b-col>
                        <b-col sm="5" lg="5"></b-col>
                        <b-col sm="3" lg="3">
                          <b-btn v-if="subEdit === false" variant="primary" class="float-right" @click="subEdit = true">修改</b-btn>
                          <b-btn v-if="subEdit === true" variant="success" class="float-right" @click="saveSub">保存</b-btn>
                          <b-btn variant="primary" class="mr-2 float-right" @click="modal_status_sub = '4'">转台</b-btn>
                        </b-col>
                      </b-row>
                    </div>
                    <b-row class="mb-3">
                        <b-col sm="6" lg="6">预约编号：{{sub_data.sub_code}}</b-col>
                        <b-col sm="6" lg="6" >预约人：{{sub_data.phone}}</b-col>
                    </b-row>
                    <b-row class="mb-3">
                      <b-col sm="6" lg="6">用户：{{sub_data.phone}}</b-col>
                      <b-col sm="6" lg="6" >用户类型：{{sub_data.levelname}}</b-col>
                    </b-row>
                    <b-row class="mb-3">
                      <b-col sm="6" lg="6">
                        <b-input-group>
                          <b-input-group-prepend><b-input-group-text>人数</b-input-group-text></b-input-group-prepend>
                          <input type="text" class="form-control" placeholder="人数" :disabled="!subEdit"  v-model="sub_data.p_number" />
                        </b-input-group>
                      </b-col>
                      <b-col sm="6" lg="6" >
                        <b-input-group class="mb-3">
                          <b-input-group-prepend><b-input-group-text>预约时间</b-input-group-text></b-input-group-prepend>
                          <date-picker v-model="sub_data.sub_date" :config="options" :disabled="!subEdit"></date-picker>
                        </b-input-group>
                      </b-col>
                    </b-row>
                    <b-row class="mb-5">
                      <b-col sm="12" lg="12">
                        <b-input-group class="mb-3">
                          <b-input-group-prepend><b-input-group-text>备注</b-input-group-text></b-input-group-prepend>
                          <textarea class="form-control" :disabled="!subEdit" v-model="sub_data.remark"></textarea>
                        </b-input-group>
                      </b-col>
                    </b-row>
                    <b-row class="mb-3">
                        <b-col sm="4" lg="4" >
                            <b-btn variant="primary" class="btn-block" @click="openSubOrder" v-if="!order_data">预约开单</b-btn>
                        </b-col>
                        <b-col sm="4" lg="4" ></b-col>
                        <b-col sm="4" lg="4">
                            <b-btn variant="primary" class="btn-block" v-if="randerSubDateIsPass(sub_data.gmt_sub_con) !== ''" @click="showCancleModal">取消预约</b-btn>
                            <b-btn variant="primary" class="btn-block" v-if="randerSubDateIsPass(sub_data.gmt_sub_con) === ''" @click="showBlockModal">预约作废</b-btn>
                        </b-col>
                    </b-row>
                </div>
                <div v-if="modal_status_sub === '4'">
                  <b-row class="mb-5">
                    <b-col sm="12" lg="12">
                      <b-input-group>
                        <b-input-group-prepend><b-input-group-text>转移到</b-input-group-text></b-input-group-prepend>
                        <b-form-select @change="changeSubSeat" :value="subSeat" id="subSeat"
                                       :plain="true"
                                       :options="subSeatsOptions">
                        </b-form-select>
                      </b-input-group>
                    </b-col>
                  </b-row>
                  <b-row class="mb-3">
                    <b-col sm="4" lg="4" >
                      <b-btn variant="secondary" class="btn-block" @click="modal_status_sub='3'">取消</b-btn>
                    </b-col>
                    <b-col sm="4" lg="4" >
                    </b-col>
                    <b-col sm="4" lg="4" >
                      <b-btn variant="primary" class="btn-block" @click="saveSubSeat">确定</b-btn>
                    </b-col>
                  </b-row>
                </div>
            </div>
        </b-modal>
        <b-modal ref='confirmModal' class="modal-warning" :title="confirmModalTitle" v-model="confirmModal" @ok="cancelSub" ok-variant="warning" @cancel="hideConfirmModal">
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
        name: 'home',
        components: {
            datePicker
        },
        data: () => {
            return {
                shop_id: '',
                seats: [],
                newOrder: {},
                selectRoom: {},
                selectSeat: {},
                seat_status_modal: false,
                modal_status_order: '1',
                modal_status_sub: '1',
                modal_title: '',
                username: '',
                sub_date: '',
                sub_data: {},
                order_data: {},
                status: -1,
                result1: null,
                seat: null,
                date: new Date(),
                orderEdit: false,
                subEdit: false,
                room_type : 'all',
                orderBxItems:[],
                orderBxFields:[],
                orderPayTableFields: [],
                orderPayTableItems: [],
                orderSeat: '',
                subSeat: '',
                newSub: {},
                confirmModal: false,
                confirmModalTitle:'预约作废',
                confirmModalText: '取消预约会影响用户信誉，确认取消预约吗？',
                total_price: 0,
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
                ],

                subSeatsOptions : [
                ],
                orderSeatsOptions : [
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
                self.shop_id = parseInt(shop_id);
               self.subSeatsOptions = [];
               self.orderSeatsOptions = [];
                self.$http.get(`/api/admin/shop/seats/list?shop_id=${shop_id}&room_type=${self.room_type}&status=${self.status}`).then((response) => {
                    if (response.body.code === 0){
                        let list = response.body.data;
                        self.seats = response.body.data;
                        
                        for (let i = 0; i < list.length; i ++) {
                          for (let j = 0; j < list[i].list.length; j ++ ) {
                            if (!list[i].list[j].sub_data) {
                              self.subSeatsOptions.push({
                                text: list[i].list[j].seatname,
                                value: list[i].list[j].id
                              })
                            }

                            if (!list[i].list[j].order_data) {
                              self.orderSeatsOptions.push({
                                text: list[i].list[j].seatname,
                                value: list[i].list[j].id
                              })
                            }

                          }
                        } 
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
              this.newOrder = {};
              this.sub_data = seat.sub_data;
              this.order_data = seat.order_data;
              this.selectRoom = room;
              this.selectSeat = seat;

              if (seat.sub_data) {
                  this.sub_data.sub_date = window.moment(this.sub_data.gmt_sub_con).format('HH:mm:ss');
                  this.subSeat = this.sub_data.seat_id;
                }

                if (seat.order_data) {
                  this.orderSeat = this.order_data.seat_id;

                  this.orderBxFields = [
                    {
                      seatname : '桌位名',
                    },
                    {
                      gmt_create: '开台时间',
                    },
                    {
                      enter_time: '入座时长',
                    },
                    {
                      rules_name: '计费规则',
                    },
                    {
                      bx_price: '包间费'
                    }
                  ];

                  this.orderBxItems = [
                    {
                      seatname: this.selectSeat.seatname,
                      gmt_create: window.moment(this.order_data.gmt_create).format('YYYY-MM-DD HH:mm:ss'),
                      enter_time: this.mathRoomPrice().time,
                      rules_name: this.selectRoom.rules.type_name,
                      bx_price: this.mathRoomPrice().price
                    }
                  ];
                }

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

            mathRoomPrice () {
              let openDate = this.order_data.gmt_create;
              let now = new Date().getTime();
              let openTime = new Date(openDate).getTime();
              let rules = this.selectRoom.rules;
              let seconds = (now - openTime) / 1000;
              let minutes = parseInt(seconds / 60);
              let hours = parseInt(minutes / 60);
              let over_minutes = minutes % 60;
              let price = 0;

              if (rules.type === '1') {
                if (hours * 60 + minutes <= rules.first_minutes) {
                  price = rules.first_price;
                }
                else {

                  if (over_minutes > 5) {
                    hours += 1;
                  }

                  price = rules.every_h_price * hours;
                }

                if (rules.is_max_price === 1) {
                  if (price > rules.max_price) {
                    price = rules.max_price
                  }
                }
              }
              else if (rules.type === '2') {
                if (hours * 60 + minutes <= rules.first_minutes) {
                  price = rules.first_price;
                }
                else {
                  if (hours < 5) {
                    price = rules.every_5h_price;
                  }
                  else {
                    price = rules.every_5h_price;
                    let cros_hours = hours - 5;

                    price += (cros_hours * rules.every_h_price);

                    if (over_minutes >= 25 && over_minutes < 45) {
                      price += rules.every_h_price * 0.5;
                    }
                    else if (over_minutes >= 45) {
                      price += rules.every_h_price * 1;
                    }
                  }
                }

                if (rules.is_max_price === 1) {
                  if (price > rules.max_price) {
                    price = rules.max_price
                  }
                }
              }

              this.order_data.bx_price = price;

              return {
                price: price,
                time: hours + '小时' + over_minutes + '分'
              };

            },

            mathServicePrice () {
              let openDate = this.order_data.gmt_create;
              let now = new Date().getTime();
              let openTime = new Date(openDate).getTime();
              let openHour = new Date(openDate).getHours();
              let openMinutes = new Date(openDate).getMinutes();
              let nowHour = new Date().getHours();
              let nowMinutes = new Date().getMinutes();
              let rules = this.selectRoom.rules;
              let seconds = (now - openTime) / 1000;
              let minutes = parseInt(seconds / 60);
              let hours = parseInt(minutes / 60);
              let over_minutes = minutes % 60;
              let price = 0;

              if (rules.type === '1') {
                let mathCloseHour = hours + openHour;
                let serviceHour = 0;
                if (openHour >= 0 && openHour <= 5) {
                  serviceHour += (5 - openHour);
                }
                if (mathCloseHour > 24) {
                  let day = parseInt(mathCloseHour / 24);
                  for (let i = 0; i < day; i ++) {
                    serviceHour += Math.min(6,mathCloseHour - 24);
                    mathCloseHour -= 24;
                  }
                }

                price = serviceHour * rules.plus_h_price
              }
              else if (rules.type === '2') {
                let mathCloseHour = hours + openHour;
                let serviceHour = 0;
                if (openHour >= 0 && openHour <= 5) {
                  serviceHour += (5 - openHour);

                  if (openMinutes >= 25 && openMinutes < 45) {
                    serviceHour += 0.5;
                  }
                  else if (openMinutes >= 45) {
                    serviceHour += 1;
                  }
                }

                if (nowMinutes >= 25 && nowMinutes < 45) {
                  mathCloseHour += 0.5;
                }
                else if (nowMinutes >= 45) {
                  mathCloseHour += 1;
                }

                if (mathCloseHour > 24) {
                  let day = parseInt(mathCloseHour / 24);
                  for (let i = 0; i < day; i ++) {
                    serviceHour += Math.min(9,mathCloseHour - 24);
                    mathCloseHour -= 24;
                  }
                }

                price = serviceHour * rules.plus_h_price

              }

              this.order_data.service_price = price;

              return price;
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

            changeOrderSeat (e) {
              this.orderSeat = e;
            },

            changeSubSeat (e) {
              this.subSeat = e;
            },

            createOrder: function (){
              let self = this;

              self.newOrder.shop_id = self.shop_id;
              self.newOrder.seat_id = self.selectSeat.id;

              if (!self.newOrder.create) {
                self.newOrder.gmt_create = window.moment().format('YYYY-MM-DD HH:mm:ss');
              }
              else {
                self.newOrder.gmt_create = window.moment().format('YYYY-MM-DD') + ' ' + self.newOrder.create;
              }

              if (!self.newOrder.p_number) {
                window.toast.error({title:"请填写人数"});
                return;
              }

              self.$http.post('/api/admin/order/seatCreateOrder', self.newOrder).then((response) => {
                if (response.body.code === 0){
                  window.toast.success({title:"开单成功"});
                  self.seat_status_modal = false;
                  self.fetchData();
                }
                else {
                  window.toast.error({title:response.body.errMsg});
                }
              }).catch((res) => {
                window.toast.error({title:"网络错误"});
              });
            },

            saveSub () {
              let self = this;
              self.subEdit = false;

              let today = window.moment().format('YYYY-MM-DD');

              if (self.sub_data.sub_date !== self.sub_data.gmt_sub_con && self.sub_data.sub_date.length < 10) {
                self.sub_data.gmt_sub_con = today + ' ' + self.sub_data.sub_date;
              }
              else {
                self.sub_data.gmt_sub_con = window.moment(self.sub_data.gmt_sub_con).format('YYYY-MM-DD HH:mm:ss');
              }

              self.$http.post('/api/admin/sub/update', {
                id: self.sub_data.id,
                p_number: self.sub_data.p_number,
                gmt_sub_con: self.sub_data.gmt_sub_con,
                remark: self.sub_data.remark
              }).then((response) => {
                if (response.body.code === 0){
                  window.toast.success({title:"修改成功"});
                }
                else {
                  window.toast.error({title:response.body.errMsg});
                }
              }).catch((res) => {
                window.toast.error({title:"网络错误"});
              });
            },

            saveOrder () {
              let self = this;
              this.orderEdit = false;

              self.$http.post('/api/admin/order/update', {
                id: self.order_data.id,
                p_number: self.order_data.p_number,
                phone: self.order_data.phone,
                remark: self.order_data.remark
              }).then((response) => {
                if (response.body.code === 0){
                  window.toast.success({title:"修改成功"});
                }
                else {
                  window.toast.error({title:response.body.errMsg});
                }
              }).catch((res) => {
                window.toast.error({title:"网络错误"});
              });
            },

            saveOrderSeat () {
              let self = this;
              self.$http.post('/api/admin/shop/seats/changeOrderSeat', {
                order_id: self.order_data.id,
                seat_id: self.orderSeat,
                shop_id: self.shop_id
              }).then((response) => {
                if (response.body.code === 0){
                  window.toast.success({title:"转台成功"});
                  self.seat_status_modal = false;
                  self.fetchData();
                }
                else {
                  window.toast.error({title:response.body.errMsg});
                }
              }).catch((res) => {
                window.toast.error({title:"网络错误"});
              });
            },

            saveSubSeat() {
              let self = this;
              self.$http.post('/api/admin/shop/seats/changeSubSeat', {
                sub_id: self.sub_data.id,
                seat_id: self.subSeat,
                shop_id: self.shop_id
              }).then((response) => {
                if (response.body.code === 0){
                  window.toast.success({title:"转台成功"});
                  self.seat_status_modal = false;
                  self.fetchData();
                }
                else {
                  window.toast.error({title:response.body.errMsg});
                }
              }).catch((res) => {
                window.toast.error({title:"网络错误"});
              });
            },
            openSubOrder() {
              let self = this;
              if (self.selectSeat.order_data) {
                window.toast.error({title:"该桌位已有消费中的订单"});
                return;
              }

              let subData = self.selectSeat.sub_data;


              self.newOrder = {};
              self.newOrder.phone = subData.phone;
              self.newOrder.p_number = subData.p_number+'';
              self.newOrder.sub_id = subData.id;
              self.newOrder.remark = subData.remark;
              self.newOrder.create = window.moment().format('HH:mm:ss');

              self.modal_status_order = '2';
            },

            createSub() {
              let self = this;

              self.newSub.shop_id = self.shop_id;
              self.newSub.seat_id = self.selectSeat.id;
              self.newSub.room_id = self.selectRoom.id;

              if (!self.newSub.create) {
                self.newSub.gmt_sub_con = window.moment().format('YYYY-MM-DD HH:mm:ss');
              }
              else {
                self.newSub.gmt_sub_con = window.moment().format('YYYY-MM-DD') + ' ' + self.newSub.create;
              }

              if ((!self.newSub.p_number || !self.newSub.phone) && !self.newSub.sub_code) {
                window.toast.error({title:"预约信息不全"});
                return;
              }

              self.$http.post('/api/admin/sub/seatCreateSub', self.newSub).then((response) => {
                if (response.body.code === 0){
                  window.toast.success({title:"预约成功"});
                  self.seat_status_modal = false;
                  self.fetchData();
                }
                else {
                  window.toast.error({title:response.body.errMsg});
                }
              }).catch((res) => {
                window.toast.error({title:"网络错误"});
              });
            },

            cancelSub () {
                let self = this;
                self.$http.post('/api/admin/sub/cancelSub', {
                  id: self.sub_data.id,
                  seat_id: self.selectSeat.id
                }).then((response) => {
                  if (response.body.code === 0){
                    window.toast.success({title:"取消/作废预约成功"});
                    self.seat_status_modal = false;
                    self.fetchData();
                  }
                  else {
                    window.toast.error({title:response.body.errMsg});
                  }
                }).catch((res) => {
                  window.toast.error({title:"网络错误"});
                });
            },

            showCancleModal () {
                let self = this;
                self.confirmModalTitle = '取消预约';
                self.confirmModalText = '取消预约会影响用户信誉，确认取消预约吗？';
                self.seat_status_modal = false;
                self.confirmModal = true;
            },

            showBlockModal () {
              let self = this;
              self.confirmModalTitle = '预约作废';
              self.confirmModalText = '预约时间之前取消，不影响用户信誉。';
              self.seat_status_modal = false;
              self.confirmModal = true;
            },

            hideConfirmModal () {
              let self = this;
              self.confirmModal = false;
              self.seat_status_modal = true;
            },

            showPayOrderModal () {
              this.orderPayTableFields = [
                {
                  price_type: '金额类型',
                },
                {
                  price: '消费金额',
                },
                {
                  zk: '会员折扣',
                },
                {
                  ret_price: '实际消费'
                }
              ];
              let con_price = this.order_data.con_price ? parseFloat(this.order_data.con_price) : 0;
              let con_price_dis = con_price;
              let con_discount = 1;
              if (this.order_data.level_id in this.selectRoom.vip_discount.gfc_1.discount) {
                con_discount = this.selectRoom.vip_discount.gfc_1.discount[this.order_data.level_id];
                con_price_dis = con_discount * con_price;
              }

              let bx_price = this.mathRoomPrice().price;
              let bx_price_ret = bx_price;
              let bx_discount = 1;
              if (this.order_data.level_id in this.selectRoom.vip_discount.bj.discount) {
                bx_discount = this.selectRoom.vip_discount.bj.discount[this.order_data.level_id];
                bx_price_ret = bx_discount * bx_price;
              }

              let total = parseFloat(con_price) + parseFloat(bx_price) + parseFloat(this.mathServicePrice());
              let total_ret = total;

              let total_discount = 1;

              if (this.order_data.level_id in this.selectRoom.vip_discount.all.discount) {
                total_discount = this.selectRoom.vip_discount.all.discount[this.order_data.level_id];
                total_ret = total_discount * total;
              }
              else {
                total_ret = parseFloat(con_price_dis) + parseFloat(bx_price_ret) + parseFloat(this.mathServicePrice());
              }

              if (total_ret <= this.order_data.balance) {
                this.order_data.pay_type = 4;
                this.order_data.default_pay_type = 4;
              }
              else {
                this.order_data.pay_type = 3;
                this.order_data.default_pay_type = 3;
              }

              total = total > 0 ? total.toFixed(2): total;
              total_ret = total_ret > 0 ? total_ret.toFixed(2): total_ret;
              this.order_data.ret_total_price = total_ret;
              this.total_price = total_ret;

              this.orderPayTableItems = [
                {
                  price_type:'商品金额',
                  price: con_price.toFixed(2),
                  zk: con_discount === 1 ? '无' : parseFloat(con_discount*10).toFixed(1) + '折',
                  ret_price: con_price_dis.toFixed(2)
                },
                {
                  price_type:'包间消费',
                  price: bx_price.toFixed(2),
                  zk: bx_discount === 1 ? '无' : parseFloat(bx_discount*10).toFixed(1) + '折',
                  ret_price: bx_price_ret.toFixed(2)
                },
                {
                  price_type:'服务费',
                  price: this.mathServicePrice().toFixed(2),
                  zk: '无',
                  ret_price: this.mathServicePrice().toFixed(2)
                },
                {
                  price_type:'总额',
                  price: total,
                  zk: total_discount === 1 ? '无' : parseFloat(total_discount*10).toFixed(1) + '折',
                  ret_price: total_ret
                }
              ];
              this.modal_status_order = '5';
            },

            orderFreeCheck(e) {
                if (e) {
                  this.order_data.pay_type = 9;
                }
                else {
                  this.order_data.pay_type = this.order_data.default_pay_type;
                }
            },
            updateDiscounts(e) {
                let value = e.srcElement.value;
                if (value && parseFloat(value)) {
                  this.total_price = (parseFloat(this.order_data.ret_total_price) - parseFloat(value)).toFixed(2);
                }

            },

            payOrder () {
              let self = this;

              self.$http.post('/api/admin/order/update', {
                id: self.order_data.id,
                phone: self.order_data.phone,
                pay_type: self.order_data.pay_type,
                con_price: self.order_data.con_price,
                bx_price: self.order_data.bx_price,
                service_price: self.order_data.service_price,
                discounts: self.order_data.discounts,
                remark: self.order_data.remark,
                is_pay: 1,
                seat_id: self.selectSeat.id,
                price: self.total_price,
                o_price: self.order_data.ret_total_price
              }).then((response) => {
                if (response.body.code === 0){
                  window.toast.success({title:"结账成功"});
                  self.seat_status_modal = false;
                  self.fetchData();
                }
                else {
                  window.toast.error({title:response.body.errMsg});
                }
              }).catch((res) => {
                window.toast.error({title:"网络错误"});
              });
            }

        }
    }
</script>
