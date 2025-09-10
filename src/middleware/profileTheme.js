import supabase from "./supabase"
// profileTheme.js
export const colorThemes = {
  red: { background: "#e74c3c", text: "#ffffff" },
  yellow: { background: "#f1c40f", text: "#000000" },
  green: { background: "#27ae60", text: "#ffffff" },
  lightBlue: { background: "#3498db", text: "#ffffff" },
  mediumBlue: { background: "#18188f", text: "#ffffff" },
  darkBlue: { background: "#2c3e50", text: "#ffffff" },
  purple: { background: "#9b59b6", text: "#ffffff" },
  black: { background: "#000000", text: "#ffffff" },
};

export async function updateUserTheme(colorKey, userId) {
  if (!userId) return;

  const { error } = await supabase
    .from("users")
    .update({ background_color: colorKey})
    .eq("id", userId);

  if (!error) {
    applyTheme(colorThemes[colorKey]); // instant feedback
  }
}

export function applyTheme(theme) {
  document.documentElement.style.setProperty("--nav-color", theme.background);
  document.documentElement.style.setProperty("--nav-text", theme.text);
}