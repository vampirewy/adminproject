<template>
<div class="lay_out">
  <el-header class="header">
    <div class="left">
      <span class="logo">拼便宜-运营后台</span>
    </div>
    <div class="right">
      <el-select v-model="value" disabled>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span class="ml_10">欢迎使用</span>
      <span class="ml_10">退出</span>
    </div>
  </el-header>
  <div class="container">
    <el-aside width="201px" class="aside">
      <!-- <div class="left"> -->
      <el-menu :default-active="defaultActive" class="el-menu-demo" background-color="#545C64" text-color="#fff" active-text-color="#ffd04b" @select="changeRouter">
        <el-submenu :index="item.index" v-for="(item,index) in navLists" :key="index">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">{{item.name}}</span>
          </template>
          <el-menu-item :index="item1.path" v-for="(item1,index1) in item.sonName" :key="index1">{{item1.name}}</el-menu-item>
        </el-submenu>
      </el-menu>
      <!-- </div> -->
    </el-aside>
    <el-main class="right">
      <!-- <div class="right"> -->
      <el-col :span="24" class="main" style="min-height:100%;">
        <el-breadcrumb separator="/">
          <!-- <el-breadcrumb-item :to="{ path: '/shoppingGuide' }"></el-breadcrumb-item> -->
          <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <router-view></router-view>
      </el-col>
      <!-- </div> -->
    </el-main>
  </div>
</div>
</template>

<script>
const baseInfor = [{
  name: "商品属性",
  value: "manager",
  index: "1",
  sonName: [{
    name: "品牌管理",
    path: "/brandmanage"
  }]
}];
const otherCityInfor = [{
    name: "导购管理",
    value: "3310",
    index: "1",
    sonName: [{
      name: "列表",
      path: "/shoppingGuide"
    }]
  },
  {
    name: "专题管理",
    value: "3310",
    index: "2",
    sonName: [{
        name: "列表",
        path: "/specialguide"
      },
      {
        name: "信息",
        path: "/specialinfor"
      }
      // { name: "商品", path: "/specialgood" }
    ]
  },
  {
    name: "弹窗管理",
    value: "3310",
    index: "3",
    sonName: [{
        name: "列表",
        path: "/popmanager"
      },
      // {name:"添加",path:"/addpop"}
    ]
  }
];
export default {
  name: "layOut",
  data() {
    return {
      value: localStorage.getItem("cityCode"),
      options: [{
          value: "manager",
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
      navLists: []
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
    localStorage.getItem('cityCode') == 'manager' ? (this.navLists = baseInfor) : (this.navLists = otherCityInfor);
    if (this.value == `manager`) {
      this.defaultActive = window.location.href = window.location.href.substring(0, window.location.href.indexOf('#') + 1) + '/brandmanage';
    } else {
      // this.defaultActive = window.location.href = window.location.href.substring(0,window.location.href.indexOf('#')+1) + '/shoppingGuide';
      this.defaultActive = window.location.href.split("/#")[1];
    };

  },
  // mounted() {
  //   this.defaultActive = window.location.href.split("/#")[1];
  /**  */
  // },
  updated() {
    this.defaultActive = window.location.href.split("/#")[1];
    console.log(this.defaultActive);
    console.log(`城市code:${this.value}`);
    localStorage.getItem('cityCode') == 'manager' ? (this.navLists = baseInfor) : (this.navLists = otherCityInfor);
  },
  computed: {},
  watch: {
    $route: "getPath"
  }
};
</script>

<style lang="less" scoped>
@background: #545c64;
@color: #fff;
@fontSize: 18px;
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
    position: fixed;
    left: 0;
    bottom: 0;
    top: 60px;
    right: 0;
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
    position: relative;
    .right {
        margin-left: 200px;
        width: 100%;
    }
}
.main {
    // .padding();
    height: 100%;
}
/deep/ .el-aside {
    background: @background;
}
</style>
