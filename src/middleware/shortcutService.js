import { use } from 'react';
import supabase from './supabase';

export async function getShortcuts(userId) {
  // logged in → load from Supabase
  const { data, error } = await supabase
    .from("shortcuts")
    .select("*")
    .eq("user_id", userId)
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data;
}

export async function saveShortcuts(userId, shortcuts) {
  // upsert keeps rows if they already exist, and updates them
  const { error } = await supabase
    .from("shortcuts")
    .upsert(
      shortcuts.map((s, idx) => ({
        id: s.id,
        user_id: userId,
        name: s.name,
        link: s.link,
        icon_url: s.icon_url,
        order_index: idx,
      })),
      { onConflict: ["id"] } // ensures id uniqueness drives update vs insert
    );

  if (error) throw error;
}

export async function deleteShortcut(userId, shortcutId) {
  const { error } = await supabase
    .from("shortcuts")
    .delete()
    .match({
      user_id: String(userId),
      id: String(shortcutId)
    });

  if (error) throw error;
}

export async function updateShortcutOrder(userId, shortcuts) {
  // Loop through each shortcut and update its order_index
  for (let i = 0; i < shortcuts.length; i++) {
    const s = shortcuts[i];
    await supabase
      .from("shortcuts")
      .update({ order_index: i })
      .eq("id", s.id)
      .eq("user_id", userId);
  }
}

export async function uploadIcon(userId, file) {
  // Ensure unique filename inside the user's folder
  const filePath = `user-${userId}/${crypto.randomUUID()}-${file.name}`;

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from("icons")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false, // prevent overwriting
    });

  if (uploadError) throw uploadError;

  // Get a public URL to use in <img src="">
  const { data } = supabase.storage
    .from("icons")
    .getPublicUrl(filePath);

  return data.publicUrl;
}