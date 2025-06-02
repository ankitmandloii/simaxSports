import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import styles from './BottomBar.module.css';
import { Link, useLocation } from "react-router-dom";
import { RiTShirt2Line } from "react-icons/ri";
import { LuHardDriveUpload } from "react-icons/lu";
import { PiListNumbersBold } from "react-icons/pi";
import { PiCameraPlusFill } from "react-icons/pi";
import "swiper/css";
import 'swiper/css/bundle';
import {
  AddProductIcon,
  AddArtIcon,
  SelectArtIcon,
  NumberArtIcon,
} from "../iconsSvg/CustomIcon";
import AddTextSheet from '../mobileView/AddTextSheetMobile/AddTextSheet';
import AddArtToolbar from '../Toolbar/AddArtToolbar/AddArtToolbar';
import AddImageToolbar from '../Toolbar/AddImageToolbar/AddImageToolbar';
import NamesToolbar from '../Toolbar/NamesToolbar/NamesToolbar';
import ProductToolbar from '../Toolbar/ProductToolbar/ProductToolbar';
import AddTextToolbar from '../Toolbar/AddTextToolbar/AddTextToolbar';

const menuItems = [
  { path: "/product", icon: <RiTShirt2Line />, label: "Products" ,data:<ProductToolbar/> },
  { path: "/addText", icon: <AddProductIcon />, label: "Text",data:<AddTextToolbar/> },
  { path: "/uploadArt", icon: <LuHardDriveUpload />, label: "Upload",data:<AddImageToolbar/> },
  { path: "/addArt", icon: <PiCameraPlusFill />, label: "Add Art",data:<AddArtToolbar/> },
  { path: "/addNames", icon: <PiListNumbersBold />, label: "Names & Numbers" ,data:<NamesToolbar/>},
];

const BottomBar = () => { 
  const [card, setCard] = useState(2);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [sheetContaint, setSheetContaint] = useState(<ProductToolbar></ProductToolbar>);
  useEffect(() => {
    const updateCardCount = () => {
      const width = window.innerWidth;
      if (width < 300) setCard(3);
      else if (width < 500) setCard(4);
      else if (width < 800) setCard(5);
      else setCard(5);
    };

    updateCardCount();
    window.addEventListener('resize', updateCardCount);
    return () => window.removeEventListener('resize', updateCardCount);
  }, []);

  return (
    <div className={styles.wrapper}>
      <Swiper
        slidesPerView={card}
        spaceBetween={15}
        loop={false}
        freeMode={true}
        autoplay={{ delay: 5000 }}
        modules={[FreeMode, Pagination]}
      >
        {menuItems.map((item, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <Link
              to={item.path}
              className={`${styles.menuItem} ${location.pathname.startsWith(item.path) ? styles.active : ''
                }`}
                onClick={() => {
                  setSheetContaint(item.data);
                  setIsOpen(true);
                }}
            >
              <div className={`${styles.bottomBarIcon} ${location.pathname.startsWith(item.path) ? styles.active : ''
                }`}>{item.icon}
                {item.path === "/addArt" && (
                  <span className={styles.spannAi}>AI</span>
                )}
              </div>

              <div className={styles.label}>{item.label}</div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <AddTextSheet isOpen = {isOpen} setIsOpen = {setIsOpen} sheetContaint={sheetContaint}></AddTextSheet>
    </div>
  );
};

export default BottomBar;
