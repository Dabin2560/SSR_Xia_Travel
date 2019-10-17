// 
import {Message} from 'element-ui';

// 使用axios的拦截器拦截页面的所有请求错误，并弹出对应的错误提示。
// context包含nuxt.js下所有的方法， 固定参数
export default (context) => {
  // 拦截错误响应信息，跟以前项目的main.js中的拦截器不一样，
  // onError只拦截错误，如果请求错误，就会执行onError中的函数
  context.$axios.onError(res => {
    // console.log(res.response)
    // res是错误对象，error的对象可以通过response获取详细信息
    const {message,statusCode} = res.response.data;
    if (statusCode === 400) {
      Message.error(message)
    }
    if(statusCode===403){
      // 1.提交机票订单，后台验证无token，无登录，重定向到登录页
      context.redirect("/user/login")
    }
  })

}
