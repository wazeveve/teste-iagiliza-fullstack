interface ChatMessageProps {
    sender: "user" | "ai";
    text: string;
}


export function ChatMessage({sender, text }: ChatMessageProps) {
    const isUser = sender === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
            <div className={`max-2-lg px-4 py-2 rounded-2xl text-sm ${isUser ? "bg-blue-600 text-white": "bg-gray-700 text-gray-100"}`}>
                {text}
            </div>
        </div>
    );
}