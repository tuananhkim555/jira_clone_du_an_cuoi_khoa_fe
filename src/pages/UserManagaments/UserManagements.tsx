import { useState, useEffect } from 'react';
import { Pagination, Modal, Input, Button, Select } from 'antd';
import { DeleteOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotificationMessage from '../../components/NotificationMessage';
import '../../styles/pagination.css';
import '../../styles/modal.css';
import '../../styles/button.css';
import TitleGradient from '../../components/ui/TitleGradient';
import { FaUserFriends, FaCircle } from 'react-icons/fa';
import Reveal from '../../components/Reveal';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTempUser } from '../../redux/slices/userSlice';
import AnimationSection from '../../components/ui/AnimationSection';
import TextAnimation from '../../components/ui/TextAnimation';
import { RootState } from '../../redux/store';
import { useUserManagementLogic } from './UserManagementsLogic';

const { Option } = Select;

const UserManagement = () => {
  const {
    filteredUsers,
    isLoading,
    error,
    fetchUsers,
    handleDeleteUser,
    handleSearch
  } = useUserManagementLogic();

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(12);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchUsers();
  }, []);

  const showDeleteModal = (userId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setDeleteUserId(userId);
    setIsModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    const success = await handleDeleteUser(deleteUserId);
    if (success) {
      setIsModalVisible(false);
      setDeleteUserId(null);
    }
  };

  const handleSearchClick = () => {
    handleSearch(searchTerm, searchType);
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
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const onPageChange = (page: number) => setCurrentPage(page);

  const handleEditUser = (user: any, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('Selected user in UserManagements:', user);
    dispatch(setTempUser({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber
    }));
    navigate('/profile', { 
      state: { 
        selectedUser: user,
        currentUser: currentUser
      } 
    });
  };

  return (
    <Reveal>
      <div className="container mx-auto mt-4 sm:mt-6 md:mt-8 lg:mt-10 px-4 sm:px-6 py-6 sm:py-8 md:py-10 flex flex-col items-center">
        <AnimationSection>
          <div className="w-full max-w-7xl flex justify-center mb-6 sm:mb-8 md:mb-10">
            <FaUserFriends className='text-xl sm:text-2xl md:text-3xl text-purple-900 mr-2 sm:mr-3 mt-1 sm:mt-[5px]' />
            <TitleGradient>User Management</TitleGradient>
          </div>
        </AnimationSection>
        <div className="w-full max-w-7xl flex justify-center mb-6 sm:mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row items-center w-full max-w-xl relative">
            <Input
              addonBefore={selectBefore}
              placeholder="Enter search term"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow rounded-sm mb-2 sm:mb-0 sm:mr-2"
              suffix={
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearchClick}
                  className="absolute right-0 top-0 bottom-0 z-10 bg-[#36004f] border-[#36004f] hover:bg-[#4b0070] focus:bg-[#36004f] rounded-r-md flex items-center justify-center custom-button custom-button-outline"
                />
              }
            />
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 w-full max-w-7xl">
              {currentUsers.map((user: any) => (
                <div 
                  key={user.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg duration-300 ease-in-out transform hover:scale-105"
                >
                  <img src={user.avatar || 'https://via.placeholder.com/150'} alt={user.name} className="w-full h-24 object-cover" />
                  <div className="p-2">
                    <h2 
                      className="text-sm font-semibold mb-1 text-green-600 truncate flex items-center"
                    >
                      <FaCircle className="text-xs mr-1 text-green-500" />
                      <TextAnimation text={user.name} />                
                    </h2>
                    <p className="text-[#36004f] text-xs mb-1 truncate">
                      <i className="fas fa-envelope mr-1"></i>    
                        {user.email} 
                    </p>
                    <p className="text-gray-600 text-xs mb-1 truncate -ml-[1px]">
                      <i className="fas fa-phone mr-1">Phone:</i>{user.phoneNumber}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-gray-500 text-xs bg-gradient-to-r from-purple-900 to-orange-800 bg-clip-text text-transparent">ID: {user.id}</p>
                      <div>
                        <button
                          onClick={(e) => handleEditUser(user, e)}
                          className="bg-purple-950 text-white p-[3px] py-[1px] rounded-md hover:bg-purple-800 transition duration-300 mr-1"
                        >
                          <EditOutlined />
                        </button>
                        <button
                          onClick={(e) => showDeleteModal(user.id, e)}
                          className="bg-gradient-to-r from-purple-900 to-orange-700 text-white p-[3px] py-[1px] rounded-md hover:from-purple-800 hover:to-orange-600 transition duration-300"
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Pagination
                current={currentPage}
                total={filteredUsers.length}
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
          onOk={handleDeleteConfirm}
          onCancel={() => setIsModalVisible(false)}
          okText="Yes"
          cancelText="No"
          centered
          className='max-w-xs sm:max-w-sm md:max-w-md mb-52 ml-52'
          okButtonProps={{ 
            className: 'bg-purple-900 text-white hover:bg-purple-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-900 focus:ring-opacity-50 custom-button-outline' 
          }}
        >
          <p>Are you sure you want to delete this user?</p>
        </Modal>
      </div>
    </Reveal>
  );
};

export default UserManagement;
