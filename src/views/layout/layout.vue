<template>
  <div class="lay_out">
    <el-header class="header">
      <div class="left">
        <span class="logo">拼便宜-运营后台</span>
      </div>
      <div class="right">
        <el-select v-model="value" disabled>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <span class="ml_10">欢迎使用</span> -->
        <!-- <span class="ml_10">退出</span> -->
      </div>
    </el-header>
    <div class="container">
      <div class="left">
        <!-- <el-col :span="4" class="aside"> -->
        <el-menu
          :default-active="defaultActive"
          class="el-menu-demo"
          background-color="#545C64"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="changeRouter"
        >
          <el-submenu :index="item.index" v-for="(item,index) in navLists" :key="index">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item.name}}</span>
            </template>
            <el-menu-item
              :index="item1.path"
              v-for="(item1,index1) in item.sonName"
              :key="index1"
            >{{item1.name}}</el-menu-item>
          </el-submenu>
          <!-- <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">导购管理</span>
            </template>
            <el-menu-item index="/shoppingGuide">列表</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">专题管理</span>
            </template>
            <el-menu-item index="/specialguide">列表</el-menu-item>
            <el-menu-item index="/specialinfor">信息</el-menu-item>
          </el-submenu>-->
        </el-menu>
        <!-- </el-col> -->
      </div>
      <div class="right">
        <el-col :span="24" class="main" style="min-height:100%;">
          <el-breadcrumb separator="/">
            <!-- <el-breadcrumb-item :to="{ path: '/shoppingGuide' }"></el-breadcrumb-item> -->
            <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "layOut",
  data() {
    return {
      value: localStorage.getItem("cityCode"),
      options: [
        {
          value: "",
          label: "基础信息"
        },
        {
          value: "3310",
          label: "杭州"
        },
        {
          value: "3320",
          label: "宁波"
        },
        {
          value: "4201",
          label: "武汉"
        }
      ],
      defaultActive: "",
      navLists: [
        {
          name: "导购管理",
          index: "1",
          sonName: [
            {
              name: "列表",
              path: "/shoppingGuide"
            }
          ]
        },
        {
          name: "专题管理",
          index: "2",
          sonName: [
            { name: "列表", path: "/specialguide" },
            { name: "信息", path: "/specialinfor" },
            // { name: "商品", path: "/specialgood" }
          ]
        }
      ]
    };
  },
  methods: {
    changeRouter(index) {
      console.log(index);
      this.$router.push(index);
    },
    getPath() {
      this.defaultActive = this.$route.path;
    }
  },
  created() {
    this.defaultActive = window.location.href.split("/#")[1];
  },
  // mounted() {
  //   this.defaultActive = window.location.href.split("/#")[1];
  // },
  updated() {
    this.defaultActive = window.location.href.split("/#")[1];
  },
  computed: {},
  watch: {
    $route: "getPath"
  }
};
</script>

<style lang="less" scoped>
@background: #545C64;
@color: #fff;
@fontSize: 18px;
// .lay_out{
//   height:100%;
//   width:100%;
// }
.padding() {
  padding: 20px;
}
.ml_10() {
  margin-left: 10px;
}
.lay_out {
  height: 100%;
}
.aside {
  background: @background;
  // position:fixed;
  // left:0;
  // bottom:0;
  // top:0;
  // right:0;
}
.header {
  background: @background;
  line-height: 60px;
  color: @color;
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 20;
  .logo {
    font-size: @fontSize;
  }
  .right {
    .ml_10 {
      .ml_10();
      cursor: pointer;
    }
  }
}
.container {
  min-height: 100%;
  margin-top: 60px;
  display: flex;
  // border: 1px solid red;
  .left {
    position: fixed;
    top: 60px;
    bottom: 0;
    right: 0;
    left: 0;
    background: @background;
    width: 201px;
  }
  .right {
    margin-left: 200px;
    width: 100%;
  }
}
// .content {
//   display: flex;
//   .left {
//     min-height: 980px;
//     background: #000;
//   }
//   .left,
//   .el-row {
//     width: 202px;
//   }
// }
.main {
  .padding();
  height: 100%;
  // width: 100%;
  // .top {
  //   display: flex;
  //   align-items: center;
  // }
}
</style>