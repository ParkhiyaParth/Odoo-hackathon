// src/components/AnswerCard.tsx

interface AnswerCardProps {
  description: string;
  author: string;
  createdAt: string;
  votes: number;
  isAccepted: boolean;
}

export default function AnswerCard({
  description,
  author,
  createdAt,
  votes,
  isAccepted,
}: AnswerCardProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl shadow-sm mb-4">
      <div className="text-gray-700 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: description }} />
      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <span>by {author}</span>
        <span>{new Date(createdAt).toLocaleString()}</span>
        <span>👍 {votes} {isAccepted && <span className="text-green-500">✔ Accepted</span>}</span>
      </div>
    </div>
  );
}
