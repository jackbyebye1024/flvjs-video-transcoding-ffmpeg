const NodeMediaServer = require("node-media-server"),
  query = require("./query.js"),
  { spawn } = require("child_process");


query().then(res=>{
  res.forEach(element => {
    console.log(element);
    let config = {
      rtmp: {
        port: element.http_port,
        chunk_size: 60 * 1000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30,
      },
      http: {
        port: element.ws_port,
        allow_origin: "*",
      },
    };
    let nms = new NodeMediaServer(config);
    nms.run();
  });

  return res;
}).then((res) => {
  res.forEach(element => {
    let childProcess = spawn("ffmpeg", [
      "-i", // 源文件
      element.camera_ip,
      "-vcodec",
      "libx264",
      "-f",
      "flv",
      "-r",
      "15",
      "-s",
      "1920*1080",
      "-an",
      `rtmp://127.0.0.1:${element.http_port}/live/abc`,
    ]);
    childProcess.stderr.on("data", (data) => {
      console.log(`stderr: ${data}`);
    });
    childProcess.on("close", (code) => {
      console.log(`转码进程退出 with code${code}`);
    });
    console.log(`转码进程启动`);
  });
});