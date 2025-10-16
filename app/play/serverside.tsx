"use server";

import { createServerClient } from "@supabase/ssr";

interface Card {
  id: number;
  question: string;
  answer: string;
  category_id: number;
}

function getServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}

export async function getCardsServer() {
  const supabase = getServerClient();
  const { data, error } = await supabase.from("cards").select("*");
  if (error) throw new Error(error.message);
  return data;
}

export async function checkAnswerServer(cardId: number, userAnswer: string) {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("cards")
    .select("answer")
    .eq("id", cardId)
    .single();

  if (error || !data) {
    console.error("Card not found:", error?.message);
    return { correct: false, correctAnswer: null };
  }

  const correct =
    userAnswer.trim().toLowerCase() === data.answer.trim().toLowerCase();

  return { correct, correctAnswer: data.answer };
}

export async function getNextCardServer(
  cards: Card[],
  currentIndex: number,
  mode: "sequential" | "random"
) {
  if (cards.length === 0) return 0;
  if (mode === "random") {
    const randomIndex = Math.floor(Math.random() * cards.length);
    return randomIndex;
  }
  return (currentIndex + 1) % cards.length;
}
