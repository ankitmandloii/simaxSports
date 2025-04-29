import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaUsers, FaCog, FaStore, FaMoneyCheckAlt, FaListAlt, FaBars, FaSignOutAlt } from "react-icons/fa";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const location = useLocation();

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };



  // Menu items for bottom navigation
  const bottomNavItems = [
    { path: "/admin/dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/admin/users", icon: <FaUsers />, label: "Users" },
    { path: "/admin/merchants", icon: <FaStore />, label: "Merchants" },
    { path: "/admin/transactions", icon: <FaMoneyCheckAlt />, label: "Transactions" },
  ];

  return (
    <div className="flex">

      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-[#6c5ce7] text-white rounded-lg lg:hidden"
        aria-label="Toggle Sidebar"
      >
        <FaBars />
      </button>

    
      <Sidebar
        collapsed={collapsed}
        className="h-screen bg-[#f8f9fa] shadow-lg flex flex-col justify-between transition-all duration-300 ease-in-out"
        breakPoint="lg" // Collapse sidebar on screens smaller than lg (1024px)
        onToggle={() => setCollapsed(!collapsed)}
      >
       
        <div className="p-4 text-center">
          <h1 className="text-xl font-bold text-[#6c5ce7]">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Role: Administrator</p>
        </div>

        <Menu
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              if (level === 0)
                return {
                  color: disabled ? "#ccc" : "#6c5ce7",
                  backgroundColor: active ? "#e9ecef" : undefined,
                  "&:hover": {
                    backgroundColor: "#6c5ce710",
                  },
                };
            },
          }}
        >
          <MenuItem
            component={<Link to="/admin/dashboard" />}
            icon={<FaHome />}
            active={location.pathname === "/admin/dashboard"}
          >
            Dashboard
          </MenuItem>
          <MenuItem
            component={<Link to="/admin/users" />}
            icon={<FaUsers />}
            active={location.pathname === "/admin/users"}
          >
            Manage Users
          </MenuItem>
          <MenuItem
            component={<Link to="/admin/merchants" />}
            icon={<FaStore />}
            active={location.pathname === "/admin/merchants"}
          >
            Manage Merchants
          </MenuItem>
          <MenuItem
            component={<Link to="/admin/transactions" />}
            icon={<FaMoneyCheckAlt />}
            active={location.pathname === "/admin/transactions"}
          >
            Transactions
          </MenuItem>
          <MenuItem
            component={<Link to="/admin/admins" />}
            icon={<FaStore />}
            active={location.pathname === "/admin/admins"}
          >
            Manage Admins
          </MenuItem>
    
        </Menu>

      
      </Sidebar>

     
    </div>
  );
};

export default AdminSidebar;

