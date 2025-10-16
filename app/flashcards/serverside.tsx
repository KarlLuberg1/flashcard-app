"use server";

import { createServerClient } from "@supabase/ssr";

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

export async function createCategoryServer(name: string) {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from("categories")
    .insert([{ name }])
    .select("*");

  if (error) {
    throw new Error(`Create category failed: ${error.message}`);
  }
  return data;
}

export async function updateCategoryServer(id: number, name: string) {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id)
    .select("*");

  if (error) {
    throw new Error(`Update category failed: ${error.message}`);
  }
  return data;
}

export async function deleteCategoryServer(id: number) {
  const supabase = getServerClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    throw new Error(`Delete category failed: ${error.message}`);
  }
}

export async function createCardServer(
  category_id: number,
  question: string,
  answer: string
) {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("cards")
    .insert([{ category_id, question, answer }])
    .select("*");

  if (error) {
    throw new Error(`Create card failed: ${error.message}`);
  }
  return data;
}

export async function updateCardServer(
  id: number,
  question: string,
  answer: string
) {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("cards")
    .update({ question, answer })
    .eq("id", id)
    .select("*");

  if (error) {
    throw new Error(`Update card failed: ${error.message}`);
  }
  return data;
}

export async function deleteCardServer(id: number) {
  const supabase = getServerClient();
  const { error } = await supabase.from("cards").delete().eq("id", id);

  if (error) {
    throw new Error(`Delete card failed: ${error.message}`);
  }
}
