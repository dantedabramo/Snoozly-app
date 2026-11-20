/* Home: the hero fan, one night on a timeline, the wall of mornings, your week, the Colors game, Pro and the FAQ. */
(function(){
  'use strict';
  var S=window.SNZ;if(!S)return;
  var $=S.$,$$=S.$$,EXPO='expo.out';

  /* ---------- FAQ: native disclosures, with a smooth open and close when motion is on ---------- */
  $$('.qa').forEach(function(d){
    var sum=$('summary',d),ans=$('.ans',d);
    sum.addEventListener('click',function(e){
      if(!S.MOTION)return;
      e.preventDefault();
      gsap.killTweensOf(ans);
      if(d.open){
        gsap.to(ans,{height:0,duration:.4,ease:'expo.inOut',onComplete:function(){d.open=false;gsap.set(ans,{clearProps:'height'});ScrollTrigger.refresh()}});
      }else{
        d.open=true;
        gsap.fromTo(ans,{height:0},{height:'auto',duration:.6,ease:EXPO,onComplete:function(){gsap.set(ans,{clearProps:'height'});ScrollTrigger.refresh()}});
        gsap.fromTo($('p',ans),{opacity:0,y:-8},{opacity:1,y:0,duration:.5,delay:.05,ease:EXPO});
      }
    });
  });

  /* ---------- Skip game: Colors ---------- */
  (function(){
    var play=$('#play');if(!play)return;
    var C=[{k:'purple',n:'Purple',h:'#A78BFA'},{k:'green',n:'Green',h:'#7EE0B8'},{k:'yellow',n:'Yellow',h:'#F5D78E'},{k:'pink',n:'Pink',h:'#F29C8C'}];
    var word=$('#word'),msg=$('#msg'),dots=$$('.dots i',play),streak=0,ink=3,shown=1;
    function paint(){
      word.textContent=C[shown].n.toUpperCase();word.style.color=C[ink].h;
      word.setAttribute('aria-label','The word '+C[shown].n+', shown in '+C[ink].n.toLowerCase());
      dots.forEach(function(d,i){d.classList.toggle('on',i<streak)});
    }
    function next(){
      var w,c;do{w=Math.floor(Math.random()*4);c=Math.floor(Math.random()*4)}while(w===c||(c===ink&&w===shown));
      shown=w;ink=c;paint();
      if(S.MOTION)gsap.fromTo(word,{opacity:0,y:10,filter:'blur(4px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.45,ease:EXPO});
    }
    play.addEventListener('click',function(e){
      if(e.target.closest('#again')){streak=0;play.classList.remove('won');msg.textContent='Three in a row to finish.';next();var f=$('#sw button',play);if(f)f.focus();return}
      var b=e.target.closest('#sw button');if(!b||play.classList.contains('won'))return;
      if(b.dataset.c===C[ink].k){
        streak++;
        if(streak>=3){
          dots.forEach(function(d){d.classList.add('on')});
          play.classList.add('won');
          word.textContent='DONE';word.setAttribute('aria-label','Done');
          msg.innerHTML='<b>Nice work.</b> A calm mind sleeps easier. Still want to skip tonight?';
          $('#again').focus();
          return;
        }
        msg.textContent=streak===1?'One down. Two to go.':'Nearly there. One more.';
        next();
      }else{
        var was=C[ink].n.toLowerCase();streak=0;
        b.classList.remove('no');void b.offsetWidth;if(!S.reduced)b.classList.add('no');
        msg.textContent='Not quite, that word was '+was+'. Start again.';
        next();
      }
    });
    paint();
  })();

  /* ---------- Motion ---------- */
  function lines(el,type){return SplitText.create(el,{type:type||'lines',mask:type==='words'?'words':'lines'})}
  function headline(h,trigger){if(!h)return;var s=lines(h);gsap.from(s.lines,{yPercent:110,stagger:.08,duration:1.3,ease:EXPO,scrollTrigger:{trigger:trigger||h,start:'top 84%'}})}
  function rise(targets,trigger,opts){return gsap.from(targets,Object.assign({y:36,opacity:0,duration:1.2,ease:EXPO,stagger:.08,scrollTrigger:{trigger:trigger,start:'top 84%'}},opts||{}))}

  function hero(){
    var h=lines('#hl','words');
    gsap.set('.hero',{visibility:'visible'});
    gsap.from(h.words,{yPercent:115,duration:1.25,ease:EXPO,stagger:.06,delay:.2});
    gsap.from('.critter',{scale:.85,opacity:0,duration:1.6,ease:EXPO,delay:.05});
    gsap.from(['.hero-sub','.acts','.hero .note'],{y:18,opacity:0,duration:1.1,ease:EXPO,stagger:.08,delay:.45});
    /* The hand of screens is dealt from below, the middle one first. */
    gsap.from('.fan .fan-c',{y:220,opacity:0,duration:1.6,ease:EXPO,delay:.55});
    gsap.from('.fan .fan-l',{y:260,opacity:0,duration:1.7,ease:EXPO,delay:.7});
    gsap.from('.fan .fan-r',{y:260,opacity:0,duration:1.7,ease:EXPO,delay:.78});
    /* Scrolling away spreads the hand a little further. The scroll moves each phone's frame,
       the intro moves the phone, so the two never fight over the same transform. */
    var st={trigger:'.fan',start:'top 70%',end:'bottom top',scrub:true};
    gsap.to('.fan .fan-l .ph-f',{x:-40,rotation:-5,ease:'none',scrollTrigger:st});
    gsap.to('.fan .fan-r .ph-f',{x:40,rotation:5,ease:'none',scrollTrigger:st});
    gsap.to('.fan .fan-c .ph-f',{y:-36,ease:'none',scrollTrigger:st});
  }

  function night(){
    headline($('.night h2'),'.night .sec-head');
    rise($('.night .sec-head .lede'),'.night .sec-head');
    /* The line fills as you move through the night. */
    gsap.fromTo('#line-fill',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:'.timeline',start:'top 55%',end:'bottom 55%',scrub:true}});
    $$('.stop').forEach(function(stop,i){
      var even=i%2===1,ph=$('.ph',stop),t=$('time',stop),copy=$$('.copy>*',stop);
      gsap.from(ph,{y:90,rotation:even?-4:4,opacity:0,duration:1.4,ease:EXPO,scrollTrigger:{trigger:stop,start:'top 80%'}});
      gsap.from(copy,{y:28,opacity:0,duration:1.1,ease:EXPO,stagger:.08,scrollTrigger:{trigger:stop,start:'top 76%'}});
      /* Each time lights up as the line reaches it. */
      gsap.fromTo(t,{scale:.82,opacity:.35},{scale:1,opacity:1,duration:.7,ease:'back.out(2.2)',scrollTrigger:{trigger:t,start:'top 56%',toggleActions:'play none none reverse'}});
    });
  }

  function promise(){
    var s=lines('#stmt','words');
    gsap.fromTo(s.words,{opacity:.14},{opacity:1,stagger:.06,ease:'none',scrollTrigger:{trigger:'#stmt',start:'top 82%',end:'bottom 50%',scrub:true}});
    rise($$('.facts li'),'.facts',{y:14,duration:.9});
  }

  function wall(desk){
    if(desk){
      /* Three columns drift at different speeds, like screens on a moving wall. */
      $$('.col').forEach(function(c){
        var sp=+c.dataset.speed||0;
        gsap.fromTo(c,{y:sp},{y:-sp,ease:'none',scrollTrigger:{trigger:'.cols',start:'top bottom',end:'bottom top',scrub:true}});
      });
      $$('.tile').forEach(function(t){gsap.from(t,{y:60,opacity:0,duration:1.3,ease:EXPO,scrollTrigger:{trigger:t,start:'top 92%'}})});
    }else rise($$('.tile'),'.cols',{x:40,y:0,stagger:.06});
  }

  function week(){
    gsap.from('.duo .back',{x:-60,y:40,rotation:-12,opacity:0,duration:1.4,ease:EXPO,scrollTrigger:{trigger:'.duo',start:'top 80%'}});
    gsap.from('.duo .front',{x:60,y:80,rotation:12,opacity:0,duration:1.4,ease:EXPO,delay:.12,scrollTrigger:{trigger:'.duo',start:'top 80%'}});
    headline($('.week h2'),'.week-copy');
    rise([$('.week .lede')].concat($$('.points>div')),'.week-copy');
  }

  function rest(){
    headline($('.wall h2'),'.wall .sec-head');
    rise($('.wall .sec-head .lede'),'.wall .sec-head');
    headline($('.skipper h2'),'.skipper');
    rise([$('.skipper .lede'),$('#play')],'.skipper');
    gsap.from('.skipper .solo',{y:80,rotation:10,opacity:0,duration:1.4,ease:EXPO,scrollTrigger:{trigger:'.skipper',start:'top 75%'}});
    headline($('.pro-sec h2'),'.pro-sec .sec-head');
    rise([$('.pro-sec .eyebrow'),$('.pro-sec .lede')],'.pro-sec .sec-head');
    rise($$('.plan'),'.plans',{y:48,stagger:.1});
    headline($('.around h2'),'.around');
    rise($$('.rows>div'),'.rows',{y:20,stagger:.06});
    headline($('.faq h2'),'.faq .sec-head');
    rise($('.faq .lede'),'.faq .sec-head');
    rise($$('.qa'),'.faq-list',{y:20,stagger:.05});
    /* The sun comes up behind the last call to action. */
    gsap.fromTo('.sun',{yPercent:16},{yPercent:0,ease:'none',scrollTrigger:{trigger:'.dawn-foot',start:'top bottom',end:'bottom bottom',scrub:true}});
    rise(['.foot-cr','.foot-cta h2','.foot-cta p','.foot-cta .badge'],'.dawn-foot',{stagger:.07});
  }

  function spy(){
    [['#night','night'],['#promise','night'],['#progress','progress'],['#week','progress'],['#skip','progress'],['#pro','pro'],['#around',null],['#faq','faq'],['#foot',null]].forEach(function(p){
      var el=$(p[0]);if(!el)return;
      ScrollTrigger.create({trigger:el,start:'top 50%',end:'bottom 50%',onToggle:function(s){if(s.isActive)S.setNav(p[1])}});
    });
    ScrollTrigger.create({trigger:'.hero',start:'top top',end:'bottom 50%',onToggle:function(s){if(s.isActive)S.setNav(null)}});
  }

  function build(){
    if(S.hasGsap)spy();
    if(!S.MOTION)return;
    hero();night();promise();week();rest();
    gsap.matchMedia().add({desk:'(min-width:821px)',mob:'(max-width:820px)'},function(c){wall(c.conditions.desk)});
  }

  var fontsReady=document.fonts&&document.fonts.ready?Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,1500)})]):Promise.resolve();
  fontsReady.then(function(){
    build();
    if(S.hasGsap)ScrollTrigger.refresh();
    /* Arriving at #faq or #pro from another page: go there once everything has measured. */
    var id=location.hash.slice(1);
    if(id&&document.getElementById(id))setTimeout(function(){S.go(id,{immediate:true})},60);
    S.dawn();
  });
  window.addEventListener('load',function(){if(S.hasGsap)ScrollTrigger.refresh()});
})();
