import React, { useState } from 'react';
import { updateTaskStatus } from '../../../api/api';
import TinyMCE from '../../../components/Tinymce/Tinymce';
import { Avatar, Slider } from 'antd';
import { useMediaQuery } from '@mui/material';
import { FaEdit, FaBug, FaTasks, FaHashtag, FaHeading, FaAlignLeft, FaUsers, FaExclamationTriangle, FaClock, FaComments, FaPaperPlane, FaSave } from 'react-icons/fa';
import '../../../styles/button.css'

interface EditTaskDetailProps {
  taskId: string;
  projectId: string;
  isVisible: boolean;
  onClose: () => void;
  onUpdate: () => void;
  taskTitle: string;
  taskDescription: string;
  taskStatus: string;
  taskPriority: string;
}

type StatusOption = {
  statusId: string;
  statusName: string;
};

type PriorityOption = {
  priorityId: string;
  priority: string;
};

type TaskType = {
  id: string;
  name: string;
};

const TASK_TYPES: TaskType[] = [
  { id: "1", name: "Bug" },
  { id: "2", name: "New Task" }
];

const STATUS_OPTIONS: StatusOption[] = [
  { statusId: "1", statusName: "BACKLOG" },
  { statusId: "2", statusName: "IN PROGRESS" },
  { statusId: "3", statusName: "SELECTED FOR DEVELOPMENT" },
  { statusId: "4", statusName: "DONE" }
];

const PRIORITY_OPTIONS: PriorityOption[] = [
  { priorityId: "1", priority: "High" },
  { priorityId: "2", priority: "Medium" },
  { priorityId: "3", priority: "Low" },
  { priorityId: "4", priority: "Lowest" }
];

const EditTaskDetail: React.FC<EditTaskDetailProps> = ({ taskId, projectId, isVisible, onClose, onUpdate, taskTitle, taskDescription, taskStatus, taskPriority }) => {
  const [status, setStatus] = useState(taskStatus);
  const [priority, setPriority] = useState(taskPriority);
  const [title, setTitle] = useState(taskTitle);
  const [description, setDescription] = useState(taskDescription);
  const [taskType, setTaskType] = useState("2");
  const [comment, setComment] = useState("");
  const [originalEstimate, setOriginalEstimate] = useState("0");
  const [timeLogged, setTimeLogged] = useState("0");
  const [timeEstimated, setTimeEstimated] = useState("0");

  const isMobile = useMediaQuery('(max-width:640px)');
  const isTablet = useMediaQuery('(max-width:1024px)');

  if (!isVisible) return null;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    try {
      await updateTaskStatus(Number(taskId), e.target.value);
      onUpdate();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (content: string) => {
    setDescription(content);
  };

  const handlePriorityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value);
  };

  const handleCommentSubmit = () => {
    // Handle comment submission
    setComment("");
  };

  const calculateProgress = () => {
    const logged = parseFloat(timeLogged) || 0;
    const estimated = parseFloat(timeEstimated) || 1;
    return Math.min((logged / estimated) * 100, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" style={{paddingLeft: isMobile ? "16px" : isTablet ? "20px" : "250px"}}>
      <div className={`bg-white rounded-lg p-4 w-full relative z-[10000] ${isMobile ? 'max-w-full' : isTablet ? 'max-w-3xl' : 'max-w-5xl'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FaEdit className="text-2xl mr-2 text-purple-950" />
            <h2 className="text-lg font-semibold text-purple-950">Edit Task</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={`flex ${isMobile ? 'flex-col' : 'gap-6'}`}>
          {/* Left Column */}
          <div className={`${isMobile ? 'w-full' : isTablet ? 'w-1/2' : 'w-3/5'} mb-4`}>
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                  <FaTasks className="mr-2" />
                  Task Type
                </label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {TASK_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="w-1/2">
                <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                  <FaHashtag className="mr-2" />
                  Task ID
                </label>
                <input
                  type="text"
                  value={taskId}
                  disabled
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaHeading className="mr-2" />
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaAlignLeft className="mr-2" />
                Description
              </label>
              <TinyMCE value={description} onChange={(content) => handleDescriptionChange(content)} height={150} />
            </div>

            {!isMobile && (
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                  <FaComments className="mr-2" />
                  Comments
                </label>
                <div className="flex items-start gap-2">
                  <Avatar size={32} src="https://example.com/avatar.jpg" />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <button
                    onClick={handleCommentSubmit}
                    className="px-3 py-1.5 custom-button-outline text-white rounded  text-sm flex items-center"
                  >
                    <FaPaperPlane className="mr-1" />
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className={`${isMobile ? 'w-full' : isTablet ? 'w-1/2' : 'w-2/5'}`}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaTasks className="mr-2" />
                Status
              </label>
              <select
                value={status}
                onChange={handleStatusChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.statusId} value={option.statusId}>{option.statusName}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaUsers className="mr-2" />
                Assignees
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select assignee</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaExclamationTriangle className="mr-2" />
                Priority
              </label>
              <select
                value={priority}
                onChange={handlePriorityChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.priorityId} value={option.priorityId}>{option.priority}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaClock className="mr-2" />
                Original Estimate (hours)
              </label>
              <input
                type="number"
                value={originalEstimate}
                onChange={(e) => setOriginalEstimate(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaClock className="mr-2" />
                Time Tracking
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Slider
                      value={calculateProgress()}
                      disabled
                      tooltip={{
                        formatter: (value) => `${value?.toFixed(0)}%`
                      }}
                      trackStyle={{ backgroundColor: '#1e1b4b' }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    {calculateProgress().toFixed(0)}%
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-xs mb-1">Time Logged (hours):</div>
                    <input
                      type="number"
                      value={timeLogged}
                      onChange={(e) => setTimeLogged(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs mb-1">Time Estimated (hours):</div>
                    <input
                      type="number"
                      value={timeEstimated}
                      onChange={(e) => setTimeEstimated(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isMobile && (
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
              <FaComments className="mr-2" />
              Comments
            </label>
            <div className="flex items-start gap-2">
              <Avatar size={32} src="https://example.com/avatar.jpg" />
              <div className="flex-1">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                onClick={handleCommentSubmit}
                className="custom-button-outline"
              >
                Send
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onUpdate}
            className="px-3 py-1.5 custom-button-outline text-white rounded hover:bg-blue-600 text-sm flex items-center"
          >
            <FaSave className="mr-1" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskDetail;
