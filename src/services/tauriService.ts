import { invoke } from "@tauri-apps/api/core";

// Rust側のコマンドを呼び出す関数
export async function sendMessageToBackend(message: string): Promise<string> {
  try {
    // Rust側の process_message コマンドを呼び出す
    const response = await invoke<string>("process_message", {
      message: message,
    });
    return response;
  } catch (error) {
    console.error("バックエンド通信エラー:", error);
    return "エラーが発生しました";
  }
}

// 動作テスト用の関数
export async function testConnection(): Promise<boolean> {
  try {
    const response = await sendMessageToBackend("接続テスト");
    console.log("接続テスト成功:", response);
    return true;
  } catch (error) {
    console.error("接続テスト失敗:", error);
    return false;
  }
}
