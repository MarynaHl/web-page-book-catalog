import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const books = [
  { id: 1, title: "Тіні забутих предків", author: "М. Коцюбинський", genre: "classic", price: 220 },
  { id: 2, title: "Ловець пригод", author: "А. Блейк", genre: "fantasy", price: 310 },
  { id: 3, title: "Коротка історія часу", author: "С. Гокінг", genre: "nonfiction", price: 450 },
  { id: 4, title: "Місто", author: "В. Підмогильний", genre: "classic", price: 260 },
  { id: 5, title: "Пікнік на узбіччі", author: "Брати Стругацькі", genre: "fantasy", price: 280 },
  { id: 6, title: "Чому нації занепадають", author: "Аджемоглу/Робінсон", genre: "nonfiction", price: 500 },
];

app.get("/books", (req, res) => res.json(books));

app.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
