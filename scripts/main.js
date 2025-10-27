document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');
const yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();
const navToggle=document.getElementById('nav-toggle');const siteNav=document.getElementById('site-nav');
if(navToggle&&siteNav){navToggle.addEventListener('click',()=>{const e='true'===navToggle.getAttribute('aria-expanded');navToggle.setAttribute('aria-expanded',String(!e));siteNav.hidden=e});
siteNav.addEventListener('click',t=>{const e=t.target.closest('a');if(e&&'none'!==window.getComputedStyle(navToggle).display){navToggle.setAttribute('aria-expanded','false');siteNav.hidden=!0}})}
document.querySelectorAll('[data-nav]').forEach(a=>{const id=a.getAttribute('data-nav');if(id&&location.hash.replace('#','')===id||'home'===id&&'/'===location.pathname)a.setAttribute('aria-current','page')});
const html=document.documentElement,themeBtn=document.getElementById('theme-toggle'),THEME_KEY='site-theme';
function applyTheme(e){html.dataset.theme=e,themeBtn&&(themeBtn.setAttribute('aria-pressed',String('auto'!==e)),themeBtn.textContent='dark'===e?'Light mode':'light'===e?'Auto theme':'Dark mode')}
const saved=localStorage.getItem(THEME_KEY)||'auto';applyTheme(saved);
themeBtn&&themeBtn.addEventListener('click',()=>{const e=['auto','dark','light'],t=e[(e.indexOf(html.dataset.theme||'auto')+1)%e.length];localStorage.setItem(THEME_KEY,t),applyTheme(t)});
// if('serviceWorker'in navigator){navigator.serviceWorker.register('/service-worker.js').catch(console.warn)}


// Pause decorative grass animation when tab is hidden to save cycles.
document.addEventListener('visibilitychange', () => {
  document.documentElement.toggleAttribute('data-pause-anim', document.hidden);
});


// --- Floating light specks spawner ---
(function(){
  const field = document.getElementById('speck-field');
  if (!field) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const baseRate = prefersReduced ? 450 : 280; // ms between spawns baseline
  let spawnTimer = null;
  let running = true;

  function spawn(){
    if (!running) return;
    const w = window.innerWidth;
    const speck = document.createElement('span');
    speck.className = 'speck';

    // Randomize parameters
    const size = Math.random() < 0.8 ? (Math.random()*2 + 2) : (Math.random()*3 + 4); // mostly 2-4px, some 4-7px
    const x = Math.random() * (w + 40) - 20; // allow a little outside
    const drift = (Math.random() - 0.5) * 60; // horizontal drift over lifetime
    const dur = (Math.random() * 6 + 7).toFixed(2) + 's'; // 7-13s
    const delay = '0s';
    const op = (Math.random()*0.4 + 0.4).toFixed(2); // 0.4 - 0.8

    speck.style.setProperty('--sz', size + 'px');
    speck.style.setProperty('--x', x + 'px');
    speck.style.setProperty('--drift', drift.toFixed(1) + 'px');
    speck.style.setProperty('--dur', dur);
    speck.style.setProperty('--delay', delay);
    speck.style.setProperty('--op', op);

    field.appendChild(speck);

    const cleanup = () => { speck.remove(); };
    speck.addEventListener('animationend', cleanup);
    // Safety cleanup if animationend doesn't fire
    setTimeout(cleanup, parseFloat(dur) * 1000 + 2000);
  }

  function schedule(){
    clearInterval(spawnTimer);
    const w = Math.max(window.innerWidth, 320);
    // Rate scales with width; ~ 1-3 specks per second depending on viewport
    const rate = Math.max(160, baseRate - (w/8));
    spawnTimer = setInterval(spawn, rate);
  }

  window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) schedule();
  });

  schedule();
})();
