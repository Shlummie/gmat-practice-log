import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "GMAT Practice Log",
  description: "Local-first GMAT practice, error log, review scheduler, and AI study assistant.",
};

const nav = [
  ["Dashboard", "/"],
  ["Question Bank", "/questions"],
  ["Practice", "/practice"],
  ["Error Log", "/error-log"],
  ["Reviews", "/reviews"],
  ["Mock Tests", "/mocks"],
  ["AI Assistant", "/ai"],
  ["Import / Export", "/data"],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell grid min-h-screen grid-cols-[248px_1fr]">
          <aside className="sidebar sticky top-0 flex min-h-screen flex-col border-r border-[#243142] bg-[#0e141c] p-4">
            <Link href="/" className="mb-6 block">
              <div className="text-lg font-black tracking-tight">GMAT Log</div>
              <div className="text-xs text-[#8ea0b5]">Practice, review, improve</div>
            </Link>
            <nav className="grid gap-1">
              {nav.map(([name, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-[#c7d2e1] hover:bg-[#151f2b] hover:text-white"
                >
                  {name}
                </Link>
              ))}
            </nav>
            <div className="mt-auto rounded-md border border-[#243142] bg-[#111821] p-3 text-xs leading-5 text-[#8ea0b5]">
              Local SQLite app. No official copyrighted GMAT questions included.
            </div>
          </aside>
          <main className="min-w-0 p-4 md:p-7">{children}</main>
        </div>
      </body>
    </html>
  );
}
