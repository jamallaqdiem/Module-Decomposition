import { useState, useEffect } from "react";
import { type Message } from "./types/type";
import FormInput from "./components/FormInput";
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";

/**
 * @description Main application orchestrator managing global state, API fetching, and WebSockets.
 */

function App() {
  const savedUsername = localStorage.getItem("chat_username") || "";
  const initialForm = {
    username: savedUsername,
    text: "",
  };

  const [chat, setChat] = useState<Message[]>([]);
  const [formChat, setFormChat] = useState({ ...initialForm });
  const [alert, setAlert] = useState("");
  const [messageType, setMessageType] = useState("");
  const port = "https://backendchatapp.hosting.codeyourfuture.io/api";
  const port2 = "wss://backendchatapp.hosting.codeyourfuture.io/api";

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
      showNotification("Username and message cannot be empty!", "error");
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
      showNotification("Message sent successfully!", "success");
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

  if (!chat) return <p>Loading Messages...</p>;

  const layoutStyles = {
    mainWrapper:
      "min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 antialiased",
    cardContainer:
      "w-full max-w-4xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col h-[800px]",
    footerBar:
      "p-4 bg-slate-800/50 border-t border-slate-700/60 flex justify-end",
    refreshBtn:
      "px-5 py-2.5 text-sm font-medium text-slate-900 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-150",
  };
  return (
    <main className={layoutStyles.mainWrapper}>
      <div className={layoutStyles.cardContainer}>
        <Header messagesCount={chat.length} />
        <ChatContainer handleReaction={handleReaction} chat={chat} />
        <FormInput
          formChat={formChat}
          setFormChat={setFormChat}
          onSubmit={handleFormChat}
          alert={alert}
          messageType={messageType}
          isNameSaved={!!localStorage.getItem("chat_username")}
        />

        {/* Button Actions */}
        <div className={layoutStyles.footerBar}>
          <button onClick={arrayMessages} className={layoutStyles.refreshBtn}>
            Refresh Messages
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
