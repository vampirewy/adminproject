const client = require("scp2");
client.scp(
  "dist/",
  {
    host: "120.77.39.79",
    username: "ppy",
    password: "Ppy@079@#,",
    path: "/web/admin/op"
  },
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("文件上传完毕!\n");
    }
  }
);
