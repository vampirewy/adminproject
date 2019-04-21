const client = require("scp2");
client.scp(
  "dist/",
  {
    host: "172.16.31.21",
    username: "ppy",
    password: "ppy@app",
    path: "/ppy/web/admin/op"
  },
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("文件上传完毕!\n");
    }
  }
);
