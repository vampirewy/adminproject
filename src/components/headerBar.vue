<template>
  <div class="header_bar">
    <header class="header">
      <div class="left">
        <!-- <el-checkbox :indeterminate="isIndeterminate">全选</el-checkbox> -->
        <el-checkbox-group v-model="statusList">
          <el-checkbox
            @change="changeStatus(item.status)"
            v-for="(item,index) in checkBoxLists"
            :label="item.status"
            :key="index"
          >{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="middle">
        <el-select v-model="value" @blur="changeArea()">
          <el-option
            v-for="item in allAreaName"
            :key="item.traName"
            :label="item.traName"
            :value="item.traId"
          ></el-option>
        </el-select>
      </div>
      <div class="right">
        <el-input placeholder="请输入名称" prefix-icon="el-icon-search" v-model="inputText" clearable></el-input>
        <el-button type="primary" class="search" @click="search()">搜索</el-button>
        <el-button type="danger" @click="add()">添加</el-button>
      </div>
    </header>
  </div>
</template>

<script>
import { allArea } from "@/api/headerBar";
export default {
  name: "headerBar",
  // props: {
  //   allAreaName: Array
  // },
  data() {
    return {
      statusList: [],
      checkBoxLists: [
        { name: "全部状态", status: `` },
        { name: "未生效", status: 0 },
        { name: "生效中", status: 1 },
        { name: "已结束", status: 2 },
        { name: "已停用", status: 3 },
        { name: "已删除", status: 4 }
      ],
      allAreaName: [],
      inputText: ``,
      value: "",
      num:1
    };
  },
  methods: {
    async allArea() {
      let params = {
        // statisticsAll:true,
        topicType: `guide`
      };
      const res = await allArea(params);
      console.warn(res.data);
      if (res.data.statusCode === 2000) {
        this.allAreaName = res.data.body;
      }
    },
    search() {
      console.log(`搜索`);
      this.statusList = this.statusList.join(",");
      this.$emit("statusAreaName", this.value, this.statusList, this.inputText,this.num);
      this.statusList = [];
    },
    add() {
      console.log(this.$route);
      this.$route.name === `shoppingGuide`
        ? this.$router.push(`/addshopping`)
        : this.$router.push(`/specialinfor`);
    },
    changeStatus(index) {
      /**
       *  0-末生效,1-生效中,2-已结束,3-已停用,4-已删除
       *  全部状态不传值
       */
      console.log(`值${index}`);
      // console.warn(this.statusList);
    },
    changeArea() {
      // console.log(this.value);
    }
  },
  created() {
    this.allArea();
  }
};
</script>

<style scoped lang="less">
.flex() {
  display: flex;
  align-items: center;
}
.header_bar {
  margin-bottom: 20px;
}
.header,
.right {
  .flex();
}
.right,
.middle,
.left {
  margin-right: 10px;
}
.search {
  margin-left: 10px;
}
</style>