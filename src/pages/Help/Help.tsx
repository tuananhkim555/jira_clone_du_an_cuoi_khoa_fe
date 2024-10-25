import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import axios from 'axios';
import NotificationMessage from '../../components/NotificationMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import Reveal from '../../components/Reveal';
import TextAnimation from '../../components/ui/TextAnimation';
import AnimationSection from '../../components/ui/AnimationSection';

const IssuesFilters = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    content: ''
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('https://getform.io/f/agdyxxpb', formData);
      NotificationMessage({
        type: 'success',
        message: 'Form submitted successfully!',
        duration: 3
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        content: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      NotificationMessage({
        type: 'error',
        message: 'Failed to submit form. Please try again.',
        duration: 3
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showModal = () => {
    console.log('showModal called');
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.log('handleOk called');
    setIsModalVisible(false);
    // Here you can add logic to initiate the call
  };

  const handleCancel = () => {
    console.log('handleCancel called');
    setIsModalVisible(false);
  };

  console.log('isModalVisible:', isModalVisible);

  return (
    <div className='overflow-y-hidden'>
    <Reveal>
      <div className="flex justify-center items-center min-h-screen p-4 relative">
        {isSubmitting && <LoadingSpinner />}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-[#28004a] p-6 md:p-8 text-white">
            <TextAnimation text="Contact Support" className="text-2xl text-white md:text-3xl font-extrabold mb-4" />
            <AnimationSection>
            <p className="mb-4 text-purple-200 text-sm md:text-base">We are always ready to assist you. Please fill in your information, and we will contact you as soon as possible.</p>
            <div className="mt-6">
              <div className="flex items-center mb-4">
                   <FaEnvelope className="h-6 w-6 mr-2 text-purple-300" />
                <span>tuananhkim555@gmail.com</span>                 
              </div>
              <div className="flex items-center mb-4 cursor-pointer" onClick={showModal}>
                <FaPhone className="h-6 w-6 mr-2 text-purple-300" />
                <span>+(84) 766 353 315</span>
              </div>
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="h-6 w-6 mr-2 text-purple-300" />
                <span>Lệ Thủy - Quảng Bình - Việt Nam</span>
              </div>
              <div className="flex items-center">
                <FaGlobe className="h-6 w-6 mr-2 text-purple-300" />
                <a href="https://tuananhdev.click" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-300 ">
                  tuananhdev.click
                </a>
              </div>
            </div>
            </AnimationSection>
          </div>
          <div className="w-full md:w-2/3 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-900 to-orange-800 hover:from-purple-800 hover:to-orange-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 delay-150 hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal
        title="Call Now"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="call" type="primary" onClick={handleOk} style={{ backgroundColor: '#31005b', borderColor: '#31005b' }}>
            Call Now
          </Button>,
        ]}
      >
        <p>Do you want to call +(84) 766 353 315?</p>
      </Modal>
    </div>
    </Reveal>
  </div>
  );
};

export default IssuesFilters;
