const client = require('scp2');
client.scp('./dist/*', {
  host: '192.168.1.10',
  username: 'app',
  password: 'pg@app',
  path: '/web/admin/op/'
}, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('文件上传完毕!\n')
  }
});