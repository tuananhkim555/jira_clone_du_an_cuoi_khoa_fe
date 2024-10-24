import React, { useState, useEffect } from 'react';
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

const initialColumns: { [key: string]: Column } = {
  todo: {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: generateId(), content: 'Task 1' },
      { id: generateId(), content: 'Task 2' },
    ],
    color: 'bg-[#300053]',
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    tasks: [
      { id: generateId(), content: 'Task 3' },
    ],
    color: 'from-[#320053] to-purple-950',
  },
  review: {
    id: 'review',
    title: 'Review',
    tasks: [
      { id: generateId(), content: 'Task 4' },
    ],
    color: 'from-purple-950 to-orange-700',
  },
  done: {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: generateId(), content: 'Task 5' },
    ],
    color: 'from-orange-700 to-orange-900',
  },
};

const JiraBoard: React.FC = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timeTracking, setTimeTracking] = useState(0);
  const [loggedHours, setLoggedHours] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);
  const [description, setDescription] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://jiranew.cybersoft.edu.vn/api/Project/getAllProject');
        setProjects(response.data.content);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

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
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = () => {
    setIsModalVisible(false);
    // Xử lý logic khi người dùng nhấn Create
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

  const handleEditorChange = (content: string) => {
    setDescription(content);
  };

  return (
    <div className="min-h-screen p-3  md:p-10 mt-16 lg:mt-28 flex flex-col overflow-y-hidden">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto h-[500px] lg:h-[350px]">
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
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Create Task</h2>
                <Form layout="vertical">
                  <div className="flex space-x-3 mb-3">
                    <Form.Item
                      label="Project Name"
                      className="flex-1"
                    >
                      <Select placeholder="Select project name">
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
                      <Input placeholder="Enter task name" />
                    </Form.Item>
                  </div>
                  <div className="flex space-x-3 mb-3">
                    <Form.Item
                      label="Priority"
                      className="flex-1"
                    >
                      <Select placeholder="Select priority">
                        <Select.Option value="low">Low</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="high">High</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Task Type"
                      className="flex-1"
                    >
                      <Select placeholder="Select task type">
                        <Select.Option value="feature">Feature</Select.Option>
                        <Select.Option value="bug">Bug</Select.Option>
                        <Select.Option value="improvement">Improvement</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <Form.Item
                    label="Status"
                    className="flex-1"
                  >
                    <Select placeholder="Select status">
                      <Select.Option value="todo">To Do</Select.Option>
                      <Select.Option value="inProgress">In Progress</Select.Option>
                      <Select.Option value="review">Review</Select.Option>
                      <Select.Option value="done">Done</Select.Option>
                    </Select>
                  </Form.Item>
                  <div className="flex space-x-3 mb-3">
                    <div className="flex-1 flex flex-col space-y-3">
                      <Form.Item label="Assignees">
                        <Select placeholder="Please select" mode="multiple">
                          {/* Add options for assignees here */}
                        </Select>
                      </Form.Item>
                      <Form.Item label="Original Estimate">
                        <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
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
