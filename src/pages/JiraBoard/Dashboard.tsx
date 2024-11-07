import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Timeline } from 'antd';
import { UserOutlined, ProjectOutlined, CheckCircleOutlined, ClockCircleOutlined, PlusOutlined, DeleteOutlined, HistoryOutlined, TeamOutlined, FundProjectionScreenOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { getAllUsers } from '../../common/api/api';
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
      className="p-4 min-h-screen max-w-[1400px] mx-auto mt-14"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card hoverable className="shadow-md cursor-pointer bg-gradient-to-r from-[#1c0035] to-[#330067]" onClick={handleProjectClick}>
              <Statistic
                title={<span className="text-white">Total Projects</span>}
                value={12}
                prefix={<ProjectOutlined className="text-white" />}
                valueStyle={{ color: 'white', fontSize: '1.2rem' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card hoverable className="shadow-md bg-gradient-to-r from-[#2b0054] to-purple-950">
              <Statistic
                title={<span className="text-white">Active Users</span>}
                value={808}
                prefix={<UserOutlined className="text-white" />}
                valueStyle={{ color: 'white', fontSize: '1.2rem' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card hoverable className="shadow-md bg-gradient-to-r from-[#350067] to-orange-800">
              <Statistic
                title={<span className="text-white">Completed Tasks</span>}
                value={45}
                prefix={<CheckCircleOutlined className="text-white" />}
                valueStyle={{ color: 'white', fontSize: '1.2rem' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card hoverable className="shadow-md bg-gradient-to-r from-orange-800 to-orange-950">
              <Statistic
                title={<span className="text-white">Pending Tasks</span>}
                value={8}
                prefix={<ClockCircleOutlined className="text-white" />}
                valueStyle={{ color: 'white', fontSize: '1.2rem' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={[12, 12]} className="mt-4">
        <Col xs={24} lg={14}>
          <motion.div variants={itemVariants}>
            <Card 
              title={
                <div className="flex items-center">
                  <HistoryOutlined className="text-purple-950 text-lg mr-2" />
                  <span className="bg-gradient-to-r from-purple-950 to-orange-800 bg-clip-text text-transparent">
                    Recent Activities
                  </span>
                </div>
              } 
              className="shadow-md" 
              size="small"
            >
              <Timeline>
                <Timeline.Item color="green">Project A created</Timeline.Item>
                <Timeline.Item color="blue">New task assigned to John</Timeline.Item>
                <Timeline.Item color="red">Bug reported in Project B</Timeline.Item>
                <Timeline.Item>Task completed by Sarah</Timeline.Item>
              </Timeline>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} lg={10}>
          <motion.div variants={itemVariants}>
            <Card 
              title={
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <TeamOutlined className="text-purple-950 text-lg mr-2" />
                    <span className="bg-gradient-to-r from-purple-950 to-orange-800 bg-clip-text text-transparent">
                      Team Members
                    </span>
                  </div>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-950 cursor-pointer hover:bg-purple-800">
                    <PlusOutlined className="text-white text-sm" />
                  </div>
                </div>
              } 
              className="shadow-md" 
              size="small"
            >
              <List
                itemLayout="horizontal"
                dataSource={users.slice(0, 5)}
                renderItem={(user: User) => (
                  <List.Item className="flex justify-between items-center">
                    <List.Item.Meta 
                      avatar={<Avatar size="small" icon={<UserOutlined />} />}
                      title={<div className="mr-8">{user.name}</div>}
                      description={<div className="mr-8 text-orange-700">{user.email}</div>}
                      className="min-w-0"
                    />
                    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-900 to-orange-700 cursor-pointer hover:opacity-80">
                      <DeleteOutlined className="text-white text-sm" />
                    </div>
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
            <Card 
              title={
                <div className="flex items-center">
                  <FundProjectionScreenOutlined className="text-purple-950 text-lg mr-2" />
                  <span className="bg-gradient-to-r from-purple-950 to-orange-800 bg-clip-text text-transparent">
                    Project Progress
                  </span>
                </div>
              } 
              className="shadow-md" 
              size="small"
            >
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={8}>
                  <Progress type="circle" className='text-purple-950' percent={75} size={80} />
                  <p className="text-center mt-2 text-sm text-purple-950">Project A</p>
                </Col>
                <Col xs={24} sm={8}>
                  <Progress type="circle" className='text-purple-950' percent={45} status="active" size={80} />
                  <p className="text-center mt-2 text-sm text-purple-950">Project B</p>
                </Col>
                <Col xs={24} sm={8}>
                  <Progress type="circle" className='text-purple-950' percent={90} strokeColor="#52c41a" size={80} />
                  <p className="text-center mt-2 text-sm text-purple-950">Project C</p>
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
