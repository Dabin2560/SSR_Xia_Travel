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
        <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
          <el-option
            v-for="(item,index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间" @change="handleFlightTimes">
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
        <el-select size="mini" v-model="company" placeholder="航空公司" @change="handleCompany">
          <el-option
            v-for="(item,index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
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
      // 此4项为筛选 select 的数据，声明坑位，一键撤销事件
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      airSize: "", // 机型大小
      // 固定数据，机型大小列表
      planSizeList: [
        { name: "大型", size: "L" },
        { name: "中型", size: "M" },
        { name: "小型", size: "S" }
      ]
    };
  },
  methods: {
    // 选择机场时候触发
    handleAirport(value) {
      // console.log("起飞机场"+value);
      // console.log(this.data)
      const afterFilter = this.data.flights.filter(v => {
        return (v.org_airport_name === value);
      });
      // console.log(afterFilter)
      this.$emit("setFilterData", afterFilter);
    },

    // 选择出发时间时候触发
    handleFlightTimes(value) {
      // console.log("选择出发时间"+value);
      // console.log(this.data)
      // 显示6:00-12:00绑定的值输出为[6,12] 数组split() 以逗号切割
      const arr=value.split(",")
      // console.log(arr) // 如：["0","6"]
      const arr2 = this.data.flights.filter(v=>{
        // 遍历，得出所有的 dep_time起飞时间：如6：55, 切割： ["6","55"]拿到索引[0]的项，小时
        const starTime= +v.dep_time.split(":")[0]
        // 判断 起飞的小时，在区间 arr[0] ~ arr[1]间 则终止执行
        return +arr[0] <= starTime && starTime < +arr[1]
      })
      // 通过事件传值，将数据传到父组件，进行渲染
      this.$emit("setFilterData", arr2);
    },

    // 选择航空公司时候触发
    handleCompany(value) {
      // console.log("航空公司"+value);
      const afterFilter = this.data.flights.filter(v => {
        // 判断 值是否相等 相等时，终止执行
        return (v.airline_name === value);
      });
      // console.log(afterFilter)
      this.$emit("setFilterData", afterFilter);
    },

    // 选择机型时候触发
    handleAirSize(value) {
      // console.log("选择机型"+value);
      // console.log(this.data)
      const afterFilter = this.data.flights.filter(v => {
        // console.log(v)
        return v.plane_size === value;
      });
      // console.log(afterFilter)
      this.$emit("setFilterData", afterFilter);
    },

    // 撤销条件时候触发
    handleFiltersCancel() {
      // console.log("撤销");
      this.airport=""; // 机场
      this.flightTimes=""; // 出发时间
      this.company=""; // 航空公司
      this.airSize=""; // 机型大小
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