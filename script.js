const menuKey = 'vb_daily_menu';
const configured = Boolean(window.SUPABASE_URL && window.SUPABASE_KEY && !window.SUPABASE_URL.startsWith('PASTE_') && !window.SUPABASE_KEY.startsWith('PASTE_'));
const sb = configured && window.supabase ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY) : null;

function indiaToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]));
}
function renderItem(x) {
  const name = escapeHtml(x.name || 'Bakery item');
  const price = escapeHtml(x.price || '');
  const description = escapeHtml(x.description || 'Freshly prepared at Vishweshwara Bakery.');
  const image = x.image_url || x.photo || '';
  const imageHtml = image ? `<img src="${escapeHtml(image)}" alt="${name}" style="width:100%;height:180px;object-fit:cover;border-radius:15px" loading="lazy">` : '🍰';
  const orderText = encodeURIComponent(`Hello Vishweshwara Bakery, I want to order ${x.name || 'this item'}${x.price ? ' - ' + x.price : ''}`);
  return `<article class="card"><div class="product-icon">${imageHtml}</div><div><span class="tag">TODAY</span><h3>${name}</h3><p>${description}</p><strong>${price}</strong></div><a target="_blank" rel="noopener" href="https://wa.me/918340816801?text=${orderText}">Order →</a></article>`;
}
async function renderToday() {
  const box = document.getElementById('todayMenu');
  if (!box) return;
  box.innerHTML = '<article class="card" style="grid-column:1/-1;text-align:center"><div class="product-icon">⏳</div><h3>Loading today’s menu...</h3><p>Please wait a moment.</p></article>';
  const today = indiaToday();
  let items = [];
  if (sb) {
    const { data, error } = await sb.from('menu_items').select('*').eq('menu_date', today).order('created_at', { ascending:false });
    if (!error) items = data || [];
    else console.error('Today menu error:', error);
  } else {
    try { items = JSON.parse(localStorage.getItem(menuKey) || '[]').filter(x => !x.menu_date || x.menu_date === today); } catch(e) {}
  }
  box.innerHTML = items.length ? items.map(renderItem).join('') : '<article class="card" style="grid-column:1/-1;text-align:center"><div class="product-icon">🎂</div><h3>Today’s menu is being prepared</h3><p>Call or WhatsApp us for today’s fresh cakes, pastries and puffs.</p><a target="_blank" rel="noopener" href="https://wa.me/918340816801?text=Hello%20Vishweshwara%20Bakery%2C%20please%20share%20today%27s%20menu.">Ask on WhatsApp →</a></article>';
}

document.addEventListener('DOMContentLoaded', () => {
  renderToday();
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (el) { e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
  }));
});
