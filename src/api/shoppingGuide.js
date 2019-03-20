import service from "../utils/request";
//===================================导购模块================================//
//导购列表
export function shoppingGuide(params) {
  return service({
    url: `shopping/guides`,
    method: `get`,
    params
  });
}
//删除
export function del(params) {
  return service({
    url: `shopping/guides/${params}/drop`,
    method: `post`
  });
}
//停用
export function stop(params) {
  return service({
    url: `shopping/guides/${params}/stop`,
    method: `post`
  });
}
//排序
export function sort(params) {
  return service({
    url: `sort/moveTo`,
    method: `post`,
    data: params
  });
}
//创建导购
export function create(params) {
  return service({
    url: `shopping/guides/create`,
    method: `post`,
    data: params
  });
}
//除模版1外，专题模糊查询
export function checkSpecial(params) {
  return service({
    url: `shopping/topics/dropdown`,
    method: `get`,
    params
  });
}
//查询导购明细
export function guideDetails(params) {
  return service({
    url: `shopping/guides/${params.guideId}`,
    method: `get`
  });
}
//延长时间 
export function onlyDelayTime(params){
  return service({
    url:`shopping/guides/${params.guideId}/extendEndTime`,
    method:`post`,
    data:params
  });
}
//修改导购信息
export function modifyGuide(params){
  return service({
    url:`shopping/guides/${params.guideId}/modify`,
    method:`post`,
    data:params
  });
}