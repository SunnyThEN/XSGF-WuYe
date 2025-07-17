<template>
  <div class="login-container">
    <div class="project-name">香山工坊资产管理中心</div>
    <div class="login-form">
      <div class="form-user" @keypress="loginPress">
        <div class="login-text">
          <div>
            <div>{{ $ts('账号登录') }}</div>
            <div class="login-line"></div>
          </div>
          <div style="flex: 1"></div>
        </div>
        <div class="login-text-small">WELCOME TO LOGIN</div>
        <div class="item">
          <div class="input-icon el-icon-user"></div>
          <input
            type="text"
            v-focus
            v-model="userInfo.userName"
            :placeholder="$ts(['请输入', '账号'])"
          />
        </div>
        <div class="item">
          <div class="input-icon el-icon-lock"></div>
          <input
            type="password"
            v-focus
            v-model="userInfo.password"
            :placeholder="$ts(['请输入', '密码'])"
          />
        </div>
      </div>
      <div class="loging-btn">
        <el-button
          size="large"
          :loading="loading"
          color="#3a6cd1"
          :dark="true"
          @click="login"
          long
        >
          <span v-if="!loading">{{ $ts('登录') }}</span>
          <span v-else>{{ $ts('正在登录') }}...</span>
        </el-button>
      </div>
      <!-- 账号信息 -->
    </div>
    <!-- 页面底部 -->
    <div class="login-footer">
      <span>香山工坊资产管理中心 v1.0</span>
    </div>
    <img class="login-bg" src="/static/login_bg.png" />
  </div>
</template>

<script>
import { defineComponent, ref, reactive, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store/index';
import http from '@/../src/api/http.js';

export default defineComponent({
  setup() {
    const loading = ref(false);
    const userInfo = reactive({
      userName: '',
      password: ''
    });

    const { proxy } = getCurrentInstance();
    const router = useRouter();
    
    const login = () => {
      if (!userInfo.userName) return proxy.$message.error('请输入账号');
      if (!userInfo.password) return proxy.$message.error('请输入密码');
      
      loading.value = true;
      http
        .post('/api/user/login', userInfo)
        .then((result) => {
          if (!result.status) {
            loading.value = false;
            return proxy.$message.error(result.message);
          }
          store.commit('setUserInfo', result.data);
          router.push({ path: '/' });
        });
    };
    localStorage.setItem("proportion", 0.13);
    const loginPress = (e) => {
      if (e.keyCode == 13) {
        login();
      }
    };

    return {
      loading,
      login,
      userInfo,
      loginPress
    };
  }
});
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  width: 100%;
  height: 100%;
  background: rgb(246, 247, 252);
  justify-content: flex-end;
  align-items: center;
}

.login-form {
  align-items: center;
  width: 50%;
  display: flex;
  flex-direction: column;
  z-index: 999;

  .form-user {
    .item {
      border-radius: 5px;
      border: 1px solid #ececec;
      display: flex;
      margin-bottom: 30px;
      background: #ffff;
      height: 45px;
      padding-left: 20px;

      .input-icon {
        line-height: 45px;
        color: #7a7a7a;
        padding-right: 20px;
      }
    }
  }

  input {
    background: white;
    width: 100%;
    border: 0;
    outline: none;
    font-size: 16px;
    line-height: 45px;
    color: #323233;
  }
}

.form-user,
.loging-btn {
  width: 400px;
}

.loging-btn {
  box-shadow: 2px 4px 11px #a4c2ff;
  margin-top: 10px;

  button {
    padding: 21px;
    font-size: 14px !important;
    width: 100%;
  }
}

.login-text {
  font-weight: bolder;
  font-size: 20px;
  letter-spacing: 2px;
  position: relative;
  display: flex;

  .login-line {
    z-index: -1;
    padding: 5px;
    position: relative;
    top: -8px;
    width: 100%;
    background-image: linear-gradient(to right, #6598ff, white);
  }
}

.login-text-small {
  margin-bottom: 20px;
  font-size: 13px;
  color: #7d7c7c;
}

.login-bg {
  left: 0;
  position: absolute;
  height: 100%;
  width: 50%;
  z-index: 0;
}

.project-name {
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 9999;
  font-weight: bolder;
  background-image: linear-gradient(to right, #1850c1, #9c009c);
  -webkit-background-clip: text;
  color: transparent;
  font-size: 25px;
}

.account-info {
  font-size: 12px;
  color: #636363;
  margin-top: 15px;
  text-align: center;
}

.login-footer {
  position: absolute;
  width: 50%;
  bottom: 0.5rem;
  font-size: 14px;
  text-align: center;
  padding-bottom: 10px;
  color: #4f4f4f;
}

@media screen and (max-width: 700px) {
  .login-bg,
  .login-footer,
  .project-name {
    display: none;
  }

  .login-container {
    padding: 2rem;
    justify-content: center;
  }

  .login-form {
    width: 100%;
  }

  .form-user,
  .loging-btn {
    width: 100%;
  }
}
</style>
