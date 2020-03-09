<template>
  <div class="login">
    <!-- 知识点1：登录界面图形的绘制（css） -->
    <div class="login_box">
      <div class="icon_box">
        <img src="../assets/img/logo.png" alt />
      </div>
      <el-form ref="form" :model="form" label-width="0px" class="login_form" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" prefix-icon="iconfont icon-lock_fill" type="password"></el-input>
        </el-form-item>
        <el-form-item class="login_button">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    reset() {
      this.$refs.form.resetFields();
    },
    login() {
      // 知识点：async、对象解构
      this.$refs.form.validate(async value => {
        if (value) {
          const { data: res } = await this.$http.post("login", this.form);
          if (res.meta.status === 200) {
            console.log(res);
            this.$message({
              message: "登录成功",
              type: "success"
            });
            sessionStorage.setItem("token",res.data.token);
            this.$router.push("/home");
          } else {
            this.$message.error(res.meta.msg);
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.login {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.icon_box {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 0 0 10px #eee;
}
.icon_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  /* 知识点2：box-sizing属性的妙用 */
  box-sizing: border-box;
}
.login_button {
  display: flex;
  justify-content: flex-end;
}
</style>