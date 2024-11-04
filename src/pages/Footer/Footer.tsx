import { FaFacebook, FaGithub, FaTiktok } from 'react-icons/fa'

const Footer = () => {
  return (
    <>
        <div className="lg:mt-[-150px] mt-[250px] md:mt-[300px]">
        <div className="max-w-6xl mx-auto px-3">
          <div className="flex flex-col items-center">
            <div className="flex space-x-4 mb-3">
              <FaTiktok size={24} className="text-gray-600 hover:text-gray-800 transition-colors" />
              <FaGithub size={24} className="text-gray-600 hover:text-gray-800 transition-colors" />
              <FaFacebook size={24} className="text-gray-600 hover:text-gray-800 transition-colors" />
            </div>
            <p className="text-lg font-semibold text-gray-700">&copy; 2024 Jira Board</p>
            <p className="text-lg text-gray-600">Tuan Anh Dev. All rights reserved.

</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer;
