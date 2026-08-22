import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "LuckOptics | Premium LuckOptics-Inspired Eyewear Shop",
  description: "Shop eyeglasses, sunglasses, and screen-protective computer glasses with customizable prescription lenses. Cash on Delivery (COD) available.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-gray-50 text-gray-900">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
