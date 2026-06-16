interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Header = ({ title, subtitle, actions }: HeaderProps) => (
  <header className="flex h-16 items-center justify-between border-b border-navy-100 bg-white px-6">
    <div>
      <h1 className="text-base font-semibold text-navy-900">{title}</h1>
      {subtitle && <p className="text-xs text-navy-400">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </header>
);
