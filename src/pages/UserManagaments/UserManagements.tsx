import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Pagination, Modal, Input, Button, Select } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotificationMessage from '../../components/NotificationMessage';
import '../../styles/pagination.css';
const { Option } = Select;
import '../../styles/modal.css';
import '../../styles/button.css';
import TitleGradient from '../../components/ui/TitleGradient';
import { FaUserFriends } from 'react-icons/fa';
import { FaCircle } from 'react-icons/fa';
import Reveal from '../../components/Reveal';
interface User {
  id: number;
  avatar: string;
  name: string;
  email: string;
  phoneNumber: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://jiranew.cybersoft.edu.vn/';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(12);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/Users/getUser`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
            TokenCybersoft: import.meta.env.VITE_CYBERSOFT_TOKEN,
            Accept: 'application/json'
          }
        });
        const data = response.data as { statusCode: number; content: any[] };
        if (data.statusCode === 200 && Array.isArray(data.content)) {
          setUsers(data.content.map((user: any) => ({
            id: user.userId,
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber
          })));
          console.log('Lấy dữ liệu người dùng thành công!');
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error:', error.response?.data || error.message);
        } else {
          console.error('Error:', error);
        }
        setError('Lấy dữ liệu người dùng thất bại!');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const showDeleteModal = (userId: number) => {
    setDeleteUserId(userId);
    setIsModalVisible(true);
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    try {
      const response = await axios.delete(`${API_URL}/api/Users/deleteUser?id=${deleteUserId}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
          TokenCybersoft: import.meta.env.VITE_CYBERSOFT_TOKEN,
        },
      });

      if (response.status === 200) {
        setUsers(users.filter(user => user.id !== deleteUserId));
        NotificationMessage({ type: 'success', message: 'User deleted successfully' });
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      if (axios.isAxiosError(error)) {
        NotificationMessage({ 
          type: 'error', 
          message: 'Failed to delete user', 
          description: error.response?.data?.message || error.message 
        });
      } else {
        NotificationMessage({ 
          type: 'error', 
          message: 'Failed to delete user', 
          description: 'An unexpected error occurred' 
        });
      }
    } finally {
      setIsModalVisible(false);
      setDeleteUserId(null);
    }
  };

  const handleSearch = () => {
    const filteredUsers = users.filter(user => {
      switch (searchType) {
        case 'name':
          return user.name.toLowerCase().includes(searchTerm.toLowerCase());
        case 'id':
          return user.id.toString().includes(searchTerm);
        case 'phone':
          return user.phoneNumber.includes(searchTerm);
        case 'email':
          return user.email.toLowerCase().includes(searchTerm.toLowerCase());
        default:
          return false;
      }
    });
    setUsers(filteredUsers);
  };

  const selectBefore = (
    <Select 
      defaultValue="name" 
      className="w-24"
      onChange={(value) => setSearchType(value)}
    >
      <Option value="name">Name</Option>
      <Option value="id">ID</Option>
      <Option value="phone">Phone</Option>
      <Option value="email">Email</Option>
    </Select>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <Reveal>
    <div className="container mx-auto mt-10 px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-7xl flex justify-center mb-10">
        <FaUserFriends className='text-3xl text-purple-900 mr-2 mt-[5px]' />
        <TitleGradient>User Management</TitleGradient>
      </div>
      
      <div className="w-full max-w-7xl flex justify-center mb-10">
        <div className="flex flex-row items-center w-full max-w-xl relative">
          <Input
            addonBefore={selectBefore}
            placeholder="Enter search term"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow rounded-smn"
            suffix={
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                className="absolute right-0 top-[-1px] bottom-0 bg-[#36004f] border-[#36004f] hover:bg-[#4b0070] focus:bg-[#36004f] rounded-l-md flex items-center justify-center custom-button custom-button-outline"
              />
            }
          />
        </div>
      </div>

      {users.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full max-w-7xl">
            {currentUsers.map((user: User) => (
              <div key={user.id} className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                <img src={user.avatar || 'https://via.placeholder.com/150'} alt={user.name} className="w-full h-24 object-cover" />
                <div className="p-2">
                  <h2 className="text-sm font-semibold mb-1 text-green-600 truncate flex items-center">
                    <FaCircle className="text-xs mr-1 text-green-500" />
                    {user.name}
                  </h2>
                  <p className="text-gray-600 text-xs mb-1 truncate">
                    <i className="fas fa-envelope mr-1"></i>{user.email}
                  </p>
                  <p className="text-gray-600 text-xs mb-1 truncate">
                    <i className="fas fa-phone mr-1"></i>{user.phoneNumber}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-500 text-xs">ID: {user.id}</p>
                    <button
                      onClick={() => showDeleteModal(user.id)}
                      className="bg-gradient-to-r from-purple-900 to-orange-700 text-white p-[3px] py-[1px] rounded-md hover:from-purple-800 hover:to-orange-600 transition duration-300"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Pagination
              current={currentPage}
              total={users.length}
              pageSize={usersPerPage}
              onChange={onPageChange}
              showSizeChanger={false}
              className='pagination-container'
            />
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600">No users found.</div>
      )}
      
      <Modal
        title="Confirm Delete"
        visible={isModalVisible}
        onOk={handleDeleteUser}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes"
        cancelText="No"
        centered
        okButtonProps={{ 
          className: 'bg-purple-900 text-white hover:bg-purple-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-900 focus:ring-opacity-50 modal-button modal-button-danger modal-button-secondary' 
        }}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
    </Reveal>
  );
};

export default UserManagement;
