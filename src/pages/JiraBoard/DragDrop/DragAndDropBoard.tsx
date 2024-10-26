import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Avatar, Tag, Tooltip } from 'antd';
import { CheckCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { fetchUsers, User } from './DragAndDropLogic';

interface Task {
  id: string;
  taskName: string;
  // Add other task properties as needed
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

interface DragAndDropBoardProps {
  columns: { [key: string]: Column };
  setColumns: React.Dispatch<React.SetStateAction<{ [key: string]: Column }>>;
}

const DragAndDropBoard: React.FC<DragAndDropBoardProps> = ({ columns, setColumns }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };

    loadUsers();
  }, []);

  const onDragEnd = (result: DropResult) => {
    // ... (keep the existing onDragEnd logic)
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  const renderProjectCard = (tasks: Task[]) => {
    return tasks.map((task, index) => (
      <Draggable key={task.id} draggableId={String(task.id)} index={index}>
        {(provided) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-2 sm:p-3 mb-2 rounded-lg bg-gray-50 shadow-sm`}
          >
            <div className="flex items-center justify-between mb-2">
              {/* Render task details here */}
              <span>{task.taskName}</span>
            </div>
          </li>
        )}
      </Draggable>
    ));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto h-[500px] lg:h-[400px]">
        {Object.entries(columns).map(([columnId, column], idx) => (
          <Droppable key={column.id.toString() + idx} droppableId={column.id.toString()}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="bg-white rounded-lg flex flex-col"
              >
                <h2 className={`text-sm font-semibold p-2 sm:p-3 rounded-t-lg text-white bg-gradient-to-r ${column.color}`}>
                  {column.title}
                </h2>
                <ul className="p-2 sm:p-3 flex-grow overflow-y-auto" style={{ minHeight: '180px', maxHeight: 'calc(100vh - 280px)' }}>
                  {renderProjectCard(column.tasks)}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default DragAndDropBoard;
