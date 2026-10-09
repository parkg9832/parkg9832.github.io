import { readFile, writeFile, rename, mkdir, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { createHash, randomUUID } from 'node:crypto';

export async function loadNews(root) {
  const source = await readFile(join(root,'site-news-data.js'),'utf8');
  const context={window:{}};runInNewContext(source,context,{timeout:1000});
  return {data:JSON.parse(JSON.stringify(context.window.MOKDA_NEWS)),revision:createHash('sha256').update(source).digest('hex'),source};
}
const fail = message => {throw Object.assign(new Error(message),{status:400});};
const string = (value,label,max,required=true) => {
  if(typeof value!=='string'||value.length>max|| (required&&!value.trim()))fail(`${label} 내용을 확인해주세요.`);
  return value.trim();
};
function validDate(value,label,required=false){
  if(!value&&!required)return '';
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||Number.isNaN(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value)fail(`${label} 날짜를 확인해주세요.`);
  return value;
}
export async function validateStory(root,input,data) {
  if(!input||typeof input!=='object'||Array.isArray(input))fail('소식 내용이 필요합니다.');
  if(typeof input.id!=='string'||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.id)||input.id.length>80)fail('주소는 영문 소문자·숫자·하이픈으로 입력해주세요.');
  if(!['news','press','events','collaborations'].includes(input.category))fail('분류를 선택해주세요.');
  const existing=data.stories.find(s=>s.id===input.id);
  const record={...existing,id:input.id,category:input.category==='press'?'press':'news',publishedDate:validDate(input.publishedDate,'게시일',true),location:string(input.location||'','장소',100,false)};
  const position=Number(input.homePosition||0);
  if(!Number.isInteger(position)||position<0||position>4)fail('홈 노출 위치를 확인해주세요.');
  record.homeFeatured=position>0;record.homeOrder=position||99;
  for(const key of ['image','video']){
    const value=input[key]||'';
    if(key==='video'&&!value){delete record.video;continue;}
    if(typeof value!=='string'||!/^[a-z0-9][a-z0-9-]{0,95}$/.test(value))fail(`${key==='image'?'표지 이미지':'영상'}를 선택해주세요.`);
    const file=join(root,'assets',key==='image'?'images':'videos','news',value+(key==='image'?'.webp':'.mp4'));
    try{if(!(await stat(file)).isFile())throw new Error();}catch{fail('선택한 미디어 파일을 찾을 수 없습니다.');}
    record[key]=value;
  }
  if(!Array.isArray(input.gallery)||input.gallery.length>24)fail('갤러리에는 최대 24개 이미지를 넣을 수 있습니다.');
  record.gallery=[];
  for(const value of input.gallery){
    if(typeof value!=='string'||!/^[a-z0-9][a-z0-9-]{0,95}$/.test(value))fail('갤러리 이미지 이름을 확인해주세요.');
    try{await stat(join(root,'assets/images/news',value+'.webp'));}catch{fail('갤러리 이미지를 찾을 수 없습니다.');}
    record.gallery.push(value);
  }
  if(input.related!==undefined){
    if(!Array.isArray(input.related)||input.related.length>6||input.related.some(id=>id===record.id||!data.stories.some(s=>s.id===id)))fail('관련 소식을 확인해주세요.');
    record.related=[...new Set(input.related)];
  }else record.related=[...(existing?.related||[])];
  const start=validDate(input.eventDate,'행사 시작일'),end=validDate(input.eventEndDate,'행사 종료일');
  if(end&&(!start||end<start))fail('행사 종료일은 시작일 이후로 입력해주세요.');
  if(start){record.eventDate=start;delete record.dateUnconfirmed;}else delete record.eventDate;
  if(end)record.eventEndDate=end;else delete record.eventEndDate;
  for(const lang of ['KR','ES','EN']){
    const copy=input[lang];if(!copy||typeof copy!=='object')fail(`${lang} 내용을 입력해주세요.`);
    const sections=copy.sections;
    if(!Array.isArray(sections)||sections.length<1||sections.length>12)fail(`${lang} 본문은 1~12개 문단으로 입력해주세요.`);
    record[lang]={title:string(copy.title,`${lang} 제목`,180),summary:string(copy.summary,`${lang} 요약`,400),imageAlt:string(copy.imageAlt,`${lang} 사진 설명`,240),sections:sections.map(section=>{
      if(!Array.isArray(section)||section.length!==2)fail(`${lang} 본문 구조를 확인해주세요.`);
      return [string(section[0],`${lang} 소제목`,160),string(section[1],`${lang} 본문`,10000)];
    })};
    if(copy.imageCaption)record[lang].imageCaption=string(copy.imageCaption,`${lang} 사진 캡션`,400);
  }
  return record;
}
export async function saveStory(root,input,revision,{create=false,homeCreators}={}){
  const snapshot=await loadNews(root);
  if(snapshot.revision!==revision)throw Object.assign(new Error('다른 변경이 저장되었습니다. 목록을 새로 불러온 뒤 다시 편집해주세요.'),{status:409});
  const exists=snapshot.data.stories.some(s=>s.id===input?.id);
  if(create&&exists)throw Object.assign(new Error('이미 사용 중인 소식 주소입니다.'),{status:409});
  if(!create&&!exists)throw Object.assign(new Error('수정할 소식을 찾을 수 없습니다.'),{status:404});
  const record=await validateStory(root,input,snapshot.data);
  snapshot.data.stories=snapshot.data.stories.map(story=>{
    if(story.id===record.id)return record;
    if(record.homeFeatured&&story.homeFeatured&&story.homeOrder===record.homeOrder)return {...story,homeFeatured:false,homeOrder:99};
    return story;
  });
  if(create)snapshot.data.stories.unshift(record);
  if(typeof homeCreators==='boolean')snapshot.data.settings={...snapshot.data.settings,homeCreators};
  const backup=join(root,'output/news-manager/backups');await mkdir(backup,{recursive:true});
  await writeFile(join(backup,`${Date.now()}-${randomUUID()}.js`),snapshot.source,{flag:'wx'});
  const source='// Editorial source. Manage locally with npm run manage:news.\nwindow.MOKDA_NEWS = '+JSON.stringify(snapshot.data,null,2)+';\n';
  const temporary=join(root,`site-news-data.${randomUUID()}.tmp`);
  await writeFile(temporary,source,{flag:'wx'});await rename(temporary,join(root,'site-news-data.js'));
  return loadNews(root);
}
export async function listMedia(root){
  const images=(await readdir(join(root,'assets/images/news'))).filter(name=>/^[a-z0-9-]+\.webp$/.test(name)&&!name.endsWith('-640.webp')).map(name=>name.slice(0,-5));
  const videos=(await readdir(join(root,'assets/videos/news'))).filter(name=>/^[a-z0-9-]+\.mp4$/.test(name)).map(name=>name.slice(0,-4));
  return {images:images.sort(),videos:videos.sort()};
}
