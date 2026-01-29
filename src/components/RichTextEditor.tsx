import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

interface RichTextEditorProps {
  content: string;
  onUpdate: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onUpdate,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="border rounded p-2">
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
