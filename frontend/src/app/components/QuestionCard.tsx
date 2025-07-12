// src/components/QuestionCard.tsx

import Link from "next/link";

interface QuestionCardProps {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  votes: number;
  createdAt: string;
}

export default function QuestionCard({
  _id,
  title,
  description,
  tags,
  author,
  votes,
  createdAt,
}: QuestionCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md p-5 rounded-xl mb-5">
      <Link href={`/question/${_id}`}>
        <h2 className="text-xl font-semibold text-blue-600 hover:underline">{title}</h2>
      </Link>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
      <div className="flex gap-2 mt-3 flex-wrap">
        {tags.map((tag, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>by {author}</span>
        <span>{new Date(createdAt).toLocaleDateString()}</span>
        <span>👍 {votes}</span>
      </div>
    </div>
  );
}
