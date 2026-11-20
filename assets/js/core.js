/* Shared by every page: motion setup, smooth scroll, the bar and its menu, the starry sky and the dawn. */
(function(){
  'use strict';
  var APP_STORE_URL='https://apps.apple.com/app/id6822070712';
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap=!!(window.gsap&&window.ScrollTrigger&&window.SplitText);
  var MOTION=hasGsap&&!reduced;
  var root=document.documentElement;
  if(MOTION)root.classList.add('anim');
  if(hasGsap){gsap.registerPlugin(ScrollTrigger);gsap.registerPlugin(SplitText)}

  var S=window.SNZ={MOTION:MOTION,reduced:reduced,hasGsap:hasGsap,lenis:null,$:$,$$:$$};

  /* Real links, so long-press, middle-click and "copy link" all work. */
  $$('[data-app]').forEach(function(a){a.href=APP_STORE_URL;a.target='_blank';a.rel='noopener'});
  $$('[data-year]').forEach(function(e){e.textContent=String(new Date().getFullYear())});

  /* Smooth scroll, driven by GSAP's ticker so ScrollTrigger and Lenis never disagree. */
  if(MOTION&&window.Lenis){
    var lenis=new Lenis({lerp:.09,smoothWheel:true,autoRaf:false});
    S.lenis=lenis;
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(function(t){lenis.raf(t*1000)});
    gsap.ticker.lagSmoothing(0);
  }
  if(MOTION)ScrollTrigger.config({ignoreMobileResize:true});

  var easeIO=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
  S.scrollTo=function(y,opts){
    opts=opts||{};
    if(S.lenis){S.lenis.resize();S.lenis.scrollTo(y,{duration:opts.immediate?0:1.4,immediate:!!opts.immediate,force:true,easing:easeIO})}
    else window.scrollTo({top:y,behavior:opts.immediate||reduced?'auto':'smooth'});
  };
  S.go=function(id,opts){
    var el=id==='top'?null:document.getElementById(id);
    if(id!=='top'&&!el)return;
    S.scrollTo(el?Math.max(0,el.getBoundingClientRect().top+window.scrollY-(id==='night'?40:70)):0,opts);
  };

  /* ---------- The bar ---------- */
  var bar=$('#bar'),btn=$('.menu-btn'),menu=$('#menu');
  function solid(){if(bar)bar.classList.toggle('solid',window.scrollY>24)}
  window.addEventListener('scroll',solid,{passive:true});if(S.lenis)S.lenis.on('scroll',solid);solid();window.addEventListener('load',solid);
  function setMenu(open){
    if(!menu)return;
    btn.setAttribute('aria-expanded',String(open));bar.classList.toggle('open',open);
    if(open){menu.hidden=false;if(MOTION)gsap.fromTo(menu,{opacity:0,y:-10,scale:.98},{opacity:1,y:0,scale:1,duration:.4,ease:'expo.out'});var f=$('a',menu);if(f)f.focus()}
    else if(MOTION&&!menu.hidden)gsap.to(menu,{opacity:0,y:-8,duration:.2,ease:'power1.in',onComplete:function(){menu.hidden=true}});
    else menu.hidden=true;
  }
  if(btn)btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true')});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&btn&&btn.getAttribute('aria-expanded')==='true'){setMenu(false);btn.focus()}});
  /* Marks the section you are reading in the bar. */
  S.setNav=function(key){$$('.nav a').forEach(function(a){var on=a.dataset.nav===key;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})};

  document.addEventListener('click',function(e){
    var g=e.target.closest('[data-go]');
    if(menu&&!menu.hidden&&e.target.closest('#menu a'))setMenu(false);
    if(g&&document.body.dataset.page==='home'){
      e.preventDefault();S.go(g.dataset.go);
      history.replaceState(null,'',g.dataset.go==='top'?location.pathname:'#'+g.dataset.go);
    }
  });

  /* ---------- The sky ---------- */
  var cv=$('.sky .stars'),dawnEl=$('.sky .dawn');
  if(cv&&cv.getContext){
    var cx=cv.getContext('2d'),stars=[],W=0,H=0,dpr=1,last=0,raf=0;
    /* The app's own star palette: mostly white, some lavender and moonlight blue, a few gold sparkles. */
    var PAL=['244,242,255','244,242,255','196,181,253','139,213,246'];
    var seed=7;function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}
    function size(){
      dpr=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
      cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
      seed=7;stars=[];
      var n=Math.min(240,Math.round(W*H/8000));
      for(var i=0;i<n;i++)stars.push({x:rnd()*W,y:rnd()*H*.92,r:.35+Math.pow(rnd(),3)*1.25,a:.25+rnd()*.6,p:rnd()*6.283,s:.4+rnd()*1.1,c:PAL[Math.floor(rnd()*PAL.length)]});
      for(var j=0;j<Math.max(3,Math.round(W/320));j++)stars.push({x:rnd()*W,y:rnd()*H*.7,r:3+rnd()*3.5,a:.55+rnd()*.3,p:rnd()*6.283,s:.5+rnd()*.5,c:'245,215,142',g:1});
      paint(0);
    }
    function sparkle(x,y,r){cx.beginPath();cx.moveTo(x,y-r);cx.quadraticCurveTo(x+r*.18,y-r*.18,x+r,y);cx.quadraticCurveTo(x+r*.18,y+r*.18,x,y+r);cx.quadraticCurveTo(x-r*.18,y+r*.18,x-r,y);cx.quadraticCurveTo(x-r*.18,y-r*.18,x,y-r);cx.fill()}
    function paint(t){
      cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,W,H);
      for(var i=0;i<stars.length;i++){
        var s=stars[i],tw=reduced?1:.55+.45*Math.sin(s.p+t*s.s);
        cx.fillStyle='rgba('+s.c+','+(s.a*tw).toFixed(3)+')';
        if(s.g)sparkle(s.x,s.y,s.r);else{cx.beginPath();cx.arc(s.x,s.y,s.r,0,6.283);cx.fill()}
      }
    }
    function loop(now){raf=requestAnimationFrame(loop);if(now-last<50)return;last=now;paint(now/1000)}
    size();
    var rw=W;window.addEventListener('resize',function(){if(matchMedia('(pointer:coarse)').matches&&innerWidth===rw)return;rw=innerWidth;size()},{passive:true});
    if(!reduced){
      raf=requestAnimationFrame(loop);
      document.addEventListener('visibilitychange',function(){cancelAnimationFrame(raf);if(!document.hidden)raf=requestAnimationFrame(loop)});
    }
  }
  /* Morning comes in over the last stretch of every page, and the stars fade with it. */
  var dq=false;
  function dawn(){
    dq=false;
    var h=document.documentElement.scrollHeight,vh=innerHeight,span=Math.min(vh*1.6,h*.5);
    var d=Math.max(0,Math.min(1,(window.scrollY+vh-(h-span))/span));
    if(dawnEl)dawnEl.style.opacity=d.toFixed(3);
    if(cv)cv.style.opacity=(1-.75*d).toFixed(3);
  }
  window.addEventListener('scroll',function(){if(!dq){dq=true;requestAnimationFrame(dawn)}},{passive:true});
  window.addEventListener('resize',dawn,{passive:true});
  window.addEventListener('load',dawn);
  S.dawn=dawn;dawn();

  if(MOTION)gsap.from('.bar-in',{y:-16,opacity:0,duration:.9,ease:'expo.out',delay:.05,clearProps:'transform,opacity'});
  window.addEventListener('load',function(){if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(hasGsap)ScrollTrigger.refresh();dawn()})});
})();
