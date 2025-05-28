"use client";

import type React from "react";

import { useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ChatbotButton from "@/components/chatbot-button";
import { AuthProvider } from "@/components/auth-provider";
import RouteGuard from "@/components/route-guard";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuthProvider>
      <RouteGuard>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatbotButton />
        </div>
      </RouteGuard>
    </AuthProvider>
  );
}
