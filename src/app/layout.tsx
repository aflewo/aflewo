import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PreloaderContainer from "@/components/PreloaderContainer";
import { ThemeProvider } from "@/components/theme-provider";
import ElasticNavigator from "@/components/ElasticNavigator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AFLEWO Connect | Africa Let's Worship",
  description: "One God. One People. One Africa. Stirring up hope in Jesus through a united voice since 2004.",
  icons: {
    icon: "/brand/AFLEWO LOGO 1-Photoroom.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PreloaderContainer />
          <Navbar />
          <main className="relative min-h-screen">
            {children}
          </main>
          <ElasticNavigator />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
