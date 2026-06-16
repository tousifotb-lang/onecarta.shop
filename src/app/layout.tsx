import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartHydration from "@/components/CartHydration";

export const metadata: Metadata = {
  title: "Onecarta — Bangladesh's Online Shopping Destination",
  description: "Shop electronics, fashion, groceries and more at the best prices.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartHydration />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}