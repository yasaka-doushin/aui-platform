// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// モジュールの宣言
mod ai;
mod commands;
mod utils;

use ai::SimpleLLM;
use std::sync::Arc;
use tokio::sync::Mutex;

// グローバル状態の管理
struct AppState {
    llm: Arc<Mutex<SimpleLLM>>,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// 新しいコマンド：LLMテスト用
#[tauri::command]
async fn test_llm(
    prompt: String,
    state: tauri::State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    println!("test_llm コマンド呼び出し: {}", prompt);

    let llm = state.llm.lock().await;
    match llm.generate(&prompt).await {
        Ok(response) => {
            println!(
                "LLM応答成功: {} (感情: {})",
                response.text, response.emotion
            );
            Ok(serde_json::json!({
                "text": response.text,
                "emotion": response.emotion,
                "tokens": response.tokens_used
            }))
        }
        Err(e) => {
            println!("LLMエラー: {}", e);
            Err(format!("LLMエラー: {}", e))
        }
    }
}

fn main() {
    // アプリケーション状態の初期化
    let app_state = AppState {
        llm: Arc::new(Mutex::new(SimpleLLM::new())),
    };

    tauri::Builder::default()
        .manage(app_state) // 状態を管理
        .invoke_handler(tauri::generate_handler![greet, test_llm]) // test_llmを追加
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
