import React, { useState, useEffect, ChangeEvent } from 'react';
import { updateTaskStatus, deleteTask, removeUserFromTask, assignUserTask, getUsersInProject } from '../../../common/api/api';
import { updateTask } from '../JiraBoardLogic';
import TinyMCE from '../../../common/components/Tinymce/Tinymce';
import { Avatar, Slider, Select, Tooltip } from 'antd';
import { useMediaQuery } from '@mui/material';
import { FaEdit, FaBug, FaTasks, FaHashtag, FaHeading, FaAlignLeft, FaUsers, FaExclamationTriangle, FaClock, FaComments, FaPaperPlane, FaSave, FaCommentDots, FaLink, FaTrash } from 'react-icons/fa';
import '../../../styles/button.css'
import { CrownOutlined } from '@ant-design/icons';
import ConfirmationModal from '../../../common/components/ConfirmationModal';
import NotificationMessage from '../../../common/components/NotificationMessage';
import '../../../styles/EditTaskDetail.css';
import { EditTaskDetailProps } from '../JiraboardType';
import { TASK_TYPES } from '../../../common/constants/taskTypes';
import { 
  StatusOption, 
  PriorityOption, 
  ProjectUser, 
  Assignee, 
  SelectProps,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS 
} from './EditTaskType';

