// src/pages/Chat.tsx
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { ChatMessage } from "../components/ChatMessage";
import { InputField } from "../components/InputField";
import { useNavigate } from "react-router-dom";

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
};

export default function Chat() {
    const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("Token not found.");
      window.location.href = "/login";
      return;
    }

    api.get("/messages")
      .then((res) => {
        const data = res.data.map((m: any) => ({
          id: m.id,
          sender: m.fromIA ? "ai" : "user",
          text: m.content ?? m.text ?? "",
        }));
        setMessages(data);
      })
      .catch((err) => {
        console.error("Error to achieving messages:", err.response || err);
        setMessages([]);
      });
  }, []);

  async function handleSend(message: string) {
    if (!message.trim()) return;

    const userMsg: Message = { id: Date.now(), sender: "user", text: message };
    setMessages((prev) => prev.concat(userMsg));

    try {
      const res = await api.post("/message", { content: message });

      console.log("Resposta /message:", res.data);

      const ia = res.data?.iaMessage ?? res.data?.ia_message ?? res.data?.reply;

      const aiText =
        (ia && (ia.content ?? ia.text ?? ia)) ??
        "AI ANSWER";

      const aiMsg: Message = { id: Date.now() + 1, sender: "ai", text: aiText };
      setMessages((prev) => prev.concat(aiMsg));
    } catch (err: any) {
      console.error("Erro POST /message:", {
        message: err.message,
        response: err?.response?.data,
        status: err?.response?.status,
        headers: err?.response?.headers,
      });

      const errorMsg: Message = {
        id: Date.now() + 2,
        sender: "ai",
        text: "Error.",
      };
      setMessages((prev) => prev.concat(errorMsg));
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* 👇 header com botão de perfil */}
      <header className="flex justify-between items-center bg-gray-800 p-4">
        <h1 className="text-lg font-semibold">Chat com IA</h1>
        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded"
        >
          Perfil
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <ChatMessage key={m.id} sender={m.sender} text={m.text} />
        ))}
      </main>

      <footer className="p-4 bg-gray-800">
        <InputField onSend={handleSend} />
      </footer>
    </div>
  );
}