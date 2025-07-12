'use client';

import { useState, useCallback, useMemo } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Select from "react-select";
import { FiLoader, FiTag, FiSend } from "react-icons/fi";

// Define tag options outside component to prevent recreation on every render
const TAG_OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'nodejs', label: 'Node.js' },
];

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Memoize editor configuration
  const editorConfig = useMemo(() => ({
    extensions: [StarterKit],
    content: '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4',
      },
    },
  }), []);

  // Initialize editor
  const editor = useEditor({
    ...editorConfig,
    onUpdate: ({ editor }) => {
      setDesc(editor.getHTML());
    },
  });
  
  const [desc, setDesc] = useState("<p></p>");

  // Memoize change handlers
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
    []
  );

  const handleTagsChange = useCallback(
    (options: readonly any[]) => setTags(options.map(o => o.value)),
    []
  );

  // Submit handler with loading state
  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !desc || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: desc, tags })
      });
      const data = await res.json();
      console.log(data);
      // Reset form on success
      setTitle("");
      setTags([]);
      editor?.commands.clearContent();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, desc, tags, isSubmitting, editor]);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Ask a Question</h1>
        
        {/* Title Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Question Title
          </label>
          <input
            type="text"
            placeholder="Be specific and imagine you're asking a question to another person"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        {/* Editor */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Detailed Explanation
          </label>
          <div className="border border-slate-300 rounded-lg overflow-hidden shadow-sm">
            {editor ? (
              <EditorContent editor={editor} />
            ) : (
              <div className="min-h-[300px] flex items-center justify-center bg-slate-50">
                <FiLoader className="animate-spin text-slate-400 text-2xl" />
              </div>
            )}
          </div>
        </div>

        {/* Tags Selector */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <FiTag className="text-slate-500" />
            <span>Tags</span>
          </div>
          <Select
            isMulti
            name="tags"
            options={TAG_OPTIONS}
            onChange={handleTagsChange}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select up to 5 tags..."
            value={TAG_OPTIONS.filter(option => tags.includes(option.value))}
          />
        </div>

        {/* Submit Button */}
        <button
          disabled={isSubmitting || !title.trim() || !desc}
          onClick={handleSubmit}
          className={`flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-all ${
            isSubmitting || !title.trim() || !desc
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {isSubmitting ? (
            <>
              <FiLoader className="animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <FiSend />
              <span>Post Your Question</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}