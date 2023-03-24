import React, { useEffect } from 'react'
import { producerAccounts, warehouseAccounts, SETUP_TOOL } from '../../apis/setup/entities'

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
      <button onClick={SETUP_TOOL.createProducers} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Create Producer accounts
      </button>
      <br/><br/>
      <button onClick={SETUP_TOOL.createWarehouses} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Create warehouse accounts
      </button>
    </div>
  )
}

export default Setup