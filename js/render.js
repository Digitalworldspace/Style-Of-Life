(function(){
  "use strict";
  var WA_NUMBER = "916352925472";
  var ETSY_URL = "https://styleoflifein.etsy.com";
  var CAT_LABELS = {
    "necklaces": "Necklaces",
    "bracelets": "Bracelets",
    "rings": "Rings",
    "earrings": "Earrings",
    "signature-pieces": "Signature Pieces"
  };
  var CAT_ORDER = ["necklaces", "bracelets", "rings", "earrings", "signature-pieces"];

  function esc(s){
    return String(s==null?"":s).replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function labelFor(cat){
    if(CAT_LABELS[cat]) return CAT_LABELS[cat];
    return String(cat).replace(/[-_]/g,' ').replace(/\b\w/g, function(c){return c.toUpperCase();});
  }
  function waLink(text){
    return "https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(text);
  }

  function photoCard(p){
    var enquireText = "Hi Style Of Life, I'd like to enquire about the "+p.name+".";
    return (
      '<div class="card">'+
        '<div class="card-art card-art-photo"><img src="'+esc(p.image)+'" alt="'+esc(p.alt||p.name)+'" loading="lazy"></div>'+
        '<div class="card-body">'+
          '<h3>'+esc(p.name)+'</h3>'+
          (p.price ? '<div class="price">'+esc(p.price)+'</div>' : '')+
          (p.description ? '<p class="card-blurb">'+esc(p.description)+'</p>' : '')+
          '<div class="card-ctas">'+
            '<a class="btn btn-whatsapp btn-sm" href="'+waLink(enquireText)+'" target="_blank" rel="noopener">Enquire on WhatsApp</a>'+
            '<a class="card-link" href="'+ETSY_URL+'" target="_blank" rel="noopener">View on Etsy →</a>'+
          '</div>'+
        '</div>'+
      '</div>'
    );
  }

  function videoCard(p){
    var enquireText = "Hi Style Of Life, I'd like to enquire about the "+p.name+(p.video ? " (https://youtube.com/shorts/"+p.video+")" : "")+".";
    return (
      '<div class="card">'+
        '<div class="vwrap"><iframe data-yt="'+esc(p.video)+'" title="'+esc(p.name)+'" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>'+
        '<div class="card-body">'+
          '<h3>'+esc(p.name)+'</h3>'+
          (p.price ? '<div class="price">'+esc(p.price)+'</div>' : '')+
          (p.description ? '<p class="card-blurb">'+esc(p.description)+'</p>' : '')+
          '<div class="card-ctas">'+
            '<a class="btn btn-whatsapp btn-sm" href="'+waLink(enquireText)+'" target="_blank" rel="noopener">Enquire on WhatsApp</a>'+
            '<a class="card-link" href="'+ETSY_URL+'" target="_blank" rel="noopener">View on Etsy →</a>'+
          '</div>'+
        '</div>'+
      '</div>'
    );
  }

  function renderCatalog(products){
    var container = document.getElementById('product-catalog');
    if(!container) return;

    if(!products || !products.length){
      container.innerHTML = '<p class="catalog-loading reveal is-visible">New pieces are on their way — message us on WhatsApp for the latest collection.</p>';
      return;
    }

    // group by category, preserving CAT_ORDER first, then any new categories by first appearance
    var byCat = {}, order = [];
    products.forEach(function(p){
      if(!byCat[p.category]){ byCat[p.category] = []; }
      byCat[p.category].push(p);
    });
    CAT_ORDER.forEach(function(c){ if(byCat[c]) order.push(c); });
    Object.keys(byCat).forEach(function(c){ if(order.indexOf(c)===-1) order.push(c); });

    var html = '';
    order.forEach(function(cat, idx){
      var items = byCat[cat];
      var hasVideo = items.some(function(p){ return p.type === 'video'; });
      var gridClass = hasVideo ? 'grid-4v' : 'grid4';
      var idAttr = CAT_LABELS[cat] ? ' id="'+cat+'"' : '';
      html += '<div class="cat-head reveal"'+idAttr+'>'+esc(labelFor(cat))+'</div>\n';
      html += '<div class="'+gridClass+' reveal-stagger" style="margin-bottom:56px;">\n';
      items.forEach(function(p){
        html += (p.type === 'video' ? videoCard(p) : photoCard(p)) + '\n';
      });
      html += '</div>\n';
    });

    container.removeAttribute('data-loading');
    container.innerHTML = html;

    if(window.SOL_initReveal) window.SOL_initReveal();
    if(window.SOL_initVideoAutoplay) window.SOL_initVideoAutoplay();
  }

  function loadCatalog(){
    var container = document.getElementById('product-catalog');
    if(!container) return;
    fetch('data/products.json', {cache:'no-store'})
      .then(function(r){ if(!r.ok) throw new Error('fetch failed'); return r.json(); })
      .then(function(data){
        // merge in any locally-drafted products saved from the admin page on this browser
        try{
          var draft = JSON.parse(localStorage.getItem('sol_products_draft')||'null');
          if(draft && draft.length) data = draft;
        }catch(e){}
        renderCatalog(data);
      })
      .catch(function(){
        container.innerHTML = '<p class="catalog-loading reveal is-visible">We could not load the collection right now — please message us on WhatsApp, or refresh the page.</p>';
      });
  }

  function applyBanner(b){
    if(!b) return;
    var bar = document.querySelector('.promo-bar');
    if(bar){
      if(b.promoEnabled === false){
        bar.style.display = 'none';
      } else {
        var spans = bar.querySelectorAll('.promo-track span');
        // spans alternate: promoText, subText1, promoText, subText2, repeated
        spans.forEach(function(sp, i){
          var slot = i % 4;
          if(slot === 0 || slot === 2) sp.textContent = '✦ ' + b.promoText + ' ✦';
          else if(slot === 1) sp.textContent = b.promoSubText1;
          else sp.textContent = b.promoSubText2;
        });
      }
    }
    var badge = document.querySelector('.discount-badge');
    if(badge){
      if(b.badgeEnabled === false){
        badge.style.display = 'none';
      } else {
        var span = badge.querySelector('span'), small = badge.querySelector('small');
        if(span) span.textContent = b.badgeText;
        if(small) small.textContent = b.badgeSubText;
      }
    }
  }

  function loadBanner(){
    var hasBar = document.querySelector('.promo-bar');
    var hasBadge = document.querySelector('.discount-badge');
    if(!hasBar && !hasBadge) return;
    fetch('data/banners.json', {cache:'no-store'})
      .then(function(r){ if(!r.ok) throw new Error('fetch failed'); return r.json(); })
      .then(function(data){
        try{
          var draft = JSON.parse(localStorage.getItem('sol_banner_draft')||'null');
          if(draft) data = draft;
        }catch(e){}
        applyBanner(data);
      })
      .catch(function(){ /* keep the static markup already in the page as a fallback */ });
  }

  loadCatalog();
  loadBanner();
})();
