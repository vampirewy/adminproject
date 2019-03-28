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
    <PageBar
      @pageBar="specialGuideRequest"
      :pageNum="pageNum"
      :pageSize="pageSize"
      :totalPage="totalPage"
      :totalCount="totalCount"
      :traId="traId"
      :statusLists="statusLists"
      :name="topicName"
    ></PageBar>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { MessageBounced } from "@/utils/message";
import HeaderBar from "@/components/headerBar.vue";
import PageBar from "@/components/pageBar.vue";
import { specialGuide, del} from "@/api/specialGuide";
import { getRequest, postRequest } from "@/utils/ajax";
export default {
  name: "specialguide",
  components: {
    HeaderBar,
    PageBar
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
      this.traId = traId;
      this.pageNum = page ? page : this.pageNum;
      this.statusLists = statusLists;
      this.topicName = topicName;
      this.pageNum = page ? page : this.pageNum;
      let params = {
        status: statusLists,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        traId: traId,
        topicName: topicName
      };
      getRequest(`/mall/shopping/topics`, params).then(
        res => {
          this.totalCount = res.body.totalSize;
          this.totalPage = res.body.pageCount;
          res.body.pageData.length &&
            res.body.pageData.forEach(el => {
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
              el.recommend = el.recommend
                ? (el.upText = `取消置顶`)
                : (el.upText = `推荐置顶`);
              el.topicTypeText = el.topicTypeText ? el.topicTypeText : `--`;
            });
          this.specialGuideLists = res.body.pageData;
        },
        error => {}
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
    del(currentRow) {
      let page = 1;
      new MessageBounced(`您确认删除?`,``,`如果操作删除,投放该专题的商圈,导购将不再生效!`,action =>{
        postRequest(`/mall/shopping/topics/${currentRow.topicId}/drop`).then(res=>{
          new MessageBounced(`删除成功`,`success`).messageWindow();
          this.specialGuideRequest(this.traId,this.statusLists,this.topicName,page);
        },error=>{
          new MessageBounced(error.msg,`error`).messageWindow();
        });
      }).confirmWindow();
    },
    stop(currentRow) {
      let page = 1;
      new MessageBounced(`您确认停用?`,``,`如果操作停用，投放该专题的商圈，导购将不会再显示！`,action =>{
        action === `confirm` && postRequest(`/mall/shopping/topics/${currentRow.topicId}/stop`).then(res=>{
          new MessageBounced(`停用成功!`,`success`).messageWindow();
          this.specialGuideRequest(this.traId,this.statusLists,this.guideName,page);
        },error=>{
          new MessageBounced(error.msg,`error`).messageWindow();
        });
      }).confirmWindow();
    },
    top(currentRow) {
      console.log(currentRow);
      let params = {
        recommend: (currentRow.recommend = !currentRow.recommend),
        topicId: currentRow.topicId
      };
      postRequest(`/mall/shopping/topics/${params.topicId}/recommend`,params).then(res=>{
        console.log(res);
        currentRow.recommend ? new MessageBounced(`置顶成功`,`success`).messageWindow() : new MessageBounced(`取消置顶`,`error`).messageWindow();
        this.specialGuideRequest(this.traId,this.statusLists,this.topicName);
      },error=>{
        new MessageBounced(res.msg,`error`).messageWindow();
      });
    },
    selectGoods(currentRow) {
      console.log(`专题商品:`);
      console.log(currentRow.topicId);
      this.$router.push({
        name: "goods",
        params: { topicId: currentRow.topicId }
      });
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