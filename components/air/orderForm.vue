<template>
  <div class="main">
    <div class="air-column">
      <h2>剩机人</h2>
      <el-form class="member-info">
        <div class="member-info-item" 
        v-for="(item,index) in this.users"
        :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in this.detail.insurances" :key="index">
          <el-checkbox 
          :label="`${item.type}：￥${item.price}/份×1　最高赔付${item.compensation}`" 
          @change="handleInsurances(item.id)"
          border></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  data() {
        return {
          // 机票的详情
          detail:{},
            // 声明要保存的表单（乘机人/证件）数据，可以有多个人，
            users:[
                {username:"",id:""},
            ],
            // insurances是保存 乘机人购买的保险
            insurances:[],
            // 联系人姓名 手机 验证码
            contactName:"",
            contactPhone:"",
            captcha:"", // 手机验证码
            invoice:false, // 是否需要发票
            
        }
    },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      // 事件 点击添加一项
      this.users.push({username:"",id:""})
    },

    // 移除乘机人
    handleDeleteUser(index) {
      this.users.splice(index,1)
    },
    // 选择保险时触发  
    handleInsurances(id){
      // 判断乘机人此次机票是否已经点击购买保险(是购买一项/还是2项)，（选择框点击事件）若存在则删除，若不存在则添加
      // indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
      // 如果要检索的字符串值没有出现，则该方法返回 -1，且对大小写敏感
      const index = this.insurances.indexOf(id)
      // 判断 输出的值大于-1 则说明insurances有数据，已选状态
      if(index> -1){
        // 存在则删除
        this.insurances.splice(index,1)
      }else{
        // 不存在则添加
        this.insurances.push(id)
      }
      console.log(this.insurances)

    },
    // 发送手机验证码
    async handleSendCaptcha() {
      // 判断不为空才能发送
      if(!this.contactPhone){
        this.$message.error("手机号码不能为空");
        return
      }
      // 调用vuex管理 的手机号码验证
      const res= await this.$store.dispatch("user/sendCaptcha",this.contactPhone);
      // console.log(res)
      this.$message.success(`当前的验证码为${res.data.code}`);
    },

    // 提交订单
    async handleSubmit(){
      const data = {
        users:this.users,
        insurances:this.insurances,
        contactName:this.contactName,
        contactPhone:this.contactPhone,
        captcha:this.captcha,
        seat_xid:this.$route.query.seat_xid,
        id:this.$route.query.id,
        invoice:this.invoice,
      }
      // console.log(data)
      const res=await this.$axios({
        url:"/airorders",
        method:"POST",
        data,
        headers:{
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      })
      // console.log(res) // 发现报错403（提交机票订单，后台验证无token，无登录，重定向到登录页）， 
      // 在plugins/axios.js中，添加拦截


    }
  },
  mounted() {
    // 加载获取API后台数据

    // console.log(this.$route.query)
    // 解构出url传过来的id和机票id
    const {id,seat_xid} = this.$route.query
    // 请求
    this.$axios({
      url:"/airs/"+id,
      params: {
        seat_xid
      }
    }).then(res=>{
      console.log(res)
      this.detail=res.data
    })
  },
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>