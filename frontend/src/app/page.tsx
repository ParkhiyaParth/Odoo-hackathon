'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import NotificationBell from "./components/NotificationBell";
import {
  Loader2,
  Filter,
  PlusCircle,
  ChevronDown,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Search,
} from 'lucide-react';

interface Answer {
  content: string;
  author: string;
  votes: number;
  createdAt: string;
}

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
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [filter, setFilter] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [notificationCount] = useState(3);
  const [newAnswer, setNewAnswer] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all questions
  const fetchQuestions = async (search = "") => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/get-all-questions`;
      const params = new URLSearchParams();
      if (filter) params.append("filter", filter);
      if (search) params.append("search", search);
      url += "?" + params.toString();

      const res = await fetch(url);
      const data = await res.json();
      setQuestions(data || []);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch answers when question is selected
  useEffect(() => {
    if (!selectedQuestion?._id) return;

    const fetchAnswers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/get-answers`
        );
        const data = await res.json();

        const cleaned = (data || []).map((ans: any) => ({
          content: ans.content ?? ans.description ?? "No content",
          author: ans.author ?? "Anonymous",
          votes: ans.votes ?? 0,
        }));

        setAnswers(cleaned);
      } catch (error) {
        console.error("Error fetching answers:", error);
        setAnswers([]);
      }
    };

    fetchAnswers();
  }, [selectedQuestion]);

  // Fetch questions on load or when filter/search changes
  useEffect(() => {
    fetchQuestions(searchQuery);
  }, [filter, searchQuery]);

  // Handle answer submission
  const handleSubmitAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_id: selectedQuestion?._id,
          description: newAnswer,
          user_email: "parth",
          votes: 0,
          created_at: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Answer submitted successfully!");
        setNewAnswer("");
        // 🔁 Refresh answers after submit
        setSelectedQuestion({ ...selectedQuestion });
      } else {
        alert("Error: " + data.detail);
      }
    } catch (error) {
      console.error("Failed to post answer:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-black">
          <div className="w-full flex items-center gap-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search"
                className="w-full border px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                <Search size={18} />
              </button>
            </form>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded transition text-sm font-medium"
              >
                <Filter size={18} />
                {filter === "newest" ? "Newest" : "Unanswered"}
                <ChevronDown size={16} />
              </button>

              {showFilterDropdown && (
                <div className="absolute z-10 mt-1 w-40 bg-white rounded-md shadow-lg">
                  {["newest", "unanswered"].map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setFilter(f);
                        setShowFilterDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${filter === f ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      {f[0].toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <NotificationBell count={notificationCount} />
              <Link href="/AskQuestion">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium">
                  <PlusCircle size={18} /> Ask New Question
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 pb-10">
        {selectedQuestion ? (
          <div className="md:col-span-4 space-y-6">
            {/* Back */}
            <button
              onClick={() => setSelectedQuestion(null)}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              ← Back to questions
            </button>

            {/* Question Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedQuestion.title}
              </h1>
              <p className="prose prose-sm max-w-none mb-6 whitespace-pre-line">{selectedQuestion.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedQuestion.tags.map((tag) => (
                  <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="font-medium text-gray-700">{selectedQuestion.author}</span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <MessageSquare className="mr-1" /> {answers.length} answers
                  </span>
                  <span className="flex items-center">
                    <ThumbsUp className="mr-1" /> {selectedQuestion.votes}
                  </span>
                  <span>{new Date(selectedQuestion.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* ✅ Answers */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Answers</h2>
              {answers.length > 0 ? (
                answers.map((answer, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                    <p className="prose prose-sm max-w-none mb-4 whitespace-pre-line">
                      {answer.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="font-medium text-gray-700">
                        {answer.author} • {new Date(answer.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center hover:text-green-600">
                          <ThumbsUp className="mr-1" /> {answer.votes}
                        </button>
                        <button className="flex items-center hover:text-red-600">
                          <ThumbsDown className="mr-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No answers yet.</p>
              )}
            </div>

            {/* Submit Answer */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit Your Answer</h2>
              <form onSubmit={handleSubmitAnswer}>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition mb-4 min-h-[200px]"
                  placeholder="Write your answer here..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  Post Answer
                </button>
              </form>
            </div>
          </div>
        ) : (
          <main className="md:col-span-4 space-y-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-blue-600" size={30} />
              </div>
            ) : questions.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No questions available.</p>
            ) : (
              <>
                {questions.map((q) => (
                  <div
                    key={q._id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer"
                    onClick={() => setSelectedQuestion(q)}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{q.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {q.description.length > 150 ? `${q.description.substring(0, 150)}...` : q.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {q.tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{q.author}</span>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <MessageSquare className="mr-1" /> {q.answers?.length || 0} answers
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="mr-1" /> {q.votes}
                        </span>
                        <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
