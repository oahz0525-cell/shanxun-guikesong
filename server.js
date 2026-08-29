#!/usr/bin/env node
/**
 * 山熏演示版静态服务器（公开仓库）
 * 仅提供静态文件，不含 REST / 溯源写入 API
 */
const http=require('http');
const fs=require('fs');
const path=require('path');
const PORT=process.env.PORT||8788;
const ROOT=__dirname;

const MIME={
  '.html':'text/html; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.css':'text/css',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.json':'application/json',
  '.svg':'image/svg+xml',
};

const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  let filePath=path.join(ROOT,decodeURIComponent(url.pathname));
  if(url.pathname==='/') filePath=path.join(ROOT,'山熏_demo.html');
  if(fs.existsSync(filePath)&&fs.statSync(filePath).isDirectory())
    filePath=path.join(filePath,'index.html');
  if(!fs.existsSync(filePath)){
    res.writeHead(404); return res.end('Not found');
  }
  const ext=path.extname(filePath);
  res.writeHead(200,{'Content-Type':MIME[ext]||'application/octet-stream'});
  fs.createReadStream(filePath).pipe(res);
});

if(require.main===module){
  server.listen(PORT,()=>{
    console.log(`山熏演示 → http://localhost:${PORT}/`);
  });
}else{
  module.exports=require('serverless-http')(server);
}
