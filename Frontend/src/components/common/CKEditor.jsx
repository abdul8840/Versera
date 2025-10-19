import React, { useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CKEditorComponent = ({ value, onChange, placeholder = 'Start writing your story...' }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (editorRef.current) {
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="ckeditor-container">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onReady={(editor) => {
          editorRef.current = editor;
          console.log('Editor is ready to use!', editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{
          placeholder,
          toolbar: {
            items: [
              'heading', '|',
              'bold', 'italic', 'underline', 'strikethrough', '|',
              'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
              'alignment', '|',
              'numberedList', 'bulletedList', '|',
              'outdent', 'indent', '|',
              'link', 'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', '|',
              'undo', 'redo'
            ]
          },
          language: 'en',
          image: {
            toolbar: [
              'imageTextAlternative',
              'toggleImageCaption',
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side'
            ]
          },
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells'
            ]
          }
        }}
      />
      
      <style jsx>{`
        .ckeditor-container :global(.ck.ck-editor) {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }
        .ckeditor-container :global(.ck.ck-toolbar) {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          border-radius: 0.5rem 0.5rem 0 0;
          background: #f9fafb;
        }
        .ckeditor-container :global(.ck.ck-content) {
          min-height: 400px;
          border: none;
          border-radius: 0 0 0.5rem 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default CKEditorComponent;