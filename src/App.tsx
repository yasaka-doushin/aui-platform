import { useState } from "react";
import { invoke } from "@tauri-apps/api/core"; // Tauri v2のインポート方法

import { Avatar } from "./components/Avatar";
import { ChatWindow } from "./components/Chat/ChatWindow";
// import { useChatStore } from "./stores/ChatStore";
import { EmotionType } from "./components/Avatar/emotions";

import "./App.css";

// interface LLMResponse {
//   text: string;
//   emotion: string;
//   tokens: number;
// }

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>("neutral");

  // const [llmPrompt, setLlmPrompt] = useState("");
  // const [llmResponse, setLlmResponse] = useState<LLMResponse | null>(null);
  // const [isLoading, setIsLoading] = useState(false);

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  const emotions: EmotionType[] = [
    "neutral",
    "happy",
    "sad",
    "angry",
    "surprised",
    "thinking",
    "confused",
    "excited",
  ];

  // async function testLLM() {
  //   if (!llmPrompt.trim()) {
  //     alert("プロンプトを入力してください");
  //     return;
  //   }

  //   setIsLoading(true);
  //   setLlmResponse(null);

  //   try {
  //     const response = await invoke<LLMResponse>("test_llm", {
  //       prompt: llmPrompt,
  //     });
  //     setLlmResponse(response);
  //   } catch (error) {
  //     console.error("LLMエラー:", error);
  //     setLlmResponse({
  //       text: `エラー: ${error}`,
  //       emotion: "error",
  //       tokens: 0,
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // // 感情に応じた絵文字を返す
  // const getEmotionEmoji = (emotion: string) => {
  //   const emojis: { [key: string]: string } = {
  //     happy: "😊",
  //     excited: "🤩",
  //     helpful: "🤝",
  //     thinking: "🤔",
  //     neutral: "😐",
  //     error: "❌",
  //   };
  //   return emojis[emotion] || "🤖";
  // };

  return (
    <div className="container">
      <h1> AUI Platform - Avatar Test</h1>

      {/* アバター表示　*/}
      <div style={{ margin: "20px 0 " }}>
        <Avatar emotion={currentEmotion} />
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Current emotion: <strong>{currentEmotion}</strong>
        </p>
      </div>

      {/* 感情切り替えボタン */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          margin: "20px 0",
        }}
      >
        {emotions.map((emotion) => (
          <button
            key={emotion}
            onClick={() => setCurrentEmotion(emotion)}
            style={{
              padding: "8px 16px",
              backgroundColor:
                currentEmotion === emotion ? "#0074D9" : "#f0f0f0",
              color: currentEmotion === emotion ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {emotion}
          </button>
        ))}
      </div>

      <div className="row">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="submit">Greet</button>
        </form>
      </div>
      <p>{greetMsg}</p>

      <div className="container">
        <ChatWindow />
      </div>
    </div>

    //   {/* LLMテスト部分 */}
    //   <div className="row" style={{ marginTop: "30px" }}>
    //     <h2>🧠 AI アシスタント (簡易版)</h2>
    //     <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
    //       <textarea
    //         value={llmPrompt}
    //         onChange={(e) => setLlmPrompt(e.target.value)}
    //         placeholder="質問を入力してください... (例: こんにちは、プログラミングについて教えて、など)"
    //         style={{
    //           width: "500px",
    //           height: "100px",
    //           padding: "10px",
    //           fontSize: "14px",
    //         }}
    //       />
    //       <button
    //         type="button"
    //         onClick={testLLM}
    //         disabled={isLoading}
    //         style={{
    //           padding: "10px 20px",
    //           fontSize: "16px",
    //           cursor: isLoading ? "not-allowed" : "pointer",
    //         }}
    //       >
    //         {isLoading ? "🔄 処理中..." : "📨 送信"}
    //       </button>

    //       {llmResponse && (
    //         <div
    //           style={{
    //             marginTop: "20px",
    //             padding: "15px",
    //             backgroundColor: "#f0f0f0",
    //             borderRadius: "8px",
    //             border: "2px solid #ddd",
    //           }}
    //         >
    //           <div style={{ marginBottom: "10px" }}>
    //             <strong>感情:</strong> {getEmotionEmoji(llmResponse.emotion)}{" "}
    //             {llmResponse.emotion}
    //           </div>
    //           <div style={{ marginBottom: "10px" }}>
    //             <strong>応答:</strong>
    //             <p style={{ marginTop: "5px" }}>{llmResponse.text}</p>
    //           </div>
    //           <div style={{ fontSize: "12px", color: "#666" }}>
    //             使用トークン数: {llmResponse.tokens}
    //           </div>
    //         </div>
    //       )}
    //     </div>

    //     {/* テスト用のサンプル質問 */}
    //     <div
    //       style={{
    //         marginTop: "30px",
    //         padding: "15px",
    //         backgroundColor: "#e8f4f8",
    //         borderRadius: "8px",
    //       }}
    //     >
    //       <h3>💡 試してみよう！</h3>
    //       <ul style={{ textAlign: "left" }}>
    //         <li>「こんにちは」と挨拶してみる</li>
    //         <li>「プログラミングについて教えて」と聞いてみる</li>
    //         <li>「Rustについて知りたい」と質問してみる</li>
    //         <li>「助けて」とヘルプを求めてみる</li>
    //       </ul>
    //     </div>
    //   </div>
    // </div>
  );
}

export default App;
