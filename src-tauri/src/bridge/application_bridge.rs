// src-tauri/src/bridge/application_bridge.rs
use super::context::ContextManager;
use super::types::{AppContext, BridgeError, WindowInfo};
use super::vscode::VSCodeBridge;

#[cfg(target_os = "windows")]
use super::windows::WindowsBridge;

use std::sync::Arc;
use tokio::sync::Mutex;

pub struct ApplicationBridge {
    // 将来的に設定やキャッシュを保持
    debug_mode: bool,
    #[cfg(target_os = "windows")]
    windows_bridge: WindowsBridge,
    vscode_bridge: VSCodeBridge,
    context_manager: Arc<Mutex<ContextManager>>,
}

impl ApplicationBridge {
    pub fn new() -> Self {
        ApplicationBridge {
            debug_mode: true, // デバッグモードON
            #[cfg(target_os = "windows")]
            windows_bridge: WindowsBridge::new(),
            vscode_bridge: VSCodeBridge::new(),
            context_manager: Arc::new(Mutex::new(ContextManager::new())),
        }
    }

    pub async fn get_active_window(&self) -> Result<WindowInfo, BridgeError> {
        if self.debug_mode {
            println!("[DEBUG] Getting active window info...");
        }

        #[cfg(target_os = "windows")]
        {
            let info = self.windows_bridge.get_active_window_info()?;
            if self.debug_mode {
                println!("[DEBUG] Window: {} (PID: {})", info.title, info.process_id);
            }
            return Ok(info);
        }

        #[cfg(not(target_os = "windows"))]
        {
            // Windows以外の環境ではダミーデータ
            Ok(WindowInfo {
                title: "Not implemented".to_string(),
                app_name: "unknown".to_string(),
                process_id: 0,
            })
        }
    }

    pub async fn get_app_context(&self) -> Result<AppContext, BridgeError> {
        let window_info = self.get_active_window().await?;

        // VSCodeかどうかチェック
        let context = if VSCodeBridge::is_vscode(&window_info.app_name) {
            if self.debug_mode {
                println!("[DEBUG] VSCode detected!");
            }
            VSCodeBridge::get_vscode_context(&window_info)
        } else {
            // その他のアプリケーション
            AppContext {
                window_info: window_info.clone(),
                is_vscode: false,
                content: None,
            }
        };

        // コンテキストを記録
        let mut manager = self.context_manager.lock().await;
        manager.record_context(context.clone());

        Ok(context)
    }

    // 統計情報を取得
    pub async fn get_usage_stats(&self) -> std::collections::HashMap<String, usize> {
        let manager = self.context_manager.lock().await;
        manager.get_vscode_usage_stats()
    }
}
