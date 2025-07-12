'use client';

import AskQuestion from "./components/AskQuestion";
import Navbar from "./components/navbar";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar fixed at the top */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <Navbar />
      </header>

      {/* Main content with proper spacing */}
      <main className="flex-1 pt-6 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AskQuestion />
        </div>
      </main>
    </div>
  );
}