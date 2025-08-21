
// src-tauri/src/bridge/windows.rs
use windows::Win32::{
    Foundation::{HWND, MAX_PATH},
    UI::WindowsAndMessaging::{
        GetForegroundWindow, GetWindowTextW, GetWindowThreadProcessId,
    },
    System::Threading::{OpenProcess, PROCESS_QUERY_INFORMATION, PROCESS_VM_READ},
    System::ProcessStatus::GetModuleFileNameExW,
};
use std::ffi::OsString;
use std::os::windows::ffi::OsStringExt;

use super::types::{WindowInfo, BridgeError};

pub struct WindowsBridge;

impl WindowsBridge {
    pub fn new() -> Self {
        WindowsBridge
    }

    pub fn get_active_window_info(&self) -> Result<WindowInfo, BridgeError> {
        unsafe {
            // アクティブウィンドウのハンドルを取得
            let hwnd = GetForegroundWindow();
            
            if hwnd.0 == 0 {
                return Err(BridgeError::WindowsApiError(
                    "No active window found".to_string()
                ));
            }

            // ウィンドウタイトルを取得
            let mut title_buffer = vec![0u16; 256];
            let title_len = GetWindowTextW(hwnd, &mut title_buffer);
            
            let title = if title_len > 0 {
                let title_slice = &title_buffer[..title_len as usize];
                OsString::from_wide(title_slice)
                    .to_string_lossy()
                    .to_string()
            } else {
                "Unknown".to_string()
            };

            // プロセスIDを取得
            let mut process_id = 0u32;
            GetWindowThreadProcessId(hwnd, Some(&mut process_id));

            // プロセス名を取得
            let app_name = self.get_process_name(process_id)
                .unwrap_or_else(|_| "unknown.exe".to_string());

            Ok(WindowInfo {
                title,
                app_name,
                process_id,
            })
        }
    }

    fn get_process_name(&self, process_id: u32) -> Result<String, BridgeError> {
        unsafe {
            // プロセスを開く
            let process_handle = OpenProcess(
                PROCESS_QUERY_INFORMATION | PROCESS_VM_READ,
                false,
                process_id,
            ).map_err(|e| BridgeError::WindowsApiError(e.to_string()))?;

            // プロセス名を取得
            let mut filename_buffer = vec![0u16; MAX_PATH as usize];
            let len = GetModuleFileNameExW(
                process_handle,
                None,
                &mut filename_buffer,
            );

            if len == 0 {
                return Err(BridgeError::ProcessNotFound);
            }

            let filename = OsString::from_wide(&filename_buffer[..len as usize])
                .to_string_lossy()
                .to_string();

            // ファイル名だけを抽出
            let app_name = filename
                .split('\\')
                .last()
                .unwrap_or("unknown.exe")
                .to_string();

            Ok(app_name)
        }
    }
}