import {  ChevronLast, ChevronFirst, Menu, X } from "lucide-react"
import { useContext, createContext, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import LogoAva from "../assets/Jira_Logo.svg"
import { FaTrello, FaPlus, FaProjectDiagram, FaExclamationCircle, FaFileAlt, FaCogs, FaUser, FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { RootState } from "../redux/store.ts";
import { clearUser, setUser } from "../redux/store.ts"; // Assuming you have a clearUser and setUser action in your store
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true })
import AvatarPage from "../assets/anhdaidien2.jpg"

interface SidebarProps {
  onMenuClick: React.Dispatch<React.SetStateAction<string>>;
}

export default function Sidebar({ onMenuClick }: SidebarProps) {
  const [expanded, setExpanded] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const dispatch = useDispatch();
  
  // Lấy thông tin user từ Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user && isAuthenticated) {
      console.log("User from Redux");
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      console.log("No user data in Redux store or user is not authenticated");
      // If user is not authenticated, redirect to login page
    }
  }, [user, isAuthenticated, navigate]);

  useEffect(() => {
    // Check token expiration
    const checkTokenExpiration = () => {
      const token = user?.accessToken;
      if (token) {
        // Implement your token expiration check logic here
        // For example, you can decode the token and check its expiration time
        // If token is expired, clear the user data
        if (isTokenExpired(token)) {
          dispatch(clearUser());
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [user, dispatch, navigate]);

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
      case 'kanban':
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
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-[13px] left-16 z-50 p-2 rounded-md bg-[#280042] text-white"
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>
      <aside className={`h-screen fixed top-0 left-0 z-30 transition-all duration-300 ease-in-out ${
        window.innerWidth >= 750 ? 'translate-x-0' : isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } ${expanded ? 'w-64' : 'w-20'} lg:ml-[65px] pt-[60px] lg:pt-0`}>
        <nav className="h-full flex flex-col bg-gray-50 border-r shadow-xl rounded-r-3xl">
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
              className="p-1.5 rounded-lg bg-[#310051] hover:bg-purple-900 text-white shadow-md"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            
            <ul className="flex-1 px-3 pt-10">
              <SidebarItem icon={<FaTrello />} text="Kanban Board" active={activeMenu === "kanban"} onClick={() => handleMenuClick("kanban")} />
              <SidebarItem icon={<FaPlus />} text="Create Projects" active={activeMenu === "create-projects"} onClick={() => handleMenuClick("create-projects")} />
              <SidebarItem icon={<FaProjectDiagram />} text="Project Management" active={activeMenu === "project-management"} onClick={() => handleMenuClick("project-management")} />
              
              {/* Add a horizontal line with margin */}
              <li className="my-4">
                <hr className="border-gray-300" />
              </li>
              
              <SidebarItem icon={<FaUser />} text="Profile" active={activeMenu === "profile"} onClick={() => handleMenuClick("profile")} />
              <SidebarItem icon={<FaUserFriends />} text="Users Managements" active={activeMenu === "user-management"} onClick={() => handleMenuClick("user-management")} />
              
              {/* Add a horizontal line with margin */}
              <li className="my-4">
                <hr className="border-gray-300" />
              </li>
              
              <SidebarItem icon={<FaFileAlt />} text="Pages" active={activeMenu === "pages"} onClick={() => handleMenuClick("pages")} />
              <SidebarItem icon={<FaExclamationCircle />} text="Help" active={activeMenu === "help"} onClick={() => handleMenuClick("help")} />
              <SidebarItem icon={<FaCogs />} text="Settings" active={activeMenu === "settings"} onClick={() => handleMenuClick("settings")} />
            </ul>
          </SidebarContext.Provider>

          <div className="border-t flex p-3">
            <img
              src={AvatarPage}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
              style={{
                border: '3px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #4C1D95, #9A3412)',
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
                <h4 className="font-semibold">{user?.name || "Guest"}</h4>
                <span className="text-xs text-gray-600">{user?.email || "Not logged in"}</span>
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
            ? "bg-[#310051] text-white"
            : "hover:bg-gradient-to-r hover:bg-purple-950  hover:text-white text-gray-600"
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
          className={`absolute right-2 w-3 h-2 rounded bg-purple-900 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-purple-800 text-sm
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

// Helper function to check if token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Assume token is expired if there's an error
  }
}
