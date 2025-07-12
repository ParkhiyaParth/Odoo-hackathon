'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Strike from '@tiptap/extension-strike';
import Image from '@tiptap/extension-image';
import EmojiPicker from 'emoji-picker-react';
import { 
  FiBold, 
  FiItalic, 
  FiLink, 
  FiAlignLeft, 
  FiAlignCenter, 
  FiAlignRight, 
  FiList,
  FiImage,
  FiSmile
} from 'react-icons/fi';
import { MdStrikethroughS, MdFormatListNumbered } from 'react-icons/md';
import { useEffect, useState, useRef } from 'react';

type RichTextEditorProps = {
  content?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export default function RichTextEditor({
  content = '',
  onChange,
  placeholder = 'Write your answer...',
  className = '',
}: RichTextEditorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
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
        types: ['heading', 'paragraph'],
      }),
      Strike,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg',
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'min-h-[200px] p-4 focus:outline-none prose prose-sm max-w-none',
        placeholder: placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // In a real app, upload to your server here
      const url = URL.createObjectURL(file);
      editor?.chain().focus().setImage({ src: url }).run();
    };

    input.click();
  };

  if (!editor) {
    return <div className={`${className} border rounded-lg p-4`}>Loading editor...</div>;
  }

  return (
    <div 
      ref={containerRef}
      className={`${className} border border-gray-300 rounded-lg relative`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 rounded-t-lg">
        {/* Text Formatting */}
        <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Bold"
          >
            <FiBold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Italic"
          >
            <FiItalic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded ${editor.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Strikethrough"
          >
            <MdStrikethroughS className="w-4 h-4" />
          </button>
        </div>

        {/* Link */}
        <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
          <button
            type="button"
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href;
              const url = window.prompt('URL', previousUrl);
              
              if (url === null) return;
              
              if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink().run();
                return;
              }
              
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }}
            className={`p-2 rounded ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Link"
          >
            <FiLink className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Align left"
          >
            <FiAlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Align center"
          >
            <FiAlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Align right"
          >
            <FiAlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Bullet list"
          >
            <FiList className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            title="Numbered list"
          >
            <MdFormatListNumbered className="w-4 h-4" />
          </button>
        </div>

        {/* Media Group */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleImageUpload}
            className="p-2 rounded hover:bg-gray-100"
            title="Insert image"
          >
            <FiImage className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              ref={emojiButtonRef}
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded hover:bg-gray-100"
              title="Insert emoji"
            >
              <FiSmile className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Editor content */}
      <EditorContent editor={editor} />
      
      {/* Emoji Picker - Positioned properly below the emoji button */}
      {showEmojiPicker && (
        <div 
          className="absolute z-50"
          style={{
            top: emojiButtonRef.current 
              ? emojiButtonRef.current.offsetTop + emojiButtonRef.current.offsetHeight + 8
              : 'auto',
            left: emojiButtonRef.current?.offsetLeft
          }}
        >
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              editor?.commands.insertContent(emojiData.emoji);
              setShowEmojiPicker(false);
            }}
            width={300}
            height={350}
            previewConfig={{ showPreview: false }}
            searchPlaceholder="Q Search"
            categories={[
              {
                category: 'frequent',
                name: 'Frequently Used'
              },
              {
                category: 'smileys_people',
                name: 'Smileys & People'
              }
            ]}
          />
        </div>
      )}
    </div>
  );
}