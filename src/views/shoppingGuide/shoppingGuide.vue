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
    <PageBar
      @pageBar="shoppingGuideRequest"
      :pageNum="pageNum"
      :pageSize="pageSize"
      :totalPage="totalPage"
      :totalCount="totalCount"
      :traId="traId"
      :statusLists="statusLists"
      :name="guideName"
    ></PageBar>
  </div>
</template>

<script>
import HeaderBar from "@/components/headerBar.vue";
import PageBar from "@/components/pageBar.vue";
import { getRequest, postRequest } from "@/utils/ajax";
import { MessageBounced } from "@/utils/message";
// import { allArea } from "@/api/headerBar";
export default {
  name: "shoopingGuide",
  components: {
    HeaderBar,
    PageBar
  },
  data() {
    return {
      showArea: true, //头部栏商圈选择
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
      console.log( traId, statusLists, guideName,page);
      console.log(`==============================`);
      this.traId = traId;
      this.statusLists = statusLists;
      this.guideName = guideName;
      this.pageNum = page ? page : this.pageNum;
      let params = {
        statusArray: statusLists,
        pageNum: this.pageNum,
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
      getRequest("/mall/shopping/guides", params).then(
        res => {
          this.totalCount = res.body.totalSize;
          this.totalPage = res.body.pageCount;
          res.body.pageData.length &&
            res.body.pageData.forEach(el => {
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
          this.shoppingGuideLists = res.body.pageData;
        },
        error => {
          console.log(error);
        }
      );
    },
    sort(currentRow) {
      console.log(`排序`);
      console.log(currentRow);
      let [sortId,point,bizType]=[currentRow.guideId,currentRow.sortIndex,'guide-'+localStorage.getItem('cityCode')];
      postRequest(`/mall/sort/moveTo`,{sortId,point,bizType}).then(res=>{
        console.log(res);
        this.shoppingGuideRequest(this.traId,this.statusLists,this.guideName);
      },error=>{
        new MessageBounced(error.msg,`error`).messageWindow();
      });
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
      let page = 1;
      new MessageBounced(`您确认停用?`,``,`如果操作停用，投放该导购的商圈，导购将不会再显示！`,action => {
        action === `confirm` &&  postRequest(`/mall/shopping/guides/${row.guideId}/stop`).then(res=>{
          console.log(res);
          new MessageBounced(`停用成功!`,`success`).messageWindow();
          this.shoppingGuideRequest(this.traId,this.statusLists,this.guideName,page);
        },error=>{
          new MessageBounced(error.msg,`error`).messageWindow();
        });
      }).confirmWindow();
    },
    del(currentRow) {
      let page = 1;
      new MessageBounced(`您确认删除?`,``,`如果操作删除,投放该导购的商圈,导购将不再生效!`,action => {
          if(action === `confirm`){
            console.log(`确认`);
            postRequest(`/mall/shopping/guides/${currentRow.guideId}/drop`).then(res=>{
              new MessageBounced(`删除成功!`,`success`).messageWindow();
              this.shoppingGuideRequest(this.traId,this.statusLists,this.guideName,page);
            },error=>{
              new MessageBounced(error.msg,`error`).messageWindow();
            });
          };
        }
      ).confirmWindow();
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