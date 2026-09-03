import type { Metadata } from "next";
import { Archivo, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tripiani",
  description: "Plan your next trip in minutes with matched recommendations.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-tp-cream text-tp-ink font-sans">{children}</body>
    </html>
  );
}
