import service from "../utils/request";
//弹窗列表
export function popList(params) {
  return service({
    url: `/mall/shopping/window/list`,
    method: `get`,
    params
  })
}
//查看
export function seeDetail(params) {
  return service({
    url: `/mall/shopping/window/${params}/detail`,
    method: `get`
  })
}
//排序
export function sort(params) {
  return service({
    url: `/mall/sort/moveTo`,
    method: `post`,
    data: params
  });
}
//删除
export function delItem(params) {
  return service({
    url: `/mall/shopping/window/${params}/drop`,
    method: `post`
  })
}
//停用
export function stopItem(params) {
  return service({
    url: `/mall/shopping/window/${params}/stop`,
    method: `post`
  })
}
//导出数据
export function exportData(params) {
  return service({
    url: `/mall/shopping/window/${params}/exportOut`,
    method: `post`,
    responseType:'blob'
  })
}

//新增 重新添加
export function addReeditDetail(params) {
  return service({
    url: `/mall/shopping/window/create`,
    method: `post`,
    data: params
  })
}