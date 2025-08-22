import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface SystemInfo {
  memory_usage_percent: number;
  cpu_usage_percent: number;
  available_memory_mb: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const info = await invoke<SystemInfo>("get_system_info");
        setSystemInfo(info);
      } catch (error) {
        console.error("Failed to get system info:", error);
      }
    }, 2000); // 2秒ごとに更新

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          padding: "8px",
          background: "#333",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        📊
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "8px",
        fontSize: "12px",
        fontFamily: "monospace",
        minWidth: "200px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <span>Performance Monitor</span>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {systemInfo ? (
        <>
          <div>CPU: {systemInfo.cpu_usage_percent.toFixed(1)}%</div>
          <div>Memory: {systemInfo.memory_usage_percent.toFixed(1)}%</div>
          <div>Available: {systemInfo.available_memory_mb} MB</div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
