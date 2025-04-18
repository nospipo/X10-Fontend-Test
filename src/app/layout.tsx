import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bank Deposit Management',
  description: 'A simple bank deposit management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-kanit">{children}</body>
    </html>
  );
} 