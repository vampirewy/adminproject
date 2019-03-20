import service from "../utils/request";
//=====================全部商圈======================================//
export function allArea(params) {
  return service({
    url: `tra/topics/statistics`,
    method: `get`,
    params
  });
}
//导购、专题商圈
export function guideAllArea() {
  return service({
    url: `tra/topics/selections`,
    method: `get`
  });
}