import type { Metadata } from "next";
import { Provider } from "react-redux";
import "./globals.css";
import store from "@/redux/store";
import ClientProvider from '@/components/ClientProvider';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme',
    default: 'E-Commerce', // a default is required when creating a template
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
      <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
