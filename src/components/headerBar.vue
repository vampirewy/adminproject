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
      <div class="middle" v-if="showArea">
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
        <el-button type="primary" class="search" @click="searchPop()">搜索</el-button>
        <el-button type="danger" @click="addPopName()">添加</el-button>
      </div>
    </header>
  </div>
</template>

<script>
import { allArea } from "@/api/headerBar";
import { checkSpecial } from "@/api/shoppingGuide";
export default {
  name: "headerBar",
  props: {
    showArea: Boolean  //显示弹窗或者商圈
  },
  data() {
    return {
      statusList: [],  //选择的状态值  ''-全部状态 0-未生效 1-生效中 2-已结束 3-已停用 4-已删除
      checkBoxLists: [
        { name: "全部状态", status: `` },
        { name: "未生效", status: 0 },
        { name: "生效中", status: 1 },
        { name: "已结束", status: 2 },
        { name: "已停用", status: 3 },
        { name: "已删除", status: 4 }
      ],
      allAreaName: [],  //商圈
      inputText: ``, //除弹窗输入框外的输入框
      value: "",  //商圈ID号
      num: 1,  //页码
      popName: "",  //选择的弹窗名称
      searchLists: [] //弹窗模糊搜索列表
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
      this.$emit(
        "statusAreaName",
        this.value,
        this.statusList,
        this.inputText,
        this.num
      );
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
    searchPopName(topicName, fn) {
      let params = {
        topicName: topicName
      };
      checkSpecial(params).then(
        res => {
          console.log(res.data);
          if (res.data.statusCode === 2000) {
            res.data.body.length &&
              res.data.body.forEach(el => {
                el.value = el.topicName;
              });
            this.searchLists = res.data.body;
            fn(this.searchLists);
          } else {}
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
      console.log(this.statusList);
      this.statusList = this.statusList.join(",");
      //状态选择 弹窗名称
      // this.$emit("searchPopName", this.statusList, this.popName);
      this.statusList = [];
    },
    addPopName() {
      this.$router.push("/addpop");
    }
  },
  created() {
    if (!this.showArea) return;
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