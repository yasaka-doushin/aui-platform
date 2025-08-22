import React, { useState } from "react";
import { defaultSettings, useSettingsStore } from "../stores/settingsStore";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetSettings();
    setLocalSettings(defaultSettings);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "30px",
          width: "500px",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <h2>設定</h2>

        {/* 基本設定 */}
        <div style={{ marginTop: "20px" }}>
          <h3>基本設定</h3>

          <div style={{ marginTop: "10px" }}>
            <label>テーマ:</label>
            <select
              value={localSettings.theme}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  theme: e.target.value as "light" | "dark",
                })
              }
              style={{ marginLeft: "10px" }}
            >
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
            </select>
          </div>

          <div style={{ marginTop: "10px" }}>
            <label>言語:</label>
            <select
              value={localSettings.language}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  language: e.target.value as "ja" | "en",
                })
              }
              style={{ marginLeft: "10px" }}
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* AI設定 */}
        <div style={{ marginTop: "20px" }}>
          <h3>AI設定</h3>

          <div style={{ marginTop: "10px" }}>
            <label>Temperature: {localSettings.llmTemperature}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localSettings.llmTemperature}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  llmTemperature: parseFloat(e.target.value),
                })
              }
              style={{ width: "100%", marginTop: "5px" }}
            />
            <small>
              低い値=より一貫性のある応答、高い値=よりクリエイティブ
            </small>
          </div>

          <div style={{ marginTop: "10px" }}>
            <label>最大トークン数: {localSettings.maxTokens}</label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={localSettings.maxTokens}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  maxTokens: parseInt(e.target.value),
                })
              }
              style={{ width: "100%", marginTop: "5px" }}
            />
          </div>
        </div>

        {/* アバター設定 */}
        <div style={{ marginTop: "20px" }}>
          <h3>アバター設定</h3>

          <div style={{ marginTop: "10px" }}>
            <label>アニメーション速度:</label>
            <select
              value={localSettings.avatarSpeed}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  avatarSpeed: e.target.value as "slow" | "normal" | "fast",
                })
              }
              style={{ marginLeft: "10px" }}
            >
              <option value="slow">ゆっくり</option>
              <option value="normal">普通</option>
              <option value="fast">速い</option>
            </select>
          </div>

          <div style={{ marginTop: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={localSettings.showEmotions}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    showEmotions: e.target.checked,
                  })
                }
              />
              感情表現を表示
            </label>
          </div>
        </div>

        {/* ボタン */}
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {saved && <span style={{ color: "green" }}>✓ 保存しました</span>}
          <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
            <button onClick={handleReset}>初期値に戻す</button>
            <button onClick={onClose}>キャンセル</button>
            <button
              onClick={handleSave}
              style={{
                background: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
