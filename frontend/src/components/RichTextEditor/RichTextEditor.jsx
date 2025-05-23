import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './RichTextEditor.css';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Toolbar from './Toolbar/EditorToolbar';
import EditorTabs from './Tabs/EditorTabs';
import CustomTextField from '../TextFieldComponents/CustomTextField/CustomTextField';

const RichTextEditor = ({
  sx = {},
  previewComponent,
  header,
  setHeader,
  setContent,
  content,
  previewStyle,
}) => {
  const [mode, setMode] = useState('editor');

  const Preview = previewComponent;

  const handleHeaderChange = (e) => {
    setHeader(e.target.value);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      Heading,
      Link,
      BulletList,
      OrderedList,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    // onDestroy: () => {
    //   setContent("");
    //   setHeader("");
    // },
  });

  // Sync editor content with the content prop
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content]);

  return (
    <div style={{ ...sx }}>
      {mode === 'editor' ? (
        <>
          <CustomTextField
            labelText="Header"
            labelFontWeight={600}
            inputHeight="40px"
            TextFieldWidth="100%"
            value={header}
            onChange={handleHeaderChange}
            style={{ marginBottom: '2rem' }}
          />
          <label className="editor-label">Content</label>
          <div className="editor-container">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </>
      ) : (
        <Preview style={previewStyle} />
      )}
      <EditorTabs
        mode={mode}
        setMode={setMode}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      />
    </div>
  );
};

RichTextEditor.propTypes = {
  sx: PropTypes.object,
  previewComponent: PropTypes.elementType.isRequired,
  header: PropTypes.string,
  setHeader: PropTypes.func,
  setContent: PropTypes.func,
  content: PropTypes.string,
  resetState: PropTypes.func,
  previewStyle: PropTypes.object,
};

export default RichTextEditor;
