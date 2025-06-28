import Link from "next/link";

export default function Home() {
  return (
    <div className="h-[calc(100vh-96px)] grid grid-rows-[1fr] items-center justify-items-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-1 items-center sm:items-start w-full max-w-2xl">
        <div className="flex flex-col items-center gap-8 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <h1 className="text-2xl font-bold">N3XA Support Agent</h1>
          <p className="text-center">
            Welcome to the AI-powered support system. End users can chat with an
            assistant to create support tickets, and support techs can manage
            those tickets in real-time.{" "}
          </p>
        </div>

        <div className="flex gap-4 items-center justify-around flex-col w-full sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/chat"
          >
            Chat with Support Assistant
          </Link>
          <Link
            className="rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/admin"
          >
            Admin Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
