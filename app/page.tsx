"use client";

import { useState, useRef, useEffect } from "react";
import { Inter, Sora } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
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

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Server error. Please try again later." },
      ]);
    }

    setLoading(false);
  };

  return (
    <main
      className={`${inter.variable} ${sora.variable} flex h-screen bg-[#050508]`}
    >
      {/* ================= SIDEBAR ================= */}
      <aside className="hidden md:flex w-72 flex-col bg-gradient-to-b from-[#0a0a0f] to-[#0d0d18] border-r border-indigo-500/10">
        <div className="p-4 border-b border-indigo-500/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg text-white">
              ⚡
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm">
                RevTalk AI
              </h1>
              <p className="text-green-400 text-xs">Online</p>
            </div>
          </div>

          <button className="mt-4 w-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 py-2 rounded-lg text-sm hover:bg-indigo-500/20 transition">
            + New Chat
          </button>
        </div>

        <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-400">
          <p className="mb-2 uppercase text-xs text-gray-600">Today</p>
          <div className="space-y-2">
            <div className="p-2 rounded-lg hover:bg-indigo-500/10 cursor-pointer">
              EV Battery Comparison
            </div>
            <div className="p-2 rounded-lg hover:bg-indigo-500/10 cursor-pointer">
              Charging Speed Guide
            </div>
          </div>
        </div>
      </aside>

      {/* ================= CHAT AREA ================= */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-500/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg text-white">
              🔋
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">
                RevTalk Assistant
              </h2>
              <p className="text-xs text-gray-500">
                EV Chargers Expert
              </p>
            </div>
          </div>

        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-5 shadow-lg text-2xl">
                🔋
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 font-heading">
                How can I help you today?
              </h2>

              <p className="text-gray-500 mb-8 max-w-md">
                Ask anything about EV batteries, charging systems, performance or cost.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {[
                  "Best EV battery in 2025?",
                  "How long does EV charging take?",
                  "Compare lithium vs solid-state batteries",
                  "EV maintenance cost breakdown",
                ].map((q, i) => (
                  <div
                    key={i}
                    onClick={() => setInput(q)}
                    className="p-4 rounded-xl bg-[#0f0f18] border border-indigo-500/10 hover:border-indigo-500/30 hover:bg-[#13131f] transition cursor-pointer"
                  >
                    <p className="text-sm text-gray-200">{q}</p>
                  </div>
                ))}
              </div>
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
                className={`px-4 py-3 max-w-[75%] text-sm shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl rounded-br-md"
                    : "bg-[#13131f] text-gray-200 rounded-2xl rounded-bl-md border border-indigo-500/10"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                ⚡
              </div>

              <div className="flex gap-1">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-indigo-500/10 bg-[#0a0a12] px-6 py-4">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              placeholder="Ask about EV batteries..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-[#11111a] text-white border border-indigo-500/20 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white px-6 py-3 text-sm rounded-full hover:opacity-90 transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}