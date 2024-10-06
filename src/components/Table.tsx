import React from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

const projects = [
    { id: 10779, name: 'wow', category: 'Dự án web', creator: 'Maaaa', members: [] },
    { id: 10782, name: 'naruto', category: 'Dự án phần mềm', creator: 'Admin Cyberlearn - 01', members: [] },
    { id: 10783, name: 'Newgirl', category: 'Dự án di động', creator: 'cyber', members: [] },
    { id: 10784, name: 'Tuwo', category: 'Dự án di động', creator: 'cyber', members: [] },
    { id: 10787, name: 'Capstone Jira', category: 'Dự án web', creator: 'Nhật Quang', members: ['LL', 'AO'] },
    { id: 10791, name: 'TC_01', category: 'Dự án web', creator: 'KIET NGUYEN', members: ['AO'] },
];

const ProjectTable: React.FC = () => {
    return (
        <div className="w-full p-4">
            <h2 className="text-xl text-gray-600 font-semibold mb-4">Project Management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-left text-sm">Project ID</th>
                            <th className="p-2 text-left text-sm">Project name</th>
                            <th className="p-2 text-left text-sm">Category</th>
                            <th className="p-2 text-left text-sm">Creator</th>
                            <th className="p-2 text-left text-sm">Members</th>
                            <th className="p-2 text-left text-sm">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.id} className="border-t text-sm">
                                <td className="p-2">{project.id}</td>
                                <td className="p-2">{project.name}</td>
                                <td className="p-2">{project.category}</td>
                                <td className="p-2">{project.creator}</td>
                                <td className="p-2">
                                    <div className="flex items-center">
                                        {project.members.map((member, index) => (
                                            <span key={index} className="bg-gray-300 text-xs rounded-full px-2 py-1 mr-2">
                                                {member}
                                            </span>
                                        ))}
                                        <button className="text-gray-600">+</button>
                                    </div>
                                </td>
                                <td className="p-2 flex space-x-2">
                                    <button className="text-blue-500"><FaPencilAlt /></button>
                                    <button className="text-red-500"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectTable;
