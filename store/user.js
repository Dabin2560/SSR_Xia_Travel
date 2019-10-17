// 固定写法 暴露出state，准备保存
export const state = ()=> {
  return {
    userInfo:{},
  }

}

// 存放的是同步修改state的方法
export const mutations = {
  // mutation下的值，必须是一个函数，函数中会有一个固定的参数state，
  // 第二个参数是用户调用方法时候传进来
  setUserInfo(state,data){
    state.userInfo = data;
  },

}

// 存放的是异步修改state的方法
export const actions = {
  // 使用vuex管理模式，封装的登录方法函数，接收 参数一/参数二 ：参考下代码
  // const res = await this.$store.dispatch("user/login", this.form);
  async login(store,data){
    // async 和 await
    // async的用法，它作为一个关键字放到函数前面，用于表示函数是一个异步函数，
    //    因为async就是异步的意思， 异步函数也就意味着该函数的执行不会阻塞后面代码的执行。
    // await 后面放置的就是返回promise对象的一个表达式
    var res = await this.$axios({
      url:"/accounts/login",
      method:"POST",
      data
    })
    // 判断 
    if(res.status===200){
      store.commit("setUserInfo",res.data)
      // 登录成功跳转

    }
    return res;
  },
  // 使用vuex管理模式，封装的注册方法函数
  async register(store,data){
    var res= await this.$axios({
      url:"/accounts/register",
      method:"POST",
      data
    })
    if(res.status===200){
      store.commit("setUserInfo",res.data)
    }
    return res;
  },
  // 使用vuex管理模式，封装的 发送手机验证码 方法函数
  async sendCaptcha(store,data){
    var res=await this.$axios({
      url:"/captchas",
      method:"POST",
      data:{
        tel:data
      }
    })
    return res;
  },

}


