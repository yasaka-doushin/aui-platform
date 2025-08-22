import React, { useEffect } from "react";
import { getUserFriendlyMessage, AppError } from "../utils/errorHandler";

interface ErrorNotificationProps {
  error: AppError | null;
  onClose: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onClose,
}) => {
  useEffect(() => {
    if (error) {
      // 5秒後に自動で閉じる
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  if (!error) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#ff4444",
        color: "white",
        padding: "12px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        maxWidth: "400px",
        zIndex: 1000,
      }}
    >
      <span>⚠️</span>
      <span>{getUserFriendlyMessage(error)}</span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        ×
      </button>
    </div>
  );
};
