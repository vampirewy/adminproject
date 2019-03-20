<template>
  <div class="spcial_guide">
    <HeaderBar :allAreaName="allAreaName" @statusAreaName="specialGuideRequest"></HeaderBar>
    <el-row>
      <el-col :span="24">
        <el-table :data="specialGuideLists" stripe style="width:100%" border>
          <!-- <el-table-column align="center" type="index"></el-table-column> -->
          <el-table-column align="center" prop="topicId" label="专题ID" width="75"></el-table-column>
          <el-table-column prop="picUrl" label="专详图片" align="center" width="100">
            <template scope="scope">
              <img :src="scope.row.picUrl?scope.row.picUrl:''" style="width:80px;">
            </template>
          </el-table-column>
          <el-table-column prop="topicName" label="名称" align="center" width="100"></el-table-column>
          <el-table-column prop="topicTypeText" label="专题活动" align="center" width="80"></el-table-column>
          <el-table-column prop="goodsNum" label="专题商品" align="center" width="80">
            <template scope="scope">
              <span class="pointer" @click="selectGoods(scope.row)">{{scope.row.goodsNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="traNames" label="活动商圈" align="center"></el-table-column>
          <el-table-column prop="startTime" label="生效时间" align="center"></el-table-column>
          <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
          <el-table-column prop="modifyTime" label="更新时间" align="center"></el-table-column>
          <el-table-column prop="modifyUserName" label="更新人" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" align="center"></el-table-column>
          <el-table-column prop="operation" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.status==='未生效'" @click="edit(scope.row)">编辑</el-button>
              <el-button type="text" v-if="scope.row.status==='未生效'" @click="del(scope.row)">删除</el-button>
              <el-button
                type="text"
                v-if="scope.row.status==='生效中'"
                @click="delayTime(scope.row)"
              >延长时间</el-button>
              <el-button type="text" v-if="scope.row.status==='生效中'" @click="stop(scope.row)">停用</el-button>
              <el-button
                type="text"
                v-if="scope.row.status==='已停用'||scope.row.status==='已结束'||scope.row.status==='已删除'"
                @click="see(scope.row)"
              >查看</el-button>
              <el-button
                type="text"
                v-if="scope.row.status==='已停用'||scope.row.status==='已结束'||scope.row.status==='已删除'"
                @click="reEdit(scope.row,'重新编辑')"
              >重新添加</el-button>
              <el-button
                @click="top(scope.row)"
                type="text"
                v-if="(scope.row.status==='生效中'||scope.row.status==='未生效')&&scope.row.picUrl"
              >{{scope.row.upText}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
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
import { Message } from "element-ui";
import HeaderBar from "@/components/headerBar.vue";
import { specialGuide, del, stop, topGun } from "@/api/specialGuide";
export default {
  name:"specialguide",
  components: {
    HeaderBar
  },
  data() {
    return {
      totalCount: null,
      totalPage: null,
      pageSize: 30,
      pageNum: 1,
      specialGuideLists: [],
      allAreaName: [],
      upText: ``,
      traId: "",
      statusLists: "",
      topicName: ""
    };
  },
  methods: {
    /**
     * 1.modifyTime 更新时间
     * 2.modifyUserName 更新人
     * 3.picUrl 图片
     * 4.topicName 名称
     * 5.topicTypeText 专题活动
     * 6.traNames 商圈名称
     * 7.startTime 生效时间
     * 8.status 状态 0-末生效,1-生效中,2-已结束,3-已停用,4-已删除
     * 9.goodsNum 专题商品
     *
     * headerBar参数
     * @traId  商圈ID
     * @statusLists 未生效，已生效等状态
     * @topicName  专题名字
     * @page   页数重置1
     */
    specialGuideRequest(traId, statusLists, topicName, page) {
      (this.traId = traId),
        (this.statusLists = statusLists),
        (this.topicName = topicName);
      let params = {
        status: statusLists,
        pageNum: page || this.pageNum,
        pageSize: this.pageSize,
        traId: traId,
        topicName: topicName
      };
      specialGuide(params).then(
        res => {
          console.log(res.data.body.pageData);
          if (res.data.statusCode === 2000) {
            console.log(1111);
            this.totalCount = res.data.body.totalSize;
            this.totalPage = res.data.body.pageCount;
            // this.totalCount = res.data.body.pageCount;
            res.data.body.pageData &&
              res.data.body.pageData.length &&
              res.data.body.pageData.forEach(el => {
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
                // el.recommend = el.recommend ? `取消置顶` : `推荐置顶`;
                el.recommend
                  ? (el.upText = `取消置顶`)
                  : (el.upText = `推荐置顶`);
                el.topicTypeText = el.topicTypeText ? el.topicTypeText : "--";
              });
            this.specialGuideLists = res.data.body.pageData;
            console.log(`数据为`);
            console.log(this.specialGuideLists);
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    /** 先判断单子状态 未生效还是生效中  未生效可以全部修改、生效中只能修改时间
     *  @status 当前单子状态
     *  @topicId 当前专题ID号
     */
    edit(currentRow) {
      console.log(`当前选中行`);
      console.log(currentRow);
      this.$router.push({
        name: "infor",
        params: {
          topicId: currentRow.topicId,
          status: currentRow.status
        }
      });
    },
    delayTime(currentRow) {
      this.$router.push({
        name: "infor",
        params: {
          topicId: currentRow.topicId,
          status: currentRow.status
        }
      });
    },
    see(currentRow) {
      this.$router.push({
        name: "infor",
        params: {
          topicId: currentRow.topicId,
          status: currentRow.status
        }
      });
    },
    //调用创建专题信息接口，后台生成新信息条目
    reEdit(currentRow, editText) {
      this.$router.push({
        name: "infor",
        params: {
          topicId: currentRow.topicId,
          status: currentRow.status,
          text: editText
        }
      });
    },
    del(row) {
      this.$confirm(
        "如果操作删除,投放该专题的商圈,导购将不再生效!",
        "您确认删除？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(
        () => {
          console.log(`确定`);
          del(row.topicId).then(
            res => {
              console.log(res);
              if (res.data.statusCode === 2000 && res.data.body) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
              this.specialGuideRequest(
                this.traId,
                this.statusLists,
                this.topicName
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
    stop(row) {
      this.$confirm(
        "如果操作停用，投放该专题的商圈，导购将不会再显示！",
        "您确认停用？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(
        () => {
          stop(row.topicId).then(
            res => {
              console.log(res);
              if (res.data.statusCode === 2000) {
                this.$message({
                  type: "success",
                  message: "停用成功!"
                });
              }
              this.specialGuideRequest(
                this.traId,
                this.statusLists,
                this.topicName
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
    top(row) {
      console.log(row);
      let params = {
        recommend: (row.recommend = !row.recommend),
        topicId: row.topicId
      };
      topGun(params).then(
        res => {
          console.log(res.data);
          if (res.data.statusCode === 2000) {
            row.recommend
              ? this.$message({
                  message: `置顶成功`,
                  type: `success`
                })
              : this.$message({
                  message: `取消置顶`,
                  type: `error`
                });
            this.specialGuideRequest(
              this.traId,
              this.statusLists,
              this.topicName
            );
          } else {
            this.$message({
              message: res.data.msg,
              type: `error`
            });
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    selectGoods(currentRow) {
      console.log(`专题商品:`);
      console.log(currentRow.topicId);
      this.$router.push({
        name: "goods",
        params: { topicId: currentRow.topicId }
      });
    },
    handleCurrentChange(page) {
      console.log(`第${page}页`);
      this.pageNum = page;
      this.specialGuideRequest(this.traId, this.statusLists, this.topicName);
    },
    firstPage() {
      console.log(`第1页`);
      this.pageNum = 1;
      this.specialGuideRequest(this.traId, this.statusLists, this.topicName);
    },
    lastPage() {
      this.pageNum = this.totalPage;
      console.log(`最后${this.pageNum}页`);
      this.specialGuideRequest(this.traId, this.statusLists, this.topicName);
    }
  },
  created() {
    this.specialGuideRequest();
  },
  updated() {
    window.scrollTo(0, 0);
  }
};
</script>

<style  lang="less">
.spcial_guide {
  margin-top: 20px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: center;
}
.pointer {
  cursor: pointer;
  text-decoration: underline;
}
.el-table th.gutter {
  display: table-cell !important;
}
</style>