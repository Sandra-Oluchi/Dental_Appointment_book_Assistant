"use client";

import { useState } from "react";

import { sendChatMessage } from "@/lib/api";

const suggestedQuestions = [
  "Do you offer braces?",
  "Can I whiten my teeth?",
  "Tell me about dental implants",
];

export default function ChatAssistant() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("Ask about services, opening hours, or appointments.");
  const [loading, setLoading] = useState(false);

  async function sendMessage(nextMessage = message) {
    if (!nextMessage.trim()) {
      return;
    }

    setLoading(true);
    setMessage(nextMessage);

    try {
      const result = await sendChatMessage(nextMessage);
      setReply(result.reply);
    } catch {
      setReply("Sorry, I could not respond right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-teal-700">AI Assistant</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            Dental Clinic Assistant
          </h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          Online
        </span>
      </div>

      <div className="mt-5 min-h-28 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        {loading ? "Thinking..." : reply}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestedQuestions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => sendMessage(question)}
            className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-teal-700"
          >
            {question}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="h-12 min-w-0 flex-1 rounded-md border border-slate-200 px-3 text-slate-950 outline-none focus:border-teal-700"
          placeholder="Ask about braces, whitening..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          type="button"
          onClick={() => sendMessage()}
          disabled={loading}
          className="h-12 rounded-md bg-slate-950 px-5 font-semibold text-white disabled:bg-slate-400"
        >
          Send
        </button>
      </div>
    </section>
  );
}
