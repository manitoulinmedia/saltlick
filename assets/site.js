fetch("/content/site.json")
  .then((response) => response.json())
  .then((site) => {
    document.querySelectorAll("[data-text]").forEach((node) => {
      const value = site[node.dataset.text];
      if (value !== undefined) node.textContent = value;
    });
    document.querySelectorAll("[data-image]").forEach((node) => {
      const value = site[node.dataset.image];
      if (value) node.src = value;
    });
    document.querySelectorAll("[data-link]").forEach((node) => {
      let value = site[node.dataset.link];
      if (!value) return;
      if (node.hasAttribute("data-mailto")) value = "mailto:" + value;
      if (node.hasAttribute("data-tel")) value = "tel:" + value.replace(/[^+\d]/g, "");
      node.href = value;
    });
    document.getElementById("featured-dishes").innerHTML = site.featured_dishes.map((dish, i) => `
      <article class="food-card">
        <div class="food-image"><img src="${dish.image}" alt="${dish.name}"></div>
        <div class="meta"><b>0${i + 1}</b><span>${dish.eyebrow}</span></div>
        <h3>${dish.name}</h3><p>${dish.description}</p>
      </article>`).join("");
    document.getElementById("gallery-grid").innerHTML = site.gallery.map((item, index) =>
      `<button class="gallery-item" type="button" data-index="${index}" aria-label="View ${item.alt}"><img src="${item.image}" alt="${item.alt}"><span>View story ↗︎</span></button>`).join("");
    setupGallery(site.gallery);
    setupMegaMenuImages(site);
  })
  .catch(() => document.documentElement.classList.add("content-fallback"));

const menuTrigger = document.querySelector(".menu-trigger");
const megaMenu = document.querySelector(".mega-menu");

if (menuTrigger && megaMenu) {
  const closeMenu = () => {
    menuTrigger.setAttribute("aria-expanded", "false");
    megaMenu.classList.remove("is-open");
  };
  menuTrigger.addEventListener("click", () => {
    const opening = menuTrigger.getAttribute("aria-expanded") !== "true";
    menuTrigger.setAttribute("aria-expanded", String(opening));
    megaMenu.classList.toggle("is-open", opening);
    if (!opening) menuTrigger.blur();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".menu-nav-item")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuTrigger.focus();
    }
  });
  megaMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
}

function setupMegaMenuImages(site) {
  const image = document.getElementById("mega-menu-image");
  const title = document.getElementById("mega-menu-title");
  if (!image || !title) return;
  document.querySelectorAll("[data-menu-image]").forEach((link) => {
    const showCategory = () => {
      const nextImage = site[link.dataset.menuImage];
      if (nextImage && image.src !== new URL(nextImage, location.href).href) {
        image.classList.add("is-changing");
        window.setTimeout(() => {
          image.src = nextImage;
          image.alt = link.dataset.menuTitle;
          title.textContent = link.dataset.menuTitle;
          image.classList.remove("is-changing");
        }, 130);
      } else {
        title.textContent = link.dataset.menuTitle;
      }
    };
    link.addEventListener("mouseenter", showCategory);
    link.addEventListener("focus", showCategory);
  });
}

const siteHeader = document.querySelector(".site-header");
if (siteHeader) {
  const updateHeader = () => siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function setupGallery(items) {
  const dialog = document.getElementById("gallery-lightbox");
  if (!dialog) return;
  const image = dialog.querySelector("img");
  const title = dialog.querySelector("h3");
  const description = dialog.querySelector("p");
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const photo = items[Number(item.dataset.index)];
      image.src = photo.image;
      image.alt = photo.alt;
      title.textContent = photo.title || photo.alt;
      description.textContent = photo.description || photo.alt;
      dialog.showModal();
    });
  });
  dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
