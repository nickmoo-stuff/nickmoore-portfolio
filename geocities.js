/* GeoCities Easter egg: click the terminal logo five times to toggle. */
(()=>{'use strict';
 const logo=document.querySelector('.brand');if(!logo)return;
 const panel=document.createElement('aside');panel.className='geo-ornaments';panel.setAttribute('aria-label','Secret 1998 homepage decorations');
 panel.innerHTML=`<div class="geo-banner">★ WELCOME 2 NICK'S AWESOME HOMEPAGE!!! ★</div>
 <div class="geo-marquee"><span>~*~ UNDER CONSTRUCTION!!! ~*~ SIGN MY GUESTBOOK!!! ~*~ BEST VIEWED IN INTERNET EXPLORER 5.5!!! ~*~</span></div>
 <div class="geo-flames" aria-hidden="true">🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥</div>
 <div class="geo-badges"><img src="assets/geo-banana.gif" alt="Pointless dancing banana"><span>🚧 UNDER CONSTRCTION!!! 🚧</span><img src="assets/geo-ufo.gif" alt="Random bouncing flying saucer"><span class="geo-counter">VISITOR 0000007</span><img src="assets/geo-pizza.gif" alt="Inexplicably rotating pizza"><span>BEST VIEWED AT 800 × 600</span></div>
 <div class="geo-hide-hint">Secret mode: click nick@moore:~# five times to return to the present</div>`;
 document.querySelector('.header')?.after(panel);
 let clicks=0,last=0;
 logo.title='Home (or perhaps something else...)';
 logo.addEventListener('click',event=>{
  const now=Date.now();if(now-last>2200)clicks=0;last=now;clicks++;
  if(clicks<5){event.preventDefault();return}
  event.preventDefault();clicks=0;
  const on=document.body.classList.toggle('geo-mode');
  logo.setAttribute('aria-label',on?'Nick Moore home — secret GeoCities mode enabled':'Nick Moore home');
  // Never play audio automatically. This mode deliberately has no sound.
 });
})();
