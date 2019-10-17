<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <!-- 父组件向子组件传flightsData :data="flightsData" -->
        <!-- 子组件向父组件传值 事件方式 @ -->
        <FlightsFilters :data="cacheflightsData" @setFilterData="setFilterData" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <!-- 把遍历出来的item传到子组件 -->
        <FlightsItem v-for="(item,index) in dataList" :key="index" :item="item" />

        <!-- 分页 -->
        <!-- 若无航班信息数据，数据长度为0 则👆航班信息组件页不会显示 v-if -->
        <el-pagination
          class="pagination"
          v-if="this.flightsData.flights.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 15]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>

        <!-- 无航班信息/无航班数据 则显示 -->
        <div
          v-if="flightsData.flights.length === 0 && !loading"
          style="padding:50px;text-align:center"
        >
          <el-table v-loading="true"></el-table>该航班暂无数据
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import moment from "moment";
// 引入 航班头部
import FlightsListHead from "@/components/air/flightsListHead";
// 引入 航班信息列表
import FlightsItem from "@/components/air/flightsItem";
// 引入 顶部过滤列表
import FlightsFilters from "@/components/air/flightsFilters";

export default {
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters
  },
  data() {
    return {
      // 判断是否正在加载数据（常见服务器卡顿）
      loading: true,
      flightsData: {
        // 初始值
        flights: [],
        // 页面加载请求后台数据查看数据结构，可先声明坑位
        // 上面<template> 以：data="flightsData" filterData传值 供筛选页面使用，
        info: {},
        options: {}
      },
      // 保存筛选后的数据，与原始/所有的数据区别，但目录一样👆
      cacheflightsData: {
        flights: [],
        info: {},
        options: {}
      },
      // 使用computed监听后，注释掉，
      // dataList: [],
      //
      pageSize: 5,
      pageIndex: 1,
      // 筛选功能实现后，数据数量改变
      // 因此，渲染需要用另存的一份，筛选过后的数据条数
      total: 0
    };
  },
  methods: {
    // 选择条数的事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.dataList = this.flightsData.flights.slice(0, this.pageSize);
    },
    // 页数 切换事件 val是elementUI 传入的，点击选择 第几页 的值
    handleCurrentChange(val) {
      // this.dataList = this.flightsData.flights;
      this.pageIndex = val;
      // 修改机票列表，每页显示的条数
      // console.log(this.dataList) // slice参数：0，5   5,10  10,15  下（使用computed监听 2个值变化，注释掉）
      // this.dataList=this.flightsData.flights.slice((this.pageIndex-1)*this.pageSize,this.pageIndex*this.pageSize)
    },
    // 机票过滤组件 事件传值方式
    setFilterData(afterFilter) {
      // console.log(afterFilter)
      // 子组件，过滤后通过事件传的数据afterFilter，赋值 渲染到页面
      this.flightsData.flights = afterFilter;
      // 分页的初始值
      this.total=afterFilter.length;
      // 筛选后，数据回到第一页
      this.pageIndex = 1;
    },
    // 封装 获取后台Api数据
    getALLData() {
      this.$axios({
        url: "/airs",
        // params:this.$route.params
        // axios的 get请求的方法 ：获取url上传的参数：值
        params: this.$route.query
      }).then(res => {
        // console.log(this.$route.query)  //上 输出为对象{}
        // console.log(res)
        this.flightsData = res.data;
        // console.log(this.flightsData);
        // 上面传了保存一份，👇 再缓存保存一份，作为
        // 展开对象（再保存为对象，新建内存指向，和上面res.data内存位置不同了），再保存到filterData
        this.cacheflightsData = { ...res.data };

        // 请求完毕 若无数据则显示 组件
        this.loading = false;

        // 分页总数，若经过筛选，则渲染条数，分页有所改变
        this.total = this.flightsData.total;
      });
    }
  },
  computed: {
    // 监听 将值return出，保存到 dataList:[]（监听：函数名带 输出值）
    dataList() {
      const arr = this.flightsData.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
      return arr;
    }
  },
  mounted() {
    // 页面加载时，调用获取后台数据
    // 即 页面加载获取后台API数据
    this.getALLData()
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}
.pagination {
  text-align: center;
}
.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>