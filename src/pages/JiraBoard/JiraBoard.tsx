import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById, getAllProjects, getProjectCategories, getAllUsers, createTask, getAllStatuses, getAllPriorities, getAllTaskTypes } from '../../api';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { FaLeaf, FaTiktok, FaGithub, FaFacebook } from 'react-icons/fa';
import TextGradient from '../../components/ui/TitleGradient';
import { Input, Button, Form, Select, InputNumber, Slider, Row, Col, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import AnimationSection from '../../components/ui/AnimationSection';
import TextAnimation from '../../components/ui/TextAnimation';
import Reveal from '../../components/Reveal';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import CustomSelect from '../../components/CustomSelect';

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

interface User {
  userId: string;
  name: string;
  avatar: string;
  email: string;
  phoneNumber: string;
}

const initialColumns: { [key: string]: Column } = {
  todo: {
    id: 'backlog',
    title: 'BACKLOG',
    tasks: [],
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
  const [columns, setColumns] = useState(initialColumns);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timeTracking, setTimeTracking] = useState(0);
  const [loggedHours, setLoggedHours] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);
  const [description, setDescription] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectCategories, setProjectCategories] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [taskName, setTaskName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [originalEstimate, setOriginalEstimate] = useState(0);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        if (response.data && Array.isArray(response.data.content)) {
          setProjects(response.data.content);
          console.log('Fetched projects:', response.data.content);
        } else {
          console.error('Invalid response format for projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (projectId) {
        try {
          const response = await getProjectById(projectId);
          if (response.data && response.data.content) {
            setCurrentProject(response.data.content);
            console.log('Fetched current project:', response.data.content);
          } else {
            console.error('Invalid response format for project details');
          }
        } catch (error) {
          console.error('Error fetching project details:', error);
        }
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const [categoriesResponse, usersResponse, statusesResponse, prioritiesResponse, taskTypesResponse] = await Promise.all([
          getProjectCategories(),
          getAllUsers(),
          getAllStatuses(),
          getAllPriorities(),
          getAllTaskTypes()
        ]);
        
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data.content)) {
          setProjectCategories(categoriesResponse.data.content);
        }
        if (usersResponse.data && Array.isArray(usersResponse.data.content)) {
          setAllUsers(usersResponse.data.content);
          console.log('Users set:', usersResponse.data.content);
        }
        if (statusesResponse.data && Array.isArray(statusesResponse.data.content)) {
          setStatuses(statusesResponse.data.content);
          console.log('Statuses set:', statusesResponse.data.content);
        }
        if (prioritiesResponse.data && Array.isArray(prioritiesResponse.data.content)) {
          setPriorities(prioritiesResponse.data.content);
          console.log('Priorities set:', prioritiesResponse.data.content);
        }
        if (taskTypesResponse.data && Array.isArray(taskTypesResponse.data.content)) {
          setTaskTypes(taskTypesResponse.data.content);
          console.log('Task types set:', taskTypesResponse.data.content);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log('Current statuses:', statuses);
    console.log('Current priorities:', priorities);
  }, [statuses, priorities]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newTasks = Array.from(start.tasks);
      const [reorderedItem] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, reorderedItem);

      const newColumn = {
        ...start,
        tasks: newTasks,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      const startTasks = Array.from(start.tasks);
      const [movedItem] = startTasks.splice(source.index, 1);
      const newStart = {
        ...start,
        tasks: startTasks,
      };

      const finishTasks = Array.from(finish.tasks);
      finishTasks.splice(destination.index, 0, movedItem);
      const newFinish = {
        ...finish,
        tasks: finishTasks,
      };

      setColumns({
        ...columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      });
    }
  };

  const showModal = () => {
    console.log('Showing modal');
    console.log('Current statuses:', statuses);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = async () => {
    if (!currentProject) return;

    const taskData = {
      listUserAsign: selectedAssignees,
      taskName: taskName,
      description: description,
      statusId: selectedStatus,
      originalEstimate: originalEstimate,
      timeTrackingSpent: loggedHours,
      timeTrackingRemaining: remainingHours,
      projectId: currentProject.id,
      typeId: parseInt(selectedTaskType),
      priorityId: priorities.find(p => p.priority === selectedPriority)?.priorityId || 0,
    };

    try {
      const response = await createTask(taskData);
      if (response.data && response.data.content) {
        const newTask = {
          id: response.data.content.taskId,
          content: response.data.content.taskName
        };
        
        // Add the new task to the appropriate column
        const updatedColumns = { ...columns };
        const targetColumn = updatedColumns[selectedStatus] || updatedColumns.todo;
        targetColumn.tasks.push(newTask);
        
        setColumns(updatedColumns);
        setIsModalVisible(false);
        // Reset form fields
        setTaskName('');
        setDescription('');
        setSelectedStatus('');
        setSelectedPriority('');
        setSelectedTaskType('');
        setSelectedAssignees([]);
        setOriginalEstimate(0);
        setLoggedHours(0);
        setRemainingHours(0);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
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

  console.log('Rendering JiraBoard, statuses:', statuses);
  console.log('Rendering JiraBoard, priorities:', priorities);

  return (
    <div className="min-h-screen p-3 md:p-10 mt-12 lg:mt-24 flex flex-col">
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
        <Reveal>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto h-[500px] lg:h-[350px] overflow-x-auto">
            {Object.values(columns).map((column) => (
              <div key={column.id} className="bg-white rounded-lg shadow-md flex flex-col">
                <h2 className={`text-base font-semibold p-2 sm:p-3 rounded-t-lg text-white bg-gradient-to-r ${column.color}`}>
                  {column.title}
                </h2>
                <Droppable droppableId={column.id}>
                  {(provided: DroppableProvided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="p-2 sm:p-3 flex-grow overflow-y-auto"
                      style={{ minHeight: '180px', maxHeight: 'calc(100vh - 280px)' }}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-2 sm:p-3 mb-2 rounded-lg ${
                                snapshot.isDragging ? 'bg-blue-100' : 'bg-gray-50'
                              } shadow-sm`}
                            >
                              {task.content}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
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
                width: 'min(90vw, 650px)',
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
                      <Select 
                        value={currentProject?.id}
                        onChange={(value) => {
                          const selected = projects.find(p => p.id === value);
                          setCurrentProject(selected || null);
                        }}
                        disabled={!!projectId}
                      >
                        {projects.map((project) => (
                          <Select.Option key={project.id} value={project.id}>
                            {project.projectName}
                          </Select.Option>
                        ))}
                      </Select>
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
                        options={priorities.map(p => ({ value: p.priority, label: p.priority }))}
                        value={selectedPriority}
                        onChange={(value) => setSelectedPriority(value)}
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
                        onChange={(value) => setSelectedTaskType(value)}
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
                      onChange={(value) => setSelectedStatus(value)}
                      placeholder="Select status"
                    />
                  </Form.Item>
                  <div className="flex space-x-3 mb-3">
                    <div className="flex-1 flex flex-col space-y-3">
                      <Form.Item label="Assignees">
                        <CustomSelect
                          options={allUsers.map(user => ({ value: user.userId, label: user.name }))}
                          value={selectedAssignees}
                          onChange={(values) => setSelectedAssignees(values)}
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
      <footer className='mb-8 lg:mb-40'>
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
    </div>
  );
};

export default JiraBoard;
