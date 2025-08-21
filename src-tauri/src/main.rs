// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod bridge;

// モジュールの宣言
mod ai;
mod commands;
mod utils;

use ai::SimpleLLM;
use bridge::ApplicationBridge;
use std::sync::Arc;
use tokio::sync::{Mutex, RwLock};

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

// シンプルなメッセージ処理コマンド
#[tauri::command]
fn process_message(message: String) -> String {
    // とりあえずエコーバック（受け取ったメッセージに「応答: 」を付けて返す）
    format!("応答: {}", message)
}

// テスト用コマンド
#[tauri::command]
async fn test_bridge(
    bridge: tauri::State<'_, Arc<RwLock<ApplicationBridge>>>,
) -> Result<String, String> {
    let bridge = bridge.read().await;
    match bridge.get_active_window().await {
        Ok(info) => Ok(format!("Window: {} ({})", info.title, info.app_name)),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
async fn get_app_context(
    bridge: tauri::State<'_, Arc<RwLock<ApplicationBridge>>>,
) -> Result<bridge::AppContext, String> {
    let bridge = bridge.read().await;
    bridge.get_app_context().await.map_err(|e| e.to_string())
}

fn main() {
    // アプリケーション状態の初期化
    let app_state = AppState {
        llm: Arc::new(Mutex::new(SimpleLLM::new())),
    };

    let app_bridge = Arc::new(RwLock::new(ApplicationBridge::new()));

    tauri::Builder::default()
        .manage(app_state) // 状態を管理
        .manage(app_bridge)
        .invoke_handler(tauri::generate_handler![
            greet,
            test_llm,
            process_message,
            test_bridge,
            get_app_context,
        ]) // test_llmを追加
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
