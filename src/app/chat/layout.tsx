"use client";
import Sidebar from "@/lib/components/Sidebar/Sidebar";
import React from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-96px)] w-full  flex flex-row items-stretch bg-background">
      <Sidebar />
      <main className="flex-1 p-4 flex flex-col items-center h-full min-h-0">
        {children}
      </main>
    </div>
  );
}
