import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEProps {
  value: string;
  onChange: (content: string, editor: any) => void;
  height?: number;
}

const TinyMCE: React.FC<TinyMCEProps> = ({ value, onChange, height = 300 }) => {
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      value={value} 
      init={{
        height: height,
        menubar: false,
        plugins: [
          'lists', 'link', 'image', 'charmap', 'preview',
          'searchreplace', 'code', 'fullscreen',
          'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar:
          'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help'
      }}
      onEditorChange={onChange}
    />
  );
};

export default TinyMCE;
