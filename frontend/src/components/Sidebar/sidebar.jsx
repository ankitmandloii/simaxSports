import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaStore,
  FaMoneyCheckAlt,
  FaBars,
} from "react-icons/fa";
import "./sidebar.css";
import { RiTShirt2Line } from "react-icons/ri";
import { BsCloudUpload } from "react-icons/bs";
import { MdAddchart } from "react-icons/md";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { path: "/product", icon: <RiTShirt2Line />, label: "Products" },
    { path: "/addText", icon: <FaUsers />, label: "Add Text" },
    { path: "/admin/merchants", icon: <BsCloudUpload />, label: "Upload Art" },
    { path: "/admin/transactions", icon: <MdAddchart />, label: "Add Art" },
    { path: "/admin/admins", icon: <FaStore />, label: "Names And Numbers" },
  ];

  return (
    <div className="sidebar-wrapper">
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">SIMAX</h1>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-label">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
