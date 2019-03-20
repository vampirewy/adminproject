<template>
  <div class="shoppingguide">
    <HeaderBar @statusAreaName="shoppingGuideRequest"></HeaderBar>
    <div class="lists">
      <el-table :data="shoppingGuideLists" style="width: 100%" border stripe>
        <!-- <el-table-column align="center" type="index"></el-table-column> -->
        <el-table-column align="center" prop="guideId" label="导购ID" width="75"></el-table-column>
        <el-table-column align="center" prop="templateCodeText" label="模版" width="60"></el-table-column>
        <el-table-column align="center" prop="guideName" label="名称"></el-table-column>
        <el-table-column align="center" prop="guideNameDisplay" label="显示名称"></el-table-column>
        <el-table-column align="center" prop="traNames" label="商圈"></el-table-column>
        <el-table-column align="center" prop="sortIndex" label="排序">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sortIndex" size="mini" @blur="sort(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="startTime" label="生效时间"></el-table-column>
        <el-table-column align="center" prop="endTime" label="结束时间"></el-table-column>
        <el-table-column align="center" prop="modifyTime" label="更新时间"></el-table-column>
        <el-table-column align="center" prop="modifyUserName" label="更新人"></el-table-column>
        <el-table-column align="center" prop="status" label="状态"></el-table-column>
        <el-table-column align="center" prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" v-if="scope.row.status==='未生效'">编辑</el-button>
            <el-button type="text" v-if="scope.row.status==='未生效'" @click="del(scope.row)">删除</el-button>
            <el-button type="text" v-if="scope.row.status==='生效中'" @click="delay(scope.row)">延长时间</el-button>
            <el-button type="text" v-if="scope.row.status==='生效中'" @click="stop(scope.row)">停用</el-button>
            <el-button
              type="text"
              v-if="scope.row.status==='已停用'||scope.row.status==='已结束'||scope.row.status==='已删除'"
              @click="see(scope.row)"
            >查看</el-button>
            <el-button
              type="text"
              v-if="scope.row.status==='已停用'||scope.row.status==='已结束'||scope.row.status==='已删除'"
              @click="resEdit(scope.row,`重新添加`)"
            >重新添加</el-button>
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
  </div>
</template>

<script>
import HeaderBar from "@/components/headerBar.vue";
import { shoppingGuide, del, stop, sort } from "@/api/shoppingGuide";
import { allArea } from "@/api/headerBar";
export default {
  name: "shoopingGuide",
  components: {
    HeaderBar
  },
  data() {
    return {
      input: ``,
      totalCount: null,
      totalPage: null,
      pageSize: 30,
      pageNum: 1,
      shoppingGuideLists: [],
      // allAreaName: []
      traId: "",
      statusLists: "",
      guideName: ""
    };
  },
  methods: {
    shoppingGuideRequest(traId, statusLists, guideName, page) {
      console.log(`==============================`);
      console.log(traId, statusLists, guideName, page);
      console.log(`==============================`);
      this.traId = traId;
      this.statusLists = statusLists;
      this.guideName = guideName;
      let params = {
        statusArray: statusLists,
        pageNum: page || this.pageNum,
        pageSize: this.pageSize,
        traId: traId,
        guideName: guideName
      };
      console.warn(params.status);
      /**
       * pageCount 总页数
       * totalSize 总条数
       * pageData  为具体数据
       * 1. guideId id号
       * 2. templateCodeText  模板
       * 3. guideName 名称
       * 4. guideNameDisplay 显示名称 0为否，1为是
       * 5. traNames 商圈
       * 6. createTime 生效时间
       * 7. modifyTime 更新时间
       * 8. modifyUserName 更新人
       * 9. status 状态 0未生效 1生效中 2已结束 3已停用 4已删除
       *
       */
      shoppingGuide(params).then(
        res => {
          if (res.data.statusCode === 2000) {
            console.info(res.data.body);
            this.totalCount = res.data.body.totalSize;
            this.totalPage = res.data.body.pageCount;
            // this.totalCount=res.data.body.pageCount;
            // this.totalPage = Math.ceil(res.data.body.totalSize / this.pageSize);
            res.data.body.pageData &&
              res.data.body.pageData.length &&
              res.data.body.pageData.forEach(el => {
                el.guideNameDisplay = el.guideNameDisplay ? "是" : "否";
                el.status =
                  el.status === 1
                    ? "生效中"
                    : el.status === 2
                    ? "已结束"
                    : el.status === 3
                    ? "已停用"
                    : el.status === 4
                    ? "已删除"
                    : "未生效";
              });
            this.shoppingGuideLists = res.data.body.pageData;
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    sort(currentRow) {
      console.log(`排序`);
      console.log(currentRow);
      let params = {
        // bizType:'guide',
        bizType: "guide-" + localStorage.getItem("cityCode"),
        sortId: currentRow.guideId,
        point: currentRow.sortIndex
      };
      sort(params).then(
        res => {
          console.log(res.data);
          if (res.data.statusCode === 2000) {
            this.shoppingGuideRequest(
              this.traId,
              this.statusLists,
              this.guideName
            );
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    edit(currentRow) {
      console.log(`当前编辑行`);
      console.log(currentRow);
      let [guideId, status, templateCode] = [
        currentRow.guideId,
        currentRow.status,
        currentRow.templateCode
      ];
      this.$router.push({
        name: `addshopping`,
        params: {
          guideId,
          status,
          templateCode
        }
      });
    },
    delay(currentRow) {
      console.log(`当前需延时的行`);
      console.log(currentRow);
      let [guideId, status, templateCode] = [
        currentRow.guideId,
        currentRow.status,
        currentRow.templateCode
      ];
      this.$router.push({
        name: `addshopping`,
        params: {
          guideId,
          status,
          templateCode
        }
      });
    },
    see(currentRow) {
      console.log(currentRow);
      let [guideId, status, templateCode] = [
        currentRow.guideId,
        currentRow.status,
        currentRow.templateCode
      ];
      this.$router.push({
        name: `addshopping`,
        params: {
          guideId,
          status,
          templateCode
        }
      });
    },
    resEdit(currentRow, text) {
      let [guideId, status, templateCode] = [
        currentRow.guideId,
        currentRow.status,
        currentRow.templateCode
      ];
      this.$router.push({
        name: `addshopping`,
        params: {
          guideId,
          status,
          templateCode,
          text: text
        }
      });
    },
    stop(row) {
      this.$confirm(
        "如果操作停用，投放该导购的商圈，导购将不会再显示！",
        "您确认停用？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(
        () => {
          stop(row.guideId).then(
            res => {
              console.log(res);
              if (res.data.statusCode === 2000 && res.data.body) {
                this.$message({
                  type: "success",
                  message: "停用成功!"
                });
              }
              this.shoppingGuideRequest(
                this.traId,
                this.statusLists,
                this.guideName
              );
            },
            error => {
              console.log(error);
            }
          );
        },
        () => {
          console.log(`取消`);
        }
      );
    },
    del(row) {
      this.$confirm(
        "如果操作删除,投放该导购的商圈,导购将不再生效!",
        "您确认删除？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(
        () => {
          console.log(`确定`);
          del(row.guideId).then(
            res => {
              console.log(res);
              if (res.data.statusCode === 2000 && res.data.body) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
              this.shoppingGuideRequest(
                this.traId,
                this.statusLists,
                this.guideName
              );
            },
            error => {
              console.log(error);
            }
          );
        },
        () => {
          console.log(`取消`);
        }
      );
    },
    handleCurrentChange(page) {
      console.log(`当前第${page}页`);
      this.pageNum = page;
      this.shoppingGuideRequest(this.traId, this.statusLists, this.guideName);
    },
    firstPage() {
      console.log(`第${this.pageNum}页`);
      this.pageNum = 1;
      this.shoppingGuideRequest(this.traId, this.statusLists, this.guideName);
    },
    lastPage() {
      console.log(`最后第${this.pageNum}页`);
      this.pageNum = this.totalPage;
      this.shoppingGuideRequest(this.traId, this.statusLists, this.guideName);
    }
  },
  created() {
    this.shoppingGuideRequest();
  },
  updated() {
    window.scrollTo(0, 0);
  }
};
</script>

<style scoped lang="less">
.shoppingguide {
  margin-top: 20px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: center;
}
</style>