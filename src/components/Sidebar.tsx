import { useEffect, useState } from 'react';
import LogoAva from "../assets/Logo Jira 5.png"
import { FaTrello, FaPlus, FaProjectDiagram, FaRocket, FaExclamationCircle, FaFileAlt, FaCogs, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  onMenuClick: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [screenSize, setScreenSize] = useState('desktop');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setScreenSize('mobile');
            } else if (window.innerWidth < 1024) {
                setScreenSize('tablet');
            } else {
                setScreenSize('desktop');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
        if (screenSize !== 'desktop') {
            setIsOpen(false);
        }
        // Navigate to the corresponding route
        switch (menu) {
            case 'kanban':
                navigate('/kanban');
                break;
            case 'create-projects':
                navigate('/create');
                break;
            case 'project-management':
                navigate('/project');
                break;
            case 'releases':
                navigate('/releases');
                break;
            case 'issues':
                navigate('/issues');
                break;
            case 'pages':
                navigate('/pages');
                break;
            case 'components':
                navigate('/components');
                break;
            default:
                navigate('/');
        }
        onMenuClick(menu);
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const sidebarContent = (
        <>
            <div className="flex items-center justify-center mb-8">
                <img src={LogoAva} alt="Avatar" className="w-16 h-16 rounded-full" />
                <div className="ml-4 text-gray-700">
                    <h2>Name</h2>
                    <p>Jira Clone 2.0</p>
                </div>
            </div>
            <nav className="space-y-2">
                <div onClick={() => handleMenuClick("kanban")} className={`block text-gray-700 py-2 px-4 rounded hover:bg-purple-950 hover:text-white hover:icon-white transition duration-300 cursor-pointer ${activeMenu === "kanban" ? 'bg-purple-950 text-white icon-white' : ''}`}>
                    <FaTrello className="inline mr-2" /> Kanban Board
                </div>
                <div onClick={() => handleMenuClick("create-projects")} className={`block text-gray-700 py-2 px-4 rounded hover:bg-purple-950 hover:text-white hover:icon-white transition duration-300 cursor-pointer ${activeMenu === "create-projects" ? 'bg-purple-950 text-white icon-white' : ''}`}>
                    <FaPlus className="inline mr-2" /> Create Projects
                </div>
                <div onClick={() => handleMenuClick("project-management")} className={`block text-gray-700 py-2 px-4 rounded hover:bg-purple-950 hover:text-white hover:icon-white transition duration-300 cursor-pointer ${activeMenu === "project-management" ? 'bg-purple-950 text-white icon-white' : ''}`}>
                    <FaProjectDiagram className="inline mr-2" /> Project Management
                </div>
                <div onClick={() => handleMenuClick("releases")} className={`block text-gray-700 py-2 px-4 rounded hover:bg-purple-950 hover:text-white hover:icon-white transition duration-300 cursor-pointer ${activeMenu === "releases" ? 'bg-purple-950 text-white icon-white' : ''}`}>
                    <FaRocket className="inline mr-2" /> Releases
                </div>
                <div onClick={() => handleMenuClick("issues")} className={`block text-gray-700 py-2 px-4 rounded hover:bg-purple-950 hover:text-white hover:icon-white transition duration-300 cursor-pointer ${activeMenu === "issues" ? 'bg-purple-950 text-white icon-white' : ''}`}>
                    <FaExclamationCircle className="inline mr-2" /> Issues and Filters
                </div>
                <div onClick={() => handleMenuClick("pages")} className={`block text-gray-700 py-2 px-4 rounded hover:bg-purple-950 hover:text-white hover:icon-white transition duration-300 cursor-pointer ${activeMenu === "pages" ? 'bg-purple-950 text-white icon-white' : ''}`}>
                    <FaFileAlt className="inline mr-2" /> Pages
                </div>
                <div onClick={() => handleMenuClick("components")} className={`block text-gray-700 py-2 px-4 rounded hover:bg-purple-950 hover:text-white hover:icon-white transition duration-300 cursor-pointer ${activeMenu === "components" ? 'bg-purple-950 text-white icon-white' : ''}`}>
                    <FaCogs className="inline mr-2" /> Components
                </div>
            </nav>
        </>
    );

    if (screenSize === 'desktop') {
        return (
            <div className="w-64 bg-gray-200 min-h-screen p-4">
                {sidebarContent}
            </div>
        );
    }

    return (
        <>
            <button onClick={toggleSidebar} className="fixed top-4 left-4 z-50 bg-purple-950 text-white p-2 rounded">
                <FaBars />
            </button>
            <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-40 ${isOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
            <div className={`fixed top-0 left-0 w-64 bg-gray-200 min-h-screen p-4 z-50 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {sidebarContent}
            </div>
        </>
    );
};

export default Sidebar;
