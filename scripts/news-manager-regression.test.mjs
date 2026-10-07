import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,mkdir,copyFile,readdir,cp,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {once} from 'node:events';
import {JSDOM} from 'jsdom';
import {createNewsManager} from './news-manager.mjs';
import {loadNews} from './news-store.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
await mkdir(join(root,'output'),{recursive:true});
const fixture=await mkdtemp(join(root,'output/news-manager-test-'));
// Synthetic records remain in this isolated, non-public fixture directory.
for(const name of await readdir(root)){if(/\.(?:js|html|css)$/.test(name))await copyFile(join(root,name),join(fixture,name));}
await cp(join(root,'styles'),join(fixture,'styles'),{recursive:true});
await mkdir(join(fixture,'scripts'),{recursive:true});
for(const name of await readdir(join(root,'scripts'))){if(name.endsWith('.mjs'))await copyFile(join(root,'scripts',name),join(fixture,'scripts',name));}
await cp(join(root,'scripts/news-manager-ui'),join(fixture,'scripts/news-manager-ui'),{recursive:true});
await mkdir(join(fixture,'assets/images'),{recursive:true});
await cp(join(root,'assets/images/news'),join(fixture,'assets/images/news'),{recursive:true});
await copyFile(join(root,'assets/images/mokda-logo-main.webp'),join(fixture,'assets/images/mokda-logo-main.webp'));
await copyFile(join(root,'assets/mokda-tailwind.css'),join(fixture,'assets/mokda-tailwind.css'));
await mkdir(join(fixture,'assets/videos/news'),{recursive:true});
for(const name of await readdir(join(root,'assets/videos/news')))await writeFile(join(fixture,'assets/videos/news',name),Buffer.from('fixture-only'));
process.env.MOKDA_FFMPEG=join(root,'output/tools/ffmpeg/ffmpeg-9.0.2-essentials_build/bin/ffmpeg.exe');
const productionBefore=await readFile(join(root,'site-news-data.js'),'utf8');
const port=4189,origin=`http://127.0.0.1:${port}`,server=createNewsManager({root:fixture,port});
server.listen(port,'127.0.0.1');await once(server,'listening');
try{
 const html=await (await fetch(origin)).text();const token=/name="mokda-session" content="([a-f0-9]+)"/.exec(html)[1];
 const response=await fetch(origin+'/api/news');assert.equal(response.headers.get('x-frame-options'),'DENY');
 const initial=await response.json();
 const from=initial.data.stories[0];
 const input={...structuredClone(from),id:'fixture-new-event',publishedDate:'2027-01-12',homePosition:1};
 const headers={'Content-Type':'application/json',Origin:origin,'X-Mokda-Session':token};
 const payload={record:input,revision:initial.revision,create:true,homeCreators:true};
 assert.equal((await fetch(origin+'/api/news',{method:'POST',headers:{...headers,Origin:'https://example.invalid'},body:JSON.stringify(payload)})).status,403);
 assert.equal((await fetch(origin+'/api/news',{method:'POST',headers:{...headers,'X-Mokda-Session':'wrong'},body:JSON.stringify(payload)})).status,403);
 const created=await fetch(origin+'/api/news',{method:'POST',headers,body:JSON.stringify(payload)});assert.equal(created.status,200);const after=await created.json();assert.equal(after.built,true,after.warning);
 assert(after.data.stories.some(s=>s.id==='fixture-new-event'));
 assert.equal(after.data.stories.find(s=>s.id===from.id).homeFeatured,false,'Move the selected home slot without deleting the previous story');
 assert.equal(after.data.stories.filter(s=>s.homeFeatured&&s.homeOrder===1).length,1);
 for(const lang of ['ko','es','en']){
  const page=new JSDOM(await readFile(join(fixture,lang,'news-fixture-new-event.html'),'utf8'));
  assert(page.window.document.querySelector('main h1').textContent.trim());assert.match(page.window.document.querySelector('link[rel="canonical"]').href,new RegExp('/'+lang+'/news-fixture-new-event.html$'));
  assert.match(page.window.document.querySelector('.news-meta').textContent,/2027/);page.window.close();
 }
 assert.match(await readFile(join(fixture,'sitemap.xml'),'utf8'),/news-fixture-new-event\.html/);
 assert.equal((await fetch(origin+'/api/news',{method:'POST',headers,body:JSON.stringify(payload)})).status,409,'Reject stale writes');
 const updated={...input,homePosition:0};for(const lang of ['KR','ES','EN'])updated[lang].title='Fixture title with "quotes" & <markup>';
 const result=await fetch(origin+'/api/news',{method:'POST',headers,body:JSON.stringify({record:updated,revision:after.revision,create:false})});assert.equal(result.status,200);const saved=await result.json();assert.equal(saved.built,true,saved.warning);
 const escaped=new JSDOM(await readFile(join(fixture,'en/news-fixture-new-event.html'),'utf8'));assert.equal(escaped.window.document.querySelector('h1').textContent,updated.EN.title);assert.equal(escaped.window.document.querySelector('h1 markup'),null);escaped.window.close();
 const home=new JSDOM(await readFile(join(fixture,'en/index.html'),'utf8'));assert.equal(home.window.document.querySelectorAll('[data-home-feature]').length,0,'An empty leading slot must not promote a smaller card');assert.equal(home.window.document.querySelectorAll('#home-news [data-news-card]').length,2);home.window.close();
 assert((await readdir(join(fixture,'output/news-manager/backups'))).length>=2);
 const bad={...updated,id:'../escape'};assert.equal((await fetch(origin+'/api/news',{method:'POST',headers,body:JSON.stringify({record:bad,revision:saved.revision,create:true})})).status,400);
 const image=await readFile(join(root,'assets/images/news/expo-booth.webp'));
 const upload=await fetch(origin+'/api/media',{method:'POST',headers:{Origin:origin,'X-Mokda-Session':token,'Content-Type':'image/webp'},body:image});assert.equal(upload.status,200);const uploaded=await upload.json();assert.equal(uploaded.kind,'image');assert((await stat(join(fixture,'assets/images/news',uploaded.name+'-640.webp'))).size>100);
 const svg=await fetch(origin+'/api/media',{method:'POST',headers:{Origin:origin,'X-Mokda-Session':token,'Content-Type':'image/svg+xml'},body:'<svg onload="alert(1)"></svg>'});assert.equal(svg.status,400);
 const clip=await readFile(join(root,'assets/videos/news/expo-visit.mp4'));
 const video=await fetch(origin+'/api/media',{method:'POST',headers:{Origin:origin,'X-Mokda-Session':token,'Content-Type':'video/mp4'},body:clip});assert.equal(video.status,200);const encoded=await video.json();assert.equal(encoded.kind,'video');assert((await stat(join(fixture,'assets/videos/news',encoded.name+'.mp4'))).size>10000);
 assert.equal((await fetch(origin+'/scripts/news-store.mjs')).status,404);
 assert.equal((await loadNews(fixture)).data.stories.length,initial.data.stories.length+1);
 assert.equal(await readFile(join(root,'site-news-data.js'),'utf8'),productionBefore,'Keep synthetic fixtures out of the real site');
 console.log('News manager regressions passed: isolated creation/editing, 3-language generation/sitemap, slot replacement, stale-write and CSRF rejection, automatic backups, image/video uploads and escaping.');
}finally{server.close();await once(server,'close');}
