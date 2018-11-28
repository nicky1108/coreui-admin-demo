<template>
    <div class="animated fadeIn">
        <b-card header="会员信息">
            <b-row class="mb-3">
                <b-col sm="6" lg="6" >管理账号：{{ user.username }}</b-col>
                <b-col sm="6" lg="6" >管理角色：{{ user.role }}</b-col>
            </b-row>
            <b-row class="mb-3">
                <b-col sm="6" lg="6" >注册时间：{{ user.gmt_create | dateformat() }}</b-col>
                <b-col sm="6" lg="6" >最后登录时间{{ expireDate(user.gmt_vip_expire) }}</b-col>
            </b-row>
            <b-row class="mb-3">
                <b-col sm="4" lg="4" >账户余额：{{ user.balance }}</b-col>
                <b-col sm="4" lg="4" >消费次数：{{ user.order_count }}</b-col>
                <b-col sm="4" lg="4" >预约/违约次数：{{ user.sub_count }}/{{ user.wy_count }}</b-col>
            </b-row>
        </b-card>
        <b-card header="账户流水">
            <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage">
                
            </b-table>
        </b-card>
    </div>
    
</template>
<script>
export default {
    name: 'viphome',
    
    data: () => {
        return {
            currentPage: 1,
            perPage: 10,
            totalRows: 0,
            user: {},
            ajaxPage: 0,
            items: [
            ],
            fields: [
            ]
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
        
        getData (page) {
            let self = this;
            
            let id = null;
            if ('id' in self.$route.query) {
                id = self.$route.query.id;
            }

            if (!id)
            {
                return;
            }
            
            self.$http.get(`/api/admin/user/${id}`).then(response => {
                if (response.body.code === 0)
                {
                    self.user = response.body.data;
                }
            })
        },

        expireDate(date) {
            let expireDate = new Date(date);
            let nowDate = new Date();

            let day = Math.floor((expireDate.getTime() - nowDate.getTime()) / 1000 / 60 / 60 / 24);
            return window.moment(date).format('YYYY-MM-DD HH:mm:ss') + '（' + day + '天）';
        }
    }
}    
</script>