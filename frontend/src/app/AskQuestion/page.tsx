'use client';

import { useState, useCallback, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Strike from "@tiptap/extension-strike";
import Image from "@tiptap/extension-image";
import Select from "react-select";
import Navbar from "../components/navbar";
import {
  FiLoader,
  FiTag,
  FiSend,
  FiBold,
  FiItalic,
  FiLink,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiList,
  FiImage,
  FiSmile,
} from "react-icons/fi";
import { MdStrikethroughS, MdFormatListNumbered } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

const TAG_OPTIONS = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "typescript", label: "TypeScript" },
  // { value: "javascript", label: "JavaScript" },
  // { value: "nodejs", label: "Node.js" },
];

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const editorConfig = useMemo(
    () => ({
      extensions: [
        StarterKit.configure({
          bulletList: {
            HTMLAttributes: {
              class: 'list-disc',
            },
          },
          orderedList: {
            HTMLAttributes: {
              class: 'list-decimal',
            },
          },
        }),
        TextStyle,
        Color,
        Link.configure({
          openOnClick: true,
          HTMLAttributes: {
            class: 'text-blue-600 underline',
          },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Strike,
        Image.configure({
          HTMLAttributes: {
            class: 'rounded-lg',
          },
        }),
      ],
      content: "<p></p>",
      editorProps: {
        attributes: {
          class: "min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none",
        },
      },
    }),
    []
  );

const [desc, setDesc] = useState("");

 const editor = useEditor({
  ...editorConfig,
  onUpdate: ({ editor }) => {
    // Store both HTML and plain text versions
    setDesc(editor.getHTML());
    setPlainTextDesc(editor.getText()); // Add this line
  },
});

// Add a new state for plain text
const [plainTextDesc, setPlainTextDesc] = useState("");

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
    []
  );

  const handleTagsChange = useCallback(
    (options: readonly any[]) => setTags(options.map((o) => o.value)),
    []
  );

  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // In a real app, you would upload the image to your server here
      const url = URL.createObjectURL(file);

      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    };

    input.click();
  }, [editor]);

  const handleSubmit = useCallback(async () => {
  if (!title.trim() || !plainTextDesc || isSubmitting) return;

  setIsSubmitting(true);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: plainTextDesc,
          tags: tags.filter((tag) => tag.trim()),
          user_email: "parth@gmail.com"
        }),
      });
    const data = await res.json();
    console.log(data);
    setTitle("");
    setTags([]);
    setPlainTextDesc("");
    editor?.commands.clearContent();
  } catch (error) {
    console.error("Submission error:", error);
  } finally {
    setIsSubmitting(false);
  }
}, [title, plainTextDesc, tags, isSubmitting, editor]);

  return (
    <>
      <Navbar />
      <div className="mt-18 max-w-3xl mx-auto p-4 md:p-6 bg-white min-h-screen">
        <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Ask a Question
        </h1>

        {/* Title Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Question Title
          </label>
          <input
            type="text"
            placeholder="Be specific and imagine you're asking a question to another person"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-800"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        {/* Editor */}
        <div className="text-black space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Detailed Explanation
          </label>
          <div className="border border-slate-300 rounded-lg overflow-hidden shadow-sm bg-white relative">
            {editor && (
              <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
                {/* Text Formatting Group */}
                <div className="flex items-center border-r border-slate-200 pr-2 mr-2">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded ${
                      editor.isActive("bold") ? "bg-slate-200" : "hover:bg-slate-100"
                    }`}
                    title="Bold"
                  >
                    <FiBold />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded ${
                      editor.isActive("italic") ? "bg-slate-200" : "hover:bg-slate-100"
                    }`}
                    title="Italic"
                  >
                    <FiItalic />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded ${
                      editor.isActive("strike") ? "bg-slate-200" : "hover:bg-slate-100"
                    }`}
                    title="Strikethrough"
                  >
                    <MdStrikethroughS />
                  </button>
                  <button
                    onClick={() => {
                      const previousUrl = editor.getAttributes('link').href;
                      const url = window.prompt('URL', previousUrl);
                      
                      if (url === null) return;
                      
                      if (url === '') {
                        editor.chain().focus().extendMarkRange('link').unsetLink().run();
                        return;
                      }
                      
                      editor
                        .chain()
                        .focus()
                        .extendMarkRange('link')
                        .setLink({ href: url })
                        .run();
                    }}
                    className={`p-2 rounded ${
                      editor.isActive("link") ? "bg-slate-200" : "hover:bg-slate-100"
                    }`}
                    title="Link"
                  >
                    <FiLink />
                  </button>
                </div>

                {/* Text Alignment Group */}
                <div className="flex items-center border-r border-slate-200 pr-2 mr-2">
                  <button
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    className={`p-2 rounded ${
                      editor.isActive({ textAlign: "left" }) ? "bg-slate-200" : "hover:bg-slate-100"
                    }`}
                    title="Align left"
                  >
                    <FiAlignLeft />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    className={`p-2 rounded ${
                      editor.isActive({ textAlign: "center" }) ? "bg-slate-200" : "hover:bg-slate-100"
                    }`}
                    title="Align center"
                  >
                    <FiAlignCenter />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    className={`p-2 rounded ${
                      editor.isActive({ textAlign: "right" }) ? "bg-slate-200" : "hover:bg-slate-100"
                    }`}
                    title="Align right"
                  >
                    <FiAlignRight />
                  </button>
                </div>

                {/* Lists Group */}
                <div className="flex items-center border-r border-slate-200 pr-2 mr-2">
                  <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded ${
                      editor.isActive("bulletList") ? "bg-slate-200" : "hover:bg-slate-100"
                    }`}
                    title="Bullet list"
                  >
                    <FiList />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded ${
                      editor.isActive("orderedList") ? "bg-slate-200" : "hover:bg-slate-100"
                    }`}
                    title="Numbered list"
                  >
                    <MdFormatListNumbered />
                  </button>
                </div>

                {/* Media Group */}
                <div className="flex items-center">
                  <button
                    onClick={handleImageUpload}
                    className="p-2 rounded hover:bg-slate-100"
                    title="Insert image"
                  >
                    <FiImage />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 rounded hover:bg-slate-100"
                      title="Insert emoji"
                    >
                      <FiSmile />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute z-10 mt-1">
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            editor?.commands.insertContent(emojiData.emoji);
                            setShowEmojiPicker(false);
                          }}
                          width={300}
                          height={350}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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
        <div className="text-black space-y-2">
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
            value={TAG_OPTIONS.filter((option) => tags.includes(option.value))}
          />
        </div>

        {/* Submit Button */}
        <button
          disabled={isSubmitting || !title.trim() || !desc}
          onClick={handleSubmit}
          className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-medium transition-all ${
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
    </>
  );
}