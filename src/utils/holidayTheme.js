const STORAGE_KEY = "sv_holiday_theme";
export const HOLIDAY_THEME_EVENT = "sv-holiday-theme-change";

const defaultTheme = () => ({
  newYearDecor: false,
  newYearEffects: false,
  victoryDayDecor: false,
  victoryDayEffects: false,
});

export function getHolidayTheme() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTheme();
    const data = JSON.parse(raw);
    return {
      ...defaultTheme(),
      ...data,
    };
  } catch {
    return defaultTheme();
  }
}

export function setHolidayTheme(theme) {
  const next = { ...defaultTheme(), ...theme };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(HOLIDAY_THEME_EVENT, { detail: next }));
  return next;
}
