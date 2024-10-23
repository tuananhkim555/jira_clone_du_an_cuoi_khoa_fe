import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { FaLeaf, FaTiktok, FaGithub, FaFacebook } from 'react-icons/fa';
import TextGradient from '../../components/ui/TitleGradient';
import { Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import AnimationSection from '../../components/ui/AnimationSection';
import TextAnimation from '../../components/ui/TextAnimation';
import Reveal from '../../components/Reveal';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 mt-10 lg:mt-10 flex flex-col overflow-y-hidden">
      <div className="flex-grow">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 lg:mb-12 text-gray-800 flex items-center justify-center">
          <AnimationSection>
            <div className='flex items-center justify-center'>
              <FaLeaf className="mr-2 text-purple-800" />
              <TextGradient>Project Detail</TextGradient>
            </div>
          </AnimationSection>
        </h1>
        <div className="max-w-7xl mx-auto mb-4">
          <h2 className="text-2xl font-semibold mb-2">
            <TextAnimation text="BC-11 DINH TUAN ANH" />
          </h2>
          <Reveal>
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search tasks"
              suffix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 200 }}
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto h-[600px] lg:h-[400px]">
            {Object.values(columns).map((column) => (
              <div key={column.id} className="bg-white rounded-lg shadow-md flex flex-col">
                <h2 className={`text-lg font-semibold p-3 sm:p-4 rounded-t-lg text-white bg-gradient-to-r ${column.color}`}>
                  {column.title}
                </h2>
                <Droppable droppableId={column.id}>
                  {(provided: DroppableProvided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="p-3 sm:p-4 flex-grow overflow-y-auto"
                      style={{ minHeight: '200px', maxHeight: 'calc(100vh - 300px)' }}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 sm:p-4 mb-2 rounded-lg ${
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
                width: 'min(80vw, 700px)',
                height: '100vh'
              }}
            >
              <div className="p-4 sm:p-6 flex-grow overflow-y-auto">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Create Task</h2>
                <Input className="mb-4" placeholder="Tên dự án" />
                <Input className="mb-4" placeholder="Mô tả dự án" />
                <Input className="mb-4" placeholder="Ngày bắt đầu" />
                <Input className="mb-4" placeholder="Ngày kết thúc dự kiến" />
              </div>
              <div className="p-4 sm:p-6 border-t flex justify-end space-x-4">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" className='custom-button-outline' onClick={handleCreate}>Create</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <footer className='mt-10 lg:mb-10'>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="flex space-x-6 mb-4">
              <FaTiktok size={24} className="text-gray-600 hover:text-gray-800 transition-colors" />
              <FaGithub size={24} className="text-gray-600 hover:text-gray-800 transition-colors" />
              <FaFacebook size={24} className="text-gray-600 hover:text-gray-800 transition-colors" />
            </div>
            <p className="text-lg font-semibold text-gray-700">&copy; 2023 Jira Board</p>
            <p className="text-gray-600">Created by BC-11 DINH TUAN ANH</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JiraBoard;
