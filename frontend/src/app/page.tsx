'use client';
import Link from "next/link";


import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import QuestionCard from "./components/QuestionCard";
import NotificationBell from "./components/NotificationBell";
import { Loader2, Filter, PlusCircle } from 'lucide-react';

interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  votes: number;
  createdAt: string;
}

export default function Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filter, setFilter] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // mock

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const res = await fetch(
<<<<<<< HEAD
          `${process.env.NEXT_PUBLIC_API_URL}/get-all-questions`
=======
          `${process.env.NEXT_PUBLIC_API_URL}/questions?filter=${filter}`
>>>>>>> 97ce21cdc91d1405a0f9a6e7b19db97f8aea35b5
        );
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-black">
        <input
          type="text"
          placeholder="🔍 Search questions..."
          className="w-full md:w-2/3 border px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
       <div className="flex items-center gap-4">
  <NotificationBell count={notificationCount} />
  <Link href="/AskQuestion">
    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium">
      <PlusCircle size={18} /> Ask Question
    </button>
  </Link>
</div>
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 pb-10">

        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-700">
            <Filter size={18} /> Filters
          </h3>
          {["newest", "unanswered"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`w-full text-left px-4 py-2 rounded-md transition text-sm font-medium ${
                filter === item
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-600" size={30} />
            </div>
          ) : questions.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">No questions available.</p>
          ) : (
            questions.map((q) => (
              <QuestionCard
                key={q._id}
                _id={q._id}
                title={q.title}
                description={q.description}
                tags={q.tags}
                author={q.author}
                votes={q.votes}
                createdAt={q.createdAt}
              />
            ))
          )}
        </main>

       
      </div>
    </div>
  );
}