// 8つの基本感情を定義
export type EmotionType =
  | "neutral" // 中立
  | "happy" // 嬉しい
  | "sad" // 悲しい
  | "angry" // 怒り
  | "surprised" // 驚き
  | "thinking" // 考え中
  | "confused" // 困惑
  | "excited"; // 興奮

// 各感情の口の形状データ
export const mouthPaths: Record<EmotionType, string> = {
  neutral: "M 75 130 L 125 130", // まっすぐ
  happy: "M 75 130 Q 100 145 125 130", // 笑顔
  sad: "M 75 140 Q 100 125 125 140", // 悲しい
  angry: "M 75 135 L 125 135", // 怒り（まっすぐ）
  surprised: "M 90 130 Q 100 140 110 130 Q 100 120 90 130", // O型
  thinking: "M 85 135 L 115 130", // 斜め
  confused: "M 75 130 Q 90 135 100 130 Q 110 125 125 130", // 波型
  excited: "M 75 125 Q 100 145 125 125", // 大きな笑顔
};

// 各感情の目の設定
export const eyeSettings: Record<
  EmotionType,
  {
    leftEye: { scaleY: number; translateY: number };
    rightEye: { scaleY: number; translateY: number };
  }
> = {
  neutral: {
    leftEye: { scaleY: 1, translateY: 0 },
    rightEye: { scaleY: 1, translateY: 0 },
  },
  happy: {
    leftEye: { scaleY: 0.3, translateY: 0 },
    rightEye: { scaleY: 0.3, translateY: 0 },
  },
  sad: {
    leftEye: { scaleY: 0.7, translateY: 5 },
    rightEye: { scaleY: 0.7, translateY: 5 },
  },
  angry: {
    leftEye: { scaleY: 0.5, translateY: 0 },
    rightEye: { scaleY: 0.5, translateY: 0 },
  },
  surprised: {
    leftEye: { scaleY: 1.5, translateY: -5 },
    rightEye: { scaleY: 1.5, translateY: -5 },
  },
  thinking: {
    leftEye: { scaleY: 0.8, translateY: 0 },
    rightEye: { scaleY: 0.3, translateY: 0 },
  },
  confused: {
    leftEye: { scaleY: 1, translateY: 0 },
    rightEye: { scaleY: 0.5, translateY: 0 },
  },
  excited: {
    leftEye: { scaleY: 1.2, translateY: -3 },
    rightEye: { scaleY: 1.2, translateY: -3 },
  },
};

// 各感情の色設定
export const emotionColors: Record<EmotionType, string> = {
  neutral: "#FFE0BD",
  happy: "#FFE5CC",
  sad: "#F0D0B0",
  angry: "#FFCCCC",
  surprised: "#FFF0DD",
  thinking: "#F5E0C0",
  confused: "#FFE0C0",
  excited: "#FFEECC",
};
