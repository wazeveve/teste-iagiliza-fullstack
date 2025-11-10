// src/components/InputField.tsx
import { useState } from "react";

export function InputField({ onSend }: { onSend: (msg: string) => void }) {
  const [input, setInput] = useState("");

  function submit() {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
  }

  return (
    <div className="p-4 flex bg-gray-800">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="Digite sua mensagem..."
        className="flex-1 bg-gray-700 text-white rounded-l px-3 py-2 focus:outline-none"
      />
      <button onClick={submit} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r">
        Enviar
      </button>
    </div>
  );
}
