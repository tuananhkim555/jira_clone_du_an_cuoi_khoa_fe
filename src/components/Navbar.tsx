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
    { icon: FaSignOutAlt, label: "Logout" },
    { icon: FaQuestion, label: "About" },
  ];

  const handleItemClick = (label: string) => {
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
      className={`
        navbar
        flex ${isMobileOrTablet ? 'flex-row' : 'flex-col'} 
        justify-between 
        ${isMobileOrTablet ? 'w-full h-16' : `h-screen ${isExpanded ? 'w-56' : 'w-16'}`} 
        fixed 
        ${isMobileOrTablet ? 'top-0 left-0 right-0' : 'left-0 top-0'} 
        transition-all duration-300 ease-in-out
        z-50
        bg-[#280042]
      `}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => !isMobileOrTablet && setIsExpanded(true)}
      onMouseLeave={() => !isMobileOrTablet && setIsExpanded(false)}
    >
      <div className={`flex ${isMobileOrTablet ? 'flex-row justify-between w-full px-4' : 'flex-col'} items-center`}>
        {/* Jira logo */}
        <div 
          className={`
            ${isMobileOrTablet ? 'order-2' : 'w-full h-32'} 
            flex items-center justify-center cursor-pointer
          `}
        >
          <FaJira className={`text-white ${isMobileOrTablet ? 'text-2xl' : 'text-5xl'}`} />
        </div>

        {/* Search for desktop */}
        {!isMobileOrTablet && (
          <div 
            className={`
              flex items-center text-white 
              h-14 w-full mt-8
              cursor-pointer 
              ${activeItem === "Search" ? 'bg-purple-800' : 'hover:bg-purple-800'}
              transition-colors duration-200
            `}
            onClick={() => handleItemClick("Search")}
          >
            <div className="flex justify-center w-16">
              <FaSearch className="text-xl" />
            </div>
            {isExpanded && (
              <span className="ml-3 text-sm text-white">Search</span>
            )}
          </div>
        )}
      </div>

      {/* Bottom icons: Logout and About */}
      {isMobileOrTablet ? (
        <div className="order-3 flex items-center">
          {/* Search for mobile/tablet */}
          <div 
            className={`
              flex items-center justify-center text-white 
              px-4 h-full
              cursor-pointer 
              ${activeItem === "Search" ? 'bg-purple-950' : 'hover:bg-purple-800'}
              transition-colors duration-200
            `}
            onClick={() => handleItemClick("Search")}
          >
            <FaSearch className="text-xl" />
          </div>
          {navItems.map((item, index) => (
            <div 
              key={index} 
              className={`
                flex items-center justify-center text-white 
                px-4 h-full
                cursor-pointer 
                ${activeItem === item.label ? 'bg-purple-950' : 'hover:bg-purple-800'}
                transition-colors duration-200
              `}
              onClick={() => handleItemClick(item.label)}
            >
              <item.icon className="text-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-6">
          {navItems.map((item, index) => (
            <div 
              key={index} 
              className={`
                flex items-center text-white 
                h-14 w-full
                cursor-pointer 
                ${activeItem === item.label ? 'bg-purple-950' : 'hover:bg-purple-800'}
                transition-colors duration-200
              `}
              onClick={() => handleItemClick(item.label)}
            >
              <div className="flex justify-center w-16">
                <item.icon className="text-xl" />
              </div>
              {isExpanded && (
                <span className="ml-3 text-sm text-white">{item.label}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Navbar;
