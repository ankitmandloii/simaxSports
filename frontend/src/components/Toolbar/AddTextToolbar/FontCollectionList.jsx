import React from 'react'
import './FontCollectionList.css';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
 
function FontCollectionList({ onSelect,onClose   }) {
    const dummyCollectionOfFontsCategory = [
        { id: 1, nameOfCategory: 'Comic', fontFamily: 'Comic Sans MS', fontWeight: '400', fontStyle: 'normal' },
        { id: 2, nameOfCategory: 'Comic', fontFamily: 'Comic Neue', fontWeight: '700', fontStyle: 'italic' },
        { id: 3, nameOfCategory: 'Comic', fontFamily: 'Chilanka', fontWeight: '400', fontStyle: 'normal' },
        { id: 4, nameOfCategory: 'Comic', fontFamily: 'Patrick Hand', fontWeight: '400', fontStyle: 'normal' },
        { id: 5, nameOfCategory: 'Comic', fontFamily: 'Gloria Hallelujah', fontWeight: '400', fontStyle: 'normal' },
        { id: 6, nameOfCategory: 'Comic', fontFamily: 'Caveat', fontWeight: '500', fontStyle: 'italic' },
        { id: 7, nameOfCategory: 'Comic', fontFamily: 'Indie Flower', fontWeight: '400', fontStyle: 'normal' },
        { id: 8, nameOfCategory: 'Comic', fontFamily: 'Reenie Beanie', fontWeight: '400', fontStyle: 'italic' },
        { id: 9, nameOfCategory: 'Comic', fontFamily: 'Architects Daughter', fontWeight: '400', fontStyle: 'normal' },
      
        { id: 10, nameOfCategory: 'Brush', fontFamily: 'Brush Script MT', fontWeight: '400', fontStyle: 'italic' },
        { id: 11, nameOfCategory: 'Brush', fontFamily: 'Pacifico', fontWeight: '400', fontStyle: 'normal' },
      
        { id: 12, nameOfCategory: 'Standard', fontFamily: 'Arial', fontWeight: '400', fontStyle: 'normal' },
        { id: 13, nameOfCategory: 'Standard', fontFamily: 'Verdana', fontWeight: '700', fontStyle: 'normal' },
      
        { id: 14, nameOfCategory: 'Serif', fontFamily: 'Times New Roman', fontWeight: '400', fontStyle: 'normal' },
      
        { id: 15, nameOfCategory: 'Mono', fontFamily: 'Courier New', fontWeight: '400', fontStyle: 'normal' },
      
        { id: 16, nameOfCategory: 'Geometric', fontFamily: 'Futura', fontWeight: '400', fontStyle: 'normal' }
      ];
      
  return (
    <>
      <div className='FontCollectionList-header'>
        <p>Font</p>
        <span className='FontCollectionList-header-cross' onClick={onClose}><CrossIcon/></span>
      </div>

        <hr></hr>
        <div className='font-list-scrollable'>

      
      <div className='FontCollectionList-category'>
             <div className='font-Category-option-heading'>POPULAR</div>
            <div className='font-Category-option-heading'>View All</div> 
            

      {dummyCollectionOfFontsCategory.map((data) => (
        <div key={data.id} onClick={() => onSelect(data.nameOfCategory)} className="font-Category-option">
          {data.nameOfCategory}
        </div>
      ))}
      </div>
      </div>
  </>
  )
}

export default FontCollectionList;