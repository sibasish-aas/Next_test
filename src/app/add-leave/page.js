'use client'

import React from 'react';
import Layout from '../../components/layout'; // Adjust the path to your layout
import LeaveApprovals from '../../components/leave/LeaveApprovals'; // Adjust the path to your LeaveApprovals component

const Page = () => {
  return (
    <Layout>
      <LeaveApprovals />
    </Layout>
  );
};

export default Page;
