use super::types::{AppContext, BridgeError};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContextHistory {
    pub timestamp: DateTime<Utc>,
    pub context: AppContext,
}

pub struct ContextManager {
    history: Vec<ContextHistory>,
    max_history_size: usize,
}

impl ContextManager {
    pub fn new() -> Self {
        ContextManager {
            history: Vec::new(),
            max_history_size: 100,
        }
    }

    // コンテキストを記録
    pub fn record_context(&mut self, context: AppContext) {
        let entry = ContextHistory {
            timestamp: Utc::now(),
            context,
        };

        self.history.push(entry);

        // 履歴サイズを制限
        if self.history.len() > self.max_history_size {
            self.history.remove(0);
        }
    }

    // 最近のコンテキストを取得
    pub fn get_recent_contexts(&self, count: usize) -> Vec<&ContextHistory> {
        let start = if self.history.len() > count {
            self.history.len() - count
        } else {
            0
        };

        self.history[start..].iter().collect()
    }

    // VSCodeでの作業時間を集計（簡易版）
    pub fn get_vscode_usage_stats(&self) -> HashMap<String, usize> {
        let mut stats = HashMap::new();
        stats.insert("total_contexts".to_string(), self.history.len());

        let vscode_count = self.history.iter().filter(|h| h.context.is_vscode).count();
        stats.insert("vscode_contexts".to_string(), vscode_count);

        stats
    }
}
