use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AppError {
    pub code: String,
    pub message: String,
}

impl AppError {
    pub fn new(code: &str, message: &str) -> Self {
        Self {
            code: code.to_string(),
            message: message.to_string(),
        }
    }
}

// Tauriコマンドで使用するResult型
pub type AppResult<T> = Result<T, AppError>;

// エラーコード定数
pub const ERROR_LLM_LOAD: &str = "LLM_LOAD_ERROR";
pub const ERROR_INVALID_INPUT: &str = "INVALID_INPUT";
pub const ERROR_SYSTEM: &str = "SYSTEM_ERROR";

// From実装でエラー変換を簡単に
impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        AppError::new(ERROR_SYSTEM, &err.to_string())
    }
}
