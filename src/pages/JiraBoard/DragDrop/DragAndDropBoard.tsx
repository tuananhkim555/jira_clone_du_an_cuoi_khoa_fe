import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Avatar, Tag, Tooltip } from 'antd';
import { CheckCircleOutlined, InboxOutlined, RocketOutlined, SyncOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { fetchUsers } from './DragAndDropLogic';
import EditTaskDetail from '../EditTaskDetail/EditTaskDetail';
import { User, Task, DragAndDropBoardProps } from './DragDropType';

const DragAndDropBoard: React.FC<DragAndDropBoardProps> = ({ columns, setColumns, onTaskClick, currentProject }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const handleTaskClick = (task: Task) => {
    onTaskClick(task.taskId?.toString() || task.id?.toString() || '');
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
              onClick={() => handleTaskClick(task)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{task.taskName}</span>
                {task.priority && (
                  <Tag color={getPriorityColor(task.priority)}>
                    {typeof task.priority === 'string' ? task.priority : task.priority.priority}
                  </Tag>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden">
                  {task.assignees?.map((assignee, assigneeIndex) => (
                    <Tooltip 
                      key={`${uniqueKey}-assignee-${assignee.id || assigneeIndex}`} 
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

    if (taskId && sourceColumnId !== targetColumnId) {
      // Logic to move task from sourceColumnId to targetColumnId
      const sourceColumn = columns[sourceColumnId];
      const targetColumn = columns[targetColumnId];

      const taskToMove = sourceColumn.tasks.find((task : any) => task.taskId === taskId);
      if (taskToMove) {
        // Remove task from source column
        const updatedSourceTasks = sourceColumn.tasks.filter((task : any) => task.taskId !== taskId);
        const updatedTargetTasks = [...targetColumn.tasks, taskToMove];

        // Update columns state
        setColumns({
          ...columns,
          [sourceColumnId]: { ...sourceColumn, tasks: updatedSourceTasks },
          [targetColumnId]: { ...targetColumn, tasks: updatedTargetTasks },
        });
      }
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
                onDrop={(e) => handleDrop(e, columnId)}
                onDragOver={(e) => e.preventDefault()}
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
      {selectedTask && (
        <EditTaskDetail
          taskId={selectedTaskId || ''}
          projectId={currentProject?.id.toString() || ''}
          isVisible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedTaskId(null);
            setSelectedTask(null);
          }}
          onUpdate={() => {
            setIsModalVisible(false);
            setSelectedTaskId(null);
            setSelectedTask(null);
          }}
          taskTitle={selectedTask.taskName}
          taskDescription={selectedTask.description || ''}
          taskStatus={selectedTask.statusId || ''}
        />
      )}
    </DragDropContext>
  );
};

export default DragAndDropBoard;
