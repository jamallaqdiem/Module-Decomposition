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

const FormInput = ({
  onSubmit,
  formChat,
  setFormChat,
  messageType,
  alert,
  isNameSaved,
}: FormInputProps) => {
  return (
    <div className="w-full p-4 border-t border-slate-700 bg-slate-900">
      <form onSubmit={onSubmit} className="flex gap-3 items-center w-full">
        {alert && (
          <p
            className={`absolute -top-6 left-4 text-xs font-medium ${messageType}`}
          >
            {alert}
          </p>
        )}
        {!isNameSaved ? (
          <input
            type="text"
            placeholder="Enter your name.."
            required
            className="w-1/4 max-w-[150px] px-3 py-2 bg-slate-800 text-slate-100 border border-slate-600 rounded-lg outline-none focus:border-indigo-500 transition-all text-sm"
            value={formChat.username}
            onChange={(e) =>
              setFormChat({ ...formChat, username: e.target.value })
            }
          />
        ) : (
          <div className="w-1/4 max-w-[150px] flex items-center space-x-1.5 text-xs text-slate-400 font-semibold px-2 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg truncate select-none">
            <span className="w-2 h-2 min-w-[8px] bg-emerald-400 rounded-full animate-pulse" />
            <span className="truncate">
              User:{" "}
              <strong className="text-emerald-400">{formChat.username}</strong>
            </span>
          </div>
        )}

        <input
          type="text"
          placeholder="Start typing a message..."
          required
          className="flex-1 px-4 py-2 bg-slate-800 text-slate-100 border border-slate-600 rounded-lg outline-none focus:border-indigo-500 transition-all text-sm"
          value={formChat.text}
          onChange={(e) => setFormChat({ ...formChat, text: e.target.value })}
        />
        <button
          type="submit"
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors duration-200 text-sm whitespace-nowrap"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default FormInput;
