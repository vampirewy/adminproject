const client = require('scp2');
// client.scp('dist/', {
//   host: '192.168.1.10',
//   username: 'app',
//   password: 'pg@app',
//   path: '/web/admin/op'
// }, function (err) {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log('文件上传完毕!\n')
//   }
// });
class UploadFtp {
  constructor(environment) {
    this.environment = environment
  }
  load() {
    switch (this.environment) {
      case 'dv2':
        console.log(`现在是dv2`);
        break;
      case 'alpha':
        break;
      case 'production':
        break;
    }
  }
}
export default UploadFtp;