import React, { useCallback, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Embed } from "@/extensions/Embed";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Link2Off,
  Youtube,
  Minus,
  Undo2,
  Redo2,
} from "lucide-react";

const Divider = () => <div className="mx-1 h-6 w-px bg-slate-200" />;

interface RichTextEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  viewMode?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onUpdate,
  viewMode = false,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: false,
        HTMLAttributes: { class: "text-indigo-600 hover:underline" },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start writing or paste a link...",
      }),
      Embed,
    ],
    content,
    editable: !viewMode,
    editorProps: {
      attributes: {
        class: `prose prose-slate lg:prose-lg max-w-none focus:outline-none p-4 lg:p-8 overflow-y-auto`,
      },
    },
    onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
  });

  const setLink = useCallback(() => {
    const url = window.prompt("URL:", "https://");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `p-2 rounded-md transition-all ${
      active
        ? "bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
    }`;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 focus-within:ring-2 ring-indigo-500 min-h-0 overflow-hidden flex flex-col">
      {/* TOOLBAR */}
      {!viewMode && (
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white px-2 py-2">
          {/* Style */}
          <button
            className={btn(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            className={btn(editor.isActive("italic"))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            className={btn(editor.isActive("underline"))}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <UnderlineIcon size={18} />
          </button>
          <button
            className={btn(editor.isActive("strike"))}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strike"
          >
            <Strikethrough size={18} />
          </button>
          <Divider />
          {/* Align */}
          <button
            className={btn(editor.isActive({ textAlign: "left" }))}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>
          <button
            className={btn(editor.isActive({ textAlign: "center" }))}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </button>
          <button
            className={btn(editor.isActive({ textAlign: "right" }))}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
          <Divider />
          {/* Lists & Blocks */}
          <button
            className={btn(editor.isActive("bulletList"))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            className={btn(editor.isActive("orderedList"))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>
          <button
            className={btn(editor.isActive("blockquote"))}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Quote"
          >
            <Quote size={18} />
          </button>
          <button
            className={btn(editor.isActive("codeBlock"))}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
          >
            <Code size={18} />
          </button>
          <Divider />
          {/* Insert & Actions */}
          <button
            className={btn(false)}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <Minus size={18} />
          </button>
          <button
            className={btn(editor.isActive("link"))}
            onClick={
              editor.isActive("link")
                ? () => editor.chain().focus().unsetLink().run()
                : setLink
            }
            title="Link"
          >
            {editor.isActive("link") ? (
              <Link2Off size={18} />
            ) : (
              <LinkIcon size={18} />
            )}
          </button>
          <button
            className={btn(false)}
            onClick={() => {
              const url = window.prompt("Embed URL:");
              if (url) editor.chain().focus().insertEmbedFromUrl(url).run();
            }}
            title="Embed Video"
          >
            <Youtube size={18} />
          </button>
          <div className="flex-1" /> {/* Spacer */}
          {/* History */}
          <button
            className={btn(false)}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo2 size={18} />
          </button>
          <button
            className={btn(false)}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo2 size={18} />
          </button>
        </div>
      )}

      {/* EDITOR AREA */}
      <EditorContent
        editor={editor}
        className="flex flex-col min-h-0 overflow-hidden"
      />
    </div>
  );
};

export default RichTextEditor;
