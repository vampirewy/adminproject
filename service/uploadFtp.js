/* eslint-disable no-console */
const client = require("scp2");
const fs = require("fs");
const archiver = require("archiver");
const chalk = require("chalk");
const ora = require("ora");
const Client = require("ssh2").Client;
const serviceInfor = require("./envInfor");
const begin = ora(`文件上传至${process.env.NODE_ENV}服务器\n`);
const conn = new Client();

// function zip(documentFile) {
//   // eslint-disable-next-line prettier/prettier
//   let output = fs.createWriteStream(__dirname + "/../" + documentFile); //打包出来后的压缩文件名+存放地址
//   let archive = archiver("zip", {
//     zlib: {
//       level: 9
//     } //最高级别压缩
//   });
//   let promise = new Promise((_resolve, _reject) => {
//     output.on("end", function() {
//       console.log("Data has been drained");
//     });
//     output.on("error", function(err) {
//       console.log("压缩失败");
//       return _reject(err);
//     });
//     output.on("close", function() {
//       console.log("压缩成功");
//       return _resolve(`压缩成功`);
//     });
//     archive.pipe(output);
//     archive.directory(__dirname + "/../dist/", false); //所要打包的文件夹
//     archive.finalize();
//   });
//   return promise;
// }
// async function upload(documentFile) {
//   const res = await zip(documentFile);
//   if (res === "压缩成功") {
//     // eslint-disable-next-line prettier/prettier
//     conn.on("ready", () => {
//         console.log(chalk.green("已连接至服务器...."));
//         conn.exec(`m -rf ${serviceInfor.path}/\n`, (err, stream) => {
//           if (err) throw err;
//           // eslint-disable-next-line prettier/prettier
//           stream.on("close", () => {
//               begin.start();
//               client.scp(
//                 serviceInfor.documentFile,
//                 {
//                   host: serviceInfor.hostName,
//                   username: serviceInfor.userName,
//                   password: serviceInfor.password,
//                   path: serviceInfor.path
//                 },
//                 err => {
//                   if (err) {
//                     // eslint-disable-next-line no-console
//                     console.log(chalk.red(err));
//                   } else {
//                     begin.stop();
//                     // eslint-disable-next-line prettier/prettier
//                     console.log(chalk.green(`文件在${process.env.NODE_ENV}环境上传完毕!\n`));
//                   }
//                 }
//               );
//               conn.end();
//             })
//             .on("data", data => {
//               // eslint-disable-next-line no-console
//               console.log("STDOUT: " + data);
//             })
//             .stderr.on("data", data => {
//               // eslint-disable-next-line no-console
//               console.log("STDERR: " + data);
//             });
//         });
//       })
//       .connect({
//         host: serviceInfor.hostName,
//         // port: serviceInfor.port,
//         username: serviceInfor.userName,
//         password: serviceInfor.password
//       });
//   }
// }
// upload(serviceInfor.documentFile);
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
        // eslint-disable-next-line prettier/prettier
        console.log(chalk.green(`文件在${process.env.NODE_ENV}环境上传完毕!\n`));
      }
    }
  );
}
// eslint-disable-next-line prettier/prettier
conn.on("ready", () => {
    console.log(chalk.green("已连接至服务器...."));
    conn.exec(`rm -rf ${serviceInfor.path}/\n`, (err, stream) => {
      if (err) throw err;
      // eslint-disable-next-line prettier/prettier
      stream.on("close", () => {
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
