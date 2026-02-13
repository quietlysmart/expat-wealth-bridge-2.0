import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#services", label: "Services" },
  { href: "#why", label: "Why Us" },
  { href: "#process", label: "Process" },
  { href: "#webinar", label: "Webinars" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["top", "services", "why", "process", "webinar", "contact"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(`#${e.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5, 1] }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const cta = useMemo(
    () => (
      <Button asChild size="xl" className="px-7 py-3 text-base">
        <a href="#contact" aria-label="Book a Free 30-Min Consultation">
          Book a Free 30-Min Call
        </a>
      </Button>
    ),
    []
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70 transition-all",
        scrolled ? "shadow-sm border-muted/70" : "border-transparent"
      )}
    >
      <div className={cn("mx-auto flex max-w-[1200px] items-center justify-between px-5", scrolled ? "py-3" : "py-4")}>        
        <a href="#top" className="flex items-center gap-3">
          <img
            src="/lovable-uploads/1ea18656-89f6-4c47-9c9f-917924af5f5a.png"
            alt="Global Expat Wealth logo"
            className="h-10 w-auto md:h-11"
            loading="eager"
            decoding="async"
          />
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "story-link text-foreground/80 hover:text-foreground",
                active === item.href && "text-primary font-medium"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">{cta}</div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          <a href="#contact" className="btn-cta btn-primary text-sm">Book Call</a>
        </div>
      </div>
    </header>
  );
}
