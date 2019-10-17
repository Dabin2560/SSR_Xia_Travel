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
        const res = await this.$axios({
          url: "/accounts/login",
          method: "POST",
          data: this.form
        });
        // console.log(res)
        if (res.status === 200) {
          this.$message.success("登录成功");
          // 解构出来以便保存
          const data = res.data
          // console.log(data)

          // * vuex不能通过直接赋值的方式来修改state的值
          // this.$store.state.user.username = data.user.nickname
          // 通过调用 user.js的 mutation同步方法，修改state的值，commit方法调用mutation

          // 类似于$emit()方式
          // this.$store.commit()方法 参数1 store/user/ 下暴露出来的事件 参数二：上面的data，赋值到state
          this.$store.commit("user/steUserInfo",data)

          setTimeout(() => {
            this.$router.push("/");
          }, 1500);
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