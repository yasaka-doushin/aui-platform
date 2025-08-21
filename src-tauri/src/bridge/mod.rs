// src-tauri/src/bridge/mod.rs
pub mod application_bridge;
pub mod context;
pub mod types;
pub mod vscode;

#[cfg(target_os = "windows")]
pub mod windows;

pub use application_bridge::ApplicationBridge;
pub use types::{AppContext, BridgeError, WindowInfo};
