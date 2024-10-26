import React from 'react';
import { Form, Input, InputNumber, Button, Slider } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';
import CustomSelect from '../../../components/CustomSelect';
import { useCreateTaskLogic } from './CreateTaskLogic';

interface CreateTaskModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onCreate: (taskData: any) => void;
  currentProject: any;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isVisible,
  onCancel,
  onCreate,
  currentProject,
}) => {
  const {
    form,
    statuses,
    priorities,
    taskTypes,
    allUsers,
    timeTracking,
    description,
    handleCreate,
    handleEditorChange,
    handleTimeSpentChange,
    handleTimeRemainingChange,
    handleSliderChange,
  } = useCreateTaskLogic(isVisible, currentProject, onCancel, onCreate);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full bg-white shadow-lg z-[9999] flex flex-col"
          style={{ width: 'min(90vw, 600px)', height: '100vh' }}
        >
          <div className="p-4 flex-grow overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-purple-950">Create Task for - {currentProject?.projectName}</h2>
            <Form form={form} layout="vertical" onFinish={handleCreate}>
              <div className="flex space-x-2 mb-[-10px]">
                <Form.Item name="projectName" label="Project" className="flex-1">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="taskName" label="Task Name" className="flex-1" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </div>
              <div className="flex space-x-2 mb-[-10px]">
                <Form.Item name="priorityId" label="Priority" className="flex-1" rules={[{ required: true }]}>
                  <CustomSelect
                    options={priorities.map(p => ({ value: p.priorityId, label: p.priority }))}
                    placeholder="Select priority"
                    value={form.getFieldValue('priorityId')}
                    onChange={(value) => form.setFieldsValue({ priorityId: value })}
                  />
                </Form.Item>
                <Form.Item name="typeId" label="Task Type" className="flex-1" rules={[{ required: true }]}>
                  <CustomSelect
                    options={taskTypes.map(type => ({ value: type.id, label: type.taskType }))}
                    placeholder="Select task type"
                    value={form.getFieldValue('typeId')}
                    onChange={(value) => form.setFieldsValue({ typeId: value })}
                  />
                </Form.Item>
              </div>
              <Form.Item name="statusId" label="Status" rules={[{ required: true }]}>
                <CustomSelect
                  options={statuses.map(s => ({ value: s.statusId, label: s.statusName }))}
                  placeholder="Select status"
                  value={form.getFieldValue('statusId')}
                  onChange={(value) => form.setFieldsValue({ statusId: value })}
                />
              </Form.Item>
              <div className="flex space-x-2">
                <div className="flex-1 space-y-2 mb-[-10px]">
                  <Form.Item name="listUserAsign" label="Assignees">
                    <CustomSelect
                      options={allUsers.map(user => ({ value: user.userId, label: user.name }))}
                      placeholder="Select assignees"
                      mode="multiple"
                      value={form.getFieldValue('listUserAsign')}
                      onChange={(value) => form.setFieldsValue({ listUserAsign: value })}
                    />
                  </Form.Item>
                  <Form.Item name="originalEstimate" label="Original Estimate" initialValue={0}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </div>
                <div className="flex-1 space-y-2 mb-[-10px]">
                  <Form.Item label="Time Tracking">
                    <div className="flex items-center">
                      <Slider
                        value={timeTracking}
                        onChange={handleSliderChange}
                        className="flex-grow mr-2"
                      />
                      <span className="text-sm font-medium">{Math.round(timeTracking)}%</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>{form.getFieldValue('timeTrackingSpent') || 0}h logged</span>
                      <span>{form.getFieldValue('timeTrackingRemaining') || 0}h remaining</span>
                    </div>
                  </Form.Item>
                  <div className="flex space-x-2" style={{ marginTop: '-8px' }}>
                    <Form.Item name="timeTrackingSpent" initialValue={0} className="flex-1">
                        <div className="text-[12px] mb-[5px]">
                            Time spent
                        </div>
                      <InputNumber min={0} style={{ width: '100%' }} onChange={handleTimeSpentChange} formatter={value => `${value}`.padStart(1, '0')} />
                    </Form.Item>
                    <Form.Item name="timeTrackingRemaining" initialValue={0} className="flex-1"> 
                        <div className="text-[12px] mb-[5px]">
                        Time remaining
                    </div>
                      <InputNumber min={0} style={{ width: '100%' }} onChange={handleTimeRemainingChange} formatter={value => `${value}`.padStart(1, '0')} />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <Form.Item label="Description">
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                  init={{
                    height: 300,
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
              <Form.Item>
                <Button type="primary" htmlType="submit" className="custom-button-outline">
                  Create Task
                </Button>
                <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;
