'use client'

import React from 'react';
import Layout from '../../components/layout'; // Adjust the path to your layout

import LeaveRequestList from '@/components/leave/LeaveRequestList';

const Page = () => {
  return (
    <Layout>
      <LeaveRequestList />
    </Layout>
  );
};

export default Page;