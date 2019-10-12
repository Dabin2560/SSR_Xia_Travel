<template>
  <div class="container">
    <!-- Eiment-UI 走马灯/轮播图 幻灯片 -->
    <!-- :interval="5000" 轮播延时 5000ms=5s -->
    <!-- arrow="always" 左右箭头显示：总是 -->
    <el-carousel :interval="5000" arrow="always">
      <el-carousel-item v-for="(item,index) in banners" :key="index">
        <div
          class="banner-image"
          :style="`background: url(${$axios.defaults.baseURL}${item.url}) center center no-repeat`"
        ></div>
      </el-carousel-item>
    </el-carousel>
    <!-- 登录/注册 -->
    <!-- <el-tabs type="border-card"> -->
      <!-- 登录 -->
      
        <!-- 登录表单 -->
 
      <!-- 注册 -->

        <!-- 注册表单 -->

    <!-- </el-tabs> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 轮播图数据  结构 [{url:"", },{}]
      banners: []
    };
  },
  methods: {},
  mounted() {
    // 页面加载时获取后台 轮播图数据
    this.$axios({
      // 查看Api拿请求地址   因为已经配置基准路径
      url: "/scenics/banners"
    }).then(res => {
      // console.log(res)  // res.data.data.url
      const { data } = res.data;
      // console.log(data)
      this.banners = data;
    });
  }
};
</script>

<style scoped lang="less">
.container {
  min-width: 1000px;
  margin: 0 auto;
  position: relative;

  // Element-UI 走马灯 轮播图样式
  /deep/ .el-carousel__container {
    height: 700px;
  }

  .banner-image {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
  }

  .banner-content {
    z-index: 9;
    width: 1000px;
    position: absolute;
    left: 50%;
    top: 45%;
    margin-left: -500px;
    border-top: 1px transparent solid;
  }
}
</style>