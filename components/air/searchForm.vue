<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          ref="departureCity"
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
          v-model="form.departCity"
          @blur="handleBlur(`depart`)"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          ref="arrivalCity"
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          class="el-autocomplete"
          v-model="form.destCity"
          @blur="handleBlur(`dest`)"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
          v-model="form.departDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>

      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
// 时间格式化插件
import moment from "moment";
export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,
      form: {
        departCity: "",
        departCode: "",
        destCity: "",
        destCode: "",
        departDate: ""
      },
      // 出发/到达定义同一个变量时，失去焦点时，值会混用
      cities: []
      // 分来定义
      // 定义 出发城市
      // departureCity:[],
      // 定义 到达城市
      // arrivalCity:[],
    };
  },
  methods: {
    // tab切换时触发
    handleSearchTab(item, index) {
      if (index === 1) {
        this.$alert("该内容还在审核中，请期待", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
    },

    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async queryDepartSearch(value, callback) {
      // 当输入框的值为空时，则callback值为空，不显示下拉
      if (!value) {
        callback([]);
        return;
      }
      // 获得焦点，显示下拉菜单，值的数据类型 cb([{ value: 1 }, { value: 2 }, { value: 3 }]);
      const res = await this.$axios({
        url: "/airs/city?name=" + value
      });
      // console.log(res)
      // 0: {id: 197, name: "广州市", code: "440100000000", parentCode: "440000000000", level: "2", …}
      const { data } = res.data;
      // 因为原本data立面没有组件需要的 value值，因此遍历添加
      const newData = data.map(v => {
        v.value = v.name.replace("市", ""); // 下拉菜单显示的值，去除 “市”  广州市--广州
        return v;
      });
      // 失去焦点默认选择，需要使用的
      // console.log(newData)
      this.cities = newData;
      // 显示到下拉菜单
      callback(newData);
    },
    // 在 输入城市（出发/到达），失去焦点时，默认选择第一个
    handleBlur(type) {
      // 方法一  分来定义 出发(departureCity)和 到达(arrivalCity)城市
      // if(type==="depart"){
      //   if(this.departureCity.length===0) return;
      //   this.form.departCity=this.departureCity[0].value;
      //   this.form.departCity=this.departureCity[0].sort;
      // }
      // if(type==="dest"){
      //   if(this.arrivalCity.length===0) return;
      //   this.form.destCity=this.arrivalCity[0].value;
      //   this.form.destCity=this.arrivalCity[0].sort;
      // }

      // 方法二  需要创建变量 保存[]
      // 当下拉菜单没有值时，终止执行
      // if (this.cities.length === 0) return;
      // if(!value) return console.log(value);
      // 其他，则执行下列代码，将索引为0，第一项为默认值
      // this.form[type + `City`] = this.cities[0].value;
      // this.form[type + `Code`] = this.cities[0].sort;

      // 方法三 使用ref绑定，获取input的值
      const aa = this.$refs.departureCity.value;
      const bb = this.$refs.arrivalCity.value;
      // console.log(aa,bb)
      // 判断
      if(type==="depart"){
        if (this.cities.length === 0 || !aa) return;
        this.form[type + `City`] = this.cities[0].value;
        this.form[type + `Code`] = this.cities[0].sort;
      }
      if(type==="dest"){
        if (this.cities.length === 0 || !bb) return;
        this.form[type + `City`] = this.cities[0].value;
        this.form[type + `Code`] = this.cities[0].sort;
      }

    },

    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDestSearch(value, cb) {
      // cb([{ value: 1 }, { value: 2 }, { value: 3 }]);
      // 调用出发城市输入框获得焦点时触发 函数方法
      this.queryDepartSearch(value, cb);
    },

    // 出发城市下拉选择时触发
    // autocomplete 是一个可带输入建议的输入框组件，fetch-suggestions 是一个返回输入建议的方法属性，
    // 如 querySearch(queryString, cb)，在该方法中你可以在你的输入建议数据准备好时通过 cb(data) 返回到 autocomplete 组件中。
    // :fetch-suggestions="queryDepartSearch"
    handleDepartSelect(item) {
      // console.log(item)
      this.form.departCity = item.value;
      this.form.departCode = item.sort;
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {
      // console.log(item)
      this.form.destCity = item.value;
      this.form.destCode = item.sort;
    },

    // 确认选择日期时触发
    handleDate(value) {
      // console.log(value)  // 打印Tue Oct 01 2019 00:00:00 GMT+0800 (中国标准时间)， 用 npm install --save moment 并引入
      this.form.departDate = moment(value).format("YYYY-MM-DD");
      // console.log(this.form.departDate);
    },

    // 触发和目标城市切换时触发
    handleReverse() {
      const { departCode, departCity, destCode, destCity } = this.form;
      this.form.departCity = destCity;
      this.form.departCode = destCode;

      this.form.destCity = departCity;
      this.form.destCode = departCode;
    },

    // 提交表单是触发
    handleSubmit() {
      // 自定义规则验证
      const rules = {
        // departCity 出发城市的验证规则
        departCity: { message: "请输入出发城市", value: this.form.departCity },
        // 目标城市验证
        destCity: { message: "请输入目的城市", value: this.form.destCity },
        // 出发日期验证
        departDate: { message: "请输出发日期", value: this.form.departDate }
      };
      // 设置变量保存，假设验证通过 true
      let valid = true;
      // 遍历 rules这个对象，判断 input里面的值 是否为空，否：打印错误信息
      // Object.keys方法，返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（ enumerable ）属性的键名。
      Object.keys(rules).forEach(v => {
        // console.log(v) // departCity  destCity  departDate
        // 验证不通过，终止往下执行
        if (!valid) return;
        //
        const { message, value } = rules[v];
        // 判断 rules.departCity/destCity/departDate .value 是否为空
        // 即 遍历后 rules[v].value 是否为空  上已经解构出来 value
        if (!value) {
          this.$message.error(message);
          // 为空 则弹框显示 修改假设值 valid=false,且代码执行终止
          valid = false;
        }
        // 上 valid假设验证 修改false 为验证失败
        if (!valid) return;
        //
        // this.$router.push()
        this.$router.push({
          path: "/air/flights", // http:127.0.0.1:1337/airs 请求是get 因此拼接url
          query: this.form // 将form的数据拼接到 url上
          // http://127.0.0.1:3000/air/flights?departCity=上海&departCode=SHA&destCity=广州&destCode=CAN&departDate=2019-10-07
        });
      });
      // vuex管理 将表单数据保存 history记录 到本地储存 [{历史3},{历史2},{历史1}]
      this.$store.commit("air/setHistory",this.form)
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
    cursor: pointer;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
  // /deep/.el-input__inner {
  //   cursor: pointer;
  // }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>
