'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "./navbar";
import NotificationBell from "./NotificationBell";
import QuestionCard from "./QuestionCard";
import { useRouter } from 'next/router';
import { Loader2, Filter, PlusCircle, ChevronDown, MessageSquare, ThumbsUp, ThumbsDown, Search, Home } from 'lucide-react';

interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  votes: number;
  createdAt: string;
  answers: {
    content: string;
    author: string;
    votes: number;
    createdAt: string;
  }[];
}

export default function Page() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [filter, setFilter] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [newAnswer, setNewAnswer] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth check
  const [userVoted, setUserVoted] = useState(false);

  const fetchQuestions = async (search = "") => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/questions?filter=${filter}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(searchQuery);
  }, [filter, searchQuery]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !newAnswer.trim()) return;
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    try {
      const updatedQuestion = {
        ...selectedQuestion,
        answers: [
          ...selectedQuestion.answers,
          {
            content: newAnswer,
            author: "You",
            votes: 0,
            createdAt: new Date().toISOString()
          }
        ]
      };
      setSelectedQuestion(updatedQuestion);
      setNewAnswer("");
    } catch (err) {
      console.error("Failed to submit answer:", err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions(searchQuery);
  };

  const handleVote = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (userVoted) return;
    
    setUserVoted(true);
    // Perform actual vote action here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-black">
          <div className="w-full flex items-center gap-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search"
                className="w-full border px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
              >
                <Search size={18} />
              </button>
            </form>
            
            {/* Filter Dropdown */}
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
                  <button
                    onClick={() => {
                      setFilter("newest");
                      setShowFilterDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      filter === "newest" ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => {
                      setFilter("unanswered");
                      setShowFilterDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      filter === "unanswered" ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Unanswered
                  </button>
                </div>
              )}
            </div>
            
            {/* Ask Question Button */}
            <div className="flex items-center gap-4 ml-auto">
              <NotificationBell count={notificationCount} />
              <Link href="/AskQuestion">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium">
                  <PlusCircle size={18} /> Ask New question
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Login Required</h3>
            <p className="mb-4">You need to login to perform this action.</p>
            <div className="flex gap-3">
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded flex-1 text-center"
              >
                Login
              </Link>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="border border-gray-300 px-4 py-2 rounded flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        {/* Main Content */}
        {selectedQuestion ? (
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <button 
                onClick={() => setSelectedQuestion(null)}
                className="flex items-center hover:text-blue-600"
              >
                <Home className="mr-1" size={16} /> Home
              </button>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Question</span>
              <span className="mx-2">/</span>
              <span className="text-gray-700 truncate max-w-xs">{selectedQuestion.title}</span>
            </div>

            {/* Question Detail */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedQuestion.title}
              </h1>
              <div className="prose prose-sm max-w-none mb-6 whitespace-pre-line">
                {selectedQuestion.description}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedQuestion.tags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="font-medium text-gray-700">{selectedQuestion.author}</span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <MessageSquare className="mr-1" /> {selectedQuestion.answers.length} answers
                  </span>
                  <span className="flex items-center">
                    <ThumbsUp className="mr-1" /> {selectedQuestion.votes} votes
                  </span>
                  <span>{new Date(selectedQuestion.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Answers Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Answers</h2>
              {selectedQuestion.answers.length > 0 ? (
                selectedQuestion.answers.map((answer, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="prose prose-sm max-w-none mb-4 whitespace-pre-line">
                      {answer.content}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div>
                        <span className="font-medium text-gray-700">{answer.author}</span> • {new Date(answer.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={handleVote}
                          disabled={userVoted}
                          className={`flex items-center ${userVoted ? 'text-gray-400' : 'hover:text-green-600'}`}
                        >
                          <ThumbsUp className="mr-1" /> {answer.votes}
                        </button>
                        <button 
                          onClick={handleVote}
                          disabled={userVoted}
                          className={`flex items-center ${userVoted ? 'text-gray-400' : 'hover:text-red-600'}`}
                        >
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

            {/* Submit Answer Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit Your Answer</h2>
              {isLoggedIn ? (
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
              ) : (
                <div className="text-center py-4">
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Login to submit an answer
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <main className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-blue-600" size={30} />
              </div>
            ) : questions.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No questions available.</p>
            ) : (
              <>
                {questions.map((q) => (
                  <QuestionCard
                    key={q._id}
                    _id={q._id}
                    title={q.title}
                    description={q.description}
                    tags={q.tags}
                    author={q.author}
                    votes={q.votes}
                    createdAt={q.createdAt}
                    answersCount={q.answers.length}
                    onSelect={() => setSelectedQuestion(q)}
                  />
                ))}
                {/* Pagination */}
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <button
                        key={num}
                        className={`px-3 py-1 rounded ${num === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </main>
        )}
      </div>
    </div>
  );
}