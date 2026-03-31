"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/install", label: "Install flow" },
  { href: "/apply", label: "Submission kit" }
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="panel panel-strong rounded-[30px] p-6">
      <p className="text-xs uppercase tracking-signal text-slate-500">Control tower</p>
      <h2 className="display-face mt-3 text-3xl text-stone">KAGE</h2>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-2xl px-4 py-3 text-sm transition ${
              isActive(pathname, item.href)
                ? "bg-ember/10 text-orange-200"
                : "text-slate-300 hover:bg-white/[0.04]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-10 rounded-[24px] border border-dashed border-white/15 p-4">
        <p className="text-xs uppercase tracking-signal text-slate-500">Live mode</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Load tokens by mint or admin wallet. The control tower no longer assumes a fake portfolio.
        </p>
      </div>
    </aside>
  );
}
