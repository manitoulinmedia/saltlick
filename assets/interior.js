fetch("/content/site.json").then(r=>r.json()).then(site=>{
  document.querySelectorAll("[data-text]").forEach(n=>{if(site[n.dataset.text]!==undefined)n.textContent=site[n.dataset.text]});
  document.querySelectorAll("[data-image]").forEach(n=>{if(site[n.dataset.image])n.src=site[n.dataset.image]});
  document.querySelectorAll("[data-link]").forEach(n=>{let v=site[n.dataset.link];if(!v)return;if(n.hasAttribute("data-mailto"))v="mailto:"+v;if(n.hasAttribute("data-tel"))v="tel:"+String(v).replace(/[^+\d]/g,"");n.href=v});
  const menuSurface=document.querySelector(".menu-page-content");
  if(menuSurface&&site.menu_page_image)menuSurface.style.setProperty("--menu-page-photo",`url(${JSON.stringify(String(site.menu_page_image))})`);
  renderMenu(site.menu_sections||[]);renderCatering(site.catering_options||[]);
}).catch(()=>document.documentElement.classList.add("content-fallback"));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
function renderMenu(sections){
  const root=document.getElementById("menu-sections"),jump=document.getElementById("menu-jump-nav");
  if(!root)return;
  const preferred=["meat-3","southern-comforts","sides","dessert","full-plates","let-him-cook"];
  const ordered=[...sections].sort((a,b)=>{
    const ai=preferred.indexOf(slug(a.name)),bi=preferred.indexOf(slug(b.name));
    return (ai<0?999:ai)-(bi<0?999:bi);
  });
  root.innerHTML=ordered.map((s,i)=>{const id=slug(s.name),num=String(i+1).padStart(2,"0");return `<section class="menu-category menu-category-${id}" id="${id}"><header><span>${num}</span><div><h2>${esc(s.name)}</h2><p>${esc(s.description)}</p></div></header><div class="menu-items">${(s.items||[]).map(item=>`<article class="${item.price?"has-price":""}"><div><h3>${esc(item.name)}</h3>${item.description?`<p>${esc(item.description)}</p>`:""}</div>${item.price?`<strong>${esc(item.price)}</strong>`:""}</article>`).join("")}</div></section>`}).join("");
  if(jump)jump.innerHTML=ordered.map(s=>`<a href="#${slug(s.name)}">${esc(s.name)}</a>`).join("");
}
function renderCatering(options){const root=document.getElementById("catering-options");if(!root)return;root.innerHTML=options.map((o,i)=>`<article><span>0${i+1}</span><h3>${esc(o.name)}</h3><p>${esc(o.description)}</p><small>${esc(o.note)}</small></article>`).join("")}
const h=document.querySelector(".site-header");if(h){const update=()=>h.classList.toggle("is-scrolled",scrollY>24);update();addEventListener("scroll",update,{passive:true})}
const mobileToggle=document.querySelector(".mobile-nav-toggle"),mobileNav=document.querySelector(".mobile-page-nav");
if(mobileToggle&&mobileNav){mobileToggle.addEventListener("click",()=>{const open=mobileToggle.getAttribute("aria-expanded")!=="true";mobileToggle.setAttribute("aria-expanded",String(open));mobileNav.classList.toggle("is-open",open)});mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{mobileToggle.setAttribute("aria-expanded","false");mobileNav.classList.remove("is-open")}));}

function setupHeroParallax(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const heroes=[...document.querySelectorAll(".interior-hero,.menu-poster-hero")].filter(hero=>hero.querySelector(":scope > img"));
  if(!heroes.length)return;
  heroes.forEach(hero=>hero.classList.add("parallax-hero"));
  let queued=false;
  const paint=()=>{
    queued=false;
    heroes.forEach(hero=>{
      const rect=hero.getBoundingClientRect();
      if(rect.bottom<0||rect.top>innerHeight)return;
      const limit=Math.min(110,rect.height*.14);
      const shift=Math.max(-limit,Math.min(limit,-rect.top*.28));
      hero.style.setProperty("--hero-parallax-y",`${shift.toFixed(1)}px`);
    });
  };
  const queuePaint=()=>{if(queued)return;queued=true;requestAnimationFrame(paint)};
  paint();
  addEventListener("scroll",queuePaint,{passive:true});
  addEventListener("resize",queuePaint,{passive:true});
  addEventListener("pageshow",queuePaint);
}
setupHeroParallax();
