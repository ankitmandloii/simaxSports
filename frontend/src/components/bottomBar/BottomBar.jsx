import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
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

} from "../iconsSvg/CustomIcon";
// import { FaFileImage } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";

import AddTextSheet from '../mobileView/AddTextSheetMobile/AddTextSheet';
import AddArtToolbar from '../Toolbar/AddArtToolbar/AddArtToolbar';
import AddImageToolbar from '../Toolbar/AddImageToolbar/AddImageToolbar';
import NamesToolbar from '../Toolbar/NamesToolbar/NamesToolbar';
import ProductToolbar from '../Toolbar/ProductToolbar/ProductToolbar';
import AddTextToolbar from '../Toolbar/AddTextToolbar/AddTextToolbar';
import UploadArtToolbar from '../Toolbar/UploadArtToolbar/UploadArtToolbar';
import { useSelector } from 'react-redux';
// import { selectedImageIdState } from '../../redux/FrontendDesign/TextFrontendDesignSlice';



const BottomBar = () => {
  const [card, setCard] = useState(5);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const activeSide = useSelector(state => state.TextFrontendDesignSlice.activeSide);
  // console.log("-------ac", activeSide);

  const selectedImageId = useSelector(state =>
    state.TextFrontendDesignSlice.present[activeSide]?.selectedImageId
  );
  // console.log("---selectedImageId", selectedImageId);
  const menuItems = [
    { path: "/design/product", icon: <RiTShirt2Line />, label: "Products", data: <ProductToolbar />, snap: 1200 },
    { path: "/design/addText", icon: <AddProductIcon />, label: "Text", data: <AddTextToolbar />, snap: 600 },
    { path: "/design/uploadArt", icon: <LuHardDriveUpload />, label: "Upload", data: <UploadArtToolbar />, snap: 1200 },
    ...(selectedImageId
      ? [{ path: "/design/addImage", icon: <CiImageOn />, label: "Add Image", data: <AddImageToolbar />, snap: 1200 }]
      : []),
    { path: "/design/addArt", icon: <PiCameraPlusFill />, label: "Add Art", data: <AddArtToolbar />, snap: 1200 },
    { path: "/design/addNames", icon: <PiListNumbersBold />, label: "Names & Numbers", data: <NamesToolbar />, snap: 1200 },


  ];


  const [sheetSnapPoint, setSheetSnapPoint] = useState(900); // Default to 900

  const [sheetContaint, setSheetContaint] = useState(<ProductToolbar></ProductToolbar>);
  useEffect(() => {
    const updateCardCount = () => {
      const width = window.innerWidth;
      if (width < 300) setCard(3);
      else if (width < 500) setCard(5);
      else setCard(5);
    };

    updateCardCount();
    window.addEventListener('resize', updateCardCount);
    return () => window.removeEventListener('resize', updateCardCount);
  }, []);
  useEffect(() => {
    const width = window.innerWidth;

    // Adjust the breakpoint as needed (e.g., 1024 for tablets or 768 for mobile only)
    const isMobileOrTablet = width <= 1024;

    if (isMobileOrTablet && location.pathname === "/design/addImage") {
      setSheetContaint(<AddImageToolbar />);
      setSheetSnapPoint(1200); // or your desired snap height
      setIsOpen(true);
    }
  }, [location.pathname]);
  // useEffect(() => {
  //   const matchedItem = menuItems.find(item => location.pathname.startsWith(item.path));
  //   if (matchedItem) {
  //     setSheetContaint(matchedItem.data);
  //     setIsOpen(true);
  //   }
  // }, [location.pathname]);

  return (
    <div className={styles.wrapper}>
      <Swiper
        slidesPerView={card}
        spaceBetween={15}
        loop={true} // Enables infinite looping
        freeMode={false} // Usually false for loop to behave correctly
        // centeredSlides={true} // Optional: Centers the active slide
        autoplay={{ delay: 3000, disableOnInteraction: false }}
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
                setSheetSnapPoint(item.snap);
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
      <AddTextSheet isOpen={isOpen} setIsOpen={setIsOpen} sheetContaint={sheetContaint} snap={sheetSnapPoint} ></AddTextSheet>
    </div>
  );
};

export default BottomBar;
