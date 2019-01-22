<template>
    <div class="animated fadeIn">
        <b-card header="会员类型">
            <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields">

            </b-table>
        </b-card>
    </div>
</template>
<script>
export default {
    name: 'viphome',
    
    data: () => {
        return {
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
            
            self.$http.get(`/api/admin/level/list`).then(response => {
                if (response.body.code === 0)
                {
                    self.fields = response.body.data.fields;
                    self.items = response.body.data.list;
                }
            })
        },


    }
}    
</script>
