// components/RichTextEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FiLoader } from 'react-icons/fi';
import { useState, useMemo } from 'react';

type RichTextEditorProps = {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
};

export default function RichTextEditor({
  content = '<p></p>',
  onChange,
  placeholder = 'Start typing...',
  label = 'Description',
  className = '',
}: RichTextEditorProps) {
  const [internalContent, setInternalContent] = useState(content);

  const editorConfig = useMemo(() => ({
    extensions: [StarterKit],
    content: internalContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4',
        placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setInternalContent(html);
      onChange?.(html);
    },
  }), [internalContent, onChange, placeholder]);

  const editor = useEditor(editorConfig);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
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
  );
}