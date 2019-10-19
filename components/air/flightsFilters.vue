<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="filters.airport" placeholder="起飞机场" >
          <el-option
            v-for="(item,index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          size="mini"
          v-model="filters.flightTimes"
          placeholder="起飞时间"
        >
          <!-- label="" 因为显示需要，因此字符串拼接 -->
          <!-- value=""只能传字符串，因此字符串插值 -->
          <el-option
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00-${item.to}:00`"
            :value="`${item.from},${item.to}`"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="filters.company" placeholder="航空公司">
          <el-option
            v-for="(item,index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="filters.airSize" placeholder="机型" >
          <el-option
            v-for="(item,index) in this.planSizeList"
            :key="index"
            :label="item.name"
            :value="item.size"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
  </div>
</template>

<script>
export default {
  // 接收父子间的传值，并用相同的数据格式保存
  props: {
    // 父组件 :data
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      filters: {
        // 此4项为筛选 select 的数据，声明坑位，一键撤销事件
        airport: "", // 机场
        flightTimes: "", // 出发时间
        company: "", // 航空公司
        airSize: "" // 机型大小
      },
      // 固定数据，机型大小列表
      planSizeList: [
        { name: "大型", size: "L" },
        { name: "中型", size: "M" },
        { name: "小型", size: "S" }
      ]
    };
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        // 同一多项过滤筛选封装
        // 先假设所有都符合为true,然后选出不符合条件的
        var arr = this.data.flights.filter(v => {
          let valid = true;
          // 筛选航班公司
          if (this.filters.company && this.filters.company !== v.airline_name) {
            valid = false;
          }
          // 筛选机型大小
          if (this.filters.airSize && this.filters.airSize !== v.plane_size) {
            valid = false;
          }
          // 筛选 起飞机场
          if (
            this.filters.airport &&
            this.filters.airport !== v.org_airport_name
          ) {
            valid = false;
          }
          // 筛选 起飞时间
          if (this.filters.flightTimes) {
            // 遍历，得出所有的 dep_time起飞时间：如6：55, 切割： ["6","55"]拿到索引[0]的项，小时
            const starTime = +v.dep_time.split(":")[0];
            // 显示6:00-12:00绑定的值输出为[6,12] 数组split() 以逗号切割
            const arr = this.filters.flightTimes.split(",");
            if (arr[0] > starTime || arr[1] <= starTime) {
              valid = false;
            }
          }

          return valid;
        });
        console.log(arr);
        this.$emit("setFilterData", arr);
      }
    }
  },
  methods: {
    // 撤销条件时候触发
    handleFiltersCancel() {
      // console.log("撤销");
      this.filters.airport = ""; // 机场
      this.filters.flightTimes = ""; // 出发时间
      this.filters.company = ""; // 航空公司
      this.filters.airSize = ""; // 机型大小
      // 将完整的 未筛选过的 数据传到父组件，进行渲染
      this.$emit("setFilterData", this.data.flights);
    }
  }
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>