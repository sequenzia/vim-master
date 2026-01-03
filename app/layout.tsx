import type { Metadata } from 'next';
import { Fira_Code, Cinzel } from 'next/font/google';
import './globals.css';

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-fantasy',
});

export const metadata: Metadata = {
  title: 'The Dark Magic of Vim',
  description: 'Learn Vim through dark magic and wizardry',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${firaCode.variable} ${cinzel.variable}`}>
      <body>
        {children}
        <div className="scanline" />
      </body>
    </html>
  );
}
