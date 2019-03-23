import service from "../utils/request";
export function brandLists (params){
  return service({
    url:`goods/brand`,
    method:`get`,
    params
  })
}
export function addBrand(params){
  return service({
    url:`goods/brand/create`,
    method:`post`,
    data:params
  })
}
export function delBrand(params){
  return service({
    url:`goods/brand/${params.brandId}/drop`,
    method:`post`
  })
}
export function modifyBrand(params){
  return service({
    url:`goods/brand/${params.brandId}/modify`,
    method:`post`,
    data:params
  })
}