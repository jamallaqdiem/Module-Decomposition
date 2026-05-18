import { useState } from "react";
import { type Message } from "./types/type";

function App() {
  const [chat, setChat] = useState<Message[]>([]);
  const port = "http://localhost:3000/api";

  const arrayMessages = async () => {
    try {
      const response = await fetch(`${port}/messages`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error, Status: ${response.status}`);
      }
      const data = await response.json();
      setChat(data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };
  if (!chat) return <p>Loading Messages...</p>;
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 antialiased">
      <div className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col h-[600px]">
        {/* Header Section */}
        <div className="bg-slate-800/80 backdrop-blur-md px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r content-box from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Jamal Community Chat
            </h1>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-700 text-slate-300 rounded-full border border-slate-600">
            {chat.length} messages
          </span>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {chat.map((message) => (
            <div
              key={message.id}
              className="group flex flex-col bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/40 rounded-xl p-4 transition-all duration-200 shadow-sm"
            >
              {/* Message Meta Info */}
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-semibold text-emerald-400 text-sm hover:underline cursor-pointer">
                  {message.username}
                </span>
                <span className="text-[10px] font-medium text-slate-400 tracking-wider">
                  {new Date(message.createdAt).toLocaleString([], {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Message Body Text */}
              <p className="text-slate-200 text-sm leading-relaxed break-words">
                {message.text}
              </p>

              {/* Like/Dislike Buttons */}
              <div className="flex items-center space-x-2 mt-3 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                <button className="flex items-center space-x-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600/50 rounded-lg transition-colors duration-150 active:scale-95">
                  <span>👍</span>
                  <span className="font-medium text-slate-200">
                    {message.likes}
                  </span>
                </button>
                <button className="flex items-center space-x-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600/50 rounded-lg transition-colors duration-150 active:scale-95">
                  <span>👎</span>
                  <span className="font-medium text-slate-200">
                    {message.dislikes}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Button Actions */}
        <div className="p-4 bg-slate-800/50 border-t border-slate-700/60 flex justify-end">
          <button
            onClick={arrayMessages}
            className="px-5 py-2.5 text-sm font-medium text-slate-900 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-150"
          >
            Refresh Messages
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
