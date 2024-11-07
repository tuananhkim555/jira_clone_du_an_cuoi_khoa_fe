import {  ChevronLast, ChevronFirst, Menu, X } from "lucide-react"
import { useContext, createContext, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import LogoAva from "../../assets/Jira_Logo.svg"
import { FaPlus, FaProjectDiagram, FaExclamationCircle, FaFileAlt, FaCogs, FaUser, FaUserFriends, FaTrello, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { RootState } from "../../redux/store.ts";
import NotificationMessage from "./NotificationMessage";
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true })
import AvatarPage from "../../assets/anhdaidien2.jpg"

interface SidebarProps {
  onMenuClick: React.Dispatch<React.SetStateAction<string>>;
}

export default function Sidebar({ onMenuClick }: SidebarProps) {
  const [expanded, setExpanded] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: "success" | "error" | "info" | "warning", message: string} | null>(null);

  // Lấy thông tin user từ Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 950) {
        setExpanded(true);
        setIsMobileMenuOpen(false);
      } else if (window.innerWidth <= 950 && window.innerWidth >= 750) {
        setExpanded(true);
        setIsMobileMenuOpen(true);
      } else {
        setExpanded(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call it initially

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    onMenuClick(menu);
    let path;
    switch (menu) {
      case 'dashboard':
        path = '/board';
        break;
      case 'create-projects':
        path = '/create';
        break;
      case 'project-management':
        path = '/project';
        break;
      case 'user-management':
        path = '/users-managements';
        break;
      case 'logout':
        if (!notification) { // Only show notification if there isn't one already
          setNotification({
            type: "success",
            message: 'Logout successful!'
          });
          setTimeout(() => {
            setNotification(null);
            navigate('/login');
          }, 1500);
        }
        return;
      default:
        path = `/${menu}`;
    }
    navigate(path);
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <>
      {notification && (
        <NotificationMessage
          type={notification.type}
          message={notification.message}
        />
      )}
      <aside className={`h-screen fixed top-0 left-0 z-30 transition-all duration-300 ease-in-out ${
        window.innerWidth >= 750 ? 'translate-x-0' : isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } ${expanded ? 'w-64' : 'w-20'}`}>
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden absolute -right-12 top-4 p-2 rounded-md bg-[#1f002d] text-white"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>

        <nav className="h-full flex flex-col bg-gradient-to-t from-[#170221] via-purple-950 to-[#170021] text-white shadow-2xl rounded-r-3xl">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src={LogoAva}
              className={`overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
              alt="Logo"
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-purple-200 text-gray-800 shadow-md"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            
            <ul className="flex-1 px-3 pt-10">
              <SidebarItem icon={<FaTrello />} text="Dashboard" active={activeMenu === "dashboard"} onClick={() => handleMenuClick("dashboard")} />
              <SidebarItem icon={<FaPlus />} text="Create Projects" active={activeMenu === "create-projects"} onClick={() => handleMenuClick("create-projects")} />
              <SidebarItem icon={<FaProjectDiagram />} text="Project Management" active={activeMenu === "project-management"} onClick={() => handleMenuClick("project-management")} />
              
              {/* Add a horizontal line with margin */}
              <li className="my-4">
                <hr className="border-purple-800" />
              </li>
              
              <SidebarItem icon={<FaUser />} text="Profile" active={activeMenu === "profile"} onClick={() => handleMenuClick("profile")} />
              <SidebarItem icon={<FaUserFriends />} text="Users Managements" active={activeMenu === "user-management"} onClick={() => handleMenuClick("user-management")} />
              
              {/* Add a horizontal line with margin */}
              <li className="my-4">
                <hr className="border-purple-800" />
              </li>
              
              <SidebarItem icon={<FaFileAlt />} text="Pages" active={activeMenu === "pages"} onClick={() => handleMenuClick("pages")} />
              <SidebarItem icon={<FaExclamationCircle />} text="Help" active={activeMenu === "help"} onClick={() => handleMenuClick("help")} />
              
              {/* Add a horizontal line with margin */}
              <li className="my-4">
                <hr className="border-purple-800" />
              </li>
              
              <SidebarItem icon={<FaCogs />} text="Settings" active={activeMenu === "settings"} onClick={() => handleMenuClick("settings")} />
              <SidebarItem icon={<FaSignOutAlt />} text="Logout" active={activeMenu === "logout"} onClick={() => handleMenuClick("logout")} />
            </ul>
          </SidebarContext.Provider>

          <div className="border-t border-purple-800 flex p-3">
            <img
              src={AvatarPage}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
              style={{
                border: '3px solid transparent',
                backgroundImage: 'linear-gradient(#1f002d, purple), linear-gradient(to right, #4C1D95, #9A3412)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'content-box, border-box',
                borderRadius: '50%',
              }}
            />
            <div
              className={`
                flex justify-between items-center
                overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
            `}
            >
              <div className="leading-4">
                <h4 className="font-semibold text-white">{user?.name || "Guest"}</h4>
                <span className="text-xs text-gray-300">{user?.email || "Not logged in"}</span>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  alert?: boolean;
  onClick: () => void;
}

export function SidebarItem({ icon, text, active, alert, onClick }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext)
  
  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-r from-[#1f002d] to-purple-950 text-white"
            : "hover:bg-gradient-to-r hover:from-[#1f002d] hover:to-purple-950 text-gray-200"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-3 h-2 rounded bg-[#1f002d] ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-gradient-to-r from-[#1f002d] to-purple-950 text-white text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  )
}
