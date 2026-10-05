const menuKey='vb_daily_menu';
async function renderToday(){
 const box=document.getElementById('todayMenu'); if(!box)return;
 const configured=window.SUPABASE_URL && !window.SUPABASE_URL.startsWith('PASTE_');
 let items=[];
 if(configured){
   const {data,error}=await supabase.createClient(window.SUPABASE_URL,window.SUPABASE_KEY).from('menu_items').select('*').eq('menu_date',new Date().toISOString().slice(0,10)).order('created_at',{ascending:false});
   if(!error) items=data||[];
 } else {
   try{items=JSON.parse(localStorage.getItem(menuKey)||'[]')}catch(e){}
 }
 box.innerHTML=items.length?items.map(x=>`<article class="card"><div class="product-icon">${x.image_url||x.photo?`<img src="${x.image_url||x.photo}" style="width:100%;height:180px;object-fit:cover;border-radius:15px">`:'🍰'}</div><div><span class="tag">TODAY</span><h3>${x.name}</h3><p>${x.description||'Freshly prepared at Vishweshwara Bakery.'}</p><strong>${x.price||''}</strong></div><a target="_blank" href="https://wa.me/918340816801?text=${encodeURIComponent('Hello Vishweshwara Bakery, I want to order '+x.name+(x.price?' - '+x.price:''))}">Order →</a></article>`).join(''):'<article class="card" style="grid-column:1/-1;text-align:center"><div class="product-icon">🎂</div><h3>Today's menu is being prepared</h3><p>Call or WhatsApp us for today's fresh cakes, pastries and puffs.</p><a target="_blank" href="https://wa.me/918340816801?text=Hello%20Vishweshwara%20Bakery%2C%20please%20share%20today%27s%20menu.">Ask on WhatsApp →</a></article>';
}
renderToday();
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'})}}));