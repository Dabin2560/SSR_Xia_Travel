<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名/手机" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>

    <p class="form-text">
      <nuxt-link to="#">忘记密码</nuxt-link>
    </p>

    <el-button class="submit" type="primary" @click="handleLoginSubmit">登录</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 提交登录按钮事件  验证后台
    handleLoginSubmit() {
      // console.log(this.form)
      this.$refs.form.validate(async valid => {
        //
        if (valid) {
          // 使用vuex管理模式 异步执行 封装登录接口
          // 参数一：store/user/ 下暴露的login函数  参数二：传过去的登录表单value
          const res = await this.$store.dispatch("user/login", this.form);
          // 判断状态码，成功弹出提示
          if (res.status === 200) {
            this.$message.success("登录成功");
            // 登录成功跳转
            setTimeout(() => {
              this.$router.back("/");
            }, 1500);
          }
        }
      });
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>