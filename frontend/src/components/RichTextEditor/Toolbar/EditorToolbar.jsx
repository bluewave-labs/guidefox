import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './EditorToolbar.css';
import { Button } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  InsertLink,
  FormatListBulleted,
  FormatListNumbered,
  Title,
} from '@mui/icons-material';
import LinkDialog from '../EditorLinkDialog/LinkDialog';

const Toolbar = ({ editor }) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isLinkActive, setIsLinkActive] = useState(false);

  if (!editor) {
    return null;
  }

  const handleClickOpen = () => {
    const currentLink = editor.getAttributes('link').href;
    setUrl(currentLink || '');
    setOpen(true);
    setIsLinkActive(!!currentLink);
  };

  const handleClose = () => {
    setOpen(false);
    setUrl('');
  };

  const handleInsertLink = () => {
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    handleClose();
  };

  const handleOpenLink = () => {
    window.open(url, '_blank');
    handleClose();
  };

  return (
    <div className="toolbar-container">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        style={{
          backgroundColor: editor.isActive('bold') ? '#e0e0e0' : 'transparent',
        }}
      >
        <FormatBold />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        style={{
          backgroundColor: editor.isActive('italic')
            ? '#e0e0e0'
            : 'transparent',
        }}
      >
        <FormatItalic />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        disabled={
          !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
        }
        style={{
          backgroundColor: editor.isActive('heading', { level: 3 })
            ? '#e0e0e0'
            : 'transparent',
        }}
      >
        <Title />
      </Button>
      <Button onClick={handleClickOpen}>
        <InsertLink />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        style={{
          backgroundColor: editor.isActive('bulletList')
            ? '#e0e0e0'
            : 'transparent',
        }}
      >
        <FormatListBulleted />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        style={{
          backgroundColor: editor.isActive('orderedList')
            ? '#e0e0e0'
            : 'transparent',
        }}
      >
        <FormatListNumbered />
      </Button>

      <LinkDialog
        open={open}
        handleClose={handleClose}
        url={url}
        setUrl={setUrl}
        isLinkActive={isLinkActive}
        handleInsertLink={handleInsertLink}
        handleOpenLink={handleOpenLink}
      />
    </div>
  );
};

Toolbar.propTypes = {
  editor: PropTypes.object,
};

export default Toolbar;
