/* eslint-disable no-unused-vars */
import project1 from "../../assets/Duanphim.png";
import project2 from "../../assets/Shoptuananh.png";
import project3 from "../../assets/Imoublog.png";
import project4 from "../../assets/FigmaMovie.png";
import project5 from "../../assets/Samarblog.png";
import project6 from "../../assets/aiportfolio2.png";
import { AiOutlineGithub, AiOutlineProject } from "react-icons/ai";
import Reveal from "../../components/Reveal";
import TitleGradient from "../../components/ui/TitleGradient";
import React, { useState, useEffect } from 'react';
import LoadingSniper from '../../components/LoadingSpinner'; // Make sure this path is correct

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

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust this time as needed

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSniper />;
  }

  return (
    <div className="max-w-[1000px] mx-auto p-6 md:my-20" id="portfolio">
      <div className="flex items-center mb-8">
        <AiOutlineProject className="text-3xl text-purple-800 mr-2" />
        <TitleGradient>Pages Project</TitleGradient>
      </div>
      {projects.map((project, index) => (
        <Reveal key={index}>
          <div
            key={index}
            className={`flex flex-col md:flex-row ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            } mb-12`}
          >
            <div className="w-full md:w-1/2 p-4 overflow-hidden">
              <img
                src={project.img}
                alt={project.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
              />
            </div>
            <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex space-x-4 items-center">
                <a
                  href={project.links.site}
                  className="px-4 py-2 bg-purple-950 text-gray-200 rounded-lg hover:bg-purple-900 transition duration-300"
                >
                  View Site
                </a>
                <a
                  href={project.links.github}
                  className="p-2 bg-gradient-to-r from-purple-900 to-orange-700 text-gray-200 rounded-lg hover:from-purple-800 hover:to-orange-600 transition duration-300"
                >
                  <AiOutlineGithub size={24} />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

export default Portfolio;
