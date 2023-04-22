import React from 'react'
import { Roles, useMetamaskAuth } from '../../auth/authConfig'
import ProfileDetails from './ProfileDetails'
import TruckData from './TruckData'


interface AccountInfoProps {
}
const AccountInfo = (props: AccountInfoProps) => {
  const { profile } = useMetamaskAuth();
  if(!profile)
    return <></>;
  return (
    <div>
      <ProfileDetails />
      { profile.role !== Roles.RETAILER && <TruckData /> }
      <br/>
    </div>
  )
}

export default AccountInfo