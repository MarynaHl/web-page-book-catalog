import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Simple example data
const books = [
  { id: 1, title: "City", author: "Pidmohylnyi", genre: "classic", price: 260 },
  { id: 2, title: "Time History", author: "Hawking", genre: "nonfiction", price: 450 }
];

// Routes
app.get("/books", (req, res) => res.json(books));
app.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// Start server
app.listen(3000, () => console.log("API running on http://localhost:3000"));
