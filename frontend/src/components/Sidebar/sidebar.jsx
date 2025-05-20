import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {

  FaBars,
} from "react-icons/fa";
import "./sidebar.css";
import { RiTShirt2Line } from "react-icons/ri";
import { AddProductIcon, AddArtIcon, SelectArtIcon, NumberArtIcon } from "../iconsSvg/CustomIcon";

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
    { path: "/addText", icon: <AddProductIcon />, label: "Text" },
    { path: "/uploadArt", icon: <AddArtIcon />, label: "Upload" },
    { path: "/addArt", icon: <SelectArtIcon />, label: "Add Art" },
    { path: "/addNames", icon: <NumberArtIcon />, label: "Names & Numbers" },
  ];

  return (
    <div className="sidebar-wrapper">
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div
        className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "show" : ""
          }`}
      >


        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${(item.path === "/product" && (location.pathname === "/" || location.pathname === "/product"))
                || location.pathname === item.path
                ? "active"
                : ""
                }`}
              onClick={() => setMobileOpen(false)}
            >
              <span className={item.path === '/addArt' ? "sidebar-icon sidebaricon-add-art" : "sidebar-icon"}>{item.icon}</span>
              {item.path === '/addArt' && <span className="spannAI">AI</span>}
              {!collapsed && <span className="sidebar-label">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
