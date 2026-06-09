import { useEffect, useRef } from "react";
import type { Message } from "../types/type";

/**
 * @description Presentational UI layer responsible for rendering message cards and active reactions.
 */

interface ChatContainerProp {
  handleReaction: (messageId: number, action: "like" | "dislike") => void;
  chat: Message[];
}
const ChatContainer = ({ handleReaction, chat }: ChatContainerProp) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const styles = {
    scrollContainer: "flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar",
    messageCard:
      "group flex flex-col bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/40 rounded-xl p-4 transition-all duration-200 shadow-sm",
    metaWrapper: "flex items-baseline justify-between mb-1.5",
    username:
      "font-semibold text-emerald-400 text-sm hover:underline cursor-pointer",
    timestamp: "text-[10px] font-medium text-slate-400 tracking-wider",
    bodyText: "text-slate-200 text-sm leading-relaxed break-words",
    actionContainer:
      "flex items-center space-x-2 mt-3 opacity-80 group-hover:opacity-100 transition-opacity duration-200",
    reactionBtn:
      "flex items-center space-x-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600/50 rounded-lg transition-colors duration-150 active:scale-95",
    reactionCount: "font-medium text-slate-200",
  };

  return (
    <div className={styles.scrollContainer}>
      {chat.map((message: Message) => (
        <div key={message.id} className={styles.messageCard}>
          {/* Message Meta Info */}
          <div className={styles.metaWrapper}>
            <span className={styles.username}>{message.username}</span>
            <span className={styles.timestamp}>
              {new Date(message.createdAt).toLocaleString([], {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Message Body Text */}
          <p className={styles.bodyText}>{message.text}</p>

          {/* Like/Dislike Buttons */}
          <div className={styles.actionContainer}>
            <button
              onClick={() => handleReaction(message.id, "like")}
              className={styles.reactionBtn}
            >
              <span>👍</span>
              <span className={styles.reactionCount}>{message.likes}</span>
            </button>

            <button
              onClick={() => handleReaction(message.id, "dislike")}
              className={styles.reactionBtn}
            >
              <span>👎</span>
              <span className={styles.reactionCount}>{message.dislikes}</span>
            </button>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
export default ChatContainer;
