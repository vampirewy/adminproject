const serviceLists = {
  dv2: () => {
    return {
      envName: "dv2",
      documentFile: "dist/",
      hostName: "192.168.1.10",
      userName: "app",
      password: "pg@app",
      path: "/web/admin/op",
      port: 22
    };
  },
  newdv2: () => {
    return {
      envName: "newdv2",
      documentFile: "dist/",
      hostName: "172.16.31.47",
      userName: "ppy",
      password: "pg@app",
      path: "/ppy/web/admin/op",
      port: 22
    };
  },
  alpha: () => {
    return {
      envName: "alpha",
      documentFile: "dist/",
      hostName: "172.16.31.21",
      userName: "ppy",
      password: "pg@app",
      path: "/ppy/web/admin/op",
      port: 22
    };
  },
  production: () => {
    return {
      envName: "production",
      documentFile: "dist/",
      hostName: "120.77.39.79",
      userName: "ppy",
      password: "Ppy@079@#,",
      path: "/web/admin/op",
      port: 22
    };
  }
};
module.exports = serviceLists[process.env.NODE_ENV]();
