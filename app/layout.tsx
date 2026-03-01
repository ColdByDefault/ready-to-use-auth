import type { Metadata } from "next";
//import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Header, Footer } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth — Better Auth Components",
  description:
    "Fully customizable, type-safe authentication components powered by Better Auth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={[
            "light",
            "dark",
            "ocean-blue",
            "forest-green",
            "gray",
            "midnight-purple",
          ]}
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
