"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import NotificationBell from "./components/NotificationBell";
import RichTextEditor from "./components/RichTextEditor";
import {
  Loader2,
  Filter,
  PlusCircle,
  ChevronDown,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Search,
} from "lucide-react";

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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [filter, setFilter] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [newAnswer, setNewAnswer] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Add this line
  const questionsPerPage = 3; // Add this line

  const fetchQuestions = async (search = "") => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/get-all-questions`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const res = await fetch(url);
      const data = await res.json();

      const normalizedData = data.map((q: any) => ({
        ...q,
        answers: Array.isArray(q.answers) ? q.answers : [],
      }));

      setQuestions(normalizedData);
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

    try {
      const updatedQuestion = {
        ...selectedQuestion,
        answers: [
          ...(selectedQuestion.answers || []),
          {
            content: newAnswer,
            author: "You",
            votes: 0,
            createdAt: new Date().toISOString(),
          },
        ],
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
  // Calculate pagination - ADD THESE LINES RIGHT BEFORE return (
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-black">
          <div className="w-full flex items-center gap-4">
            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 w-full md:w-1/3"
            >
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
                      filter === "newest"
                        ? "bg-blue-100 text-blue-800"
                        : "text-gray-700 hover:bg-gray-100"
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
                      filter === "unanswered"
                        ? "bg-blue-100 text-blue-800"
                        : "text-gray-700 hover:bg-gray-100"
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

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 pb-10">
        {/* Main Content */}
<<<<<<< HEAD
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
              />
            ))
          )}
        </main>
=======
        {selectedQuestion ? (
          <div className="md:col-span-4 space-y-6">
            {/* Back button */}
            <button
              onClick={() => setSelectedQuestion(null)}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              Back to questions
            </button>

            {/* Question Detail */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedQuestion.title}
              </h1>
              <div className="prose prose-sm max-w-none mb-6 whitespace-pre-line">
                {selectedQuestion.description}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedQuestion.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="font-medium text-gray-700">
                  {selectedQuestion.author}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <MessageSquare className="mr-1" />{" "}
                    {Array.isArray(selectedQuestion.answers)
                      ? selectedQuestion.answers.length
                      : 0}{" "}
                    answers
                  </span>
                  <span className="flex items-center">
                    <ThumbsUp className="mr-1" /> {selectedQuestion.votes} votes
                  </span>
                  <span>
                    {new Date(selectedQuestion.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Answers Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Answers</h2>
              {Array.isArray(selectedQuestion.answers) &&
              selectedQuestion.answers.length > 0 ? (
                selectedQuestion.answers.map((answer, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <div
                      className="prose prose-sm max-w-none mb-4 whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: answer.content }}
                    />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div>
                        <span className="font-medium text-gray-700">
                          {answer.author}
                        </span>{" "}
                        • {new Date(answer.createdAt).toLocaleDateString()}
                      </div>
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

            {/* Submit Answer Form with RichTextEditor */}

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Submit Your Answer
              </h2>
              <form onSubmit={handleSubmitAnswer}>
                <RichTextEditor
                  content={newAnswer}
                  onChange={setNewAnswer}
                  placeholder="Write your detailed answer here..."
                  className="border-gray-300"
                />
                <button
                  type="submit"
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
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
              <p className="text-gray-500 text-center mt-10">
                No questions available.
              </p>
            ) : (
              <>
                {currentQuestions.map((q) => (
                  <div
                    key={q._id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer"
                    onClick={() => setSelectedQuestion(q)}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {q.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {q.description.length > 150
                        ? `${q.description.substring(0, 150)}...`
                        : q.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {q.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="font-medium text-gray-700">
                        {q.author}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="mr-1" />
                        {Array.isArray(q.answers) ? q.answers.length : 0}{" "}
                        answers
                      </span>
                    </div>
                  </div>
                ))}
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex space-x-2">
                      {/* Previous button */}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                      >
                        Previous
                      </button>

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded ${
                              currentPage === pageNum
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      )}

                      {/* Next button */}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        )}
>>>>>>> 50c481e26ef3623540929e85ff84327a5761304b
      </div>
    </div>
  );
}
