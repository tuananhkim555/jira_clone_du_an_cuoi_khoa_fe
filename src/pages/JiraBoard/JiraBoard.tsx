import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProjects, fetchProjectDetails, fetchAllData, createNewTask, ProjectDetails } from './JiraBoardLogic';
import { FaLeaf, FaTiktok, FaGithub, FaFacebook } from 'react-icons/fa';
import TextGradient from '../../components/ui/TitleGradient';
import { Input, Button, Form, InputNumber, Slider } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import AnimationSection from '../../components/ui/AnimationSection';
import TextAnimation from '../../components/ui/TextAnimation';
import Reveal from '../../components/Reveal';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';
import CustomSelect from '../../components/CustomSelect';
import DragAndDropBoard from './DragDrop/DragAndDropBoard';
import CreateTaskModal from './CreateTask/CreateTaskModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotificationMessage from '../../components/NotificationMessage';

// Hàm tạo ID đơn giản
const generateId = () => Math.random().toString(36).substr(2, 9);

interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

interface Project {
  id: number;
  projectName: string;
}

interface Status {
  statusId: string;
  statusName: string;
  alias: string;
  deleted: string;
}

interface Priority {
  priorityId: number;
  priority: string;
  description: string;
  deleted: boolean;
  alias: string;
}

interface TaskType {
  id: number;
  taskType: string;
}

// Add this near the top of your file, after the imports
const statusColors: { [key: string]: string } = {
  '1': 'bg-[#300053]', // BACKLOG
  '2': 'from-[#320053] to-purple-950', // SELECTED FOR DEVELOPMENT
  '3': 'from-purple-950 to-orange-700', // IN PROGRESS
  '4': 'from-orange-700 to-orange-900', // DONE
};

const getColumnColor = (statusId: string): string => {
  return statusColors[statusId] || 'bg-gray-200'; // Default color if status is not found
};

const initialColumns: { [key: string]: Column } = {
  todo: {
    id: 'backlog',
    title: 'BACKLOG',
    tasks: [{id: 'abc', content: 'abc'}],
    color: 'bg-[#300053]',
  },
  inProgress: {
    id: 'selectedForDevelopment',
    title: 'SELECTED FOR DEVELOPMENT',
    tasks: [],
    color: 'from-[#320053] to-purple-950',
  },
  review: {
    id: 'inProgress',
    title: 'IN PROGRESS',
    tasks: [],
    color: 'from-purple-950 to-orange-700',
  },
  done: {
    id: 'done',
    title: 'DONE',
    tasks: [],
    color: 'from-orange-700 to-orange-900',
  },
};

