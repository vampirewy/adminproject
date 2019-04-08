<template>
  <div class="pop_manager">
    <HeaderBar :showArea="showArea" @searchPopName="popRequest"></HeaderBar>
    <el-row>
      <el-col :span="24">
      <el-table :data="popLists" style="width: 100%" border stripe>
        <!-- <el-table-column align="center" type="index"></el-table-column> -->
        <el-table-column align="center" prop="windowId" label="ID" width="50"></el-table-column>
        <el-table-column align="center" prop="picUrl" label="图片" width="100">
          <template scope="scope">
              <img :src="scope.row.picUrl?scope.row.picUrl:''" style="width:80px;">
            </template>
        </el-table-column>
        <el-table-column align="center" prop="windowName" label="名称"></el-table-column>
        <el-table-column align="center" prop="actionType" label="跳转到"></el-table-column>
        <el-table-column align="center" prop="pushCount popCount" label="推送量/弹窗量" width="90">
          <template slot-scope="scope">
            <span>{{scope.row.pushCount?scope.row.pushCount:'-'}}</span>&nbsp;/&nbsp;<span>{{scope.row.popCount?scope.row.popCount:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="clickCount" label="点击量" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.clickCount?scope.row.clickCount:'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sortIndex" label="优先级">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sortIndex" size="mini" @blur="sort(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="traNames" label="活动商圈"></el-table-column>
        <el-table-column align="center" prop="startTime" label="开始时间">
        </el-table-column>
        <el-table-column align="center" prop="endTime" label="结束时间"></el-table-column>
        <el-table-column align="center" prop="modifyTime" label="更新时间"></el-table-column>
        <el-table-column align="center" prop="modifyUserName" label="更新人"></el-table-column>
        <el-table-column align="center" prop="status" label="状态"></el-table-column>
        <el-table-column align="center" prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="see(scope.row,'查看')">查看</el-button>
            <el-button v-if="scope.row.status === '未生效'" type="text" @click="del(scope.row)">删除</el-button>
            <el-button v-if="scope.row.status === '生效中'" type="text" @click="stop(scope.row)">停用</el-button>
            <el-button v-if="scope.row.status === '已删除'|| scope.row.status === '已停用' || scope.row.status === '已结束'" type="text" @click="reEdit(scope.row,'重新添加')">重新添加</el-button>
            <el-button type="text" @click="exportExcel(scope.row)">导出数据</el-button>
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
import {Message} from "element-ui";
import HeaderBar from "@/components/headerBar.vue";
import img from "../../img/demo1.png";
import { popList, delItem, stopItem, exportData, sort } from "@/api/popManager";
export default {
  name: "popmanager",
  components: {
    HeaderBar
  },
  data() {
    return {
      showArea: false, //头部商圈隐藏
      traId:'',
      popName:'',
      statusList:'',
      pageNum: 1,
      pageSize: 30,
      totalCount: null,
      totalPage: null,
      popLists:[
        //   {
        //   "actionType": "专题详情",
        //   "clickCount": 0,
        //   "endTime": "2018-08-24 16:00:00",
        //   "modifyTime": "2018-08-24 16:00:00",
        //   "modifyUserName": "wangyi",
        //   "picUrl": "http://images.alpha.pinpianyi.cn/images/common/7393f45591c64ba98a2ae1de37530b96.jpg",
        //   "popCount": 200,
        //   "pushCount": 100,
        //   "sortIndex": 0,
        //   "startTime": "2018-08-24 16:00:00",
        //   "status": '未生效',
        //   "traNames": "西湖/老余杭-便利店",
        //   "windowId": 1,
        //   "windowName": "可用红包"
        // },
        // {
        //   "actionType": "专题详情",
        //   "clickCount": 0,
        //   "endTime": "2018-08-24 16:00:00",
        //   "modifyTime": "2018-08-24 16:00:00",
        //   "modifyUserName": "wangyi",
        //   "picUrl": "http://images.alpha.pinpianyi.cn/images/common/7393f45591c64ba98a2ae1de37530b96.jpg",
        //   "popCount": 200,
        //   "pushCount": 100,
        //   "sortIndex": 0,
        //   "startTime": "2018-08-24 16:00:00",
        //   "status": '生效中',
        //   "traNames": "西湖/老余杭-便利店",
        //   "windowId": 2,
        //   "windowName": "可用红包"
        // },
        // {
        //   "actionType": "专题详情",
        //   "clickCount": 0,
        //   "endTime": "2018-08-24 16:00:00",
        //   "modifyTime": "2018-08-24 16:00:00",
        //   "modifyUserName": "wangyi",
        //   "picUrl": "http://images.alpha.pinpianyi.cn/images/common/7393f45591c64ba98a2ae1de37530b96.jpg",
        //   "popCount": 200,
        //   "pushCount": 100,
        //   "sortIndex": 0,
        //   "startTime": "2018-08-24 16:00:00",
        //   "status": '已删除',
        //   "traNames": "西湖/老余杭-便利店",
        //   "windowId": 3,
        //   "windowName": "可用红包"
        // },
        // {
        //   "actionType": "专题详情",
        //   "clickCount": 0,
        //   "endTime": "2018-08-24 16:00:00",
        //   "modifyTime": "2018-08-24 16:00:00",
        //   "modifyUserName": "wangyi",
        //   "picUrl": "http://images.alpha.pinpianyi.cn/images/common/7393f45591c64ba98a2ae1de37530b96.jpg",
        //   "popCount": 200,
        //   "pushCount": 100,
        //   "sortIndex": 0,
        //   "startTime": "2018-08-24 16:00:00",
        //   "status": '已结束',
        //   "traNames": "西湖/老余杭-便利店",
        //   "windowId": 4,
        //   "windowName": "可用红包"
        // },
        // {
        //   "actionType": "专题详情",
        //   "clickCount": 0,
        //   "endTime": "2018-08-24 16:00:00",
        //   "modifyTime": "2018-08-24 16:00:00",
        //   "modifyUserName": "wangyi",
        //   "picUrl": "http://images.alpha.pinpianyi.cn/images/common/7393f45591c64ba98a2ae1de37530b96.jpg",
        //   "popCount": 200,
        //   "pushCount": 100,
        //   "sortIndex": 0,
        //   "startTime": "2018-08-24 16:00:00",
        //   "status": '已停用',
        //   "traNames": "西湖/老余杭-便利店",
        //   "windowId": 5,
        //   "windowName": "可用红包"
        // }
      ]
    };
  },
  methods: {
    /**
     *  列表请求函数
     *  @statusList 状态选择项
     *  @popName 弹窗名称
    */
    popRequest(traId, statusList, windowName, page) {
      console.log(`弹窗列表`);
      // console.log(statusList);
      // console.log(popName);
      this.traId = traId;
      this.popName = windowName;
      this.statusList = statusList;
      this.pageNum = page ? page : this.pageNum;
      let params = {
        statusArray: this.statusList,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        windowName: this.popName,
        traId: this.traId
      };
      popList(params).then(res=>{
        console.log(res.data);
        if(res.data.statusCode === 2000){
          this.totalPage = res.data.body.pageCount;
          this.totalCount = res.data.body.totalSize;
          res.data.body.pageData.forEach(el=>{
            el.status = el.status === 1 ? "生效中" : el.status === 2 ? "已结束" : el.status === 3 ? "已停用" : el.status === 4 ? "已删除" : "未生效";
          });
          this.popLists = res.data.body.pageData;
        };
      },error=>{});
    },
    jumpAddPop(currentRow,currentRowText){
      let [popId, status, text ] = [ currentRow.windowId, currentRow.status, currentRowText ];
      this.$router.push({ name: `addpop`, params: { popId, status, text} });
    },
    see(currentRow,text){
      console.log(currentRow);
      this.jumpAddPop(currentRow,text);
    },
    del(currentRow){
      console.log(currentRow);
      console.log('删除ID为:'+currentRow.windowId);
      delItem(currentRow.windowId).then(res=>{
        console.log(res);
        if(res.data.statusCode !==2000) return this.$message({message:res.data.msg,type:`error`});
        this.$message({message:`删除成功`,type:`success`});
        setTimeout(()=>{this.popRequest(this.traId,this.statusList,this.popName)},300);
      },error=>{});
    },
    stop(currentRow){
      console.log(currentRow);
      console.log('停用ID为:'+currentRow.windowId);
      stopItem(currentRow.windowId).then(res=>{
        if(res.data.statusCode !== 2000) return this.$message({message:res.data.msg,type:`error`});
        this.$message({message:`停用成功`,type:`success`});
        setTimeout(()=>{this.popRequest(this.traId,this.statusList,this.popName)},300);
      },error=>{});
    },
    reEdit(currentRow,text){
      console.log(currentRow);
      this.jumpAddPop(currentRow,text);
    },
    //导出数据 -- excel
    exportExcel(currentRow){
      console.log('导出:');
      console.log(currentRow);
    },
    sort(currentRow){
      console.log(`这里是排序`);
      console.log(currentRow);
      let [ point, sortId,bizType ] = [currentRow.sortIndex,currentRow.windowId,`window-${localStorage.getItem('cityCode')}`];
      sort({point,sortId,bizType}).then(res=>{
        if(res.statusCode !==2000) return this.$message({message:res.data.msg,type:`error`});
        setTimeout(()=>{this.popRequest(this.traId,this.statusList,this.popName)},300);
      },error=>{});
    },
    handleCurrentChange(page) {
      console.log(`当前第${page}页`);
      this.pageNum = page;
      this.popRequest(this.traId,this.statusList,this.popName);
    },
    firstPage() {
      console.log(`第${this.pageNum}页`);
      this.pageNum = 1;
      this.popRequest(this.traId,this.statusList,this.popName);
    },
    lastPage() {
      console.log(`最后第${this.pageNum}页`);
      this.pageNum = this.totalPage;
      this.popRequest(this.traId,this.statusList,this.popName);
    },
  },
  created() {
    this.popRequest();
  }
};
</script>

<style scoped lang="less">
.pop_manager {
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