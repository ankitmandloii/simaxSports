import { TbArrowForwardUp } from "react-icons/tb";
import { TbArrowBack } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react'
import { redo, selectCanRedo, selectCanUndo, undo } from "../../redux/FrontendDesign/TextFrontendDesignSlice";
import './redoundo.css'
import { StartOverIcon } from "../iconsSvg/CustomIcon";
import StartOverConfirmationPopup from "../PopupComponent/StartOverPopup/StartOverPopup";
import { useLocation } from "react-router-dom";


function RedoundoComponent() {
  const location = useLocation();
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);

  const [startOverPopup, setStartOverPopup] = useState(false);
  const dispatch = useDispatch()
  const closeStartOverPopup = () => {
    setStartOverPopup(!startOverPopup);
  }
  return (
    <ul className='redoundo-container ProductContainerListButtton'>
      <li><button className='ProductContainerButton' onClick={() => dispatch(undo())} disabled={!canUndo}><span><TbArrowBack /></span>UNDO</button></li>
      <li><button className='ProductContainerButton' onClick={() => dispatch(redo())} disabled={!canRedo}><span><TbArrowForwardUp /></span>REDO</button></li>
      <li><button className='ProductContainerButton' onClick={() => setStartOverPopup(!startOverPopup)}><span><StartOverIcon /></span>START OVER</button></li>
      {startOverPopup && <StartOverConfirmationPopup onCancel={closeStartOverPopup} />}

    </ul>

  );
}

export default RedoundoComponent;
