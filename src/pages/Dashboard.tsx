import React from 'react'
import "../styles/dashboard.css"
import Sidebar from '../components/Sidebar'
import ProjectTable from '../components/Table'

const Dashboard = () => {
  return (
      <div className="dashboard flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4">
          <ProjectTable />
      </div>
  </div>
  )
}

export default Dashboard
