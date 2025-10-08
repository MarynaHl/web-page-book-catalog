// дані
const BOOKS = [
    { id: 1, title: "Тіні забутих предків", author: "М. Коцюбинський", genre: "classic", price: 220 },
    { id: 2, title: "Ловець пригод", author: "А. Блейк", genre: "fantasy", price: 310 },
    { id: 3, title: "Коротка історія часу", author: "С. Гокінг", genre: "nonfiction", price: 450 },
    { id: 4, title: "Місто", author: "В. Підмогильний", genre: "classic", price: 260 },
    { id: 5, title: "Пікнік на узбіччі", author: "Брати Стругацькі", genre: "fantasy", price: 280 },
    { id: 6, title: "Чому нації занепадають", author: "Аджемоглу/Робінсон", genre: "nonfiction", price: 500 },
  ];
  
  const state = {
    query: "",
    genre: "all",
    sort: "none",
    favorites: new Set(JSON.parse(localStorage.getItem("favorites") || "[]")),
  };
  
  const els = {
    catalog: document.getElementById("catalog"),
    empty: document.getElementById("emptyState"),
    q: document.getElementById("q"),
    sort: document.getElementById("sortPrice"),
    favCount: document.getElementById("favCount"),
    chips: Array.from(document.querySelectorAll(".chip")),
  };
  

  function svgCover(title, author) {
    const palette = ["#1f4b99","#0a6e6e","#7a3c9a","#9a342e","#2e7d32","#6b4f1d"];
    const bg = palette[(title.length + author.length) % palette.length];
    const initials = title.split(/\s+/).map(w => w[0]).slice(0,3).join("").toUpperCase();
    const svg =
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${bg}'/>
        <stop offset='1' stop-color='#0d131d'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='55%' text-anchor='middle' font-family='system-ui,Arial' font-size='96' fill='white' font-weight='700'>${initials}</text>
    <text x='50%' y='85%' text-anchor='middle' font-family='system-ui,Arial' font-size='22' fill='#e6edf3'>${author.replace(/&/g,"&amp;")}</text>
  </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
  
  function saveFavorites(){ localStorage.setItem("favorites", JSON.stringify([...state.favorites])); }
  
  function genreLabel(key){ return { fantasy:"Фантастика", nonfiction:"Нон-фікшн", classic:"Класика" }[key] || key; }
  
  function renderCard(b){
    const isFav = state.favorites.has(b.id);
    const src = svgCover(b.title, b.author);
    const alt = `Обкладинка книги ${b.title} — ${b.author}`;
    return `
    <article class="card" aria-labelledby="title-${b.id}">
      <div class="card__media"><img src="${src}" alt="${alt}" loading="lazy" width="400" height="600"></div>
      <div class="card__body">
        <h3 id="title-${b.id}" class="card__title">${b.title}</h3>
        <p class="card__meta">${b.author} • <span class="badge">${genreLabel(b.genre)}</span></p>
        <div class="card__row">
          <span class="price">${b.price} грн</span>
          <div class="card__row" role="group" aria-label="Дії">
            <button class="btn btn--primary" data-action="toggle-fav" data-id="${b.id}" aria-pressed="${isFav}">
              ${isFav ? "В обраному" : "Додати в обране"}
            </button>
            <button class="btn btn--ghost">Детальніше</button>
          </div>
        </div>
      </div>
    </article>`;
  }
  
  function render(){
    let items = BOOKS.filter(b=>{
      const q = state.query.trim();
      const matchesQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchesG = state.genre === "all" || b.genre === state.genre;
      return matchesQ && matchesG;
    });
  
    if (state.sort === "asc") items.sort((a,b)=>a.price-b.price);
    if (state.sort === "desc") items.sort((a,b)=>b.price-a.price);
  
    els.catalog.innerHTML = items.map(renderCard).join("");
    els.empty.hidden = items.length > 0;
    els.favCount.textContent = state.favorites.size;
  
    els.catalog.querySelectorAll("[data-action='toggle-fav']").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const id = Number(btn.dataset.id);
        state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
        saveFavorites();
        render();
      });
    });
  }
  
 
  els.q.addEventListener("input", e=>{ state.query = e.target.value.toLowerCase(); render(); });
  els.chips.forEach(chip=>{
    chip.addEventListener("click", ()=>{
      els.chips.forEach(c=>{ c.classList.toggle("is-active", c===chip); c.setAttribute("aria-selected", c===chip); });
      state.genre = chip.dataset.genre; render();
    });
  });
  els.sort.addEventListener("change", e=>{ state.sort = e.target.value; render(); });
  
  render();
  