use std::sync::Arc;
use sysinfo::System;
use tokio::sync::RwLock;

pub struct PerformanceMonitor {
    system: Arc<RwLock<System>>,
}

impl PerformanceMonitor {
    pub fn new() -> Self {
        Self {
            system: Arc::new(RwLock::new(System::new_all())),
        }
    }

    // メモリ使用量取得（MB単位）
    pub async fn get_memory_usage(&self) -> f32 {
        let mut sys = self.system.write().await;
        sys.refresh_memory();

        let used = sys.used_memory() as f32;
        let total = sys.total_memory() as f32;

        if total > 0.0 {
            (used / total) * 100.0
        } else {
            0.0
        }
    }

    // CPU使用率取得
    pub async fn get_cpu_usage(&self) -> f32 {
        let mut sys = self.system.write().await;
        sys.refresh_cpu();

        sys.global_cpu_info().cpu_usage()
    }

    // システム情報取得
    pub async fn get_system_info(&self) -> Result<SystemInfo, String> {
        let memory = self.get_memory_usage().await;
        let cpu = self.get_cpu_usage().await;

        Ok(SystemInfo {
            memory_usage_percent: memory,
            cpu_usage_percent: cpu,
            available_memory_mb: self.get_available_memory_mb().await,
        })
    }

    async fn get_available_memory_mb(&self) -> u64 {
        let sys = self.system.read().await;
        sys.available_memory() / 1024 / 1024
    }
}

#[derive(serde::Serialize)]
pub struct SystemInfo {
    pub memory_usage_percent: f32,
    pub cpu_usage_percent: f32,
    pub available_memory_mb: u64,
}
