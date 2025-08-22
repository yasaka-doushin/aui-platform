import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Settings {
  // 基本設定
  theme: "light" | "dark";
  language: "ja" | "en";

  // AI設定
  llmTemperature: number; // 0.0 - 1.0
  maxTokens: number; // 100 - 2000

  // アバター設定
  avatarSpeed: "slow" | "normal" | "fast";
  showEmotions: boolean;
}

interface SettingsStore {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

export const defaultSettings: Settings = {
  theme: "light",
  language: "ja",
  llmTemperature: 0.7,
  maxTokens: 500,
  avatarSpeed: "normal",
  showEmotions: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: "aui-settings",
    }
  )
);
