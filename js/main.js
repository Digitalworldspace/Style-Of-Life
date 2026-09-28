(function(){
    try{
      var els = document.querySelectorAll('.reveal, .reveal-stagger');
      if(!('IntersectionObserver' in window)){
        els.forEach(function(el){ el.classList.add('is-visible'); });
        return;
      }
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      els.forEach(function(el){ io.observe(el); });
    }catch(e){
      document.querySelectorAll('.reveal, .reveal-stagger').forEach(function(el){ el.classList.add('is-visible'); });
    }
  })();

(function(){
  function ytSrc(id,ctl){return 'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&mute=1&loop=1&playlist='+id+'&controls='+ctl+'&playsinline=1&rel=0&modestbranding=1&enablejsapi=1';}
  function cmd(f,fn){try{f.contentWindow.postMessage(JSON.stringify({event:'command',func:fn,args:''}),'*');}catch(e){}}
  function load(el){
    if(el.tagName==='IFRAME'){ if(!el.getAttribute('src')){ el.src=ytSrc(el.dataset.yt, el.dataset.controls||'1'); } }
    else { if(!el.getAttribute('src')){ el.src=el.dataset.src; } el.muted=true; var p=el.play(); if(p&&p.catch){p.catch(function(){});} }
  }
  var els=document.querySelectorAll('iframe[data-yt], video[data-src]');
  if(!('IntersectionObserver' in window)){ els.forEach(load); return; }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      var el=en.target, on=en.isIntersecting, loaded=!!el.getAttribute('src');
      if(el.tagName==='VIDEO'){ if(on){load(el);} else if(loaded){el.pause();} }
      else if(on){ if(!loaded){load(el);} else {cmd(el,'playVideo');} }
      else if(loaded){ cmd(el,'pauseVideo'); }
    });
  },{threshold:0.35});
  els.forEach(function(el){io.observe(el);});
})();


(function(){
  var box=document.querySelector('[data-ids]'); if(!box) return;
  var ids=box.dataset.ids.split(','), gap=parseInt(box.dataset.interval||'7000',10);
  var fr=box.querySelectorAll('iframe.hv'), cur=0, front=0;
  function src(id){return 'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&mute=1&loop=1&playlist='+id+'&controls=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1';}
  function cmd(f,fn,a){try{f.contentWindow.postMessage(JSON.stringify({event:'command',func:fn,args:a||''}),'*');}catch(e){}}
  fr[0].src=src(ids[0]);
  function cycle(){
    var n=(cur+1)%ids.length, back=1-front;
    setTimeout(function(){ fr[back].src=src(ids[n]); }, gap-2500);
    setTimeout(function(){
      cmd(fr[back],'seekTo',[0,true]); cmd(fr[back],'playVideo');
      setTimeout(function(){cmd(fr[back],'seekTo',[0,true]); cmd(fr[back],'playVideo');},500);
      fr[back].classList.add('on'); fr[front].classList.remove('on');
      var old=front; setTimeout(function(){cmd(fr[old],'pauseVideo');},900);
      front=back; cur=n; cycle();
    }, gap);
  }
  cycle();
})();
