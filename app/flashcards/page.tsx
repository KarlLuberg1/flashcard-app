"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  createCategoryServer,
  updateCategoryServer,
  deleteCategoryServer,
  createCardServer,
  updateCardServer,
  deleteCardServer,
} from "./serverside";

interface Category {
  id: number;
  name: string;
}

interface Card {
  id: number;
  category_id: number;
  question: string;
  answer: string;
}

export default function FlashcardPage() {
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const { data: catData } = await supabase
        .from("categories")
        .select("*")
        .order("id");
      const { data: cardData } = await supabase
        .from("cards")
        .select("*")
        .order("id");

      if (catData) setCategories(catData);
      if (cardData) setCards(cardData);
    };

    loadData();
  }, []);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await createCategoryServer(newCategory);
    if (data && Array.isArray(data)) {
      setCategories((prev) => [...prev, ...data]);
      setNewCategory("");
    }
  };

  const editCategory = async (id: number, name: string) => {
    const newName = prompt("New category name:", name);
    if (!newName) return;
    const data = await updateCategoryServer(id, newName);
    if (data && Array.isArray(data)) {
      setCategories((prev) => prev.map((c) => (c.id === id ? data[0] : c)));
    }
  };

  const removeCategory = async (id: number) => {
    await deleteCategoryServer(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setCards((prev) => prev.filter((card) => card.category_id !== id));
  };

  const addCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return alert("Select category first!");
    const data = await createCardServer(selectedCategory, question, answer);
    if (data && Array.isArray(data)) {
      setCards((prev) => [...prev, ...data]);
      setQuestion("");
      setAnswer("");
    }
  };

  const editCard = async (id: number, q: string, a: string) => {
    const newQuestion = prompt("New question:", q);
    const newAnswer = prompt("New answer:", a);
    if (!newQuestion || !newAnswer) return;
    const data = await updateCardServer(id, newQuestion, newAnswer);
    if (data && Array.isArray(data)) {
      setCards((prev) => prev.map((c) => (c.id === id ? data[0] : c)));
    }
  };

  const removeCard = async (id: number) => {
    await deleteCardServer(id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-center">Flashcards</h1>

      {/* categoryvisual */}
      <form onSubmit={addCategory} className="flex gap-2">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category"
          className="border p-2 rounded flex-1"
          required
        />
        <button className="bg-gray-800 text-white px-3 rounded">Add</button>
      </form>

      <ul>
        {categories.map((c) => (
          <li
            key={c.id}
            className={`p-2 border-b flex justify-between ${
              selectedCategory === c.id ? "bg-black" : ""
            }`}
          >
            <span onClick={() => setSelectedCategory(c.id)}>{c.name}</span>
            <div className="space-x-2 text-sm">
              <button onClick={() => editCategory(c.id, c.name)}>edit</button>
              <button onClick={() => removeCategory(c.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* cardvisual */}
      {selectedCategory && (
        <>
          <form onSubmit={addCard} className="flex flex-col gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Question"
              className="border p-2 rounded"
              required
            />
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Answer"
              className="border p-2 rounded"
              required
            />
            <button className="bg-gray-800 text-white p-2 rounded">Add</button>
          </form>

          {cards
            .filter((card) => card.category_id === selectedCategory)
            .map((card) => (
              <div key={card.id} className="p-2 border-b flex justify-between">
                <div>
                  <p className="font-medium">{card.question}</p>
                  <p className="text-sm">{card.answer}</p>
                </div>
                <div className="space-x-2 text-sm">
                  <button
                    onClick={() =>
                      editCard(card.id, card.question, card.answer)
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => removeCard(card.id)}>Delete</button>
                </div>
              </div>
            ))}
        </>
      )}
      <div className="flex justify-center">
        <button
          className="bg-green-200 text-black px-6 py-1 rounded mt-4"
          onClick={() => (window.location.href = "/play")}
        >
          Go play!
        </button>
      </div>
    </main>
  );
}
