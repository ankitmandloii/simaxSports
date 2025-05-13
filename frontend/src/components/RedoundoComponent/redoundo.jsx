import { TbArrowForwardUp } from "react-icons/tb";
import { TbArrowBack } from "react-icons/tb";
import { useDispatch } from "react-redux";
import React, { useState, useRef } from 'react'
import { redo, undo } from "../../redux/FrontendDesign/TextFrontendDesignSlice";
import './redoundo.css'
import { StartOverIcon } from "../iconsSvg/CustomIcon";
import StartOverConfirmationPopup from "../PopupComponent/StartOverPopup/StartOverPopup";

function RedoundoComponent() {
  const [startOverPopup,setStartOverPopup]=useState(false);
    const dispatch=useDispatch()
    const closeStartOverPopup=()=>{
    setStartOverPopup(!startOverPopup);
  }
  return (
    <ul className='redoundo-container ProductContainerListButtton'>
        <li><button className='ProductContainerButton' onClick={() => dispatch(undo())}><span><TbArrowBack /></span>UNDO</button></li>
        <li><button className='ProductContainerButton' onClick={() => dispatch(redo())}><span><TbArrowForwardUp /></span>REDO</button></li>
        <li><button className='ProductContainerButton'  onClick={()=>setStartOverPopup(!startOverPopup)}><span><StartOverIcon /></span>START OVER</button></li>
         {startOverPopup && <StartOverConfirmationPopup onCancel={closeStartOverPopup}/>}

    </ul>
   
  );
}

export default RedoundoComponent;
