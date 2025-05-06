import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaStore,
  FaMoneyCheckAlt,
  FaBars,
} from "react-icons/fa";
import "./sidebar.css";
import { RiTShirt2Line } from "react-icons/ri";
import { BsCloudUpload } from "react-icons/bs";
import { MdAddchart } from "react-icons/md";
import Logo from '../images/Logo.png'
import { AddProductIcon,NumberIcon,AddArtIcon} from "../iconsSvg/CustomIcon";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth > 1024) {
      setCollapsed((prev) => !prev);
    } else {
      setMobileOpen((prev) => !prev);
    }
  };

  const menuItems = [
    { path: "/product", icon: <RiTShirt2Line />, label: "Products" },
    { path: "/addText", icon: <AddProductIcon/>, label: "Add Text" },
    { path: "/uploadArt", icon: <AddArtIcon/>, label: "Upload Art" },
    { path: "/addArt", icon: <MdAddchart />, label: "Add Art" },
    { path: "/addNames", icon: <NumberIcon />, label: "Names And Numbers" },
  ];

  return (
    <div className="sidebar-wrapper">
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "show" : ""
        }`}
      >
        <div className="sidebar-header">
          {/* <h1 className="sidebar-title">SIMAX</h1> */}
          <img src={Logo} alt="SIMAX" className="logo" />
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => setMobileOpen(false)} 
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.path=='/addArt' && <span className="spannAI">AI</span>}
              {!collapsed && <span className="sidebar-label">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
