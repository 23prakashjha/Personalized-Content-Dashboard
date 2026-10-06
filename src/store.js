import { configureStore, createSlice } from "@reduxjs/toolkit";
import { topics } from "./content.js";

const STORAGE_KEY = "the-current-preferences";

function readPreferences() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Could not restore saved preferences:", error);
    return null;
  }
}

const saved = readPreferences();

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    favorites: saved?.favorites ?? [],
    topics: saved?.topics ?? topics,
    darkMode: saved?.darkMode ?? false,
  },
  reducers: {
    toggleFavorite(state, action) {
      const id = action.payload;
      state.favorites = state.favorites.includes(id)
        ? state.favorites.filter((favorite) => favorite !== id)
        : [...state.favorites, id];
    },
    toggleTopic(state, action) {
      const topic = action.payload;
      state.topics = state.topics.includes(topic)
        ? state.topics.filter((item) => item !== topic)
        : [...state.topics, topic];
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { toggleFavorite, toggleTopic, toggleDarkMode } =
  preferencesSlice.actions;

export const store = configureStore({
  reducer: { preferences: preferencesSlice.reducer },
});

store.subscribe(() => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(store.getState().preferences),
    );
  } catch (error) {
    console.error("Could not save preferences:", error);
  }
});
