import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
// In app/layout.tsx (for App Router) or _app.tsx (for Pages Router)
import { Inter, Lexend } from 'next/font/google';

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
  title: "PragyAI",
  description: "Take your Business to another level with PragyAI's AI powered customized Chat Bot!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          suppressHydrationWarning
          className={`${inter.variable} ${lexend.variable} light:bg-muted antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
