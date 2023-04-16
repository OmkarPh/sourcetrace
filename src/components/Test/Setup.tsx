import React, { useEffect } from 'react'
import { SETUP_TOOL } from '../../apis/setup/setup'

const Setup = () => {
  useEffect(() => {
    console.log(SETUP_TOOL);
  }, [])
  
  return (
    <div className='p-4'>
      <h3>
        Setup
      </h3>
      <br/>
      <button onClick={() => SETUP_TOOL.createProducers()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Create Producer accounts
      </button>
      <br/><br/>
      <button onClick={() => SETUP_TOOL.createWarehouses()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Create warehouse accounts
      </button>
      <br/><br/>
      <button onClick={() => SETUP_TOOL.createProducts()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Create all products
      </button>
      <br/><br/>
      <button onClick={() => SETUP_TOOL.createProductLots()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Create all product lots
      </button>
      <br/><br/>
      <button onClick={() => SETUP_TOOL.testCheckpoints()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Test checkpoints
      </button>
    </div>
  )
}

export default Setup