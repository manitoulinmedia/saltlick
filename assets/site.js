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
    document.getElementById("gallery-grid").innerHTML = site.gallery.map((item) =>
      `<img src="${item.image}" alt="${item.alt}">`).join("");
  })
  .catch(() => document.documentElement.classList.add("content-fallback"));
