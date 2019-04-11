const client = require('scp2');
client.scp('dist/', {
  host: '120.78.153.9',
  username: 'ppy',
  password: 'ppy@009',
  path: '/ppy/web/admin/op'
}, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('文件上传完毕!\n')
  }
});