import React from 'react'
import camera from '../../images/camera.jpg'
import { IoAdd } from "react-icons/io5";
import '../AddTextToolbar/AddTextToolbar.css';
import { AlignCenterIcon, LayeringFirstIcon, LayeringSecondIcon, FlipFirstIcon, FlipSecondIcon, LockIcon, DuplicateIcon, AngleActionIcon } from '../../iconsSvg/CustomIcon';
import MyCompo from '../../style/MyCompo';
const AddTextToolbar = () => {
  return (
    <div className="toolbar-main-container">
      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Text Editor</h5>
        <h3 >Add new Text</h3>
        <p>You can select multiple products and colors</p>
      </div>
      <div className="toolbar-box">
        <textarea placeholder='Begain Typing...'></textarea>
        <div className='toolbar-box-container'>
          <div className='toolbar-box-icons-and-heading-container'>
            <div className='toolbar-box-icons-container'><span><AlignCenterIcon /></span></div>
            <div className='toolbar-box-heading-container'>
              Center
            </div>
          </div>



          <div className='toolbar-box-icons-and-heading-container'>
            <div className='toolbar-box-icons-container-for-together'>
              <div className='toolbar-box-icons-container-layering1'><span><LayeringFirstIcon /></span></div>
              <div className='toolbar-box-icons-container-layering2'><span><LayeringSecondIcon /></span></div>
            </div>


            {/* <div className='toolbar-box-heading-container'> */}
              Layering
            {/* </div> */}
          </div>






          <div className='toolbar-box-icons-and-heading-container'>
            <div className='toolbar-box-icons-container-for-together'>
              <div className='toolbar-box-icons-container-flip1'><span><FlipFirstIcon /></span></div>
              <div className='toolbar-box-icons-container-flip2'><span><FlipSecondIcon /></span></div>
            </div>

            {/* <div className='toolbar-box-heading-container'> */}
              Flip
            {/* </div> */}
          </div>





          <div className='toolbar-box-icons-and-heading-container'>
            <div className='toolbar-box-icons-container'><span><LockIcon /></span></div>
            <div className='toolbar-box-heading-container'>
              Lock
            </div>
          </div>


          <div className='toolbar-box-icons-and-heading-container'>
            <div className='toolbar-box-icons-container'><span><DuplicateIcon /></span></div>
            <div className='toolbar-box-heading-container'>
              Duplicate
            </div>
          </div>


          
        </div>
        {/* firstToolbarEnd here */}

      <span className='linebreak'></span>
      
            <div className='toolbar-box-Font-Value-set-inner-container'>
              <div className='toolbar-box-Font-Value-set-inner-actionheading'>
              Font
              </div> 
              <div className='toolbar-box-Font-Value-set-inner-actionlogo'>Interstate <span><AngleActionIcon/></span></div>
            </div>
       


          <span className='linebreak'></span>


          <div className='toolbar-box-Font-Value-set-inner-container'>
              <div className='toolbar-box-Font-Value-set-inner-actionheading'>
              Color
              </div> 
              <div className='toolbar-box-Font-Value-set-inner-actionlogo'>White
                <span><AngleActionIcon/></span>
               
              
              </div>
          </div>

        <span className='linebreak'></span>
      </div>
    </div>
  )
}

export default AddTextToolbar