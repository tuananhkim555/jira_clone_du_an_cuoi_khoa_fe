import { Modal, Form, Input, InputNumber, Button, Slider, notification } from 'antd';
import { useState, useEffect } from 'react';
import { getTaskDetail } from '../../../api/api';
import CustomSelect from '../../../components/CustomSelect';
import { getAllStatuses, getAllPriorities, getAllTaskTypes, getAllUsers } from '../../../api/api';

interface EditProjectDetailProps {
  taskId: string;
}

interface TaskDetail {
  projectName: string;
  taskName: string;
  priorityTask?: {
    priorityId: number;
  };
  taskTypeDetail?: {
    id: number;
  };
  statusId: number;
  assigness?: {
    id: number;
  }[];
  originalEstimate: number;
  timeTrackingSpent: number;
  timeTrackingRemaining: number;
}

interface Status {
  statusId: number;
  statusName: string;
}

interface Priority {
  priorityId: number;
  priority: string;
}

interface TaskType {
  id: number;
  taskType: string;
}

interface User {
  userId: number;
  name: string;
}

const EditProjectDetail: React.FC<EditProjectDetailProps> = ({ taskId }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [timeTracking, setTimeTracking] = useState(0);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [statusesRes, prioritiesRes, taskTypesRes, usersRes] = await Promise.all([
          getAllStatuses(),
          getAllPriorities(),
          getAllTaskTypes(),
          getAllUsers(),
        ]);
        setStatuses((statusesRes.data as any).content);
        setPriorities((prioritiesRes.data as any).content);
        setTaskTypes((taskTypesRes.data as any).content);
        setAllUsers((usersRes.data as any).content);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch task details
  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        const response = await getTaskDetail(Number(taskId));
        const detail = (response.data as any).content as TaskDetail;
        console.log('Task detail received:', detail);
        
        setTaskDetail(detail);
        
        // Update form with task details
        form.setFieldsValue({
          projectName: detail.projectName,
          taskName: detail.taskName,
          priorityId: detail.priorityTask?.priorityId,
          typeId: detail.taskTypeDetail?.id,
          statusId: detail.statusId,
          listUserAsign: detail.assigness?.map(user => user.id),
          originalEstimate: detail.originalEstimate,
          timeTrackingSpent: detail.timeTrackingSpent,
          timeTrackingRemaining: detail.timeTrackingRemaining,
        });
        
        // Update time tracking
        const spent = detail.timeTrackingSpent || 0;
        const remaining = detail.timeTrackingRemaining || 0;
        const total = spent + remaining;
        setTimeTracking(total > 0 ? (spent / total) * 100 : 0);
      } catch (error) {
        console.error('Error fetching task detail:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to load task details',
        });
      } finally {
        setLoading(false);
      }
    };

    if (isModalOpen && taskId) {
      fetchTaskDetail();
    }
  }, [taskId, isModalOpen, form]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal 
      title="Task Details" 
      open={isModalOpen}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="close" onClick={handleCancel}>
          Close
        </Button>
      ]}
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Form form={form} layout="vertical">
          <div className="flex space-x-2">
            <Form.Item name="projectName" label="Project Name" className="flex-1">
              <Input disabled />
            </Form.Item>
            <Form.Item name="taskName" label="Task Name" className="flex-1">
              <Input disabled />
            </Form.Item>
          </div>

          <div className="flex space-x-2">
            <Form.Item name="priorityId" label="Priority" className="flex-1">
              <CustomSelect
                options={priorities.map(p => ({ 
                  value: p.priorityId, 
                  label: p.priority 
                }))}
                placeholder="Select priority"
                isDisabled={true}
              />
            </Form.Item>
            <Form.Item name="typeId" label="Task Type" className="flex-1">
              <CustomSelect
                options={taskTypes.map(type => ({ 
                  value: type.id, 
                  label: type.taskType 
                }))}
                placeholder="Select task type"
                isDisabled={true}
              />
            </Form.Item>
          </div>

          <Form.Item name="statusId" label="Status">
            <CustomSelect
              options={statuses.map(s => ({ 
                value: s.statusId, 
                label: s.statusName 
              }))}
              placeholder="Select status"
              isDisabled={true}
            />
          </Form.Item>

          <Form.Item name="listUserAsign" label="Assignees">
            <CustomSelect
              options={allUsers.map(user => ({ 
                value: user.userId, 
                label: user.name 
              }))}
              placeholder="Select assignees"
              isMulti={true}
              isDisabled={true}
            />
          </Form.Item>

          <div className="flex space-x-2">
            <Form.Item name="originalEstimate" label="Original Estimate" className="flex-1">
              <InputNumber disabled style={{ width: '100%' }} />
            </Form.Item>
            <div className="flex-1">
              <Form.Item label="Time Tracking">
                <Slider value={timeTracking} disabled />
                <div className="flex justify-between text-xs mt-1">
                  <span>{form.getFieldValue('timeTrackingSpent') || 0}h logged</span>
                  <span>{form.getFieldValue('timeTrackingRemaining') || 0}h remaining</span>
                </div>
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default EditProjectDetail;
