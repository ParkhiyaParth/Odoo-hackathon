import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiMessageSquare, FiThumbsUp, FiThumbsDown, FiHome } from 'react-icons/fi';
import Link from 'next/link';
import RichTextEditor from '../../components/RichTextEditor'; // Adjust path as needed

export default function QuestionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [answer, setAnswer] = useState('');
  const [userVoted, setUserVoted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth check

  // Mock data
  const question = {
    id: id || '1',
    title: 'How to join 2 columns in a data set to make a separate column in SQL',
    content: 'I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine.',
    tags: ['SQL', 'Database'],
    answers: [
      {
        id: '1',
        content: 'The || Operator.\nThe + Operator.\nThe CONCAT Function.',
        author: 'SQL Expert',
        upvotes: 5,
        downvotes: 1,
        date: '2 days ago'
      },
      {
        id: '2',
        content: 'Details about another approach',
        author: 'Database Admin',
        upvotes: 3,
        downvotes: 0,
        date: '1 day ago'
      }
    ]
  };

  const handleVote = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (userVoted) return;
    
    // Perform vote action
    setUserVoted(true);
  };

  const handleSubmitAnswer = (html: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    console.log('Submitted answer:', html);
    setAnswer('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="flex items-center hover:text-blue-600">
          <FiHome className="mr-1" /> Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Question</span>
        <span className="mx-2">/</span>
        <span className="text-gray-700 truncate max-w-xs">{question.title}</span>
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

      {/* Question Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{question.title}</h1>
        
        <div className="prose prose-sm max-w-none mb-6">
          <p>{question.content}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {question.tags.map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <div className="flex items-center mr-4">
            <FiMessageSquare className="mr-1" /> {question.answers.length} answers
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Answers</h2>
        
        {question.answers.map(ans => (
          <div key={ans.id} className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <div className="prose prose-sm max-w-none mb-4 whitespace-pre-line">
              {ans.content}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                <span className="font-medium text-gray-700">{ans.author}</span> • {ans.date}
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleVote}
                  disabled={userVoted}
                  className={`flex items-center ${userVoted ? 'text-gray-400' : 'hover:text-green-600'}`}
                >
                  <FiThumbsUp className="mr-1" /> {ans.upvotes}
                </button>
                <button 
                  onClick={handleVote}
                  disabled={userVoted}
                  className={`flex items-center ${userVoted ? 'text-gray-400' : 'hover:text-red-600'}`}
                >
                  <FiThumbsDown className="mr-1" /> {ans.downvotes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Answer Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit Your Answer</h2>
        {isLoggedIn ? (
          <div className="space-y-4">
            <RichTextEditor
              content={answer}
              onChange={(html) => setAnswer(html)}
              placeholder="Write your detailed answer here..."
              label=""
              className="border border-gray-300 rounded-lg"
            />
            <button
              onClick={() => handleSubmitAnswer(answer)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Post Answer
            </button>
          </div>
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
  );
}