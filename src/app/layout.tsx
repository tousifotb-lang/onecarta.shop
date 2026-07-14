import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartHydration from "@/components/CartHydration";
import AuthProvider from "@/components/AuthProvider";

// Oswald Font Setup
const oswald = Oswald({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Onecarta — Bangladesh's Online Shopping Destination",
  description: "Shop electronics, fashion, groceries and more at the best prices.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* oswald.className diye puro website e font apply kora holo */}
      <body className={oswald.className}>
        <AuthProvider>
          <CartHydration />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}