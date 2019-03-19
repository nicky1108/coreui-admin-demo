<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form>
                  <h1>
                    {{$t('login.title')}}
                    <span class="span_lang" :class="lang === 'en' ? 'active': ''" @click.stop="changeLang('en')">EN</span>
                    <span class="span_lang" :class="lang === 'zh' ? 'active': ''" @click.stop="changeLang('zh')">中文</span>
                  </h1>
                  <p class="text-muted">{{$t('login.tips')}}</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                    <input type="text" class="form-control" :placeholder="$t('login.placeholder.username')" autocomplete="username email" v-model="username" />
                  </b-input-group>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                    <input type="password" class="form-control" :placeholder="$t('login.placeholder.username')" autocomplete="current-password" v-model="password"/>
                  </b-input-group>
                  <b-row>
                    <b-col cols="6">
                      <b-button variant="primary" class="px-4" @click="submit">{{$t('login.loginBtn')}}</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data : function () {
    return {
      username :'',
      password : '',
      lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'zh'
    }
  },

  methods : {
    submit : function () {
      let self = this;

      this.$http.post('/api/admin/login', {
        username: self.username,
        password: self.password
      }).then(function (response) {
        if (response.body.code === 0)
        {
          window.toast.success({title:"登录成功"});
          window.localStorage.setItem('adminToken', response.body.data.token);
          location.href = '/#/';
        }
        else {
          window.toast.error({title:"账户/密码错误"});
        }
      }).catch((response) => {
          window.toast.error({title:"账户/密码错误"});
      })
    },

    changeLang (type) {
      // this.$i18n.locale = this.lang
      this.$i18n.locale = type;
      window.localStorage.setItem('lang', type);
      location.reload();
    },
  }
}
</script>
<style scoped>
  .span_lang {
    margin-right: 10px;
    margin-left: 10px;
    cursor: pointer;
    float: right;
    font-size: 14px;
  }

  .span_lang.active {
    color: #20a8d8;
    font-weight: bold;
  }
</style>
