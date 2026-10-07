import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {join,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID,randomBytes} from 'node:crypto';
import {spawn} from 'node:child_process';
import sharp from 'sharp';
import {loadNews,saveStory,listMedia} from './news-store.mjs';

export function createNewsManager({root,port=4178,build=true}={}){
  const token=randomBytes(32).toString('hex'),origin=`http://127.0.0.1:${port}`;
  let busy=false;
  const headers={'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"};
  const json=(res,status,value)=>{res.writeHead(status,{...headers,'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));};
  async function body(req,limit){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>limit){req.resume();throw Object.assign(new Error('파일 또는 내용이 허용 크기를 넘었습니다.'),{status:413});}chunks.push(chunk);}return Buffer.concat(chunks);}
  function run(command,args){return new Promise((resolve,reject)=>{const child=spawn(command,args,{cwd:root,windowsHide:true});let error='';child.stderr.on('data',chunk=>{error=(error+chunk.toString()).slice(-3000);});child.stdout.resume();child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(error||'미리보기를 생성하지 못했습니다.')));});}
  return createServer(async(req,res)=>{
    try{
      if(req.headers.host!==`127.0.0.1:${port}`){json(res,403,{error:'허용된 로컬 주소로 접속해주세요.'});return;}
      const url=new URL(req.url,origin);
      if(req.method==='POST'){
        if(req.headers.origin!==origin||req.headers['x-mokda-session']!==token){json(res,403,{error:'로컬 편집 세션을 새로 열어주세요.'});return;}
        if(busy){json(res,409,{error:'저장 또는 미디어 처리 중입니다. 완료 후 다시 시도해주세요.'});return;}
        busy=true;
        try{
          if(url.pathname==='/api/news'){
            if(!String(req.headers['content-type']).startsWith('application/json'))throw Object.assign(new Error('JSON 형식으로 저장해주세요.'),{status:415});
            const payload=JSON.parse((await body(req,512*1024)).toString());
            await saveStory(root,payload.record,payload.revision,{create:payload.create===true,homeCreators:payload.homeCreators});
            let built=true,warning='';
            if(build)try{await run(process.execPath,['scripts/generate-localized-pages.mjs']);}catch(error){built=false;warning='원본 저장은 완료됐지만 미리보기 생성에 실패했습니다. '+error.message.slice(0,500);}
            const snapshot=await loadNews(root);json(res,200,{data:snapshot.data,revision:snapshot.revision,assets:await listMedia(root),built,warning});return;
          }
          if(url.pathname==='/api/media'){
            const bytes=await body(req,100*1024*1024);
            const isMP4=bytes.length>12&&bytes.toString('ascii',4,8)==='ftyp';
            const name=`media-${Date.now()}-${randomUUID().slice(0,8)}`;
            if(isMP4){
              const ffmpeg=process.env.MOKDA_FFMPEG||join(root,'output/tools/ffmpeg/ffmpeg-9.0.2-essentials_build/bin/ffmpeg.exe');
              try{await stat(ffmpeg);}catch{throw Object.assign(new Error('영상 변환용 FFmpeg가 필요합니다. MOKDA_FFMPEG 경로를 설정해주세요.'),{status:400});}
              const scratch=join(root,'output/news-manager/uploads');await mkdir(scratch,{recursive:true});
              const input=join(scratch,name+'.mp4');await writeFile(input,bytes,{flag:'wx'});
              const output=join(root,'assets/videos/news',name+'.mp4');
              await run(ffmpeg,['-hide_banner','-loglevel','error','-i',input,'-map','0:v:0','-map','0:a?','-vf',"fps=30,scale='if(gte(iw,ih),min(1280,iw),min(720,iw))':-2,format=yuv420p",'-c:v','libx264','-preset','veryfast','-crf','27','-maxrate','1800k','-bufsize','3600k','-threads','4','-c:a','aac','-b:a','96k','-movflags','+faststart','-y',output]);
              json(res,200,{kind:'video',name,assets:await listMedia(root)});return;
            }
            const image=sharp(bytes,{limitInputPixels:40_000_000,animated:false});
            const metadata=await image.metadata();if(!['jpeg','png','webp'].includes(metadata.format))throw Object.assign(new Error('JPG, PNG, WebP 또는 MP4 파일을 선택해주세요.'),{status:400});
            const imageDir=join(root,'assets/images/news');
            await Promise.all([1200,640].map(width=>sharp(bytes,{limitInputPixels:40_000_000}).rotate().resize({width,withoutEnlargement:true}).webp({quality:84}).toFile(join(imageDir,name+(width===640?'-640':'')+'.webp'))));
            json(res,200,{kind:'image',name,assets:await listMedia(root)});return;
          }
          json(res,404,{error:'잘못된 경로입니다.'});return;
        }finally{busy=false;}
      }
      if(req.method!=='GET'){json(res,405,{error:'허용되지 않은 요청입니다.'});return;}
      if(url.pathname==='/api/news'){const snapshot=await loadNews(root);json(res,200,{data:snapshot.data,revision:snapshot.revision,assets:await listMedia(root)});return;}
      if(url.pathname==='/brand-logo.webp'){res.writeHead(200,{...headers,'Content-Type':'image/webp'});res.end(await readFile(join(root,'assets/images/mokda-logo-main.webp')));return;}
      if(url.pathname==='/'){
        const html=(await readFile(join(root,'scripts/news-manager-ui/index.html'),'utf8')).replace('__SESSION__',token);
        res.writeHead(200,{...headers,'Content-Type':'text/html; charset=utf-8'});res.end(html);return;
      }
      const ui={'/app.js':['app.js','text/javascript'],'/style.css':['style.css','text/css']}[url.pathname];
      if(ui){res.writeHead(200,{...headers,'Content-Type':ui[1]+'; charset=utf-8'});res.end(await readFile(join(root,'scripts/news-manager-ui',ui[0])));return;}
      const media=/^\/media\/([a-z0-9-]+(?:-640)?\.webp)$/.exec(url.pathname);
      if(media){const file=join(root,'assets/images/news',media[1]);await stat(file);res.writeHead(200,{...headers,'Content-Type':'image/webp'});createReadStream(file).pipe(res);return;}
      json(res,404,{error:'파일을 찾을 수 없습니다.'});
    }catch(error){json(res,error.status||400,{error:error.status?error.message:'요청 내용을 확인해주세요. '+error.message.slice(0,250)});}
  });
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const root=join(dirname(fileURLToPath(import.meta.url)),'..');
  const port=Number(process.argv[2]||4178);
  createNewsManager({root,port}).listen(port,'127.0.0.1',()=>console.log(`MOKDA 소식 관리: http://127.0.0.1:${port} (로컬 저장·미리보기 전용)`));
}
