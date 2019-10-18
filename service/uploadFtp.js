const client = require("scp2");
const chalk = require("chalk");
const ora = require("ora");
const Client = require("ssh2").Client;
const serviceInfor = require("./envInfor");
const begin = ora(`文件上传至${process.env.NODE_ENV}服务器\n`);
const conn = new Client();
function uploadFile() {
  client.scp(
    serviceInfor.documentFile,
    {
      host: serviceInfor.hostName,
      username: serviceInfor.userName,
      password: serviceInfor.password,
      path: serviceInfor.path
    },
    err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(chalk.red(err));
      } else {
        begin.stop();
        // eslint-disable-next-line no-console
        console.log(
          chalk.green(`文件在${process.env.NODE_ENV}环境上传完毕!\n`)
        );
      }
    }
  );
}
function start(conn) {
  conn
    .on("ready", () => {
      // eslint-disable-next-line no-console
      console.log(chalk.green("已连接至服务器...."));
      conn.exec(`rm -rf ${serviceInfor.path}/\n`, (err, stream) => {
        if (err) throw err;
        stream
          .on("close", () => {
            begin.start();
            uploadFile();
            conn.end();
          })
          .on("data", data => {
            // eslint-disable-next-line no-console
            console.log("STDOUT: " + data);
          })
          .stderr.on("data", data => {
            // eslint-disable-next-line no-console
            console.log("STDERR: " + data);
          });
      });
    })
    .connect({
      host: serviceInfor.hostName,
      // port: serviceInfor.port,
      username: serviceInfor.userName,
      password: serviceInfor.password
    });
}
start(conn);
