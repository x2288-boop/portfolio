(function(){
  'use strict';
  if(!document.getElementById('video-rate-style')){
    var style = document.createElement('style');
    style.id = 'video-rate-style';
    style.textContent = '.video-rate-btn{position:absolute;top:12px;right:12px;z-index:10;background:rgba(16,14,11,.72);border:1px solid rgba(232,161,58,.55);color:#ece4d6;padding:5px 12px;border-radius:100px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;letter-spacing:.04em;cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:background .15s,color .15s}.video-rate-btn:hover{background:#e8a13a;color:#100e0b;border-color:#e8a13a}.video-rate-btn:focus{outline:none;box-shadow:0 0 0 2px rgba(232,161,58,.35)}';
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
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',init);
  } else {
    init();
  }
})();