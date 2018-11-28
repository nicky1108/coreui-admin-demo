<template>
    <div class="animated fadeIn">
        <div class="row mb-2">
            <div class="mb-10 mb-xl-0 col-sm-10 col-md-10 col-xl col-10"></div>
            <div class="col-2"><button type="button" class="btn btn-primary btn-block" @click="doSetting('new')">添加配置</button></div>
        </div>
        <b-card header="配置列表">
            <b-table :hover="true" :striped="true" responsive="sm" :items="items" :fields="fields">
                <!--<template slot="json_value" slot-scope="data">-->
                    <!--<pre>{{ data.item.json_value }}</pre>-->
                <!--</template>-->
                <template slot="setting" slot-scope="data">
                    <b-button v-for="btn in data.item.setting" :key="btn" :variant="getButtons(btn)" class="ml-2 float-right" @click="doSetting(btn, data.item)" >{{btn}}</b-button>
                </template>
            </b-table>
        </b-card>

        <b-modal :title="modal_title" size="lg" v-model="myModal" @ok="postConfig">
            <b-input-group class="mb-3">
            <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" placeholder="Key" autocomplete="job name" v-model="config_keyname" />
            </b-input-group>
          <codemirror class="mb-4" ref="vueCm" v-model="config_json" :options="editorOption"></codemirror>
        </b-modal>
    </div>
</template>
<script>
import Vue from 'vue'
import VueCodeMirror from 'vue-codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
// import 'codemirror/theme/eclipse.css'
// import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
Vue.use(VueCodeMirror);

export default {
    name: 'system_config',
    components: {
      VueCodeMirror
    },
    data: () => {
        return {
            modal_title: '新建配置',
            config_keyname: '',
            config_json: '',
            edit_id: null,
            myModal: false,
            editorOption: {
              tabSize: 4,
              styleActiveLine: true,
              lineNumbers: true,
              lineWrapping: true,
              line: true,
              mode: 'javascript',
              theme: 'material',
              autofocus: false
            },
            items: [
            ],
            fields: [
                {
                    "keyname": "Key"
                },
                {
                    "setting": "操作"
                }
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

            self.$http.get(`/api/admin/config/list`).then(response => {
                if (response.body.code === 0)
                {
                    let list = response.body.data;
                    for(let i = 0; i < list.length; i ++){
                        list[i]['setting'] = ['修改'];
                    }

                    self.items = list;
                }
            })
        },

        getButtons (setting) {

            return setting === '修改' ? 'primary'
                : setting === '删除' ? 'danger' : 'primary'
        },

        postConfig() {
            let self = this;
            self.$http.post(`/api/admin/config/post`, {
                id: self.edit_id,
                keyname: self.config_keyname,
                json_value: self.config_json
            }).then(response => {
                if (response.body.code === 0)
                {
                    window.toast.success({title:"操作成功"});
                    self.getData();
                }
                else {
                    window.toast.error({title:"网络错误"});
                }
            })
        },

        doSetting (btn, item) {
            if (btn === '修改') {
                this.modal_title = '修改配置';
                this.config_keyname = item.keyname;
                this.config_json = item.json_value;
                this.edit_id = item.id;
                this.myModal = true;
            }
            else if (btn === 'new') {
                this.modal_title = '新建配置';
                this.config_keyname = '';
                this.config_json = '{}';
                this.edit_id = null;
                this.myModal = true;
            }
        }
    }
}
</script>
