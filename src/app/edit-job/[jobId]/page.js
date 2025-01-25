"use client";
import React from 'react';
import Layout from '../../../components/layout';
import EditJob from '../../../components/job/EditJob';
 
const EditJobPage = ({ params }) => {
  const jobId = React.use(params)?.jobId;
 
  return (
    <Layout>
      <div>
        <EditJob jobId={jobId} />
      </div>
    </Layout>
  );
};
 
export default EditJobPage;