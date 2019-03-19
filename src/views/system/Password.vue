<template>
  <div class="animated fadeIn">
    <b-card :header="$t('password.title')">
      <b-row class="mb-3">
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('password.o_password')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('password.o_password')" autocomplete="job name" v-model="oPassword" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('password.password')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('password.password')" autocomplete="job name" v-model="password" />
          </b-input-group>
        </b-col>
        <b-col sm="12" lg="12" class="mb-2">
          <b-input-group>
            <b-input-group-prepend><b-input-group-text>{{$t('password.c_password')}}：</b-input-group-text></b-input-group-prepend>
            <input type="text" class="form-control" :placeholder="$t('password.c_password')" autocomplete="job name" v-model="cPassword" />
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="12" lg="12">
          <button class="btn btn-primary float-right" @click="doSave">{{$t('password.btn_save')}}</button>
        </b-col>
      </b-row>

    </b-card>
  </div>
</template>

<script>
    export default {
        name: "Password",
        data () {
          return {
            oPassword : "",
            password: "",
            cPassword: ""
          }
        },
        methods: {
          doSave() {
            let self = this;

            if (self.oPassword === "" || self.password === '' || self.cPassword === '' || self.password !== self.cPassword) {
              window.toast.error({title:"Password Error"});
              return ;
            }

            self.$http.post('/api/admin/adminuser/password', {
              o_password: self.oPassword,
              password: self.password,
              c_password: self.cPassword
            }).then((response) => {
              if (response.body.code === 0)
              {
                window.toast.success({title:self.$i18n.messages[self.$i18n.locale].commen.success});
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
