import { useState, useEffect, useRef } from "react";
import { type Message } from "./types/type";
import FormInput from "./components/ChatInput";

function App() {
  const savedUsername = localStorage.getItem("chat_username") || "";
  const initialForm = {
    username: savedUsername,
    text: "",
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState<Message[]>([]);
  const [formChat, setFormChat] = useState({ ...initialForm });
  const [alert, setAlert] = useState("");
  const [messageType, setMessageType] = useState("");
  const port = "http://localhost:3000/api";
  const port2 = "ws://localhost:3000/api";

  const showNotification = (msg: string, type: string = "success") => {
    setAlert(msg);
    setMessageType(type);
    setTimeout(() => setAlert(""), 2000);
  };

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

  useEffect(() => {
    const loadInitialData = async () => {
      await arrayMessages();
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    // Open the pipeline
    const socket = new WebSocket(port2);
    // log if it open
    socket.onopen = () => {
      console.log("Connected to the backend WebSocket conductor.");
    };

    socket.onmessage = (event) => {
      const envelope = JSON.parse(event.data);
      console.log("Broadcast received from server:", envelope);
      // Check the envelop label
      if (envelope.type === "NEW_MESSAGE") {
        const freshMessage = envelope.payload;
        // Update Chat state array
        setChat((prevChat) => {
          // Safety check
          const messageExists = prevChat.some(
            (msg) => msg.id === freshMessage.id,
          );
          if (messageExists) return prevChat;

          return [...prevChat, freshMessage];
        });
      }
      if (envelope.type === "UPDATE_REACTIONS") {
        const updatedMessage = envelope.payload;
        setChat((prevChat) => {
          return prevChat.map((message) => {
            if (message.id === updatedMessage.id) {
              return updatedMessage;
            }
            return message;
          });
        });
      }
    };
    // close the pipeline
    return () => {
      socket.close();
      console.log("WebSocket connection cleanly closed.");
    };
  }, [port2]);

  const handleFormChat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formChat.username.trim() || !formChat.text.trim()) {
      showNotification("Username and message cannot be empty!", "text-red-500");
      return;
    }
    try {
      const response = await fetch(`${port}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formChat),
      });
      const chatData = await response.json().catch(() => response.text());
      if (!response.ok) {
        throw new Error(chatData || "Failed to send message");
      }
      showNotification("Message sent successfully!", "text-green-500");
      await arrayMessages();
      localStorage.setItem("chat_username", formChat.username);
      setFormChat({ username: formChat.username, text: "" });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error send message", errorMessage);
      showNotification(`Sending message failed: ${errorMessage}`, "error");
    }
  };

  const handleReaction = async (
    messageId: number,
    action: "like" | "dislike",
  ) => {
    try {
      const response = await fetch(`${port}/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to send reaction" }));
        throw new Error(errorData.message);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error updating reaction:", errorMessage);
      showNotification(`Reaction failed: ${errorMessage}`, "error");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  if (!chat) return <p>Loading Messages...</p>;
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 antialiased">
      <div className="w-full max-w-4xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col h-[800px]">
        {/* Header Section */}
        <div className="bg-slate-800/80 backdrop-blur-md px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r content-box from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Jamal's Community Chat
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
                <button
                  onClick={() => handleReaction(message.id, "like")}
                  className="flex items-center space-x-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600/50 rounded-lg transition-colors duration-150 active:scale-95"
                >
                  <span>👍</span>
                  <span className="font-medium text-slate-200">
                    {message.likes}
                  </span>
                </button>
                <button
                  onClick={() => handleReaction(message.id, "dislike")}
                  className="flex items-center space-x-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600/50 rounded-lg transition-colors duration-150 active:scale-95"
                >
                  <span>👎</span>
                  <span className="font-medium text-slate-200">
                    {message.dislikes}
                  </span>
                </button>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          <FormInput
            formChat={formChat}
            setFormChat={setFormChat}
            onSubmit={handleFormChat}
            alert={alert}
            messageType={messageType}
            isNameSaved={!!localStorage.getItem("chat_username")}
          />
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
