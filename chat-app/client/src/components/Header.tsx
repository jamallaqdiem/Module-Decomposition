interface HeaderProps {
  messagesCount: number;
}
/**
 * @description Presentational banner displaying the platform branding and active message metrics.
 */
const Header = ({ messagesCount }: HeaderProps) => {
  const styles = {
    headerBanner:
      "bg-slate-800/80 backdrop-blur-md px-6 py-4 border-b border-slate-700 flex items-center justify-between",
    brandingGroup: "flex items-center space-x-3",
    statusIndicator: "w-3 h-3 bg-emerald-400 rounded-full animate-pulse",
    titleText:
      "text-xl font-bold tracking-wide bg-gradient-to-r content-box from-emerald-400 to-cyan-400 bg-clip-text text-transparent",
    messageBadge:
      "text-xs font-semibold px-2.5 py-1 bg-slate-700 text-slate-300 rounded-full border border-slate-600",
  };
  return (
    <div className={styles.headerBanner}>
      {/* Platform Title Layout */}
      <div className={styles.brandingGroup}>
        <div className={styles.statusIndicator} />
        <h1 className={styles.titleText}>Jamal's Community Chat</h1>
      </div>

      {/* Metric Badge */}
      <span className={styles.messageBadge}>{messagesCount} messages</span>
    </div>
  );
};

export default Header;
