import { colorThemes, updateUserTheme } from "../middleware/profileTheme";

export default function ThemePicker({ user }) {
  return (
    <div className="theme-picker">
      {Object.keys(colorThemes).map((key) => (
        <button
          key={key}
          onClick={() => updateUserTheme(key, user.id)}
          style={{
            background: colorThemes[key].background,
            color: colorThemes[key].text,
            margin: "0.5rem",
            padding: "1rem",
            borderRadius: "6px",
          }}
        >
        </button>
      ))}
    </div>
  );
}