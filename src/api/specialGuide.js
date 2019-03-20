import service from "../utils/request";
//==============专题====================//
//列表信息
export function specialGuide(params) {
  return service({
    url: `shopping/topics`,
    method: `get`,
    params
  });
}
//删除
export function del(params) {
  return service({
    url: `shopping/topics/${params}/drop`,
    method: `post`
  });
}
//停用
export function stop(params) {
  return service({
    url: `shopping/topics/${params}/stop`,
    method: `post`
  });
}
//置顶
export function topGun(params) {
  return service({
    url: `shopping/topics/${params.topicId}/recommend`,
    method: `post`,
    data: params
  });
}
//创建无活动类型
export function createNoActivity(params) {
  return service({
    url: `shopping/topics/create`,
    method: `post`,
    data: params
  });
}
//创建有活动类型
export function createActivity(params) {
  return service({
    url: `shopping/topics/moneyOff`,
    method: `post`,
    data: params
  });
}
//专题商品一级分类
export function firstSorts() {
  return service({
    url: `sell/firstSorts`,
    method: `post`
  });
}
//二级分类
export function secondSorts(params) {
  return service({
    url: `sell/secondSorts`,
    method: `get`,
    params
  });
}
//全部标签
export function tasName() {
  return service({
    url: `sell/getLabelList`,
    method: `post`
  });
}
//查询商品列表
export function searchLists(params) {
  return service({
    url: `shopping/topics/${params.topicId}/goods`,
    method: `get`,
    params
  });
}
//删除商品
export function delLists(params) {
  return service({
    url: `shopping/topics/${params.topicId}/goods/drop`,
    method: `post`,
    data: params
  });
}
//查看专题详情
export function topicDetails(params){
  return service({
    url:`shopping/topics/${params}/detail`,
    method:`get`
  });
}
//修改无活动信息
export function modifyNoActivity(params){
  return service({
    url:`shopping/topics/${params.topicId}/modify`,
    method:`post`,
    data:params
  });
}
//修改有活动的信息
export function modifyActivity(params){
  return service({
    url:`shopping/topics/${params.topicId}/modifyMoneyOff`,
    method:`post`,
    data:params
  })
}
//生效中只修改时间
export function onlyModifyTime(params){
  return service({
    url:`shopping/topics/${params.topicId}/extendEndTime`,
    method:`post`,
    data:params
  });
}