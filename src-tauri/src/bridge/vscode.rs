use super::types::{AppContext, BridgeError, WindowInfo};

pub struct VSCodeBridge;

impl VSCodeBridge {
    pub fn new() -> Self {
        VSCodeBridge
    }

    // VSCodeかどうかを判定
    pub fn is_vscode(app_name: &str) -> bool {
        app_name.to_lowercase().contains("code.exe")
            || app_name.to_lowercase().contains("code - insiders.exe")
    }

    // VSCode固有のコンテキストを取得（簡易版）
    pub fn get_vscode_context(window_info: &WindowInfo) -> AppContext {
        // ウィンドウタイトルからファイル名を推測
        let content = if window_info.title.contains(" - Visual Studio Code") {
            let parts: Vec<&str> = window_info.title.split(" - ").collect();
            if !parts.is_empty() {
                Some(format!("Editing: {}", parts[0]))
            } else {
                None
            }
        } else {
            None
        };

        AppContext {
            window_info: window_info.clone(),
            is_vscode: true,
            content,
        }
    }

    // 将来的な拡張用：VSCodeにコマンドを送信
    pub async fn send_command(&self, command: &str) -> Result<(), BridgeError> {
        println!("[VSCode] Command would be sent: {}", command);
        // 実際の実装は後で追加
        Ok(())
    }
}
