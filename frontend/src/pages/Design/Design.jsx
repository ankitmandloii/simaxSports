import React from 'react'
import './Design.css'
import AppRoutes from '../../routes/Approutes'
import ProductContainer from '../../components/ProductContainer'
const Design = () => {
  return (
    <div className='layout-container flex gap-5'>
    <AppRoutes />
    <ProductContainer />
  </div>
  )
}

export default Design