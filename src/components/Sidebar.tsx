import React from 'react';
import { Link } from 'react-router-dom';

import { FaTrello, FaPlus, FaProjectDiagram, FaRocket, FaExclamationCircle, FaFileAlt, FaCogs } from 'react-icons/fa';

const Sidebar: React.FC = () => {
    return (
        <div className="w-64 bg-gray-200 min-h-screen p-4">
            <div className="flex items-center justify-center mb-8">
                <img src="../assets/Logo Jira.png" alt="Avatar" className="w-16 h-16 rounded-full" />
                <div className="ml-4 text-gray-700">
                    <h2>Name</h2>
                    <p>Jira Clone 2.0</p>
                </div>
            </div>
            <nav className="space-y-2">
                <Link to="/kanban" className="block text-gray-700 py-2 px-4 rounded hover:bg-blue-700">
                    <FaTrello className="inline mr-2" /> Kanban Board
                </Link>
                <Link to="/create-projects" className="block text-gray-700 py-2 px-4 rounded hover:bg-blue-700">
                    <FaPlus className="inline mr-2" /> Create Projects
                </Link>
                <Link to="/project-management" className="block text-gray-700 py-2 px-4 rounded hover:bg-blue-700">
                    <FaProjectDiagram className="inline mr-2" /> Project Management
                </Link>
                <Link to="/releases" className="block text-gray-700 py-2 px-4 rounded hover:bg-blue-700">
                    <FaRocket className="inline mr-2" /> Releases
                </Link>
                <Link to="/issues" className="block text-gray-700 py-2 px-4 rounded hover:bg-blue-700">
                    <FaExclamationCircle className="inline mr-2" /> Issues and Filters
                </Link>
                <Link to="/pages" className="block text-gray-700 py-2 px-4 rounded hover:bg-blue-700">
                    <FaFileAlt className="inline mr-2" /> Pages
                </Link>
                <Link to="#" className="block text-gray-700 py-2 px-4 rounded bg-gray-300">
                    <FaCogs className="inline mr-2" /> NOT IMPLEMENTED
                </Link>
                <Link to="/components" className="block text-gray-700 py-2 px-4 rounded hover:bg-blue-700">
                    <FaCogs className="inline mr-2" /> Components
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
