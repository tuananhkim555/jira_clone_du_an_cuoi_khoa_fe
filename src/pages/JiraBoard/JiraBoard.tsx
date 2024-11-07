import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProjects, fetchProjectDetails, fetchAllData, createNewTask, ProjectDetails } from './JiraBoardLogic';
import { FaLeaf } from 'react-icons/fa';
import TextGradient from '../../common/components/ui/TitleGradient';
import { Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined, UserOutlined, FolderOutlined, CrownOutlined } from '@ant-design/icons';
import AnimationSection from '../../common/components/ui/AnimationSection';
import TextAnimation from '../../common/components/ui/TextAnimation';
import Reveal from '../../common/components/Reveal';
import DragAndDropBoard from './DragDrop/DragAndDropBoard';
import CreateTaskModal from './CreateTask/CreateTaskModal';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import NotificationMessage from '../../common/components/NotificationMessage';
import EditTaskDetail from './EditTaskDetail/EditTaskDetail';
import  Footer  from '../Footer/Footer';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface Task {
  taskId: any;
  id: string;
  taskName: string;
  content: string;
  assignees: Array<{
    id: number;
    name: string;
    avatar: string;
  }>;
  priority?: {
    priorityId: number;
    priority: string;
    priorityName: string;
  };
  priorityTask?: any;
  statusId: string;
  originalEstimate?: number;
  timeTrackingSpent?: number;
  timeTrackingRemaining?: number;
  description?: string;
  typeId?: number;
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

interface EditProjectDetailProps {
  taskId: string;
}

const statusColors: { [key: string]: string } = {
  '1': 'bg-[#300053]',
  '2': 'from-[#320053] to-purple-950',
  '3': 'from-purple-950 to-orange-700',
  '4': 'from-orange-700 to-orange-900',
};

const getColumnColor = (statusId: string): string => {
  return statusColors[statusId] || 'bg-white';
};

const initialColumns: { [key: string]: Column } = {
  todo: {
    id: 'backlog',
    title: 'BACKLOG',
    tasks: [{
      id: 'abc', taskName: 'abc', content: 'abc', statusId: '1',
      taskId: '12714',
    }],
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
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

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
          setCurrentProject({
            id: details.id,
            projectName: details.projectName
          });
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
      if (newTaskContent && currentProject?.id) {
        const updatedProject = await fetchProjectDetails(currentProject.id.toString());
        if (updatedProject) {
          updateColumnsFromProject(updatedProject);
        }
        setIsModalVisible(false);
        NotificationMessage({ type: 'success', message: 'Task created successfully!' });
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      if (currentProject) {
        const updatedProject = await fetchProjectDetails(currentProject.id.toString());
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
        tasks: status.lstTaskDeTail.map((task: any) => {
          console.log('Processing task:', task);
          
          return {
            id: task.taskId || task.id,
            taskId: task.taskId || task.id,
            taskName: task.taskName,
            content: task.taskName,
            assignees: Array.isArray(task.assigness) ? task.assigness.map((assignee: any) => ({
              id: assignee.id,
              name: assignee.name,
              avatar: assignee.avatar
            })) : [],
            priority: {
              priorityId: task.priorityTask?.priorityId || task.priority?.priorityId,
              priority: task.priorityTask?.priority || task.priority?.priority,
              description: task.priorityTask?.description || task.priority?.description
            },
            statusId: status.statusId,
            originalEstimate: task.originalEstimate,
            timeTrackingSpent: task.timeTrackingSpent,
            timeTrackingRemaining: task.timeTrackingRemaining,
            description: task.description,
            typeId: task.typeId
          };
        }),
        color: getColumnColor(status.statusId)
      };
    });
    
    console.log('Updated columns:', newColumns);
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

  const handleTaskClick = (taskId: string) => {
    let foundTask: Task | null = null;
    Object.values(columns).some(column => {
      const task = column.tasks.find(t => 
        (t.taskId?.toString() || t.id?.toString()) === taskId
      );
      if (task) {
        foundTask = task;
        return true;
      }
      return false;
    });

    if (foundTask) {
      console.log('Found task for edit:', foundTask);
      setSelectedTaskForEdit({
        ...foundTask,
        assignees: foundTask.assignees || []
      });
      setIsEditModalVisible(true);
    }
  };

  const handleTaskUpdate = async () => {
    try {
      if (!projectId) return;
      
      // Fetch updated project details
      const updatedProject = await fetchProjectDetails(projectId);
      if (updatedProject) {
        setProjectDetails(updatedProject);
        // Update columns with new data
        const updatedColumns = updatedProject.lstTask.reduce((acc, status) => {
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
    } catch (error) {
      console.error('Error refreshing project details:', error);
    }
  };

  return (
    <>
    <div className="min-h-screen p-3 md:p-10 mt-12 lg:mt-10 flex flex-col">
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
            <Button type="primary" className='custom-button-outline py-5 px-6 rounded-3xl text-lg font-semibold' onClick={showModal} icon={<PlusOutlined />}>
              Create Task
            </Button>
          </div>
          </Reveal>
        </div>
        {projectDetails && (
          <div className="max-w-6xl mx-auto mb-6">
            <div className="flex flex-wrap items-center gap-4  p-2 ">
              <div className="flex items-center">
                <span className="font-semibold text-gray-600 text-sm flex items-center">
                  <CrownOutlined className="mr-1" />
                  Title:
                </span>
                <h2 className="text-lg font-semibold ml-2 text-purple-900">
                  <TextAnimation text={projectDetails.projectName} />
                </h2>
              </div>

              <div className="flex items-center">
                <span className="font-semibold text-gray-600 text-sm flex items-center">
                  <UserOutlined className="mr-1" />
                  Creator:
                </span>
                <p className="ml-2 text-gray-800 text-[16px]">{projectDetails.creator.name}</p>
              </div>

              <div className="flex items-center">
                <span className="font-semibold text-gray-600 text-sm flex items-center">
                  <FolderOutlined className="mr-1" />
                  Category:
                </span>
                <p className="ml-2 text-gray-800 text-[16px]">{projectDetails.projectCategory.name}</p>
              </div>
            </div>
          </div>
        )}
        <Reveal>
          <DragAndDropBoard 
            columns={columns} 
            setColumns={setColumns as React.Dispatch<React.SetStateAction<{ [key: string]: Column }>>}
            onTaskClick={handleTaskClick}
          />
        </Reveal>
        {selectedTaskForEdit && (
          <EditTaskDetail
              taskId={selectedTaskForEdit.id?.toString() || ''}
              projectId={currentProject?.id.toString() || ''}
              isVisible={isEditModalVisible}
              onClose={() => {
                setIsEditModalVisible(false);
                setSelectedTaskForEdit(null);
              } }
              onUpdate={handleTaskUpdate}
              taskTitle={selectedTaskForEdit.taskName}
              taskDescription={selectedTaskForEdit.description || ''}
              taskStatus={selectedTaskForEdit.statusId || ''}
              taskPriority={selectedTaskForEdit.priority?.priorityId?.toString() || ''}
              assignees={selectedTaskForEdit.assignees || []}
          />
        )}
      </div>
      <CreateTaskModal
        isVisible={isModalVisible}
        onCancel={handleCancel}
        onCreate={handleCreate}
        currentProject={currentProject}
      />
    </div>
    <Footer />
    </>
  );
};

export default JiraBoard;
