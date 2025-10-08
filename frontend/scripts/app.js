// App state
const LS_KEY = "bookCatalog:favorites";
const state = {
  books: [], // тепер книги приходять із сервера
  query: "",
  genre: "all",
  sort: "none",
  favorites: new Set(JSON.parse(localStorage.getItem(LS_KEY) || "[]")),
};

// Elements
const els = {
  catalog: document.getElementById("catalog"),
  empty: document.getElementById("emptyState"),
  q: document.getElementById("q"),
  sort: document.getElementById("sortPrice"),
  favCount: document.getElementById("favCount"),
  chips: Array.from(document.querySelectorAll(".chip")),
};

// SVG placeholder cover
function svgCover(title, author) {
  const palette = ["#1f4b99", "#0a6e6e", "#7a3c9a", "#9a342e", "#2e7d32", "#6b4f1d"];
  const bg = palette[(title.length + author.length) % palette.length];

  const svg =
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${bg}'/>
        <stop offset='1' stop-color='#0d131d'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Helpers
function saveFavorites() {
  localStorage.setItem(LS_KEY, JSON.stringify([...state.favorites]));
}

function genreLabel(key) {
  return { fantasy: "Fantasy", nonfiction: "Nonfiction", classic: "Classics" }[key] || key;
}

// Render one card
function renderCard(b) {
  const isFav = state.favorites.has(b.id);
  const src = svgCover(b.title, b.author);
  const alt = `Book cover of ${b.title} — ${b.author}`;

  return `
  <article class="card" aria-labelledby="title-${b.id}">
    <div class="card__media">
      <img src="${src}" alt="${alt}" loading="lazy" width="400" height="600">
    </div>
    <div class="card__body">
      <h3 id="title-${b.id}" class="card__title">${b.title}</h3>
      <p class="card__meta">${b.author} • <span class="badge">${genreLabel(b.genre)}</span></p>
      <div class="card__row">
        <span class="price">${b.price} UAH</span>
        <div class="card__row" role="group" aria-label="Actions">
          <button type="button" class="btn btn--primary" data-action="toggle-fav" data-id="${b.id}" aria-pressed="${isFav}">
            ${isFav ? "In favorites" : "Add to favorites"}
          </button>
          <button type="button" class="btn btn--ghost">Details</button>
        </div>
      </div>
    </div>
  </article>`;
}

// Main render
function render() {
  let items = state.books.filter(b => {
    const q = state.query.trim().toLowerCase();
    const matchesQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    const matchesG = state.genre === "all" || b.genre === state.genre;
    return matchesQ && matchesG;
  });

  if (state.sort === "asc") items.sort((a, b) => a.price - b.price);
  if (state.sort === "desc") items.sort((a, b) => b.price - a.price);

  els.catalog.innerHTML = items.map(renderCard).join("");
  els.empty.hidden = items.length > 0;
  els.favCount.textContent = state.favorites.size;

  els.catalog.querySelectorAll("[data-action='toggle-fav']").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      if (state.favorites.has(id)) state.favorites.delete(id);
      else state.favorites.add(id);
      saveFavorites();
      render();
    });
  });
}

// Load books from API
function loadBooks() {
  fetch("http://localhost:3000/books")
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch books");
      return res.json();
    })
    .then(data => {
      state.books = data;
      render();
    })
    .catch(err => {
      console.error(err);
      els.catalog.innerHTML = `<p style="color:#f66">Error loading books from API</p>`;
    });
}

// Events
els.q.addEventListener("input", e => {
  state.query = e.target.value;
  render();
});

els.chips.forEach(chip => {
  chip.addEventListener("click", () => {
    els.chips.forEach(c => {
      c.classList.toggle("is-active", c === chip);
      c.setAttribute("aria-selected", c === chip ? "true" : "false");
    });
    state.genre = chip.dataset.genre;
    render();
  });
});

els.sort.addEventListener("change", e => {
  state.sort = e.target.value;
  render();
});

// Initial load
loadBooks();
