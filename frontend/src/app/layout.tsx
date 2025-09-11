import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter, Lexend } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

// Load Inter with specific subsets and weights
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

// Load Lexend for headings
const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lexend',
  display: 'swap',
});
export const metadata: Metadata = {
  title: 'Clarifyr',
  description:
    "Take your Business to another level with Clarifyr's AI powered customized Chat Bot!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <Script
            src="http://localhost:3000/chatbot_interface?cid=67f6a113db96c0ba1a521510"
            strategy="afterInteractive"
          />
        </head>
        <body
          className={`${inter.variable} ${lexend.variable} antialiased`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="clarifyr-theme"
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
