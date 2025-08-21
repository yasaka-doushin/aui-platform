use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error_type: String,
    pub message: String,
    pub details: Option<String>,
}

impl From<super::types::BridgeError> for ErrorResponse {
    fn from(err: super::types::BridgeError) -> Self {
        match err {
            super::types::BridgeError::WindowsApiError(msg) => ErrorResponse {
                error_type: "WindowsAPI".to_string(),
                message: "Windows APIの呼び出しに失敗しました".to_string(),
                details: Some(msg),
            },
            super::types::BridgeError::ProcessNotFound => ErrorResponse {
                error_type: "ProcessNotFound".to_string(),
                message: "プロセスが見つかりません".to_string(),
                details: None,
            },
            super::types::BridgeError::ContextReadError => ErrorResponse {
                error_type: "ContextError".to_string(),
                message: "コンテキストの読み取りに失敗しました".to_string(),
                details: None,
            },
        }
    }
}
