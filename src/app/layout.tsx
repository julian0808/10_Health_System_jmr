import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulseCare | Clinical Command Center",
  description: "A calm, clear workspace for modern patient care teams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