const EditTaskDetail: React.FC<EditTaskDetailProps> = ({
  taskId = '',
  projectId = '',
  isVisible,
  onClose,
  onUpdate,
  taskTitle = '',
  taskDescription = '',
  taskStatus = '1',
  taskPriority = '2',
  alias = '',
  reporterId = 0,
  timeTrackingRemaining = 0,
  timeTrackingSpent = 0,
  originalEstimate = 0,
  typeId = 1,
  assignees = [],
}) => {
  console.log('EditTaskDetail props:', {
    taskId,
    taskTitle,
    taskStatus,
    assignees
  });

  console.log('EditTaskDetail received assignees:', assignees);

  const [status, setStatus] = useState(taskStatus);
  const [priority, setPriority] = useState(taskPriority);
  const [title, setTitle] = useState(taskTitle);
  const [description, setDescription] = useState(taskDescription);
  const [taskType, setTaskType] = useState(typeId?.toString() || '1');
  const [taskAlias, setTaskAlias] = useState(alias);
  const [reporter, setReporter] = useState(reporterId?.toString() || '0');
  const [timeLogged, setTimeLogged] = useState(timeTrackingSpent?.toString() || '0');
  const [timeEstimated, setTimeEstimated] = useState(timeTrackingRemaining?.toString() || '0');
  const [originalEstimateValue, setOriginalEstimateValue] = useState(originalEstimate?.toString() || '0');
  const [comment, setComment] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<number[]>(
    assignees?.map(a => a.id) || []
  );
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);

  useEffect(() => {
    console.log('Assignees changed:', assignees);
  }, [assignees]);

  useEffect(() => {
    const fetchProjectUsers = async () => {
      try {
        const users = await getUsersInProject(projectId);
        setProjectUsers(users);
      } catch (error) {
        console.error('Error fetching project users:', error);
        NotificationMessage({
          type: 'error',
          message: 'Failed to fetch project users'
        });
      }
    };

    if (projectId) {
      fetchProjectUsers();
    }
  }, [projectId]);

  const isMobile = useMediaQuery('(max-width:640px)');
  const isTablet = useMediaQuery('(max-width:1024px)');

  if (!isVisible) return null;

  const handleStatusChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    try {
      await updateTaskStatus(Number(taskId), e.target.value);
      onUpdate();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (content: string) => {
    setDescription(content);
  };

  const handlePriorityChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value);
  };

  const handleCommentSubmit = () => {
    setComment("");
  };

  const calculateProgress = () => {
    const logged = parseFloat(timeLogged) || 0;
    const estimated = parseFloat(timeEstimated) || 1;
    return Math.min((logged / estimated) * 100, 100);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(Number(taskId));
      NotificationMessage({
        type: 'success',
        message: 'Task deleted successfully'
      });
      setIsDeleteModalOpen(false);
      onClose();
      onUpdate();
    } catch (error) {
      console.error('Error deleting task:', error);
      NotificationMessage({
        type: 'error',
        message: 'Failed to delete task. Please try again.'
      });
    }
  };

  const handleAssigneeChange = (value: number[]) => {
    setSelectedAssignees(value);
  };

  const handleUpdate = async () => {
    try {
      const taskData = {
        alias: taskAlias,
        description: description,
        originalEstimate: Number(originalEstimateValue) || 0,
        priorityId: Number(priority) || 2,
        projectId: Number(projectId) || 0,
        reporterId: Number(reporter) || 0,
        statusId: status,
        taskId: Number(taskId) || 0,
        taskName: title,
        timeTrackingRemaining: Number(timeEstimated) || 0,
        timeTrackingSpent: Number(timeLogged) || 0,
        typeId: Number(taskType) || 1,
        listUserAsign: selectedAssignees,
      };

      const response = await updateTask(taskData);
      
      if (response?.statusCode === 200) {
        NotificationMessage({
          type: 'success',
          message: 'Task updated successfully'
        });
        
        onUpdate();
        onClose();
      } else {
        throw new Error(response?.message || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      NotificationMessage({
        type: 'error',
        message: 'Failed to update task. Please try again.'
      });
    }
  };

  const handleRemoveAssignee = async (userId: number) => {
    try {
      await removeUserFromTask(Number(taskId), userId);
      setSelectedAssignees(prev => prev.filter(id => id !== userId));
      NotificationMessage({
        type: 'success',
        message: 'User removed from task successfully'
      });
      onUpdate();
    } catch (error) {
      console.error('Error removing user from task:', error);
      NotificationMessage({
        type: 'error',
        message: 'Failed to remove user from task'
      });
    }
  };

  const handleAssignUser = async (userId: number) => {
    try {
      await assignUserTask(Number(taskId), userId);
      setSelectedAssignees(prev => [...prev, userId]);
      NotificationMessage({
        type: 'success',
        message: 'User assigned to task successfully'
      });
      onUpdate();
    } catch (error) {
      console.error('Error assigning user to task:', error);
      NotificationMessage({
        type: 'error',
        message: 'Failed to assign user to task'
      });
    }
  };

  const selectProps = {
    mode: "multiple" as const,
    style: { width: '100%' },
    placeholder: "Search and select assignees",
    value: selectedAssignees,
    onChange: handleAssigneeChange,
    optionLabelProp: "label",
    className: "assignee-select",
    showSearch: true,
    filterOption: (input: string, option: any) => {
      const user = projectUsers.find(u => u.userId === option.value);
      return user?.name.toLowerCase().includes(input.toLowerCase()) || false;
    },
    onSelect: handleAssignUser,
    tagRender: (props: SelectProps) => {
      const user = assignees.find(a => a.id === props.value);
      if (!user) return <span></span>;
      
      return (
        <Tooltip title={user.name} placement="top">
          <span className="assignee-tag">
            <Avatar 
              size="small" 
              src={user.avatar}
              className="assignee-avatar"
            />
            <span className="assignee-name">{user.name}</span>
            <span 
              className="assignee-remove"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveAssignee(props.value);
              }}
            >
              ×
            </span>
          </span>
        </Tooltip>
      );
    },
    options: projectUsers.map(user => ({
      label: (
        <div className="assignee-option">
          <Avatar size="small" src={user.avatar} />
          <span>{user.name}</span>
        </div>
      ),
      value: user.userId
    }))
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 " style={{paddingLeft: isMobile ? "16px" : isTablet ? "20px" : "250px"}}>
      <div className={`bg-white rounded-lg p-4 w-full relative z-[10000] ${isMobile ? 'max-w-full h-[1000px]' : isTablet ? 'max-w-3xl' : 'max-w-5xl'} max-h-[90vh] overflow-y-auto h-[700px]`}>
        <div className={`${isMobile ? '' : 'flex justify-between items-center'} mb-8 `}>
          <div className="flex items-center mb-4">
            <FaEdit className="text-2xl mr-2 text-purple-950" />
            <h2 className="text-lg font-semibold text-purple-950">Edit Task</h2>
          </div>
          <div className={`flex items-center ${isMobile ? 'justify-between' : 'space-x-4'}`}>
            <button className="text-[16px] flex items-center text-gray-600 hover:text-gray-800">
              <FaCommentDots className="mr-1" />
              <span>Give feedback</span>
            </button>
            <button className="text-[16px] flex items-center text-gray-600 hover:text-gray-800">
              <FaLink className="mr-1" />
              <span>Copy link</span>
            </button>
            <button 
              onClick={handleDeleteClick}
              className="text-[16px] flex items-center text-red-700 hover:text-red-800"
            >
              <FaTrash className="mr-1" />
              <span>Delete</span>
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
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
                <CrownOutlined  className="mr-2" />
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
              <TinyMCE value={description} onChange={(content) => handleDescriptionChange(content)} height={180} />
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
                    className= "px-3 py-1.5 custom-button-outline text-white rounded  text-sm flex items-center"
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
                  <option key={option.statusId} value={option.statusId}>
                    {option.statusName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                <FaUsers className="mr-2" />
                Assignees
              </label>
              <Select {...selectProps} />
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
                value={originalEstimateValue}
                onChange={(e) => setOriginalEstimateValue(e.target.value)}
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
                className="px-3 py-1.5 custom-button-outline text-white rounded  text-sm flex items-center"
              >
                <FaPaperPlane className="mr-1" />
                Send
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm "
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-3 py-1.5 custom-button-outline text-white rounded  text-sm flex items-center"
          >
            <FaSave className="mr-1" />
            Save Changes
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default EditTaskDetail;
