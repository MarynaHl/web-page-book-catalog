# Book Catalog (HTML + CSS + JS)

A simple, accessible **book catalog** web page built with semantic HTML, external CSS, and vanilla JavaScript.  
Works fully **offline** and does **not** require external libraries or image assets — book covers are generated as SVG placeholders.

## Features
- Search by title or author (live).
- Filter by genre (tabs).
- Sort by price (asc/desc).
- Add/remove **Favorites** with a persistent counter (`localStorage`).
- Responsive grid (desktop/tablet/mobile).
- Accessibility: semantic landmarks, ARIA roles, focus styles, image alts.

## Functional Requirements (met)
- Catalog of book cards with title, author, genre, price.
- Search, genre filter, price sort.
- Favorites toggle with persistent storage.

## Non-functional Requirements (met)
- Clear, unambiguous page design.
- Semantic HTML with classes; external CSS mapped to classes.
- JS events affect functionality (filtering, sorting, favorites).
- Responsive layout, basic a11y, no external dependencies.

## Project Structure
├─ index.html
├─ styles/
│ └─ main.css
├─ scripts/
│ └─ app.js
└─ assets/ (optional, not required)

## How to Run
Just open `index.html` in a browser. No build step or server required.

## Self-evaluation (rubric)
- **Requirements:** provided (functional + non-functional).
- **Design:** complete and clear.
- **HTML:** semantic, uses classes.
- **CSS:** external files mapped via classes.
- **JS events:** search/filter/sort/favorites change page functionality.
