import React, { useState } from "react";

const ChatInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 bg-black/20 rounded-3xl px-4 py-3 border border-white/10"
    >
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder:text-white/40"
        placeholder="Écris ce que tu ressens ou ce dont tu as besoin..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        disabled={disabled}
        className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-sm font-medium shadow-lg hover:shadow-xl hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        Envoyer
      </button>
    </form>
  );
};

export default ChatInput;
