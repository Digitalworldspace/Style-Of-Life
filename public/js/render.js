(function(){
  const API = (window.SOL_CONFIG && window.SOL_CONFIG.API_BASE) || "";
  const money = (value, currency='USD') => new Intl.NumberFormat('en-US',{style:'currency',currency}).format(Number(value||0));
  async function getProducts(){
    try { const r=await fetch(API+'/api/products'); if(!r.ok) throw new Error('API'); return await r.json(); }
    catch(e){ const r=await fetch('/data/products.json'); return await r.json(); }
  }
  function card(p){
    const image=(p.images&&p.images[0])||p.image||'/favicon.ico';
    const href=p.etsy_url||p.url||'#';
    return `<article class="product-card reveal"><a href="${href}" ${href!=='#'?'target="_blank" rel="noopener"':''}><div class="product-media"><img src="${image}" alt="${esc(p.alt||p.name||p.title||'Style Of Life jewelry')}" loading="lazy"></div><div class="product-info"><div class="eyebrow">${esc(p.category||'Jewelry')}</div><h3>${esc(p.name||p.title||'Untitled')}</h3><div class="price">${money(p.price,p.currency||'USD')}</div></div></a></article>`;
  }
  function esc(v){return String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\':'&#92;','"':'&quot;'}[c]));}
  async function load(){
    const el=document.getElementById('product-catalog'); if(!el) return;
    el.innerHTML='<div class="catalog-loading">Loading collection…</div>';
    try{ const products=await getProducts(); el.innerHTML=products.filter(p=>p.published!==false).map(card).join('')||'<p>No products yet.</p>'; }
    catch(e){ el.innerHTML='<p>Collection unavailable right now.</p>'; }
  }
  load();
  window.SOL={reloadProducts:load};
})();
