import { Button, Input } from '@mui/material'
import React from 'react'
import ProfileDetails from './ProfileDetails'

const AccountInfo = () => {
  return (
    <div>
      <ProfileDetails />
      <br/><br/>
      Test MUI <br/>
      <Button variant="text">MUI Text</Button><br />
      <Button variant="contained">MUI Contained</Button><br />
      <Button variant="outlined">MUI Outlined</Button><br />
    </div>
  )
}

export default AccountInfo