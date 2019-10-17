<template>
  <!-- 注册表单 -->
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <!-- 用户名 -->
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名/手机" v-model="form.username"></el-input>
    </el-form-item>
    <!-- 验证码 -->
    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="请输入内容" v-model="form.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>
    <!-- 昵称 -->
    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="昵称" v-model="form.nickname"></el-input>
    </el-form-item>
    <!-- 密码 -->
    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>
    <!-- 密码验证 -->
    <el-form-item class="form-item" prop="checkPass">
      <el-input placeholder="确认密码" type="password" v-model="form.checkPass" autocomplete="off"></el-input>
    </el-form-item>
    <!-- 注册按钮 -->
    <el-button class="submit" type="primary" @click="handleLoginRegister">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    //
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "",
        nickname: "",
        captcha: "",
        password: "",
        checkPass: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkPass: [
          { validator: validatePass, required: true, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 提交 注册 按钮事件
    // handleLoginRegister() {
    //   // console.log(this.form)
    //   this.$refs["form"].validate(valid => {
    //     // 判断有无值, 若有，解构除了 checkPass（二次验证当前用户输入的密码，不传后台）
    //     if (valid) {
    //       const { checkPass, ...props } = this.form;
    //       // 获取接口数据
    //       this.$axios({
    //         url: "/accounts/register",
    //         method: "POST",
    //         data: props
    //       }).then(res => {
    //         // console.log(res);
    //         if (res.status === 200) {
    //           this.$message.success("注册成功");
    //           setTimeout(() => {
    //             this.$router.push("/");
    //           }, 1500);
    //         }
    //       });
    //     }
    //   });
    // },
    // 提交 注册 按钮事件 -----（异步 async  await）-----
    handleLoginRegister() {
      this.$refs.form.validate(async valid => {
        const { checkPass, ...props } = this.form;
        if (valid) {
          const res = await this.$axios({
            url: "/accounts/register",
            method: "POST",
            data: props
          });
          if (res.status === 200) {
            this.$message.success("注册成功");
            // 获取data
            // console.log(res)
            const data = res.data

            // vuex的状态管理模式 通过commit方法修改user/steUserInfo函数内的值
            this.$store.commit("user/steUserInfo",data)
            setTimeout(() => {
              this.$router.push("/");
            }, 1500);
          }
        }
      });
    },

    // 手机验证码 事件
    async handleSendCaptcha() {
      // 添加判断
      if (this.form.username.length !== 11) {
        this.$alert("手机帐号不能为空或格式错误", "错误提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning"
        });
        return;
      }

      // 获取手机验证码 接口 /captchas
      let res = await this.$axios({
        url: "/captchas",
        method: "POST",
        data: {
          tel: this.form.username
        }
      });
      // console.log(res);
      //  解构 res.data.data.
      const { code } = res.data;
      // 返回模拟的验证码
      this.$alert(`此次的验证码为${code}`, "验证码", {
        confirmButtonText: "确定",
        showCancelButton: false,
        type: "warning"
      });
    }
  }
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