import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./theme.css";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RAG Knowledge Engine",
  description: "Production RAG pipeline with hybrid search, LangChain, and Pinecone",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex h-screen overflow-hidden bg-alice-blue font-sans antialiased">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
