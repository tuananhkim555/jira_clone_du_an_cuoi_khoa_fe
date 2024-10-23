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

interface Project {
  img: string;
  title: string;
  description: string;
  links: {
    site: string;
    github: string;
  };
}

interface UploadProjectProps {
  onClose: () => void;
  onSubmit: (project: Project) => void;
}

const UploadProject: React.FC<UploadProjectProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [deployLink, setDeployLink] = useState('');
  const [githubLink, setGithubLink] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && image) {
      const newProject: Project = {
        img: URL.createObjectURL(image),
        title,
        description,
        links: {
          site: deployLink,
          github: githubLink,
        },
      };
      onSubmit(newProject);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-3"
      />
      <Input.TextArea
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-3"
      />
      <Input
        placeholder="Deploy Link"
        value={deployLink}
        onChange={(e) => setDeployLink(e.target.value)}
        className="mb-3"
      />
      <Input
        placeholder="GitHub Link"
        value={githubLink}
        onChange={(e) => setGithubLink(e.target.value)}
        className="mb-3"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mb-3"
      />
      <Button type="primary" htmlType="submit" className="mr-2 custom-button-outline">
        Upload
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </form>
  );
};

export default UploadProject;
