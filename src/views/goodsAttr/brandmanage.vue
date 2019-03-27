<template>
  <div class="brand_extension">
    <header class="header">
      <el-autocomplete
        v-model="brandName"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入品牌名称"
        @select="selectBrandName"
      ></el-autocomplete>
      <el-button type="primary" class="add" @click="search()">搜索</el-button>
      <el-button type="danger" class="add" @click="dialogFormVisible=true">添加</el-button>
    </header>
    <section>
      <el-table :data="brandLists" style="width: 100%" border stripe>
        <!-- <el-table-column align="center" type="index"></el-table-column> -->
        <el-table-column align="center" prop="brandId" label="ID" width="75"></el-table-column>
        <el-table-column align="center" prop="brandName" label="品牌名称" width="100">
          <template slot-scope="scope">
            <span v-if="scope.$index!==editIndex">{{scope.row.brandName}}</span>
            <el-input
              size="mini"
              v-model="scope.row.brandName"
              @blur="editRow(scope.row)"
              v-if="scope.$index===editIndex"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goodsCount" label="商品数量"></el-table-column>
        <el-table-column align="center" prop="recoverCount" label="回收数量"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row,scope.$index)">编辑</el-button>
            <el-button type="text" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <footer>
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
    </footer>
    <el-dialog title="添加品牌名称" :visible.sync="dialogFormVisible">
      <el-form>
        <!-- <el-form-item label="请输入品牌名称"> -->
        <el-input
          maxlength="10"
          placeholder="请输入品牌名称"
          autocomplete="off"
          v-model="addBrandName"
          @blur="add()"
        ></el-input>
        <!-- </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  brandLists,
  addBrand,
  delBrand,
  modifyBrand
} from "@/api/brandManager";
import { Message } from "element-ui";
import { clearInterval, clearTimeout, setTimeout } from 'timers';
export default {
  name: "brandmanage",
  data() {
    return {
      reg: /^[\u4E00-\u9FA5A-Za-z]+$/, //中英文
      brandName: "", //输入品牌名称
      addBrandName: "", //添加输入名称
      dialogFormVisible: false, //弹窗
      // editShow: false, //编辑时，品牌名称改成输入框
      brandLists: [],
      searchLists: [],
      totalCount: null,
      totalPage: null,
      timer:null,
      pageSize: 30,
      pageNum: 1,
      editIndex: null //切换是展示或编辑的input框
    };
  },
  methods: {
    brandRequest(pageNum, pageSize) {
      let params = {
        pageNum: pageNum,
        pageSize: pageSize,
        brandName: this.brandName //模糊搜索的名称
      };
      brandLists(params).then(
        res => {
          console.log(res.data);
          if (res.data.statusCode === 2000) {
            this.totalCount = res.data.body.totalSize;
            this.totalPage = res.data.body.pageCount;
            this.brandLists = res.data.body.pageData;
          } else {
          }
        },
        error => {}
      );
    },
    search() {
      console.log(`搜索`);
      console.log(this.brandName);
      this.pageNum = 1;
      this.brandRequest(this.pageNum, this.pageSize);
    },
    add() {
      console.log(this.addBrandName);
    },
    //保存
    save() {
      if (!this.reg.test(this.addBrandName)) {
        this.$message({ message: `只可输入汉字英文字`, type: `error` });
        this.addBrandName = "";
      } else {
        let params = {
          brandName: this.addBrandName
        };
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
          addBrand(params).then(
            res => {
              if (res.data.statusCode === 2000) {
                this.$message({ message: `添加成功`, type: `success` });
                this.dialogFormVisible = false;
                this.pageNum = 1;
                this.brandRequest(this.pageNum, this.pageSize);
              } else {
                this.$message({ message: res.data.msg, type: `error` });
              }
              this.addBrandName = "";
            },
            error => {}
          );
        },500);
      }
    },
    searchBrand(brandName, fn) {
      let params = {
        brandName: this.brandName
      };
      brandLists(params).then(
        res => {
          if (res.data.statusCode === 2000) {
            console.log(res.data);
            res.data.body.pageData.length &&
              res.data.body.pageData.forEach(el => {
                el.value = el.brandName;
              });
            this.searchLists = res.data.body.pageData;
            fn(this.searchLists);
          }
        },
        error => {}
      );
    },
    querySearchAsync(queryString, fn) {
      console.log(queryString);
      this.searchBrand(queryString, fn);
    },
    selectBrandName(name) {
      console.log(`名字`);
      console.log(name);
    },
    editRow(currentRow) {
      console.warn(currentRow);
      let params = {
        brandId: currentRow.brandId,
        brandName: currentRow.brandName
      };
      modifyBrand(params).then(
        res => {
          if (res.data.statusCode === 2000) {
            this.$message({ message: `修改成功`, type: `success` });
            this.pageNum = 1;
            this.brandRequest(this.pageNum, this.pageSize, this.brandName);
          } else {
            this.$message({ message: res.data.msg, type: `error` });
          }
          // this.editShow = false;
          this.editIndex = null;
        },
        error => {}
      );
    },
    edit(currentRow, currentIndex) {
      console.log(`编辑当前行为：`);
      console.log(currentRow);
      console.log(currentIndex);
      this.editIndex = currentIndex;
      // this.editShow = true;
    },
    del(currentRow) {
      this.editIndex = null;
      console.log(`删除当前行为:`);
      console.log(currentRow);
      let [brandId] = [currentRow.brandId];
      delBrand({ brandId }).then(
        res => {
          if (res.data.statusCode === 2000) {
            this.$message({ message: `删除成功`, type: `success` });
            this.pageNum = 1;
            this.brandRequest(this.pageNum, this.pageSize);
          } else {
            this.$message({ message: res.data.msg, type: `error` });
          }
        },
        error => {}
      );
    },
    handleCurrentChange(page) {
      console.log(`当前第${page}页`);
      this.pageNum = page;
      // this.editShow = false;
      this.editIndex = null;
      this.brandRequest(this.pageNum, this.pageSize);
    },
    firstPage() {
      console.log(`第${this.pageNum}页`);
      this.pageNum = 1;
      // this.editShow = false;
      this.editIndex = null;
      this.brandRequest(this.pageNum, this.pageSize);
    },
    lastPage() {
      console.log(`最后第${this.pageNum}页`);
      this.pageNum = this.totalPage;
      // this.editShow = false;
      this.editIndex = null;
      this.brandRequest(this.pageNum, this.pageSize);
    }
  },
  created() {
    this.brandRequest(this.pageNum, this.pageSize);
  },
  updated() {
    window.scrollTo(0, 0);
  }
};
</script>

<style scoped lang="less">
.brand_extension {
  margin-top: 20px;
  .header {
    display: flex;
    margin-bottom: 20px;
    .add {
      margin-left: 10px;
    }
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