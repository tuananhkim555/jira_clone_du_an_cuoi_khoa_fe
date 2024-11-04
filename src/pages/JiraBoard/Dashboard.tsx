import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Timeline } from 'antd';
import { UserOutlined, ProjectOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { getAllUsers } from '../../api/api';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        const data = response.data as { content: User[] };
        setUsers(data.content);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const handleProjectClick = () => {
    navigate('/project');
  };

  return (
    <motion.div 
      className="p-4 bg-gray-100 min-h-screen max-w-[1400px] mx-auto mt-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card hoverable className="shadow-sm cursor-pointer" onClick={handleProjectClick}>
              <Statistic
                title={<span className="text-[#3f8600]">Total Projects</span>}
                value={12}
                prefix={<ProjectOutlined />}
                valueStyle={{ color: '#3f8600', fontSize: '1.2rem' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card hoverable className="shadow-sm">
              <Statistic
                title={<span className="text-[#1890ff]">Active Users</span>}
                value={users.length}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff', fontSize: '1.2rem' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card hoverable className="shadow-sm">
              <Statistic
                title={<span className="text-[#52c41a]">Completed Tasks</span>}
                value={45}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a', fontSize: '1.2rem' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card hoverable className="shadow-sm">
              <Statistic
                title={<span className="text-[#d79803]">Pending Tasks</span>}
                value={8}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#d79803', fontSize: '1.2rem' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={[12, 12]} className="mt-4">
        <Col xs={24} lg={16}>
          <motion.div variants={itemVariants}>
            <Card title="Recent Activities" className="shadow-sm" size="small">
              <Timeline>
                <Timeline.Item color="green">Project A created</Timeline.Item>
                <Timeline.Item color="blue">New task assigned to John</Timeline.Item>
                <Timeline.Item color="red">Bug reported in Project B</Timeline.Item>
                <Timeline.Item>Task completed by Sarah</Timeline.Item>
              </Timeline>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} lg={8}>
          <motion.div variants={itemVariants}>
            <Card title="Team Members" className="shadow-sm" size="small">
              <List
                itemLayout="horizontal"
                dataSource={users.slice(0, 5)}
                renderItem={(user: User) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar size="small" icon={<UserOutlined />} />}
                      title={user.name}
                      description={user.email}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={[12, 12]} className="mt-4">
        <Col xs={24}>
          <motion.div variants={itemVariants}>
            <Card title="Project Progress" className="shadow-sm" size="small">
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={8}>
                  <Progress type="circle" percent={75} size={80} />
                  <p className="text-center mt-2 text-sm">Project A</p>
                </Col>
                <Col xs={24} sm={8}>
                  <Progress type="circle" percent={45} status="active" size={80} />
                  <p className="text-center mt-2 text-sm">Project B</p>
                </Col>
                <Col xs={24} sm={8}>
                  <Progress type="circle" percent={90} strokeColor="#52c41a" size={80} />
                  <p className="text-center mt-2 text-sm">Project C</p>
                </Col>
              </Row>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Dashboard;
