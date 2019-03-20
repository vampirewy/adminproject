<template>
  <div class="special_good">
    <el-row>
      <el-col :span="24">
        <div class="top">
          <el-button type="danger" class="m_r_10" @click="delMany()">批量删除</el-button>
          <el-select v-model="stateOne" placeholder="请选择" class="m_r_10" @change="selectState()">
            <el-option
              v-for="item in state"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="one" placeholder="请选择" class="m_r_10" @change="selectOne()">
            <el-option
              v-for="item in oneSorts"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-select v-model="two" placeholder="请选择" class="m_r_10" @change="selectTwo()">
            <el-option
              v-for="item in twoSorts"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-select v-model="tagName" placeholder="请选择" class="m_r_10" @change="selectTagName()">
            <el-option
              v-for="item in tagLists"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-select v-model="goodName" placeholder="请选择" class="m_r_10" @change="selectGoods()">
            <el-option
              v-for="item in goodsName"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            class="search m_r_10"
            placeholder="请输入名称"
            prefix-icon="el-icon-search"
            v-model="inputText"
            clearable
          ></el-input>
          <el-button type="primary" class="m_r_10" @click="searchData()">查询</el-button>
          <el-upload
            class="upload-demo m_r_10"
            :action="uploadExcle"
            :headers="headers"
            :on-success="uploadExcel"
            :show-file-list="showFileList"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button type="danger">导入Excel</el-button>
          </el-upload>
          <el-button type="success" class="m_r_10">
            <a href="demo.xlsx" download="demo.xlsx">下载模版</a>
          </el-button>
        </div>
        <div class="bottom">
          <el-table
            ref="multipleTable"
            :data="tableData3"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="商品ID" width="120">
              <template slot-scope="scope">{{ scope.row.goodsId }}</template>
            </el-table-column>
            <el-table-column prop="picList" label="商品图片" width="120">
              <template scope="scope">
                <img
                  v-for="(item,index) in scope.row.picList"
                  :key="index"
                  :src="item"
                  alt
                  style="width:80px;"
                >
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="specification" label="商品规格" show-overflow-tooltip></el-table-column>
            <el-table-column prop="salesNum" label="总销量" show-overflow-tooltip></el-table-column>
            <el-table-column prop="traNames" label="未上架商圈" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sortIndex" label="排序" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.sortIndex" @blur="sort(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="operation" label="操作" show-overflow-tooltip>
              <template scope="scope">
                <el-button type="text" @click="del(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-button size="mini" @click.native="firstPage">首页</el-button>
          <el-pagination
            background
            layout="prev, pager, next,total,jumper"
            prev-text="上一页"
            next-text="下一页"
            :total="totalCount"
            :page-size="pageSize"
            :current-page.sync="pageNum"
            @current-change="handleCurrentChange"
          ></el-pagination>
          <el-button size="mini" @click.native="lastPage">尾页</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import img from "@/img/demo1.png";
