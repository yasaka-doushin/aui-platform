import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import type { Transition } from "framer-motion";

import {
  EmotionType,
  mouthPaths,
  eyeSettings,
  emotionColors,
} from "./emotions";
import { EmotionEffect } from "./EmotionEffects";
import "./Avatar.css";

interface AvatarProps {
  emotion?: EmotionType;
  size?: number;
  speaking?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  emotion = "neutral",
  size = 200,
  speaking = false,
}) => {
  const eyeSetting = eyeSettings[emotion];
  const mouthPath = mouthPaths[emotion];
  const faceColor = emotionColors[emotion];
  // まばたきアニメーション用の状態
  const [isBlinking, setIsBlinking] = useState(false);

  // まばたきタイマー
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // アニメーション設定
  const springConfig = {
    type: "spring",
    stiffness: 300,
    damping: 20,
    mass: 0.8,
  } satisfies Transition;

  return (
    <MotionConfig transition={{ duration: 0.3 }}>
      <div className="avatar-wrapper">
        <div className="avatar-container">
          <svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            className="avatar-svg"
          >
            {/* アニメーション付き顔の輪郭 */}
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              stroke="#E0A080"
              strokeWidth="2"
              initial={{ fill: faceColor }}
              animate={{
                fill: faceColor,
                scale: speaking ? [1, 1.02, 1] : 1,
              }}
              transition={
                speaking
                  ? {
                      scale: {
                        duration: 0.3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      },
                    }
                  : { duration: 0.3 }
              }
            />

            {/* 左目(まばたき対応) */}
            <motion.ellipse
              cx="75"
              cy={90}
              rx="8"
              ry="8"
              fill="#333"
              animate={{
                ry: isBlinking ? 0.5 : 8 * eyeSetting.leftEye.scaleY,
                cy: 90 + eyeSetting.leftEye.translateY,
              }}
              transition={springConfig}
            />

            {/* 右目(まばたき対応) */}
            <motion.ellipse
              cx="125"
              cy={90}
              rx="8"
              ry="8"
              fill="#333"
              animate={{
                ry: isBlinking ? 0.5 : 8 * eyeSetting.rightEye.scaleY,
                cy: 90 + eyeSetting.rightEye.translateY,
              }}
              transition={springConfig}
            />

            {/* アニメーション付き口 */}
            <motion.path
              fill="none"
              stroke="#333"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ d: mouthPath }}
              animate={{
                d: mouthPath,
                strokeWidth: speaking ? [3, 4, 3] : 3,
              }}
              transition={
                speaking
                  ? {
                      strokeWidth: {
                        duration: 0.2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      },
                      d: { duration: 0.3, ease: "easeInOut" },
                    }
                  : { duration: 0.3, ease: "easeInOut" }
              }
            />

            {/* 条件付き要素 - AnimatePresenceでラップ */}
            <AnimatePresence mode="wait">
              {/* 怒りの眉毛 */}
              {emotion === "angry" && (
                <motion.g
                  key="angry-eyebrows"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <line
                    x1="65"
                    y1="75"
                    x2="85"
                    y2="80"
                    stroke="#333"
                    strokeWidth="3"
                  />
                  <line
                    x1="115"
                    y1="80"
                    x2="135"
                    y2="75"
                    stroke="#333"
                    strokeWidth="3"
                  />
                </motion.g>
              )}

              {/* 悲しみの涙 */}
              {emotion === "sad" && (
                <motion.g key="sad-tears">
                  <motion.ellipse
                    cx="75"
                    cy="105"
                    rx="3"
                    ry="5"
                    fill="#87CEEB"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                      opacity: 0.7,
                      y: [0, 20],
                    }}
                    transition={{
                      y: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeIn",
                      },
                    }}
                  />
                  <motion.ellipse
                    cx="125"
                    cy="105"
                    rx="3"
                    ry="5"
                    fill="#87CEEB"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                      opacity: 0.7,
                      y: [0, 20],
                    }}
                    transition={{
                      y: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeIn",
                        delay: 0.5,
                      },
                    }}
                  />
                </motion.g>
              )}
            </AnimatePresence>

            {/* 話している時のインジケーター（v12最適化） */}
            <AnimatePresence>
              {speaking && (
                <motion.g
                  key="speaking-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.circle
                      key={i}
                      cx={90 + i * 10}
                      cy={145}
                      r="2"
                      fill="#FF6B6B"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
          {/* 感情エフェクトオーバーレイ */}
          <EmotionEffect emotion={emotion} />
        </div>
      </div>
    </MotionConfig>
  );
};
