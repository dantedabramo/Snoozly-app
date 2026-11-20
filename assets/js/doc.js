/* Support, privacy and terms: smooth jumps to a section, and gentle reveals. */
(function(){
  'use strict';
  var S=window.SNZ;if(!S)return;
  var $=S.$,$$=S.$$,EXPO='expo.out';

  document.addEventListener('click',function(e){
    var a=e.target.closest('.toc a,.jump a');if(!a)return;
    var el=document.getElementById(a.getAttribute('href').slice(1));if(!el)return;
    e.preventDefault();
    S.scrollTo(el.getBoundingClientRect().top+window.scrollY-96);
    history.replaceState(null,'','#'+el.id);
  });

  function build(){
    if(!S.MOTION)return;
    var h=SplitText.create('.doc-hero h1',{type:'words',mask:'words'});
    gsap.set('.doc-hero h1',{visibility:'visible'});
    gsap.from(h.words,{yPercent:115,duration:1.2,ease:EXPO,stagger:.07,delay:.15});
    gsap.from('.back,.doc-hero .lede,.doc-hero .up',{y:14,opacity:0,duration:1,ease:EXPO,stagger:.08,delay:.35});
    gsap.from('.toc,.jump',{y:20,opacity:0,duration:1,ease:EXPO,delay:.5});
    $$('.prose section,.fix,.more').forEach(function(el){
      gsap.from(el,{y:32,opacity:0,duration:1,ease:EXPO,scrollTrigger:{trigger:el,start:'top 92%'}});
    });
    gsap.fromTo('.sun',{yPercent:16},{yPercent:0,ease:'none',scrollTrigger:{trigger:'.dawn-foot',start:'top bottom',end:'bottom bottom',scrub:true}});
    gsap.from(['.foot-cr','.foot-cta h2','.foot-cta p','.foot-cta .badge'],{y:30,opacity:0,duration:1.1,ease:EXPO,stagger:.07,scrollTrigger:{trigger:'.dawn-foot',start:'top 84%'}});
  }
  var fontsReady=document.fonts&&document.fonts.ready?Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,1500)})]):Promise.resolve();
  fontsReady.then(function(){
    build();
    if(S.hasGsap)ScrollTrigger.refresh();
    var id=location.hash.slice(1),el=id&&document.getElementById(id);
    if(el)setTimeout(function(){S.scrollTo(el.getBoundingClientRect().top+window.scrollY-96,{immediate:true})},60);
  });
  window.addEventListener('load',function(){if(S.hasGsap)ScrollTrigger.refresh()});
})();
