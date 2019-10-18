<template>
  <div class="flight-item" @click="showRecommend">
    <div>
      <!-- 显示的机票信息 -->
      <el-row type="flex" align="middle" class="flight-info">
        <el-col :span="6">
          <span>{{item.airline_name}}</span>
          {{item.flight_no}}
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="space-between" class="flight-info-center">
            <el-col :span="8" class="flight-airport">
              <strong>{{item.dep_time}}</strong>
              <span>{{item.org_airport_name}}{{item.org_airport_quay}}</span>
            </el-col>
            <el-col :span="8" class="flight-time">
              <span>{{elapsedTime}}</span>
            </el-col>
            <el-col :span="8" class="flight-airport">
              <strong>{{item.arr_time}}</strong>
              <span>{{item.dst_airport_name}}{{item.dst_airport_quay}}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="flight-info-right">
          ￥
          <span class="sell-price">{{item.base_price / 2}}</span>起
        </el-col>
      </el-row>
      <p style="text-align:right;padding:0 80px 10px 0;cursor: pointer;">
        <i class="el-icon-caret-bottom" style="font-size:16px"></i>低价推荐
      </p>
    </div>
    <div class="flight-recommend" v-if="ifShowRecommend">
      <!-- 隐藏的座位信息列表 -->
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        v-for="(seat,index) in item.seat_infos"
        :key="index"
      >
        <el-col :span="4">低价推荐</el-col>
        <el-col :span="20">
          <el-row type="flex" justify="space-between" align="middle" class="flight-sell">
            <el-col :span="16" class="flight-sell-left">
              <span>{{seat.group_name}}</span>
              | {{seat.supplierName}}
            </el-col>
            <el-col :span="5" class="price">￥{{seat.org_settle_price}}</el-col>
            <el-col :span="3" class="choose-button">
              <el-button type="warning" size="mini" @click="toOther(item,seat)">选定</el-button>
              <p>剩余：{{seat.discount}}</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
  
</template>

<script>
// 导入计算的方法
import {computationTime} from "@/utils/utils"

export default {
  // props除了场常规传[]。还能传对象
  props: {
    // 父组件传过来的数据 名称
    item: {
      // 声明此数据的数据类型，为对象
      type: Object,
      // 若用户不传值，设置默认值，为空
      default: {}
    }
  },
  data() {
    return {
      ifShowRecommend: false
    };
  },
  methods: {
    // 点击，显示/隐藏 低价推荐 栏目
    showRecommend() {
      this.ifShowRecommend = !this.ifShowRecommend;
    },
    toOther(item,seat){
      // console.log(item)
      // console.log(seat.seat_xid)
      this.$router.push({
        path:"/air/order",
        query:{id:item.id,seat_xid:seat.seat_xid}
      })
    }
  },
  // 监听多个变化
  computed: {
    // 出发-到达所需要时间
    elapsedTime() {
      return computationTime(this.item.dep_time,this.item.arr_time)
      // // 将所有的时间，以：切割时间格式：12：30 ，并转化为分钟
      // // dep 出发  arr到达
      // const dep = this.item.dep_time.split(":");
      // // console.log(dep); // ["20", "30"]
      // const arr = this.item.arr_time.split(":");
      // // 再将得出的数组，参数，例20:30 小时*60=分钟 + 分钟
      // const depSum = dep[0] * 60 + +dep[1];
      // const arrSum = arr[0] * 60 + +arr[1];
      // // console.log(depSum, arrSum); //
      // // 到达-出发 =间隔时间
      // let elapsed = arrSum - depSum;
      // // 判断 elapsed若得出负数，则为 到达城市为第二天凌晨时间
      // if (elapsed < 0) {
      //   elapsed = arrSum + 24 * 60 - depSum;
      // }
      // // console.log(Math.floor(elapsed/60)+":"+elapsed%60)

      // return `${Math.floor(elapsed / 60)}时${elapsed % 60}分`;
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.flight-item {
  border: 1px #ddd solid;
  margin-bottom: 10px;

  .flight-info {
    padding: 15px;
    cursor: pointer;

    > div {
      &:first-child,
      &:last-child {
        text-align: center;
      }
    }
  }

  .flight-info-center {
    padding: 0 30px;
    text-align: center;

    .flight-airport {
      strong {
        display: block;
        font-size: 24px;
        font-weight: normal;
      }
      span {
        font-size: 12px;
        color: #999;
      }
    }

    .flight-time {
      span {
        display: inline-block;
        padding: 10px 0;
        border-bottom: 1px #eee solid;
        color: #999;
      }
    }
  }

  .flight-info-right {
    .sell-price {
      font-size: 24px;
      color: orange;
      margin: 0 2px;
    }
  }
}

.flight-recommend {
  background: #f6f6f6;
  border-top: 1px #eee solid;
  padding: 0 20px;

  .flight-sell {
    border-bottom: 1px #eee solid;
    padding: 10px 0;

    &:last-child {
      border-bottom: none;
    }

    .flight-sell-left {
      font-size: 12px;
      span {
        color: green;
      }
    }

    .price {
      font-size: 20px;
      color: orange;
    }

    .choose-button {
      text-align: center;
      color: #666;
      button {
        display: block;
        width: 100%;
        margin-bottom: 5px;
      }
    }
  }
}
</style>