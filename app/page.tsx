"use client";

import { useState, useRef, useEffect } from "react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(
        "https://web-production-7d8f8.up.railway.app/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Server error. Please try again later." },
      ]);
    }

    setLoading(false);
  };

  return (
    <main
      className={`${outfit.className} flex flex-col min-h-screen`}
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <div className="flex flex-col min-h-[100vh] safe-area-inset-bottom">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black/70 backdrop-blur-md border-b border-gray-700 py-4 px-4 sm:px-6 shadow-lg">
          <h1 className="text-center text-2xl sm:text-3xl font-bold text-green-400 tracking-wide">
            🤖 RevTalk Bot
          </h1>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 w-full max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center text-gray-300 mt-10 text-sm sm:text-base">
              Ask anything about EVs...
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-[85%] sm:max-w-[75%] md:max-w-[65%] text-sm sm:text-base shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-left text-gray-300 animate-pulse text-sm sm:text-base">
              EV Bot is thinking...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-gray-700 bg-black/80 p-4 sm:p-6">
          <div className="flex gap-2 w-full max-w-4xl mx-auto">
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-full px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 text-sm sm:text-base rounded-full transition disabled:opacity-50 shadow-md"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}