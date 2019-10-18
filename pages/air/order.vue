<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->
      <div class="main">
          <OrderForm @getDetail="getDetail" @getAllPrice="getAllPrice"/>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <OrderAside :data="detail" :allPrice="allPrice"/>
      </div>
    </el-row>
  </div>
</template>

<script>
import OrderForm from '@/components/air/orderForm'
import OrderAside from '@/components/air/orderAside'
export default {
    components:{
        OrderForm,
        OrderAside
    },
    data() {
      return {
        
        // 保存子组件 事件传过来的值，
        detail:{
          // 挖坑位，设置机票信息 默认值空
          seat_infos:{},
        },
        allPrice:0,
      }
    },
    methods:{
      // 子组件事件传参，获取机票详细参数
      // this.$emit("getDetail",this.detail)
      getDetail(detail){
        // 传过来的detail赋值给此组件保存
        this.detail=detail
      },
      // 意思同上 通过事件传（计算好的总价）值
      getAllPrice(price){
        // 赋值到父组件保存，子组件2 可以使用porps：方法使用
        this.allPrice=price
      }
    },
    
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 20px auto;
}

/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}
</style>