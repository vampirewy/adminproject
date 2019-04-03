import service from "../utils/request";
export function popList(params){
  return service({
    url:`/mall/shopping/window/list`,
    method:`get`,
    params
  })
}