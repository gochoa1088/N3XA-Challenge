import React from "react";

const page = () => {
  return (
    <div className="h-[calc(100vh-96px)] grid grid-rows-[1fr] items-center justify-items-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] items-center sm:items-start w-full max-w-2xl h-full">
        <div className="flex flex-col items-center gap-8 text-center w-full sm:text-left font-[family-name:var(--font-geist-mono)]">
          <h1 className="text-2xl font-bold">Support Ticket Dashboard</h1>
          <p className="text-center">
            Manage and review support tickets from customers in real-time.
          </p>
        </div>

        <div className="w-full flex-1 flex flex-col">
          <div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-6 bg-background flex-1 overflow-y-auto min-h-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-geist-mono)]">
                Recent Tickets
              </h2>
              <button className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-9 sm:h-10 px-4 sm:px-5">
                Refresh
              </button>
            </div>

            <div className="text-center text-muted-foreground py-8">
              <p>
                No tickets available. Tickets will appear here when customers
                submit them.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;
