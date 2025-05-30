import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { RiTShirt2Line } from "react-icons/ri";
import {
  AddProductIcon,
  AddArtIcon,
  SelectArtIcon,
  NumberArtIcon,
} from "../iconsSvg/CustomIcon";

import styles from "./sidebar.module.css";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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
    {
      path: "/product?productId=8847707537647&title=Dusty%20Rose%20/%20S",
      icon: <RiTShirt2Line />,
      label: "Products",
    },
    {
      path: "/addText?productId=8847707537647&title=Dusty%20Rose%20/%20S",
      icon: <AddProductIcon />,
      label: "Text",
    },
    {
      path: "/uploadArt?productId=8847707537647&title=Dusty%20Rose%20/%20S",
      icon: <AddArtIcon />,
      label: "Upload",
    },
    {
      path: "/addArt?productId=8847707537647&title=Dusty%20Rose%20/%20S",
      icon: <SelectArtIcon />,
      label: "Add Art",
    },
    {
      path: "/addNames?productId=8847707537647&title=Dusty%20Rose%20/%20S",
      icon: <NumberArtIcon />,
      label: "Names & Numbers",
    },
  ];

  return (
    <div className={styles.sidebarWrapper}>
      <button className={styles.sidebarToggleBtn} onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""} ${mobileOpen ? styles.show : ""
          }`}
      >
        <nav className={styles.sidebarMenu}>
          {menuItems.map((item) => {
            const isActive =
              (item.path.startsWith("/product") &&
                (location.pathname === "/" ||
                  location.pathname === "/product")) ||
              location.pathname + location.search === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.sidebarLink} ${isActive ? styles.active : ""
                  }`}
                onClick={() => setMobileOpen(false)}
              >
                <span
                  className={`${styles.sidebarIcon} ${item.path === "/addArt" ? styles.sidebariconAddArt : ""
                    }`}
                >
                  {item.icon}
                </span>
                {item.path === "/addArt" && (
                  <span className={styles.spannAi}>AI</span>
                )}
                {!collapsed && (
                  <span className={styles.sidebarLabel}>{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;

