import service from "../utils/request";
export function uploadImg() {
  return service({
    url: `/mall/support/uploadPic`
  });
}
