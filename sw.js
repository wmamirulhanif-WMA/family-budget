const C='fb5';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html'])))});
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{const r=e.request;
if(r.method=='POST'&&new URL(r.url).pathname.endsWith('/share-target')){e.respondWith((async()=>{
 const f=await r.formData();let file=null,text=(f.get('title')||'')+' '+(f.get('text')||'');
 for(const v of f.values())if(typeof v!='string'&&v.size){file=v;break}
 let buf=null,type='';if(file){buf=await file.arrayBuffer();type=file.type}
 const d=await new Promise(ok=>{const q=indexedDB.open('fb',1);q.onupgradeneeded=()=>q.result.createObjectStore('k');q.onsuccess=()=>ok(q.result)});
 await new Promise(ok=>{const t=d.transaction('k','readwrite');t.objectStore('k').put({buf,type,text},'share');t.oncomplete=ok});
 return Response.redirect(new URL('./?share=1',self.registration.scope).href,303)})());return}
if(r.method!='GET')return;
e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(C).then(c=>c.put(r,y));return x}).catch(()=>caches.match(r)))});
