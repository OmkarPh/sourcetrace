import React from 'react'
import { Roles, useMetamaskAuth, withAuthenticatedRoute } from '../auth/authConfig';
import Loader from '../components/core/Loader';
import ProducerDashboard from '../components/Dashboard/ProducerDashboard';
import WarehouseDashboard from '../components/Dashboard/WarehouseDashboard';

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

// export default Dashboard;
export default withAuthenticatedRoute(Dashboard);