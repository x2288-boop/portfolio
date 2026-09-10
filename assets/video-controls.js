(function(){
  'use strict';
  if(!document.getElementById('video-rate-style')){
    var style = document.createElement('style');
    style.id = 'video-rate-style';
    style.textContent = '.video-rate-btn{position:absolute;top:12px;right:12px;z-index:10;background:rgba(16,14,11,.72);border:1px solid rgba(232,161,58,.55);color:#ece4d6;padding:5px 12px;border-radius:100px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;letter-spacing:.04em;cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:background .15s,color .15s}.video-rate-btn:hover{background:#e8a13a;color:#100e0b;border-color:#e8a13a}.video-rate-btn:focus{outline:none;box-shadow:0 0 0 2px rgba(232,161,58,.35)}'
      + '.video-loading{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:11;background:rgba(16,14,11,.72);border:1px solid rgba(232,161,58,.4);color:#ece4d6;padding:7px 16px;border-radius:100px;font-size:12.5px;letter-spacing:.06em;pointer-events:none;opacity:0;transition:opacity .2s;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}.video-loading.show{opacity:1}';
    document.head.appendChild(style);
  }
  function init(){
    document.querySelectorAll('video').forEach(function(v){
      if(v.dataset.rateReady) return;
      v.dataset.rateReady = '1';
      v.setAttribute('controls','');
      v.setAttribute('controlsList','nodownload');
      var wrap = v.closest('.frame') || v.parentElement;
      if(!wrap) return;
      if(getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
      var btn = document.createElement('button');
      btn.className = 'video-rate-btn';
      btn.type = 'button';
      btn.textContent = '1x';
      btn.setAttribute('aria-label','切换播放速度');
      btn.addEventListener('click',function(e){
        e.stopPropagation();
        var rate = v.playbackRate === 3 ? 1 : 3;
        v.playbackRate = rate;
      });
      wrap.appendChild(btn);
      v.addEventListener('ratechange',function(){
        btn.textContent = (Math.round(v.playbackRate*10)/10) + 'x';
      });

      // 缓冲提示：让等待可见，避免「点了没反应」的错觉
      var tip = document.createElement('div');
      tip.className = 'video-loading';
      tip.textContent = '缓冲中…';
      wrap.appendChild(tip);
      v.addEventListener('waiting',function(){ tip.classList.add('show'); });
      v.addEventListener('stalled',function(){ tip.classList.add('show'); });
      v.addEventListener('playing',function(){ tip.classList.remove('show'); });
      v.addEventListener('canplay',function(){ tip.classList.remove('show'); });
      v.addEventListener('pause',function(){ tip.classList.remove('show'); });

      // 滚动进入视口时才预取视频头部，页面打开 0 视频流量
      if('IntersectionObserver' in window && v.preload === 'none'){
        var io = new IntersectionObserver(function(entries,obs){
          entries.forEach(function(en){
            if(!en.isIntersecting) return;
            var t = en.target;
            if(t.dataset.warmed !== '1'){
              t.dataset.warmed = '1';
              t.preload = 'metadata';
              try{ t.load(); }catch(e){}
            }
            obs.unobserve(t);
          });
        },{rootMargin:'300px 0px'});
        io.observe(v);
      }
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',init);
  } else {
    init();
  }
})();