import { Message } from "element-ui";
import {
  firstSorts,
  secondSorts,
  tasName,
  searchLists,
  delLists
} from "@/api/specialGuide";
import { sort } from "@/api/shoppingGuide";
export default {
  name: "goods",
  data() {
    // const topicId = sessionStorage.getItem("topicId");
    return {
      topicId: null,
      showFileList: false,
      uploadExcle: "",
      headers: { sessionId: localStorage.getItem(`sessionId`) },
      fileList: [],
      inputText: "",
      // input: "",
      //上下架
      stateOne: "",
      state: [
        {
          value: "",
          label: "上架状态"
        },
        {
          value: 0,
          label: "未上架"
        },
        {
          value: 1,
          label: "已上架"
        }
      ],
      one: "",
      oneSorts: [{ code: "", name: "一级分类" }],
      two: "",
      twoSorts: [{ code: "", name: "二级分类" }],
      tagName: "",
      tagLists: [{ code: "", name: "全部标签" }],
      //商品名称
      goodName: "",
      goodsName: [
        {
          value: "",
          label: "全部商品"
        },
        {
          value: "goodsName",
          label: "商品名称"
        },
        {
          value: "goodsId",
          label: "商品ID"
        },
        {
          value: "brand",
          label: "品牌"
        }
      ],
      // value: "",
      tableData3: [],
      multipleSelection: [],
      totalCount: null,
      // totalPage: null,
      pageSize: 30,
      pageNum: 1
    };
  },
  methods: {
    //上下架
    selectState() {
      //0未上架 1已上架
      console.log(`商品状态:${this.stateOne}`);
    },
    //一级分类
    fSorts() {
      firstSorts().then(
        res => {
          console.log(res.data);
          if (res.data.statusCode === 2000) {
            res.data.body.length &&
              res.data.body.forEach(el => {
                this.oneSorts.push({ code: el.code, name: el.name });
              });
          }
        },
        error => {}
      );
    },
    selectOne() {
      console.log(`父分类code:${this.one}`);
      this.sSorts(this.one);
      this.two = "";
    },
    //二级分类
    sSorts(one) {
      secondSorts({ fatherCode: one }).then(
        res => {
          let lists = [];
          if (res.data.statusCode === 2000) {
            res.data.body.length &&
              res.data.body.forEach(el => {
                this.twoSorts.push({ code: el.code, name: el.name });
                lists.push({ code: el.code, name: el.name });
                this.twoSorts = [{ code: "", name: "二级分类" }, ...lists];
              });
          }
        },
        error => {}
      );
    },
    selectTwo() {
      console.log(`子级分类code:${this.two}`);
    },
    //全部标签
    tagData() {
      tasName().then(
        res => {
          console.log(res.data);
          if (res.data.statusCode === 2000) {
            this.tagLists = res.data.body;
          }
        },
        error => {}
      );
    },
    selectTagName() {
      console.log(`标签code:${this.tagName}`);
    },
    //全部商品(商品ID或品牌)
    selectGoods() {
      console.log(`全部商品选择为${this.goodName}`);
    },
    uploadExcel(res) {
      console.log(res);
      if (res.statusCode === 2000) {
        this.$message({
          message: `导入成功`,
          type: `success`
        });
        //刷新数据列表
        this.search();
      } else {
        this.$message({
          message: res.msg,
          type: `error`
        });
      }
    },
    handleExceed(files, fileList) {},
    search() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        topicId: this.topicId,
        queryType: this.goodName, //商品ID(goodsId) or 品牌(goodsName)
        queryValue: this.inputText, //输入框的值
        sellOn: this.stateOne, //上架状态 0未上架 1可上架
        fatherCode: this.one, //一级分类
        sonCode: this.two, //二级分类
        labelCode: this.tagName //商品标签
      };
      searchLists(params).then(
        res => {
          console.log(res.data);
          if (res.data.statusCode === 2000) {
            this.totalCount = res.data.body.totalSize;
            this.tableData3 = res.data.body.pageData;
          } else {
          }
        },
        error => {}
      );
    },
    searchData() {
      this.pageNum = 1;
      this.search();
    },
    delMany() {
      console.log(this.multipleSelection);
      if (this.multipleSelection.length) {
        let goodsIdArray = [];
        this.multipleSelection.forEach(el => {
          console.log(el.goodsId);
          goodsIdArray.push(el.goodsId);
        });
        let params = {
          topicId: this.topicId,
          idArray: goodsIdArray
        };
        delLists(params).then(
          res => {
            if (res.data.statusCode === 2000) {
              console.log(res.data);
              this.$message({
                message: `删除成功`,
                type: `success`
              });
              this.search();
            } else {
            }
          },
          error => {}
        );
      } else {
        this.$message({ message: `请选择需删除商品`, type: `error` });
      }
    },
    sort(currentRow) {
      console.log(currentRow);
      let params = {
        bizType: "topic-" + this.topicId,
        sortId: currentRow.goodsId,
        point: currentRow.sortIndex
      };
      sort(params).then(
        res => {
          console.log(res.data);
          if (res.data.statusCode === 2000) {
            this.search();
          }
        },
        error => {}
      );
    },
    del(currentRow) {
      console.log(currentRow);
      let params = {
        topicId: this.topicId,
        idArray: [currentRow.goodsId]
      };
      delLists(params).then(
        res => {
          if (res.data.statusCode === 2000) {
            console.log(res.data);
            this.$message({
              message: `删除成功`,
              type: `success`
            });
            this.search();
          } else {
            this.$message({ message: res.data.msg, type: `error` });
          }
        },
        error => {}
      );
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    firstPage() {
      console.log(`第1页`);
      this.pageNum = 1;
      this.search();
    },
    lastPage() {
      console.log(`最后页`);
      this.pageNum = this.totalCount;
      this.search();
    },
    handleCurrentChange(pageNum) {
      console.log(pageNum);
      this.pageNum = pageNum;
      this.search();
    }
  },
  created() {
    console.warn(`商品ID`);
    if (this.$route.params.topicId) {
      console.log(this.$route.params.topicId);
      this.topicId = this.$route.params.topicId;
      this.uploadExcle = `${process.env.VUE_APP_BASE_URL}shopping/topics/${
        this.$route.params.topicId
      }/goods/upload`;
      //需要topicId,单跳无效
      this.fSorts();
      this.tagData();
      this.search();
    } else {
      this.$message({
        message: `无专题ID,请返回!!`,
        type: `error`
      });
    }
  }
};
</script>

<style scoped lang="less">
.special_good {
  margin-top: 20px;
  .top {
    display: flex;
    justify-content: space-between;
  }
  .bottom {
    margin-top: 20px;
  }
  .search {
    width: 50%;
  }
  .m_r_10 {
    margin-right: 10px;
  }
}
.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: center;
}
</style>