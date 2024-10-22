import React, { useState } from 'react';
import { UploadButton } from "@bytescale/upload-widget-react";
import { Input, Button } from 'antd';

// -----
// Configuration:
// https://www.bytescale.com/docs/upload-widget#configuration
// -----
const options = {
  apiKey: "public_12a1z9WC95Pz3j8qStxWvLhaH1n6", // This is your API key.
  maxFileCount: 1,
  showFinishButton: true, // Note: You must use 'onUpdate' if you set 'showFinishButton: false' (default).
  styles: {
    colors: {
      primary: "#320059"
    }
  }
};

interface UploadProjectProps {
  onClose: () => void;
}

const UploadProject: React.FC<UploadProjectProps> = ({ onClose }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');

  const handleUpload = (files: any[]) => {
    if (files.length > 0) {
      setUploadedFileUrl(files[0].fileUrl);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: projectName,
          description: projectDescription,
          image_url: uploadedFileUrl,
          site_link: '', // You might want to add inputs for these in your form
          github_link: '',
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        // onsubmit(newProject); // This should update the project list in Pages.tsx
        onClose();
      } else {
        console.error('Failed to submit project');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <Input.TextArea
        placeholder="Project Description"
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
        rows={4}
      />
      <UploadButton options={options} onComplete={handleUpload}>
        {({onClick}) =>
          <Button onClick={onClick} className="w-full  custom-button-outline custom-button-outline-hover">
            Upload Image
          </Button>
        }
      </UploadButton>
      {uploadedFileUrl && <p>File uploaded successfully!</p>}
      <Button type="primary" onClick={handleSubmit} className="w-full custom-button-outline">
        Submit Project
      </Button>
    </div>
  );
};

export default UploadProject;
