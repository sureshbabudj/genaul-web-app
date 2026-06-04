import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

const editor = new Editor({
  extensions: [StarterKit],
  content: '<p>Hello</p>',
});

console.log('H1:', editor.isActive('heading', { level: 1 }));
console.log('P:', editor.isActive('paragraph'));
