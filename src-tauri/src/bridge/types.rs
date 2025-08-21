use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WindowInfo {
    pub title: String,
    pub app_name: String,
    pub process_id: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppContext {
    pub window_info: WindowInfo,
    pub is_vscode: bool,
    pub content: Option<String>,
}

#[derive(Debug)]
pub enum BridgeError {
    WindowsApiError(String),
    ProcessNotFound,
    ContextReadError,
}

impl std::fmt::Display for BridgeError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            BridgeError::WindowsApiError(msg) => write!(f, "Windows API Error: {}", msg),
            BridgeError::ProcessNotFound => write!(f, "Process not found"),
            BridgeError::ContextReadError => write!(f, "Failed to read context"),
        }
    }
}

impl std::error::Error for BridgeError {}
