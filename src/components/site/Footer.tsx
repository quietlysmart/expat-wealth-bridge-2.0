export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/60">
      <div className="section flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/lovable-uploads/1ea18656-89f6-4c47-9c9f-917924af5f5a.png"
            alt="Global Expat Wealth logo"
            className="h-12 w-auto md:h-14"
            loading="lazy"
            decoding="async"
          />
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Global Expat Wealth. All rights reserved.</p>
        </div>
        <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
          General information only — not personal advice. Advice provided by an independent adviser registered in relevant jurisdictions. We may introduce specialist managers or tax professionals where appropriate.
        </p>
      </div>
    </footer>
  );
}
