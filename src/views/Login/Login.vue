<template>
  <div class="login-container">
    <!-- 表单验证就在form中:model绑定要验证的名字、:rules绑定验证规则，表单item中用prop绑定名字， -->
    <!-- 手动添加登录验证，就是在表单验证不通过时不会发请求，给form添加ref -->
    <el-form
      class="login-from"
      :model="user"
      :rules="formRules"
      ref="login-ref">
      <el-form-item class="item" placeholder="请输入手机号" prop="mobile">
        <el-input v-model="user.mobile"></el-input>
      </el-form-item>
      <el-form-item class="item" placeholder="请输入验证码" prop="code">
        <el-input v-model="user.code"></el-input>
      </el-form-item>
      <!-- 注意这里绑定prop不是给checkbox绑定，而是表单item绑 -->
      <el-form-item prop="agree">
        <!-- 自定义验证规则，就给这个绑定prop -->
        <!-- v-model中复选框绑定到表单验证中user.agree -->
        <el-checkbox class="agree" v-model="user.agree">同意用户隐私协议</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="lodingBtn"
          class="loginBtn"
          type="primary"
          @click="onLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//export 导出的东西要按需导入{ login }
import { login } from '@/api/user'
export default {
  data() {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: false //默认不同意协议
      },
      // checked: false, //已同意框选中,自定义规则的话，那这个选中状态的就不需要了
      lodingBtn: false, //加载按钮默认为false
      formRules: {
        mobile: [
          { required: true, message: '请输入正确的手机号', trigger: 'change' },
          { pattern: /^1[3456789]\d{9}$/, message: ' 请输入正确格式手机号', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'change' },
          { pattern: /^\d{6}$/, message: ' 请输入正确格式验证码', trigger: 'change' }
        ],
        agree: [
          // 这里是validator，不是validate
          { validator: (rule, value, callback) => {
            // validate有三个参数，这里的value返回的时false
              // console.log(value);
              if(value) {
                callback()
              }else {
                callback(new Error('请同意用户隐私协议'))
              }
            },
            trigger: 'change'
          },
        ],
      },
    };
  },
  methods: {
    onLogin() {
      // 根据文档存储请求
      // const user = this.user
      // 先进性验证，再登录，不通过则不登陆
      this.$refs['login-ref'].validate(valid => {
        if (!valid) {
            // return this.$message.error('请输入手机号或验证码');
            return
        }
        //如果通过验证，就进行login方法的调用
        this.login();
      });
    },
    //发送请求
    // 在上面如果通过验证就调用这个方法，是为了封装而已，
    login() {
      // 点击登录按钮以后将按钮禁用为加载状态按钮，加上this.来拿
      this.lodingBtn = true
      login(this.user).then(res => {
        // console.log(res);
        this.$message({
          message: '登陆成功',
          type: 'success'
        });
        // 登录成功就将按钮恢复正常
          this.lodingBtn = false

          // 将接口返回的res中的数据存储到本地，方便数据共享,本地存储只能存储字符串，而这里存储的是一个对象，这里的res.data.data调用了toString()，然后存进去就是一个[object Object]
          // 用JSON.stringify(res.data.data),转为JSON格式字符串
          // 这里有个坑耽误了很久，不是getItem，是setItem！！！！！！！！
          window.localStorage.setItem('user',JSON.stringify(res.data.data))
          // 登录成功就进入到首页
          this.$router.push({
            name: 'home'
          })
      }).catch(err => {
        // console.log('登录失败',err);
        this.$message.error('登录失败，手机或验证码错误');
        // 登录失败也将按钮恢复正常
          this.lodingBtn = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('./Login-img.jpg') no-repeat;
  background-size: cover;
  // opacity: 0.5;
  .login-from {
    padding: 100px 50px;
    background-color: rgb(36, 35, 35);
    height: 220px;
    width: 300px;
    .agree {
      color: #fff;
      // font-size: 200px;
    }
    .loginBtn {
      // margin-left: 100px;
      width: 100%;
  }
  }
  
}
</style>