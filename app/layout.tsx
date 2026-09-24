import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Spend Audit by Credex',
  description: 'Find wasted AI tool spend in minutes.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
