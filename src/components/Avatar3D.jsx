import React from "react";
import { motion } from "framer-motion";

const Avatar3D = () => {
  return (
    <motion.div
      className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-blue-400 shadow-[0_0_60px_rgba(255,255,255,0.4)] relative overflow-hidden"
      animate={{
        y: [-10, 10, -10],
        boxShadow: [
          "0 0 40px rgba(236,72,153,0.5)",
          "0 0 60px rgba(129,140,248,0.8)",
          "0 0 40px rgba(236,72,153,0.5)",
        ],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-3xl"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl md:text-5xl">💫</span>
      </div>
    </motion.div>
  );
};

export default Avatar3D;
