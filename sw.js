const V='glass-sampler-v1',SHELL=['./','index.html','manifest.json','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'];
const EXT=['cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin){ // 自サイト：ネット優先→失敗時キャッシュ（更新が反映されやすい）
  e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
 }else if(EXT.includes(u.hostname)){ // three.js・フォント：キャッシュ優先＋裏で更新
  e.respondWith(caches.match(r).then(m=>{const f=fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res}).catch(()=>m);return m||f}));
 }
});
