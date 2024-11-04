import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Avatar, Tag, Tooltip } from 'antd';
import { CheckCircleOutlined, InboxOutlined, RocketOutlined, SyncOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { fetchUsers, User } from './DragAndDropLogic';

interface Task {
  id?: string | number;
  taskId?: string | number;
  taskName: string;
  priority?: {
    priorityId: string | number;
    priority: string;
    description?: string;
    deleted?: boolean;
    alias?: string;
  };
  statusId?: string;
  assignees?: {
    userId: string | number;
    name: string;
    avatar: string;
  }[];
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
  onTaskClick: (taskId: string) => void;
}

const DragAndDropBoard: React.FC<DragAndDropBoardProps> = ({ columns, setColumns, onTaskClick }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };

    loadUsers();
  }, []);

  useEffect(() => {
  }, [columns]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const newColumns = { ...columns };
    const sourceColumn = newColumns[source.droppableId];
    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);

    const destinationColumn = newColumns[destination.droppableId];
    
    // Kiểm tra số lượng task trong cột đích
    if (destinationColumn.tasks.length >= 4) {
      // Nếu đã có 4 task, trả task về vị trí cũ
      sourceColumn.tasks.splice(source.index, 0, movedTask);
      return;
    }

    destinationColumn.tasks.splice(destination.index, 0, movedTask);
    setColumns(newColumns);
  };

  const getPriorityColor = (priority: any) => {
    if (!priority) return 'blue';
    
    const priorityName = typeof priority === 'string' 
      ? priority 
      : priority.priority || priority.priorityName;
      
    if (!priorityName) return 'blue';

    switch (priorityName.toLowerCase()) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'blue';
    }
  };

  const handleTaskClick = (e: React.MouseEvent, task: Task) => {
    e.preventDefault();
    e.stopPropagation();
    const taskId = task.taskId || task.id;
    if (taskId) {
      onTaskClick(taskId.toString());
    }
  };

  const renderProjectCard = (tasks: Task[]) => {
    return tasks.map((task, index) => {
      const uniqueKey = `${task.taskId || task.id || index}-${task.statusId}-${index}`;
      
      return (
        <Draggable key={uniqueKey} draggableId={uniqueKey} index={index}>
          {(provided) => (
            <li
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="p-2 sm:p-3 mb-2 rounded-lg bg-gray-50 shadow-md cursor-pointer"
              onClick={(e) => handleTaskClick(e, task)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{task.taskName}</span>
                {task.priority && (
                  <Tag color={getPriorityColor(task.priority)}>
                    {task.priority.priority}
                  </Tag>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden">
                  {task.assignees?.map((assignee, assigneeIndex) => (
                    <Tooltip 
                      key={`${uniqueKey}-assignee-${assignee.userId || assigneeIndex}`} 
                      title={assignee.name}
                    >
                      <Avatar 
                        src={assignee.avatar} 
                        size="small"
                        alt={assignee.name}
                        className="border border-white"
                      />
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

  const renderTask = (task: any) => (
    <div 
      onClick={() => onTaskClick(task.id)}
      className="cursor-pointer"
    >
      <h3>{task.taskName}</h3>
      {task.priority && (
        <div className="priority-badge">
          {task.priority.priority}
        </div>
      )}
      {task.assignees && task.assignees.length > 0 && (
        <div className="assignees">
          {task.assignees.map((assignee: any) => (
            <img 
              key={assignee.userId} 
              src={assignee.avatar} 
              alt={assignee.name}
              className="avatar"
            />
          ))}
        </div>
      )}
    </div>
  );

  const getColumnTitle = (title: string) => {
    switch (title) {
      case 'BACKLOG':
        return <><InboxOutlined /> BACKLOG</>;
      case 'SELECTED FOR DEVELOPMENT':
        return <><RocketOutlined /> SELECTED DEVELOPMENT</>;
      case 'IN PROGRESS':
        return <><SyncOutlined spin /> IN PROGRESS</>;
      case 'DONE':
        return <><CheckSquareOutlined /> DONE</>;
      default:
        return title;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto h-[400px]">
        {Object.entries(columns).map(([columnId, column]) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="bg-white rounded-lg flex flex-col h-full"
              >
                <h2 className={`text-sm font-semibold p-2 sm:p-3 rounded-t-lg text-white bg-gradient-to-r ${column.color} flex items-center gap-2`}>
                  {getColumnTitle(column.title)}
                </h2>
                <ul className="p-2 sm:p-3 flex-grow overflow-y-auto custom-scrollbar" style={{ height: '370px' }}>
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
