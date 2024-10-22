/* eslint-disable no-unused-vars */
import project1 from "../../assets/Duanphim.png";
import project2 from "../../assets/Shoptuananh.png";
import project3 from "../../assets/Imoublog.png";
import project4 from "../../assets/FigmaMovie.png";
import project5 from "../../assets/Samarblog.png";
import project6 from "../../assets/aiportfolio2.png";
import { AiOutlineGithub, AiOutlineProject } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import Reveal from "../../components/Reveal";
import TitleGradient from "../../components/ui/TitleGradient";
import React, { useState, useEffect } from 'react';
import LoadingSniper from '../../components/LoadingSpinner';
import { Pagination, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../../styles/pagination.css';
const projects = [
  {
    img: project1,
    title: "Project #1",
    description: "This is a UI project for a movie streaming website, built using React.js.",
    links: {
      site: "https://webxemphimtuananh.vercel.app",
      github: "https://github.com/tuananhkim555/webxemphimtuananh",
    },
  },
  {
    img: project2,
    title: "Project #2",
    description: "This is an e-commerce shop interface built with a fullstack approach using Next.js.",
    links: {
      site: "https://shoptuananh.vercel.app",
      github: "https://github.com/tuananhkim555/shoshop",
    },
  },
  {
    img: project3,
    title: "Project #3",
    description: "UI Imouz for frontend development using HTML, CSS, JS",
    links: {
      site: "https://tuananhkim555.github.io/Imouz/",
      github: "https://github.com/tuananhkim555/Imouz",
    },
  },
  {
    img: project4,
    title: "Figma #1",
    description: "UI for Figma Design Project",
    links: {
      site: "https://www.figma.com/design/rm0mzwxFF3b2zxrlKPVJL4/Project-Movie-Ticket?t=RJIkeThjsaKa4OL3-0",
      github: "#",
    },
  },
  {
    img: project5,
    title: "Project #5",
    description: "UI for frontend development using HTML, CSS, JS.",
    links: {
      site: "https://tuananhkim555.github.io/SamarProject",
      github: "https://github.com/tuananhkim555/SamarProject",
    },
  },
  {
    img: project6,
    title: "Project #6",
    description: "UI for frontend development using ReactJS.",
    links: {
      site: "#",
      github: "#",
    },
  },
];

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const projectsPerPage = 4;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [searchTerm]);

  if (isLoading) {
    return <LoadingSniper />;
  }

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-[1100px] mx-auto p-4 md:my-16 overflow-x-hidden overflow-y-hidden" id="portfolio">
      <div className="flex items-center mb-6 justify-between">
        <div className="flex items-center">
          <AiOutlineProject className="text-2xl text-purple-800 mr-2" />
          <TitleGradient>Pages Deploy</TitleGradient>
        </div>
        <div className="flex items-center">
          <Input
            placeholder="Search projects"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
            suffix={
              <SearchOutlined
                style={{
                  color: '#31004c',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              />
            }
          />
          <div className="ml-2 p-2 bg-[#31004c] rounded-full cursor-pointer flex items-center">
            <FaPlus className="text-white mr-1" />
            <span className="text-white text-xs">Upload</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {currentProjects.map((project, index) => (
          <Reveal key={index}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 md:h-auto h-[400px]">
              <img
                src={project.img}
                alt={project.title}
                className="w-full h-48 md:h-40 object-cover"
              />
              <div className="p-3">
                <h3 className="text-lg font-semibold text-gray-600 mb-1">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-2 text-xs">{project.description}</p>
                <div className="flex space-x-2 items-center">
                  <a
                    href={project.links.site}
                    className="px-2 py-1 bg-[#31004c] text-gray-200 rounded text-xs hover:bg-purple-900 transition duration-300"
                  >
                    View Site
                  </a>
                  <a
                    href={project.links.github}
                    className="p-1 bg-gradient-to-r from-purple-900 to-orange-700 text-gray-200 rounded hover:from-purple-800 hover:to-orange-600 transition duration-300"
                  >
                    <AiOutlineGithub size={16} />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Pagination
          current={currentPage}
          total={filteredProjects.length}
          pageSize={projectsPerPage}
          onChange={handlePageChange}
          className="pagination-container"
        />
      </div>
    </div>
  );
};

export default Portfolio;
