import { useState, useEffect } from "react";
import { FaJira, FaQuestion, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { message } from "antd"; // Import message từ antd
import NotificationMessage from '../components/NotificationMessage';

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Áp dụng animation cho tất cả các thông báo Ant Design
    const style = document.createElement('style');
    style.textContent = `
      .ant-message-notice-content {
        animation: slide-in 0.5s forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const navItems = [
    { icon: FaSearch, label: "Search" },
    { icon: FaSignOutAlt, label: "Logout" },
    { icon: FaQuestion, label: "About" },
  ];

  const handleItemClick = (label: string) => {
    setIsExpanded(true);
    setActiveItem(activeItem === label ? null : label);

    if (label === "Logout") {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    NotificationMessage({ type: 'success', message: 'Đăng xuất thành công' });
    
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (!(e.target instanceof HTMLElement) || !e.target.closest('.navbar')) {
      setIsExpanded(false);
    }
  };
  useEffect(() => {
    const handleOutsideClickWrapper = (e: MouseEvent) => handleOutsideClick(e as unknown as React.MouseEvent);
    document.addEventListener('click', handleOutsideClickWrapper);
    return () => {
      document.removeEventListener('click', handleOutsideClickWrapper);
    };
  }, []);

  return (
    <div 
      className={`flex flex-col justify-between h-screen bg-purple-950 fixed left-0 top-0 transition-all duration-300 ${isExpanded ? 'w-48' : 'w-16'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={isMobileOrTablet ? 'mt-8' : ''}>
        {/* Jira logo and Search */}
        <div className="flex flex-col items-center">
          <div className="w-full h-32 flex items-center justify-center cursor-pointer"
               onClick={() => setIsExpanded(!isExpanded)}>
            <FaJira className="text-white text-4xl mt-4" />
          </div>
          <div 
            className={`flex items-center text-white h-16 cursor-pointer ${isExpanded ? '' : 'justify-center'} ${activeItem === "Search" ? 'bg-purple-800' : ''}`}
            onClick={() => handleItemClick("Search")}
          >
            <div className={`flex justify-center ${isExpanded ? 'w-16' : 'w-full'}`}>
              <FaSearch className="text-lg" />
            </div>
            {isExpanded && (
              <span className="ml-2 text-sm text-white">Search</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom icons: Logout and About */}
      <div className="mb-4">
        {navItems.slice(1).map((item, index) => (
          <div 
            key={index} 
            className={`flex items-center text-white h-16 cursor-pointer ${isExpanded ? '' : 'justify-center'} ${activeItem === item.label ? 'bg-purple-800' : ''}`}
            onClick={() => handleItemClick(item.label)}
          >
            <div className={`flex justify-center ${isExpanded ? 'w-16' : 'w-full'}`}>
              <item.icon className="text-lg" />
            </div>
            {isExpanded && (
              <span className="ml-2 text-sm text-white">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
