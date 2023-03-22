import React, { useEffect } from 'react'
import { producerAccounts, warehouseAccounts } from '../../apis/setup/entities'

const Setup = () => {
  useEffect(() => {
    console.log({ producerAccounts, warehouseAccounts});
  }, [])
  
  return (
    <div className='p-4'>
      <h3>
        Setup
      </h3>
      <br/>
    </div>
  )
}

export default Setup