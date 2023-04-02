import React from 'react'
import { useMetamaskAuth } from '../../auth/authConfig';

const TruckData = () => {
  const { profile } = useMetamaskAuth();

  if(!profile){
    return <></>
  }

  const { parsedTruckDetails } = profile;

  return (
    <div>
      {
        !parsedTruckDetails.length &&
        <div>
          No trucks
        </div>
      }
      <div className='mt-8'>
        Trucks
        <br/>
        <ul>
          {
            parsedTruckDetails.map(truck => {
              return (
                <li key={truck.address}>
                  { truck.license }
                </li>
              )
            })
          }
        </ul>

      </div>
    </div>
  )
}

export default TruckData