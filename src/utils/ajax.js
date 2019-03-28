import service from "./request";
let timer = null;
export function postRequest(url, data) {
  clearTimeout(timer);
  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      service.post(url, data).then(res => {
        if (res.data.statusCode === 2000) {
          return resolve(res.data);
        } else {
          return reject(res.data);
        };
      }, error => {});
    }, 500);
  });
}
// export function postRequest(url, data) {
//   clearTimeout(timer);
//   return new Promise((resolve, reject) => {
//     timer = setTimeout(() => {
//       return async function ajax() {
//         const response = await service.post(url, data);
//         if (response.data.statusCode === 2000) {
//           return resolve(response.data);
//         } else {
//           return reject(response.data);
//         };
//       };
//     }, 500);
//   });
// }
export function getRequest(url, params) {
  clearTimeout(timer);
  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      service.get(url, {
        params: params
      }).then(res => {
        if (res.data.statusCode === 2000) {
          return resolve(res.data);
        } else {
          return reject(res.data);
        }
      }, error => {});
    }, 500);
  });
}