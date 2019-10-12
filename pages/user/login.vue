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

    <!-- 登录/注册 Tab栏 -->
    <el-row type="flex" justify="center" align="middle" class="main">
      <div class="form-wrapper">
        <!-- 表单头部tab -->
        <el-row type="flex" justify="center" class="tabs">
          <span
            :class="{active: currentTab === index}"
            v-for="(item, index) in [`登录`, `注册`]"
            :key="index"
            @click="handleChangeTab(index)"
          >{{item}}</span>
        </el-row>
        <!-- 登录 -->
        <LoginForm v-if="currentTab===0" />
        <!-- 注册 -->
        <RegisterForm v-if="currentTab===1"/>
      </div>
    </el-row>
  </div>
</template>

<script>
import LoginForm from "@/components/user/loginForm";
import RegisterForm from "@/components/user/registerForm";
export default {
  data() {
    return {
      // 轮播图数据  结构 [{url:"", },{}]
      banners: [],
      currentTab: 1
    };
  },
  components: {
    LoginForm,
    RegisterForm
  },
  methods: {
    handleChangeTab(index) {
      this.currentTab = index;
    }
  },

  async mounted() {
    // 页面加载时获取后台 轮播图数据
    const res = await this.$axios({
      url: "/scenics/banners"
    });
    const { data } = res.data;
    // console.log(data)
    this.banners = data;
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

//
.main {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: absolute;
  top:0;
  left:0;
  z-index: 999;

  .form-wrapper {
    width: 400px;
    margin: 0 auto;
    background: #fff;
    box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
    

    .tabs {
      span {
        display: block;
        width: 50%;
        height: 50px;
        box-sizing: border-box;
        border-top: 2px #eee solid;
        background: #eee;
        line-height: 48px;
        text-align: center;
        cursor: pointer;
        color: #666;

        &.active {
          color: orange;
          border-top-color: orange;
          background: #fff;
          font-weight: bold;
        }
      }
    }
  }
}
</style>