<template>
  <div class="header_bar">
    <header class="header">
      <div class="left right">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="selectAll">全选</el-checkbox>
        <el-checkbox-group v-model="statusList" @change="seletItem">
          <el-checkbox
            v-for="(item,index) in checkBoxLists"
            :label="item.name"
            :key="index"
          >{{item.name}}</el-checkbox>
        </el-checkbox-group>
        <!-- <el-checkbox-group v-model="statusList">
          <el-checkbox
            @change="changeStatus(item)"
            v-for="(item,index) in checkBoxLists"
            :label="item.status"
            :key="index"
          >{{item.name}}</el-checkbox>
        </el-checkbox-group>-->
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
      <!-- 导购列表、专题列表 -->
      <div class="right" v-if="showArea">
        <el-input placeholder="请输入名称" prefix-icon="el-icon-search" v-model="inputText" clearable></el-input>
        <el-button type="primary" class="search" @click="search()">搜索</el-button>
        <el-button type="danger" @click="add()">添加</el-button>
      </div>
      <!-- 弹窗列表 -->
      <div class="right" v-if="!showArea">
        <el-autocomplete
          v-model="popName"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入弹窗名称"
          @select="selecthPopName"
        ></el-autocomplete>
        <el-button type="primary" class="search m_r_10" @click="searchPop()">搜索</el-button>
        <router-link to="/addpop">
          <el-button type="danger">添加</el-button>
        </router-link>
      </div>
    </header>
  </div>
</template>

<script>
import { allArea } from "@/api/headerBar";
import { getRequest, postRequest } from "@/utils/ajax";
export default {
  name: "headerBar",
  props: {
    showArea: Boolean //显示弹窗或者商圈
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
      statusList: [], //选择的状态值  0-未生效 1-生效中 2-已结束 3-已停用 4-已删除
      checkBoxLists: [
        // { name: "全部状态", status: `` },
        { name: "未生效", status: 0 },
        { name: "生效中", status: 1 },
        { name: "已结束", status: 2 },
        { name: "已停用", status: 3 },
        { name: "已删除", status: 4 }
      ],
      allAreaName: [], //商圈
      inputText: ``, //除弹窗输入框外的输入框
      value: "", //商圈ID号
      num: 1, //页码
      popName: "", //选择的弹窗名称
      searchLists: [] //弹窗模糊搜索列表
    };
  },
  methods: {
    selectAll(val) {
      this.isIndeterminate = false;
      val ? this.checkBoxLists.forEach(el => {this.statusList.push(el.name);}) : (this.statusList = []);
    },
    seletItem(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.checkBoxLists.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.checkBoxLists.length;
    },
    async allArea() {
      let params = {
        // statisticsAll:true,
        topicType: `guide`
      };
      getRequest(`/mall/tra/topics/statistics`,params).then(res=>{
        this.allAreaName = res.body;
      },error=>{});
    },
    /** 
     * @statusList Array  选中的状态值
     * @checkBoxLists Array  状态栏
     * @value  选中的商圈ID号
     * @inputText 导购、专题输入框的值
     * @num 页面回置1
     */
    search() {
      console.log(`搜索`);
      let statusList = [];
      if (this.statusList.length >= 5) {
        statusList = "";
      } else {
        for (let i = 0; i < this.statusList.length; i++) {
          this.checkBoxLists.forEach(el => {
            el.name === this.statusList[i] && statusList.push(el.status);
          });
        }
        statusList = statusList.join(",");
      };
      console.log(statusList);
      this.$emit(
        "statusAreaName",
        this.value,  //商圈ID号
        statusList,   //状态值
        this.inputText,  //导购、专题输入框
        this.num  //页面1
      );
    },
    add() {
      console.log(this.$route);
      this.$route.name === `shoppingGuide`
        ? this.$router.push(`/addshopping`)
        : this.$router.push(`/specialinfor`);
    },
    // changeStatus(item) {
    //   /**
    //    *  0-末生效,1-生效中,2-已结束,3-已停用,4-已删除
    //    *  全部状态不传值
    //    */
    //   console.log(`状态值`);
    //   console.log(item);
    // },
    changeArea() {
      // console.log(this.value);
    },
    selecthPopName(item) {
      console.log(item);
      //只要topicId,当选择app页面中的专题详情时
      // this.popName = item.value;
      // this.oneChoose.topicName = item.value;
      // this.oneChoose.topicId = item.topicId;
      // console.info(
      //   `第1栏搜索名称${this.oneChoose.topicName},id号${this.oneChoose.topicId}`
      // );
    },
    searchPopName(popName, fn) {
      let params = {windowName: popName};
      popList(params).then(
        res => {
          console.log(res.data);
          if (res.data.statusCode === 2000) {
            res.data.body.pageData.forEach(el=>{
              el.value = el.windowName;
            });
            this.searchLists = res.data.body.pageData;
            fn(this.searchLists);
          };
        },
        error => {
          console.log(error);
        }
      );
    },
    querySearchAsync(queryString, fn) {
      this.searchPopName(queryString, fn);
    },
    searchPop() {
      console.log(`弹窗搜索`);
      // console.log(this.statusList);
      let statusList = [];
      if (this.statusList.length >= 5) {
        statusList = "";
      } else {
        for (let i = 0; i < this.statusList.length; i++) {
          this.checkBoxLists.forEach(el => {
            el.name === this.statusList[i] && statusList.push(el.status);
          });
        }
        statusList = statusList.join(",");
      }
      console.log(statusList);
      //状态选择 弹窗名称
      this.$emit("searchPopName", this.value ,statusList, this.popName,this.num);
    }
  },
  created() {
    // if (!this.showArea) return;
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
.m_r_10 {
  margin-right: 10px;
}
</style>