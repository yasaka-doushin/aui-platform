import { invoke } from "@tauri-apps/api/core";

// エラー型定義
export interface AppError {
  code: string;
  message: string;
}

//エラーハンドリング関数
export async function safeInvoke<T>(
  command: string,
  args?: Record<string, unknown>
): Promise<{ data?: T; error?: AppError }> {
  try {
    const data = await invoke<T>(command, args);
    return { data };
  } catch (err) {
    console.error(`Command ${command} failed:`, err);

    // エラーオブジェクトの型チェック
    if (typeof err === "object" && err !== null && "code" in err) {
      return { error: err as AppError };
    }

    // 予期しないエラー
    return {
      error: {
        code: "UNKNOWN_ERROR",
        message: String(err),
      },
    };
  }
}

// ユーザー向けエラーメッセージ変換
export function getUserFriendlyMessage(error: AppError): string {
  const messages: Record<string, string> = {
    LLM_LOAD_ERROR: "AIモデルの読み込みに失敗しました",
    INVALID_INPUT: "入力内容が正しくありません",
    SYSTEM_ERROR: "システムエラーが発生しました",
    TEST_ERROR: "テストエラーです",
  };

  return messages[error.code] || error.message;
}
