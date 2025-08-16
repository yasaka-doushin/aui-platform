import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { EmotionType } from "./emotions";

interface EmotionEffectProps {
  emotion: EmotionType;
}

// v12の新しいVariants API活用
const sparkleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    x: 0,
    y: 0,
  },
  visible: (custom: number) => ({
    opacity: [0, 1, 1, 0],
    scale: [0, 1, 0.8, 0],
    x: (Math.random() - 0.5) * 120,
    y: -Math.random() * 60 - 20,
    transition: {
      duration: 1.5,
      delay: custom * 0.2,
      repeat: Infinity,
      repeatDelay: 2,
      ease: "easeOut",
    },
  }),
};

const bubbleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    y: 0,
  },
  visible: (custom: number) => ({
    opacity: [0, 0.8, 0.8, 0],
    scale: [0.3, 0.6 + custom * 0.2, 0.6 + custom * 0.2, 0],
    y: [-20 - custom * 15, -40 - custom * 25],
    transition: {
      duration: 2,
      delay: custom * 0.3,
      repeat: Infinity,
      repeatDelay: 1,
      ease: "easeOut",
    },
  }),
};

const exclamationVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: -180,
  },
  visible: {
    opacity: [0, 1, 1, 0],
    scale: [0.5, 1.2, 1, 0],
    rotate: 0,
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 2,
      ease: "backOut",
    },
  },
};

export const EmotionEffect: React.FC<EmotionEffectProps> = ({ emotion }) => {
  // v12のAnimatePresence with mode="wait"
  return (
    <AnimatePresence mode="wait">
      {/* Happy/Excitedのキラキラエフェクト */}
      {(emotion === "happy" || emotion === "excited") && (
        <motion.div
          key="sparkles"
          className="emotion-particles"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="particle sparkle"
              custom={i}
              variants={sparkleVariants}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                fontSize: emotion === "excited" ? "24px" : "20px",
              }}
            >
              {emotion === "excited" ? "🌟" : "✨"}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Thinkingの考え中バブル */}
      {emotion === "thinking" && (
        <motion.div
          key="thinking-bubbles"
          className="emotion-particles"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="particle bubble"
              custom={i}
              variants={bubbleVariants}
              style={{
                position: "absolute",
                left: 150 + i * 15,
                top: 50,
                fontSize: 12 + i * 4 + "px",
              }}
            >
              💭
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Surprisedの！マーク */}
      {emotion === "surprised" && (
        <motion.div
          key="exclamation"
          className="emotion-particles"
          variants={exclamationVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "28px",
            transformOrigin: "center bottom",
          }}
        >
          ❗
        </motion.div>
      )}

      {/* Confusedの？マーク */}
      {emotion === "confused" && (
        <motion.div
          key="question"
          className="emotion-particles"
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          animate={{
            opacity: [0, 1, 1, 1, 0],
            scale: [0, 1.1, 1, 1, 0],
            rotate: [0, 10, -10, 0, 0],
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "25px",
            right: "30px",
            fontSize: "24px",
          }}
        >
          ❓
        </motion.div>
      )}
    </AnimatePresence>
  );
};
