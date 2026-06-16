interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Header = ({ title, subtitle, actions }: HeaderProps) => (
  <header
    className="flex h-16 items-center justify-between px-6 shrink-0"
    style={{
      background: "rgba(4,6,13,0.6)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <div>
      <h1 className="text-base font-semibold" style={{ color: "#f1f5f9" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs" style={{ color: "#475569" }}>
          {subtitle}
        </p>
      )}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </header>
);