const JiraBoard: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [columns, setColumns] = useState<{ [key: string]: Column }>(() => {
    const savedColumns = localStorage.getItem('columns');
    return savedColumns ? JSON.parse(savedColumns) : initialColumns;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timeTracking, setTimeTracking] = useState(0);
  const [loggedHours, setLoggedHours] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);
  const [description, setDescription] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectCategories, setProjectCategories] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [taskName, setTaskName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [originalEstimate, setOriginalEstimate] = useState(0);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      const projectsData = await fetchProjects();
      setProjects(projectsData);
    };
    loadProjects();
  }, []);

  useEffect(() => {
    const loadProjectDetails = async () => {
      if (projectId) {
        const details = await fetchProjectDetails(projectId);
        if (details) {
          setProjectDetails(details);
          // Set the current project when details are loaded
          setCurrentProject({
            id: details.id,
            projectName: details.projectName
          });
          // Update columns based on project details
          const updatedColumns = details.lstTask.reduce((acc, status) => {
            acc[status.statusId] = {
              id: status.statusId,
              title: status.statusName,
              tasks: status.lstTaskDeTail,
              color: getColumnColor(status.statusId),
            };
            return acc;
          }, {} as { [key: string]: Column });
          setColumns(updatedColumns);
        }
      }
    };
    loadProjectDetails();
  }, [projectId]);

  useEffect(() => {
    const loadAllData = async () => {
      const { categories, users, statuses, priorities, taskTypes } = await fetchAllData();
      setProjectCategories(categories as any[]);
      setAllUsers(users as any[]);
      setStatuses(statuses as Status[]);
      setPriorities(priorities as Priority[]);
      setTaskTypes(taskTypes as TaskType[]);
    };
    loadAllData();
  }, []);

  useEffect(() => {
    localStorage.setItem('columns', JSON.stringify(columns));
  }, [columns]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = async (taskData: any) => {
    setIsLoading(true);
    try {
      const newTaskContent = await createNewTask(taskData);
      if (newTaskContent) {
        // Instead of creating a new task object, fetch the updated project details
        const updatedProject = await fetchProjectDetails(currentProject.id);
        if (updatedProject) {
          updateColumnsFromProject(updatedProject);
        }
        setIsModalVisible(false);
        NotificationMessage({ type: 'success', message: 'Task created successfully!' });
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      // Refresh project details to ensure UI is in sync with server
      if (currentProject) {
        const updatedProject = await fetchProjectDetails(currentProject.id);
        if (updatedProject) {
          updateColumnsFromProject(updatedProject);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateColumnsFromProject = (project: any) => {
    const newColumns: { [key: string]: Column } = {};
    project.lstTask.forEach((status: any) => {
      newColumns[status.statusId] = {
        id: status.statusId,
        title: status.statusName,
        tasks: status.lstTaskDeTail.map((task: any, index: number) => ({
          id: task.taskId || `temp-${status.statusId}-${index}`, // Use a temporary id if taskId is not available
          taskName: task.taskName,
          assignees: task.assigness,
          priority: task.priorityTask?.priority,
          statusId: status.statusId,
        })),
        color: getColumnColor(status.statusName)
      };
    });
    setColumns(newColumns);
  };

  const resetFormFields = () => {
    setTaskName('');
    setDescription('');
    setSelectedStatus('');
    setSelectedPriority('');
    setSelectedTaskType('');
    setSelectedAssignees([]);
    setOriginalEstimate(0);
    setLoggedHours(0);
    setRemainingHours(0);
  };

  const handleTimeTrackingChange = (value: number) => {
    setTimeTracking(value);
    setSliderValue(value);
  };

  const handleLoggedHoursChange = (value: number | null) => {
    if (value !== null) {
      setLoggedHours(value);
      updateTimeTracking(value, remainingHours);
    }
  };

  const handleRemainingHoursChange = (value: number | null) => {
    if (value !== null) {
      setRemainingHours(value);
      updateTimeTracking(loggedHours, value);
    }
  };

  const updateTimeTracking = (logged: number, remaining: number) => {
    const total = logged + remaining;
    if (total > 0) {
      setTimeTracking((logged / total) * 100);
      setSliderValue((logged / total) * 100);
    } else {
      setTimeTracking(0);
      setSliderValue(0);
    }
  };

  const handleEditorChange = (content: string, editor: any) => {
    setDescription(content);
  };

  return (
    <div className="min-h-screen p-3 md:p-10 mt-12 lg:mt-12 flex flex-col shadow-lg">
      {isLoading && <LoadingSpinner />}
      <div className="flex-grow">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-12 lg:mb-10 text-gray-800 flex items-center justify-center">
          <AnimationSection>
            <div className='flex items-center justify-center'>
              <FaLeaf className="mr-2 text-purple-800" />
              <TextGradient>Project Detail</TextGradient>
            </div>
          </AnimationSection>
        </h1>
        <div className="max-w-6xl mx-auto mb-3">
          <h2 className="text-xl font-semibold mb-2">
            <TextAnimation text="BC-11 DINH TUAN ANH" />
          </h2>
          <Reveal>
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search tasks"
              suffix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 180 }}
              className="focus:border-purple-900 focus:ring-purple-900"
            />
            <Button type="primary" className='custom-button-outline' onClick={showModal} icon={<PlusOutlined />}>
              Create Task
            </Button>
          </div>
          </Reveal>
        </div>
        {projectDetails && (
          <div className="max-w-6xl mx-auto mb-6">
            <h2 className="text-xl font-semibold mb-2">
              <TextAnimation text={projectDetails.projectName} />
            </h2>
            <p className="text-gray-600 mb-2">Creator: {projectDetails.creator.name}</p>
            <p className="text-gray-600 mb-2">Category: {projectDetails.projectCategory.name}</p>
            <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: projectDetails.description }} />
          </div>
        )}
        <Reveal>
          <DragAndDropBoard columns={columns} setColumns={setColumns} />
        </Reveal>
        <AnimatePresence>
          {isModalVisible && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full bg-white shadow-lg z-[9999] flex flex-col"
              style={{
                width: 'min(90vw, 600px)',
                height: '100vh'
              }}
            >
              <div className="p-3 sm:p-4 flex-grow overflow-y-auto">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Create Task for {currentProject?.projectName}</h2>
                <Form layout="vertical">
                  <div className="flex space-x-3 mb-3">
                    <Form.Item
                      label="Project Name"
                      className="flex-1"
                    >
                      <Input 
                        value={currentProject?.projectName || ''}
                        disabled
                      />
                    </Form.Item>
                    <Form.Item
                      label="Task Name"
                      className="flex-1"
                    >
                      <Input 
                        placeholder="Enter task name" 
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                      />
                    </Form.Item>
                  </div>
                  <div className="flex space-x-3 mb-3">
                    <Form.Item
                      label="Priority"
                      className="flex-1"
                    >
                      <CustomSelect
                        options={priorities.map(p => ({ value: p.priorityId.toString(), label: p.priority }))}
                        value={selectedPriority}
                        onChange={(value) => setSelectedPriority(value as string)}
                        placeholder="Select priority"
                      />
                    </Form.Item>
                    <Form.Item
                      label="Task Type"
                      className="flex-1"
                    >
                      <CustomSelect
                        options={taskTypes.map(type => ({ value: type.id.toString(), label: type.taskType }))}
                        value={selectedTaskType}
                        onChange={(value) => setSelectedTaskType(value as string)}
                        placeholder="Select task type"
                      />
                    </Form.Item>
                  </div>
                  <Form.Item
                    label="Status"
                    className="flex-1"
                  >
                    <CustomSelect
                      options={statuses.map(s => ({ value: s.statusId, label: s.statusName }))}
                      value={selectedStatus}
                      onChange={(value) => setSelectedStatus(value as string)}
                      placeholder="Select status"
                    />
                  </Form.Item>
                  <div className="flex space-x-3 mb-3">
                    <div className="flex-1 flex flex-col space-y-3">
                      <Form.Item label="Assignees">
                        <CustomSelect 
                          options={allUsers.map((user: any) => ({ value: user.userId, label: user.name }))}
                          value={selectedAssignees}
                          onChange={(values) => setSelectedAssignees(values as string[])}
                          placeholder="Select assignees"
                          mode="multiple"
                        />
                      </Form.Item>
                      <Form.Item label="Original Estimate">
                        <InputNumber 
                          min={0} 
                          placeholder="0" 
                          style={{ width: '100%' }} 
                          value={originalEstimate}
                          onChange={(value) => setOriginalEstimate(value || 0)}
                        />
                      </Form.Item>
                    </div>
                    <div className="flex-1 flex flex-col space-y-3">
                      <Form.Item label="Time Tracking">
                        <div className="flex items-center">
                          <Slider
                            min={0}
                            max={100}
                            onChange={handleTimeTrackingChange}
                            value={sliderValue}
                            style={{ flex: 1, marginRight: 16 }}
                          />
                          <span>{sliderValue.toFixed(0)}%</span>
                        </div>
                      </Form.Item>
                      <div className="flex space-x-3">
                        <Form.Item label="H logged" className="flex-1">
                          <InputNumber
                            min={0}
                            value={loggedHours}
                            onChange={handleLoggedHoursChange}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                        <Form.Item label="H remaining" className="flex-1">
                          <InputNumber
                            min={0}
                            value={remainingHours}
                            onChange={handleRemainingHoursChange}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                  <Form.Item label="Description">
                    <Editor
                      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                      init={{
                        height: 250,
                        menubar: false,
                        plugins: [
                          'advlist autolink lists link image charmap print preview anchor',
                          'searchreplace visualblocks code fullscreen',
                          'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar:
                          'undo redo | formatselect | bold italic backcolor | \
                          alignleft aligncenter alignright alignjustify | \
                          bullist numlist outdent indent | removeformat | help'
                      }}
                      onEditorChange={handleEditorChange}
                    />
                  </Form.Item>
                </Form>
              </div>
              <div className="p-3 sm:p-4 border-t flex justify-start space-x-3">
                <Button type="primary" className='custom-button-outline' onClick={handleCreate}>Create</Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <footer className='mb-8 lg:mb-20'>
        <div className="max-w-6xl mx-auto px-3">
          <div className="flex flex-col items-center">
            <div className="flex space-x-4 mb-3">
              <FaTiktok size={24} className="text-gray-600 hover:text-gray-800 transition-colors" />
              <FaGithub size={24} className="text-gray-600 hover:text-gray-800 transition-colors" />
              <FaFacebook size={24} className="text-gray-600 hover:text-gray-800 transition-colors" />
            </div>
            <p className="text-lg font-semibold text-gray-700">&copy; 2024 Jira Board</p>
            <p className="text-lg text-gray-600">Created by BC-11 DINH TUAN ANH</p>
          </div>
        </div>
      </footer>
      <CreateTaskModal
        isVisible={isModalVisible}
        onCancel={handleCancel}
        onCreate={handleCreate}
        currentProject={currentProject}
      />
    </div>
  );
};

export default JiraBoard;
