import React from "react";

const page = () => {
  return (
    <div className="h-[calc(100vh-96px)] grid grid-rows-[1fr] items-center justify-items-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] items-center sm:items-start w-full max-w-2xl h-full">
        <div className="flex flex-col items-center gap-8 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <h1 className="text-2xl font-bold">Support Assistant</h1>
          <p className="text-center">
            Chat with our AI assistant to get help with your issues and create
            support tickets.
          </p>
        </div>

        <div className="w-full space-y-6 flex-1 flex flex-col">
          <div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-6 bg-background flex-1 overflow-y-auto min-h-0">
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet. Start a conversation below.</p>
            </div>
          </div>

          <div className="flex gap-4 items-center justify-around flex-col w-full sm:flex-row">
            <input
              type="text"
              placeholder="Type your message..."
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-background text-foreground px-4 py-2 font-medium text-sm sm:text-base h-10 sm:h-12 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
            <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto">
              Send Message
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;
