// src/components/Chat/ChatWindow.tsx
// Zustandを使用するように更新

import { useState, useEffect } from "react";
import { useChatStore } from "../../stores/ChatStore";
import { testConnection } from "../../services/tauriService";
import "./ChatWindow.css";

export function ChatWindow() {
  const [inputText, setInputText] = useState("");

  // Zustandストアから状態とアクションを取得
  const {
    messages,
    isLoading,
    isConnected,
    sendMessage,
    setConnected,
    clearMessages,
  } = useChatStore();

  // 起動時に接続テスト
  useEffect(() => {
    testConnection().then(setConnected);
  }, [setConnected]);

  const handleSend = async () => {
    if (inputText.trim() && !isLoading) {
      await sendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <div className="chat-window">
      <div className="header">
        <div className="status-header">
          接続状態： {isConnected ? "✅ 接続済み" : "❌ 未接続"}
        </div>
        <button className="clear-button" onClick={clearMessages}>
          Clear
        </button>
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.isUser ? "user-message" : "bot-message"}`}
          >
            <div className="message-text">{msg.text}</div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && <div className="loading">応答を待っています...</div>}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="メッセージを入力..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? "送信中..." : "送信"}
        </button>
      </div>
    </div>
  );
}
