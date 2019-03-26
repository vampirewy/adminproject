import service from "./request";
export async function postRequest(url, data) {
  const response = await service.post(url, data);
  console.log(response);
}
export async function getRequest(url, params) {
  const response = await service.get(url, { params: params });
  return new Promise((resolve,reject)=>{
    if(response.data.statusCode === 2000){
      return resolve(response.data);
    }else{
      return reject(response.data);
    };
  });
}