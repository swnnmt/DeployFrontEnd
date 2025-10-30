"use client"

import { useState } from "react"
import Sidebar from "./SiderBarAdmin"
import UserManagement from "./ManagerUser"
import PartnerManagement from "./ManagerPanter"
import PartnerRequests from "./PartnerRequest"
import DashAdmin from "./DashAdmin"
import InvoiceAdmin from "./InvoiceAdmin"
import PartnerRequest from "./PartnerRequestAdmin"

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard")

  // Render nội dung theo menu sidebar
  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />
      case "partners":
        return <PartnerManagement />
      case "partner-requests":
        return <PartnerRequest />
        case "invoices":
        return <InvoiceAdmin />
      default:
        return <DashAdmin /> 
    }
  }

  return (
    <div className="admin-dashboard flex">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Nội dung */}
      <main className="admin-content flex-1 bg-gray-100 min-h-screen p-6">
        {renderContent()}
      </main>
    </div>
  )
}

export default AdminDashboard
