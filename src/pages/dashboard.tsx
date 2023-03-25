import React from 'react'
import { Roles, useMetamaskAuth } from '../auth/authConfig';
import Loader from '../components/core/Loader';
import ProducerDashboard from '../components/Dasboard/ProducerDashboard';
import WarehouseDashboard from '../components/Dasboard/WarehouseDashboard';

const Dashboard: React.FC = () => {
  const { isProcessingLogin, profile } = useMetamaskAuth();

  if(isProcessingLogin || !profile){
    return <Loader />
  }

  if(profile.role == Roles.PRODUCER){
    return <ProducerDashboard />
  }

  return (
    <WarehouseDashboard />
  )
}

export default Dashboard;