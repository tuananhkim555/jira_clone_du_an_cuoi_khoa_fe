import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Avatar, Tag, Tooltip } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { fetchUsers, User } from './DragAndDropLogic';

interface Task {
  id?: string | number; // Make id optional and allow for string or number
  taskName: string;
  priority?: string;
  statusId?: string;
  assignees?: { id: string; name: string; avatar: string }[];
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

  useEffect(() => {
    console.log('Columns updated:', columns);
  }, [columns]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Nếu không có điểm ến hoặc điểm đến giống điểm xuất phát, không làm gì cả
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    // Tạo bản sao của columns để thao tác
    const newColumns = { ...columns };

    // Xóa task khỏi cột nguồn
    const sourceColumn = newColumns[source.droppableId];
    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);

    // Thêm task vào cột đích
    const destinationColumn = newColumns[destination.droppableId];
    destinationColumn.tasks.splice(destination.index, 0, movedTask);

    // Cập nhật state
    setColumns(newColumns);

    // Ở đây bạn có thể thêm logic để cập nhật trạng thái task trên server
  };

  const getPriorityColor = (priority?: string) => {
    if (!priority) return 'blue';
    switch (priority.toLowerCase()) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  const renderProjectCard = (tasks: Task[]) => {
    return tasks.map((task, index) => {
      // Generate a unique key if id is not available
      const key = task.id ? task.id.toString() : `task-${index}`;
      return (
        <Draggable key={key} draggableId={key} index={index}>
          {(provided) => (
            <li
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="p-2 sm:p-3 mb-2 rounded-lg bg-gray-50 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{task.taskName}</span>
                {task.priority && <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden">
                  {task.assignees && task.assignees.map((assignee, idx) => (
                    <Tooltip key={assignee.id} title={assignee.name}>
                      <Avatar src={assignee.avatar} size="small" />
                    </Tooltip>
                  ))}
                </div>
                {task.statusId === '4' && <CheckCircleOutlined className="text-green-500" />}
              </div>
            </li>
          )}
        </Draggable>
      );
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto h-[500px] lg:h-[400px]">
        {Object.entries(columns).map(([columnId, column]) => (
          <Droppable key={column.id} droppableId={column.id}>
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
