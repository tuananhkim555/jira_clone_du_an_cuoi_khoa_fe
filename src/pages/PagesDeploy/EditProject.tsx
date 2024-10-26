import React, { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

interface Project {
  id?: number;
  img: string;
  title: string;
  description: string;
  links: {
    site: string;
    github: string;
  };
}

interface EditProjectProps {
  project: Project;
  onClose: () => void;
  onSubmit: (updatedProject: Project) => void;
}

const EditProject: React.FC<EditProjectProps> = ({ project, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'Current Image',
      status: 'done',
      url: project.img,
    },
  ]);

  const handleSubmit = (values: any) => {
    const updatedProject: Project = {
      ...project,
      ...values,
      img: fileList[0]?.url || project.img,
      links: {
        site: values.siteLink,
        github: values.githubLink,
      },
    };
    onSubmit(updatedProject);
  };

  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{
      title: project.title,
      description: project.description,
      siteLink: project.links.site,
      githubLink: project.links.github,
    }}>
      <Form.Item name="img" label="Project Image">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={beforeUpload}
          maxCount={1}
        >
          {fileList.length < 1 && <UploadOutlined />}
        </Upload>
      </Form.Item>
      <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description!' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="siteLink" label="Site Link" rules={[{ required: true, message: 'Please input the site link!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="githubLink" label="GitHub Link" rules={[{ required: true, message: 'Please input the GitHub link!' }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className='custom-button-outline'>
          Edit
        </Button>
        <Button onClick={onClose} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditProject;

