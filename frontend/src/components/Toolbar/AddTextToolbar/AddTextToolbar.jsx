import React, { useState } from 'react'
import camera from '../../images/camera.jpg'
import { IoAdd } from "react-icons/io5";
import '../AddTextToolbar/AddTextToolbar.css';
import { AlignCenterIcon, LayeringFirstIcon, LayeringSecondIcon, FlipFirstIcon, FlipSecondIcon, LockIcon, DuplicateIcon, AngleActionIcon } from '../../iconsSvg/CustomIcon';
import MyCompo from '../../style/MyCompo';
import FontCollectionList from './FontCollectionList';


const AddTextToolbar = () => {


  

  const [rangeValue, setRangeValue] = useState([20, 80]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newRangeValue = [...rangeValue];

    if (name === 'min') {
      newRangeValue[0] = parseInt(value);
    } else if (name === 'max') {
      newRangeValue[1] = parseInt(value);
    }

    setRangeValue(newRangeValue);
  };


   const [showContent, setShowContent] = useState(false);
  const handleShowContent = (e) => {
    const { name, value } = e.target;
    if(value.length > 0) {
      setShowContent(true);
    }else{
      setShowContent(false);
    }
  }

  const [showFontSelector, setShowFontSelector] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Interstate');

  const handleFontSelect = (font) => {
    setSelectedFont(font);
    setShowFontSelector(false);
  };

  const handleClose = () => {
    setShowFontSelector(false);
  };

  return (
    <div className="toolbar-main-container">
      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Text Editor</h5>
        <h3 >Add new Text</h3>
        <p>You can select multiple products and colors</p>
      </div>
      <div className="toolbar-box">
      {!showFontSelector ? (
        <>
        <textarea placeholder='Begain Typing...' onChange={handleShowContent}></textarea>
        
      {showContent  &&<>
       
        <div className='addText-first-toolbar-box-container'>
         
         
         
          <div className='toolbar-box-icons-and-heading-container'>
            <div className='toolbar-box-icons-container'><span><AlignCenterIcon /></span></div>
            <div className='toolbar-box-heading-container'>
              Center
            </div>
          </div>

         <div>
          
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
         

          <hr></hr>
        <div className='toolbar-box-Font-Value-set-inner-container'>
          <div className='toolbar-box-Font-Value-set-inner-actionheading'>
            Font
          </div>
          <div className='toolbar-box-Font-Value-set-inner-actionlogo cursor' onClick={()=>{setShowFontSelector(true)}}>{selectedFont} <span><AngleActionIcon /></span></div>
        </div>



        <hr></hr>

        <div className='toolbar-box-Font-Value-set-inner-container'>
          <div className='toolbar-box-Font-Value-set-inner-actionheading'>
            Color
          </div>
          <div className='toolbar-box-Font-Value-set-inner-actionheading'>White
            <span><AngleActionIcon /></span>


          </div>
        </div>

        <hr></hr>

      


        <div className='toolbar-box-Font-Value-set-inner-container'>
          <div className='toolbar-box-Font-Value-set-inner-actionheading'>
            Outline
          </div>
          <div className='toolbar-box-Font-Value-set-inner-actionheading'>None
            <span><AngleActionIcon /></span>


          </div>
        </div>

        <hr></hr>

        <div className='toolbar-box-Font-Value-set-inner-container'>
          <div className='toolbar-box-Font-Value-set-inner-actionheading'>
            Size
          </div>
          <div className='toolbar-box-Font-Value-set-inner-actionlogo'>
            <input
              type="range"
              id="min"
              name="min"
              min="0"
              max="100"
              value={rangeValue[0]}
              onChange={handleInputChange}
            />

            <span><AngleActionIcon /></span>
          </div>
        </div>


        <hr></hr>


        <div className='toolbar-box-Font-Value-set-inner-container'>
          <div className='toolbar-box-Font-Value-set-inner-actionheading'>
            Arc
          </div>
          <div className='toolbar-box-Font-Value-set-inner-actionlogo'>
            <input
              type="range"
              id="min"
              name="min"
              min="0"
              max="100"
              value={rangeValue[0]}
              onChange={handleInputChange}
            />

            <span><AngleActionIcon /></span>
          </div>
        </div>

        <hr></hr>

        <div className='toolbar-box-Font-Value-set-inner-container'>
          <div className='toolbar-box-Font-Value-set-inner-actionheading'>
            Rotate
          </div>
          <div className='toolbar-box-Font-Value-set-inner-actionlogo'>
            <input
              type="range"
              id="min"
              name="min"
              min="0"
              max="100"
              value={rangeValue[0]}
              onChange={handleInputChange}
            />

            <span><AngleActionIcon /></span>
          </div>
        </div>

        <hr></hr>
            <div className='toolbar-box-Font-Value-set-inner-container'>
          <div className='toolbar-box-Font-Value-set-inner-actionheading'>
            Spacing
          </div>
          <div className='toolbar-box-Font-Value-set-inner-actionlogo'>
            <input
              type="range"
              id="min"
              name="min"
              min="0"
              max="100"
              value={rangeValue[0]}
              onChange={handleInputChange}
            />

            <span><AngleActionIcon /></span>
          </div>
         </div>
        
       
            </>}
          </>
          ) : (
        <FontCollectionList onSelect={handleFontSelect} onClose={handleClose}/>
      )}
      </div>
    </div>
  )
}

export default AddTextToolbar