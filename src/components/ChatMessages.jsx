import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatMessages = ({ messages, loading }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
      <AnimatePresence initial={false}>
        {messages.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
              m.from === "ai"
                ? "bg-white/15 text-white self-start"
                : "bg-gradient-to-r from-pink-500 to-purple-500 text-white self-end ml-auto"
            }`}
          >
            {m.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-white/70">
          <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
          <span>L’IA réfléchit…</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
