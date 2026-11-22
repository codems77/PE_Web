const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const appUrl=process.env.APP_URL || 'http://127.0.0.1:3000';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let favorite=false, ratings=[],fail=false,expire=false,nickname='테스터';
 const calls=[];
 const token='e30.'+Buffer.from(JSON.stringify({sub:'7'})).toString('base64url')+'.signature';
 const movie={id:42,title:'테스트 영화',original_title:'Test Movie',release_date:'2026-01-01',poster_path:null,backdrop_path:null,genres:[],runtime:100,tagline:'테스트',overview:'영화 설명'};
 await page.route('**/*',async route=>{
  const req=route.request(),u=new URL(req.url()),p=u.pathname,method=req.method();
  if(p.startsWith('/api/tmdb/'))return route.fulfill({json:p.endsWith('/popular')||p.endsWith('/search/movie')?{results:[movie],total_pages:1}:movie});
  if(u.origin===new URL(appUrl).origin)return route.continue();
  if(req.resourceType()==='image') return route.abort();
  calls.push({p,method,body:req.postDataJSON?.(),auth:req.headers()['authorization']});
  const ok=result=>route.fulfill({json:{isSuccess:true,code:'COMMON200',message:'성공',result}});
  if(p.endsWith('/auth/login'))return fail?route.fulfill({status:401,json:{message:'로그인 실패'}}):ok({nickname,accessToken:token});
  if (!/^\/(members|favorites|ratings)(\/|$)/.test(p)) return route.abort();
  if (method==='OPTIONS') return route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':new URL(appUrl).origin,'Access-Control-Allow-Methods':'GET, POST, PATCH, DELETE, OPTIONS','Access-Control-Allow-Headers':'authorization, content-type'}});
  assert.equal(req.headers()['authorization'],`Bearer ${token}`,`${method} ${p}`);
  if(p.endsWith('/members/me')){
   if(expire)return route.fulfill({status:401,json:{message:'만료'}});
   if(method==='PATCH')nickname=req.postDataJSON().nickname;
   return ok({email:'test@example.com',nickname,createdAt:'2026-01-01'});
  }
  if(p.endsWith('/favorites/42')){
   if(method==='DELETE')favorite=false;
   return ok({isFavorite:favorite});
  }
  if(p.endsWith('/favorites')){if(method==='POST'){favorite=true;return ok({movieId:42})}return ok(favorite?[{movieId:42}]:[])}
  if(p.endsWith('/members/7/ratings'))return route.fulfill({json:ratings});
  if(p.endsWith('/ratings')&&method==='POST'){ratings=[{...req.postDataJSON(),ratingId:9}];return ok(ratings[0]);}
  if(p.endsWith('/ratings/9')){if(method==='DELETE'){ratings=[];return ok(null)}ratings=[{...ratings[0],...req.postDataJSON()}];return ok(ratings[0]);}
  return route.abort();
 });
 const wait=async locator=>locator.waitFor({state:'visible'});
 await page.goto(new URL('/search',appUrl).href, {waitUntil:'networkidle'});
 await page.getByRole('textbox',{name:'검색어'}).fill('테스트 영화');
 await page.getByRole('button',{name:'검색',exact:true}).click();
 await page.waitForURL(url=>url.searchParams.get('query')==='테스트 영화');
 await page.getByRole('link',{name:'테스트 영화',exact:true}).first().click();
 await page.waitForURL('**/movies/42');
 await wait(page.getByRole('heading',{name:'테스트 영화',exact:true}));
 console.log('PASS: search query and movie detail navigation');
 await page.goto(new URL('/mypage/edit',appUrl).href);
 await page.waitForURL('**/login');console.log('PASS 1: protected edit route redirects');
 await page.getByLabel('이메일',{exact:true}).fill('test@example.com');await page.getByLabel('비밀번호',{exact:true}).fill('wrong');fail=true;
 await page.getByRole('button',{name:'로그인',exact:true}).click();await wait(page.getByRole('alert').filter({hasText:'로그인에 실패했어요'}));assert.equal(await page.getByLabel('비밀번호',{exact:true}).inputValue(),'wrong');console.log('PASS 2: login failure preserves inputs and permits retry');
 fail=false;await page.getByRole('button',{name:'로그인',exact:true}).click();await page.waitForURL(new URL('/',appUrl).href);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('umcine-auth-store')).state.accessToken),token);
 await page.goto(new URL('/login',appUrl).href);await page.waitForURL(new URL('/',appUrl).href);console.log('PASS 3: token persistence and logged-in login redirect');
 await page.goto(new URL('/movies/42',appUrl).href);await page.getByRole('button',{name:'즐겨찾기 추가',exact:true}).click();await wait(page.getByRole('button',{name:'즐겨찾기 해제',exact:true}));
 await page.goto(new URL('/mypage',appUrl).href);await wait(page.getByRole('link',{name:'테스트 영화',exact:true}));
 await page.goto(new URL('/movies/42',appUrl).href);await page.getByRole('button',{name:'즐겨찾기 해제',exact:true}).click();await wait(page.getByRole('button',{name:'즐겨찾기 추가',exact:true}));console.log('PASS 4: favorites add, mypage list, remove');
 await page.getByLabel('별점',{exact:true}).selectOption('3');await page.getByLabel('후기 (선택, 500자 이하)').fill('좋아요');await page.getByRole('button',{name:'평점 등록',exact:true}).click();await wait(page.getByRole('button',{name:'평점 수정',exact:true}));
 await page.getByLabel('별점',{exact:true}).selectOption('4');await page.getByRole('button',{name:'평점 수정',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#score')?.value==='4');
 await page.getByRole('button',{name:'평점 삭제',exact:true}).click();await wait(page.getByRole('button',{name:'평점 등록',exact:true}));assert.equal(ratings.length,0);
 assert(calls.some(c=>c.method==='PATCH'&&c.p.endsWith('/ratings/9')&&c.body.score===4));console.log('PASS 5: ratings create, update, delete and refetch');
 await page.goto('http://127.0.0.1:5173/mypage/edit');await wait(page.getByLabel('닉네임',{exact:true}));await page.getByLabel('닉네임',{exact:true}).fill('새닉네임');await page.getByRole('button',{name:'변경사항 저장'}).click();await page.waitForURL('**/mypage');await wait(page.getByRole('heading',{name:'새닉네임님'}));console.log('PASS 6: server profile used by protected pages');
 expire=true;await page.reload();await page.waitForURL('**/login');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('umcine-auth-store')).state.accessToken),null);console.log('PASS 7: 401 clears session and redirects');
 assert.deepEqual(errors,[]);console.log('PASS: no browser exceptions; authenticated API headers checked');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
