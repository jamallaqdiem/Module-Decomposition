interface FormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formChat: {
    username: string;
    text: string;
  };
  setFormChat: React.Dispatch<
    React.SetStateAction<{ username: string; text: string }>
  >;
  alert: string;
  messageType: string;
  isNameSaved: boolean;
}
/**
 * @description Presentational layout managing user validation text areas and status notifications.
 */
const FormInput = ({
  onSubmit,
  formChat,
  setFormChat,
  messageType,
  alert,
  isNameSaved,
}: FormInputProps) => {
  const styles = {
    formWrapper: "w-full p-4 border-t border-slate-700 bg-slate-900",
    formElement: "flex gap-3 items-center w-full",
    // Base alert classes
    alertBanner: "p-3 rounded-lg border text-sm transition-all",
    // Dynamic conditional variants
    alertError: "bg-red-500/10 text-red-400 border-red-500/20",
    alertSuccess: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    // Input configurations
    nameInput:
      "w-1/4 max-w-[150px] px-3 py-2 bg-slate-800 text-slate-100 border border-slate-600 rounded-lg outline-none focus:border-indigo-500 transition-all text-sm",
    savedNameBadge:
      "w-1/4 max-w-[150px] flex items-center space-x-1.5 text-xs text-slate-400 font-semibold px-2 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg truncate select-none",
    statusDot: "w-2 h-2 min-w-[8px] bg-emerald-400 rounded-full animate-pulse",
    messageInput:
      "flex-1 px-4 py-2 bg-slate-800 text-slate-100 border border-slate-600 rounded-lg outline-none focus:border-indigo-500 transition-all text-sm",
    submitBtn:
      "px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors duration-200 text-sm whitespace-nowrap",
  };
  return (
    <div className={styles.formWrapper}>
      <form onSubmit={onSubmit} className={styles.formElement}>
        {/* Conditional Notification Banner */}
        {alert && (
          <div
            className={`${styles.alertBanner} ${
              messageType === "error" ? styles.alertError : styles.alertSuccess
            }`}
          >
            {alert}
          </div>
        )}

        {/* Name Selector State */}
        {!isNameSaved ? (
          <input
            type="text"
            placeholder="Enter your name.."
            required
            className={styles.nameInput}
            value={formChat.username}
            onChange={(e) =>
              setFormChat({ ...formChat, username: e.target.value })
            }
          />
        ) : (
          <div className={styles.savedNameBadge}>
            <div className={styles.statusDot} />
            <span className="truncate">
              User:{" "}
              <strong className="text-emerald-400">{formChat.username}</strong>
            </span>
          </div>
        )}

        {/* Message Input Field */}
        <input
          type="text"
          placeholder="Start typing a message..."
          required
          className={styles.messageInput}
          value={formChat.text}
          onChange={(e) => setFormChat({ ...formChat, text: e.target.value })}
        />

        {/* Action Dispatcher */}
        <button type="submit" className={styles.submitBtn}>
          Send
        </button>
      </form>
    </div>
  );
};

export default FormInput;
